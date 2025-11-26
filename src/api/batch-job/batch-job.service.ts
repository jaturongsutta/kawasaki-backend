import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class BatchJobService {
  constructor(private commonService: CommonService) { }

  // get database time
  async getDatabaseTime(): Promise<Date | null> {
    const req = await this.commonService.getConnection();
    const result = await req.query('SELECT GETDATE() AS currentTime');
    // const result = await this.commonService.executeQuery(
    //   'SELECT GETDATE() AS currentTime',
    // );
    const dbTime = result.recordset[0]?.currentTime
      ? new Date(
        new Date(result.recordset[0].currentTime)
          .toISOString()
          .replace(/\.\d{3}Z$/, 'Z'),
      )
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

  // process Line_CYH3
  // sp_AutoStart_CYH3
  // sp_MappedMES_CYH3
  // sp_MappedMES_CYH3_003
  async processLineCYH3_sp_AutoStart_CYH3() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_AutoStart_CYH3');
      return {
        process: 'sp_AutoStart_CYH3',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_AutoStart_CYH3',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCYH3_sp_MappedMES_CYH3() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CYH3');
      return {
        process: 'sp_MappedMES_CYH3',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH3',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCYH3_sp_MappedMES_CYH3_003() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CYH3_003');
      return {
        process: 'sp_MappedMES_CYH3_003',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH3_003',
        status: 'ERROR',
        message: error.message,
      };
    }
  }

  // process Line_CYH4
  // sp_AutoStart_CYH4
  // sp_MappedMES_CYH4
  // sp_MappedMES_CYH4_003
  async processLineCYH4_sp_AutoStart_CYH4() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_AutoStart_CYH4');
      return {
        process: 'sp_AutoStart_CYH4',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_AutoStart_CYH4',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCYH4_sp_MappedMES_CYH4() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CYH4');
      return {
        process: 'sp_MappedMES_CYH4',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH4',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCYH4_sp_MappedMES_CYH4_003() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CYH4_003');
      return {
        process: 'sp_MappedMES_CYH4_003',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH4_003',
        status: 'ERROR',
        message: error.message,
      };
    }
  }

  // process Line_CYH6
  // sp_AutoStart_CYH6
  // sp_MappedMES_CYH6
  // sp_MappedMES_CYH6_003
  async processLineCYH6_sp_AutoStart_CYH6() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_AutoStart_CYH6');
      // const result = await this.commonService.executeStoreProcedure(
      //   'sp_AutoStart_CYH6',
      //   req,
      // );
      return {
        process: 'sp_AutoStart_CYH6',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_AutoStart_CYH6',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCYH6_sp_MappedMES_CYH6() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CYH6');
      // const result = await this.commonService.executeStoreProcedure(
      //   'sp_MappedMES_CYH6',
      //   req,
      // );
      return {
        process: 'sp_MappedMES_CYH6',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH6',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCYH6_sp_MappedMES_CYH6_003() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CYH6_003');

      // const result = await this.commonService.executeStoreProcedure(
      //   'sp_MappedMES_CYH6_003',
      //   req,
      // );
      return {
        process: 'sp_MappedMES_CYH6_003',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH6_003',
        status: 'ERROR',
        message: error.message,
      };
    }
  }

  // process Line_CYH7
  // sp_AutoStart_CYH7
  // sp_MappedMES_CYH7
  // sp_MappedMES_CYH7_003
  async processLineCYH7_sp_AutoStart_CYH7() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_AutoStart_CYH7');
      // const result = await this.commonService.executeStoreProcedure(
      //   'sp_AutoStart_CYH7',
      //   req,
      // );
      return {
        process: 'sp_AutoStart_CYH7',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_AutoStart_CYH7',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCYH7_sp_MappedMES_CYH7() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CYH7');
      // const result = await this.commonService.executeStoreProcedure(
      //   'sp_MappedMES_CYH7',
      //   req,
      // );
      return {
        process: 'sp_MappedMES_CYH7',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH7',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCYH7_sp_MappedMES_CYH7_003() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CYH7_003');

      // const result = await this.commonService.executeStoreProcedure(
      //   'sp_MappedMES_CYH7_003',
      //   req,
      // );
      return {
        process: 'sp_MappedMES_CYH7_003',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CYH7_003',
        status: 'ERROR',
        message: error.message,
      };
    }
  }


  // process Line_CRC9
  // sp_AutoStart_CRC9
  // sp_MappedMES_CRC9
  // sp_MappedMES_CRC9_003
  async processLineCRC9_sp_AutoStart_CRC9() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_AutoStart_CRC9');
      return {
        process: 'sp_AutoStart_CRC9',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_AutoStart_CRC9',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCRC9_sp_MappedMES_CRC9() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CRC9');
      return {
        process: 'sp_MappedMES_CRC9',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CRC9',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCRC9_sp_MappedMES_CRC9_003() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CRC9_003');

      return {
        process: 'sp_MappedMES_CRC9_003',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CRC9_003',
        status: 'ERROR',
        message: error.message,
      };
    }
  }

  // process Line_CRC10
  // sp_AutoStart_CRC10
  // sp_MappedMES_CRC10
  // sp_MappedMES_CRC10_003
  async processLineCRC10_sp_AutoStart_CRC10() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_AutoStart_CRC10');
      return {
        process: 'sp_AutoStart_CRC10',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_AutoStart_CRC10',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCRC10_sp_MappedMES_CRC10() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CRC10');
      return {
        process: 'sp_MappedMES_CRC10',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CRC10',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
  async processLineCRC10_sp_MappedMES_CRC10_003() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_CRC10_003');

      return {
        process: 'sp_MappedMES_CRC10_003',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_CRC10_003',
        status: 'ERROR',
        message: error.message,
      };
    }
  }

  async processKMTAutoStartLeak() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_AutoStart_Leak');

      return {
        process: 'sp_AutoStart_Leak',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_AutoStart_Leak',
        status: 'ERROR',
        message: error.message,
      };
    }
  }

  async processKMTLeakCYH() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_MappedMES_Leak_CYH');

      return {
        process: 'sp_MappedMES_Leak_CYH',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_MappedMES_Leak_CYH',
        status: 'ERROR',
        message: error.message,
      };
    }
  }

  // sp_handheld_InfoAlert_Toollife
  async processHandheldInfoAlertToollife() {
    try {
      const req = await this.commonService.getConnection();
      const result = await req.execute('sp_handheld_InfoAlert_Toollife');
      return {
        process: 'sp_handheld_InfoAlert_Toollife',
        status: 'SUCCESS',
        recordset: result.recordset?.length > 0 ? result.recordset : null,
      };
    } catch (error) {
      return {
        process: 'sp_handheld_InfoAlert_Toollife',
        status: 'ERROR',
        message: error.message,
      };
    }
  }
}
