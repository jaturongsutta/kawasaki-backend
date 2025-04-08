import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Request,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { ProductionDailyVolumnRecordService } from './production-daily-volumn-record.service';
import { ProductionDailyVolumnRecordSearchDto } from './dto/production-daily-volumn-record-search.dto';
import * as fs from 'fs';
import * as path from 'path';
import e, { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoSystemParametersService } from '../co-system-parameters/co-system-parameters.service';
import { ProductionDailyVolumnRecordDto } from './dto/production-daily-volumn-record.dto';

@Controller('production-daily-volumn-record')
export class ProductionDailyVolumnRecordController extends BaseController {
  constructor(
    private service: ProductionDailyVolumnRecordService,
    private coSystemParameterService: CoSystemParametersService,
  ) {
    super();
  }

  @Post('search')
  async search(@Body() dto: ProductionDailyVolumnRecordSearchDto) {
    return await this.service.search(dto);
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: any,

    @UploadedFile() file: Express.Multer.File,
  ) {
    // const data = await this.coSystemParameterService.findbyType('DIR_COA');
    // const directoryPath = data.paramValue;
    // const savePath = path.join(directoryPath, dto.filename);

    try {
      // // Ensure the directory exists
      // if (!fs.existsSync(directoryPath)) {
      //   fs.mkdirSync(directoryPath, { recursive: true });
      // }
      // fs.writeFileSync(savePath, file.buffer);

      return this.service.readExcelFile(file.buffer);

      // return {
      //   status: 0,
      // };
    } catch (error) {
      console.log('error : ', error);
      return {
        status: 2,
        message: error.message,
      };
    }
  }

  @Get('get-by-id/:id')
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: ProductionDailyVolumnRecordDto, @Request() req: any) {
    if (dto.filedata && dto.filedata.length > 0) {
      dto.filename = this.renameFilenameWithDateTime(dto.filename);
      await this.saveFile(dto.filename, dto.filedata);
    }
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: ProductionDailyVolumnRecordDto,
    @Request() req: any,
  ) {
    if (dto.filedata && dto.filedata.length > 0) {
      dto.filename = this.renameFilenameWithDateTime(dto.filename);
      await this.saveFile(dto.filename, dto.filedata);
    }

    return await this.service.update(id, dto, req.user.userId);
  }

  async saveFile(filename: string, filedata: any) {
    const systemParams =
      await this.coSystemParameterService.findbyType('Prod_Daily');
    const directoryPath =
      process.env.ENV === 'develop'
        ? path.join(process.env.ENV_DEVELOP_DIR, 'Prod_Daily')
        : systemParams.paramValue;

    const dataFile = filedata.split(',')[1];
    const buffer = Buffer.from(dataFile, 'base64');

    const savePath = path.join(directoryPath, filename);

    // Ensure the directory exists
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    fs.writeFileSync(savePath, buffer);
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

  @Post('download')
  async getFile(@Body() data: any, @Res() res: Response) {
    try {
      console.log('filename : ', data);
      const systemParams =
        await this.coSystemParameterService.findbyType('Prod_Daily');
      const directoryPath =
        process.env.ENV === 'develop'
          ? path.join(process.env.ENV_DEVELOP_DIR, 'Prod_Daily')
          : systemParams.paramValue;
      const pathFile = path.join(directoryPath, data.fileName);
      console.log('pathFile : ', pathFile);
      if (fs.existsSync(pathFile)) {
        res.sendFile(pathFile);
      } else {
        res
          .status(404)
          .send({ result: false, message: 'File not found', path: pathFile });
      }
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}
