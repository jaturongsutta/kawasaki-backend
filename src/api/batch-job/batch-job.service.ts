import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class BatchJobService {
  constructor(private commonService: CommonService) {}

  // get database time
  async getDatabaseTime() {
    const result = await this.commonService.executeQuery(
      'SELECT GETDATE() AS currentTime',
    );
    const dbTime = result[0]?.currentTime
      ? new Date(result[0].currentTime)
      : null;

    return dbTime;
  }

  // get log path
  async getLogPath() {
    //SELECT VALUE_EN FROM co_Predefine where Predefine_Group ='ConfigPath' and Predefine_CD = 'LOG'
    const result = await this.commonService.executeQuery(
      "SELECT VALUE_EN FROM co_Predefine where Predefine_Group ='ConfigPath' and Predefine_CD = 'LOG'",
    );
    const logPath = result[0]?.VALUE_EN ? result[0].VALUE_EN : null;
    return logPath;
  }

  // process Line_CYH6
  // sp_AutoStart_CYH6
  // sp_MappedMES_CYH6
  // sp_MappedMES_CYH6_003
  async processLineCYH6_sp_AutoStart_CYH6() {
    try {
      const req = await this.commonService.getConnection();
      const result = await this.commonService.executeStoreProcedure(
        'sp_AutoStart_CYH6',
        req,
      );
      return {
        process: 'sp_AutoStart_CYH6',
        status: 'SUCCESS',
        message: '',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_AutoStart_CYH6',
        status: 'ERROR',
        message: error.message,
        recordset: [],
      };
    }
  }
  async processLineCYH6_sp_MappedMES_CYH6() {
    try {
      const req = await this.commonService.getConnection();
      const result = await this.commonService.executeStoreProcedure(
        'sp_MappedMES_CYH6',
        req,
      );
      return {
        process: 'sp_MappedMES_CYH6',
        status: 'SUCCESS',
        message: '',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH6',
        status: 'ERROR',
        message: error.message,
        recordset: [],
      };
    }
  }
  async processLineCYH6_sp_MappedMES_CYH6_003() {
    try {
      const req = await this.commonService.getConnection();
      const result = await this.commonService.executeStoreProcedure(
        'sp_MappedMES_CYH6_003',
        req,
      );
      return {
        process: 'sp_MappedMES_CYH6_003',
        status: 'SUCCESS',
        message: null,
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH6_003',
        status: 'ERROR',
        message: error.message,
        recordset: [],
      };
    }
  }
}
