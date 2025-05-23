import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { connect, Transaction } from 'mssql';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);
  private getConfig(): any {
    const config = {
      server: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 1433,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      trustServerCertificate: true,
      requestTimeout: 300000,
      pool: {
        max: 32,
        min: 8,
        idleTimeoutMillis: 30000,
      },
    };

    return config;
  }

  async getConnection() {
    const config = this.getConfig();
    const pool = await connect(config);
    const req = await pool.request();
    return req;
  }

  async getConnectionAndBeginTrans() {
    const config = this.getConfig();
    const pool = await connect(config);
    const transaction = new Transaction(pool);
    await transaction.begin();
    return transaction;
  }

  async getRequest(trans: any) {
    if (trans) {
      return await trans.request(trans);
    } else {
      return await trans.request();
    }
  }

  async dbConnect() {
    const config = this.getConfig();
    const pool = await connect(config);
    const req = await pool.request();
    return req;
  }

  async getSearch(storedProcedure: string, req: any) {
    const result = await req.execute(storedProcedure);
    this.logger.log(JSON.stringify(this.getLogSql(req)));
    return {
      data: result.recordset,
      total_record:
        result.recordsets.length == 1
          ? result.recordset.length
          : result.recordsets[1][0].Total_Record,
    };
  }
  // overload method
  async executeStoreProcedure(storedProcedure: string, req: any);
  async executeStoreProcedure(storedProcedure: string, req: any, log: boolean);
  async executeStoreProcedure(
    storedProcedure: string,
    req: any,
    log: boolean = true,
  ) {
    try {
      const result = await req.execute(storedProcedure);

      if (log) {
        this.logger.log(JSON.stringify(this.getLogSql(req)));

        if (Object.keys(result.output).length > 0) {
          this.logger.log(JSON.stringify(result.output));
        }
      }

      return result;
    } catch (error) {
      this.logger.log(JSON.stringify(this.getLogSql(req)));
      if (error.originalError) {
        throw { message: error.originalError.message };
      }
      throw error;
    }
  }

  async executeQuery(query: string) {
    const config = this.getConfig();

    try {
      // Get a connection from the pool
      const pool = await connect(config);

      // Create a request object using the connection
      const request = pool.request();

      // Execute the query using the request object
      const result = await request.query(query);
      // this.logger.log(query);

      return result.recordset;

      // Return the result
    } catch (error) {
      // Handle any errors that occur during execution
      throw new Error(`Error executing the query: ${error.message}`);
    }
  }

  async saveFile(
    filename: string,
    filedata: string,
    systemParamsCode: string,
    isRename: boolean = true,
  ) {
    const result = await this.executeQuery(
      `SELECT [param_value] FROM [dbo].[co_system_parameters]  WHERE param_type ='${systemParamsCode}'`,
    );

    if (result.length === 0) {
      throw new Error(`System parameter ${systemParamsCode} not found`);
    }

    if (isRename) {
      filename = this.renameFilenameWithDateTime(filename);
    }

    const dirPath = result[0].param_value;

    const directoryPath =
      process.env.ENV === 'develop'
        ? path.join(process.env.UPLOAD_DIR, systemParamsCode)
        : dirPath;

    const dataFile = filedata.split(',')[1];
    const buffer = Buffer.from(dataFile, 'base64');
    const savePath = path.join(directoryPath, filename);
    // Ensure the directory exists
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    fs.writeFileSync(savePath, buffer);

    console.log('savePath : ', savePath);

    return {
      filename: filename,
      path: savePath,
    };
  }

  renameFilenameWithDateTime(originalFilename: string): string {
    // Get current date and time
    const now = new Date();

    // Format date and time as 'yyyyMMddHHmmss'
    const dateTimeFormat = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now
      .getHours()
      .toString()
      .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;

    // Extract the file extension
    const extensionMatch = originalFilename.match(/\.[0-9a-z]+$/i);
    const extension = extensionMatch ? extensionMatch[0] : '';

    // Remove the extension from the original filename
    const filenameWithoutExtension = originalFilename.replace(/\.[^/.]+$/, '');

    // Concatenate the filename, date-time string, and extension
    const newFilename = `${filenameWithoutExtension}_${dateTimeFormat}${extension}`;

    return newFilename;
  }

  getLogSql(p) {
    if (p._currentRequest) {
      const jsonData = {
        script: p._currentRequest.sqlTextOrProcedure.replace(
          /(\r\n|\n|\r|\t)/gm,
          ' ',
        ),
      };

      for (let i = 0; i < p._currentRequest.parameters.length; i++) {
        const param = p._currentRequest.parameters[i];
        jsonData[`@${param.name}`] = param.value === null ? null : param.value;
      }

      return jsonData;
    } else {
      return null;
    }
  }
}
