import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { ProductionDailyVolumnRecordSearchDto } from './dto/production-daily-volumn-record-search.dto';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import {
  ProductionDailyVolumnRecordDto,
  ProductionDailyVolumnRecordShift,
  ProductionDailyVolumnStorageTank,
} from './dto/production-daily-volumn-record.dto';
import { BaseResponse } from 'src/common/base-response';
@Injectable()
export class ProductionDailyVolumnRecordService {
  constructor(private commonService: CommonService) {}

  async search(dto: ProductionDailyVolumnRecordSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Date', dto.date);
    req.input('Line', dto.line);
    req.input('Grade', dto.grade);
    req.input('ProductName', dto.productName);

    // return await this.commonService.getSearch('sp_search_prod_daily', req);

    const result = await this.commonService.executeStoreProcedure(
      'sp_search_prod_daily',
      req,
    );

    if (result.recordsets.length > 0) {
      return {
        data: result.recordsets[0],
        total_record: result.recordsets[0].length,
      };
    } else {
      return {
        data: [],
        total_record: 0,
      };
    }
  }

  async getById(id: number): Promise<ProductionDailyVolumnRecordDto> {
    const dto = new ProductionDailyVolumnRecordDto();
    try {
      let req = await this.commonService.getConnection();
      req.input('Prod_Daily_Id', id);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_search_prod_daily_detail',
        req,
      );

      const { Return_CD, Return_Name } = result.output;
      if (Return_CD === 'Success') {
        const data = result.recordset[0];

        dto.date = data.Date;
        dto.line = data.Line;
        dto.grade = data.Grade;
        dto.productName = data.Product_Name;
        dto.filename = data.File_Name;

        let storageTank1 = [];
        let storageTank2 = [];
        let storageTank3 = [];
        if (result.recordsets[2].length > 0) {
          storageTank1 = result.recordsets[2].filter(
            (item) => item.Shift === 1,
          );

          storageTank2 = result.recordsets[2].filter(
            (item) => item.Shift === 2,
          );

          storageTank3 = result.recordsets[2].filter(
            (item) => item.Shift === 3,
          );
        }
        const shifts = result.recordsets[1];

        const shift1 = this.setShift(shifts[0], storageTank1);
        const shift2 = this.setShift(shifts[1], storageTank2);
        const shift3 = this.setShift(shifts[2], storageTank3);

        dto.shifts = [shift1, shift2, shift3];
      } else {
        dto.result.status = 1;
        dto.result.message = Return_Name;
      }
    } catch (error) {
      dto.result.status = 2;
      dto.result.message = error.message;
    }

    return dto;
  }

  async add(
    data: ProductionDailyVolumnRecordDto,
    userId: number,
  ): Promise<BaseResponse> {
    try {
      const shift1 = this.getMappingData(data.shifts[0]);
      const shift2 = this.getMappingData(data.shifts[1]);
      const shift3 = this.getMappingData(data.shifts[2]);

      const itemData = [...shift1, ...shift2, ...shift3];

      // const storageTanks = [
      //   ...data.shifts[0].storageTanks,
      //   ...data.shifts[1].storageTanks,
      //   ...data.shifts[2].storageTanks,
      // ];
      const storageTanks = await data.shifts.reduce((acc, shift) => {
        return acc.concat(shift.storageTanks);
      }, []);
      storageTanks.map((item) => {
        item.Full_Tank = item.Full_Tank !== 'Y' ? 'N' : 'Y';
      });

      const listFileUpload = JSON.stringify(itemData);
      const listStorageTankUpload = JSON.stringify(storageTanks);

      let req = await this.commonService.getConnection();
      req.input('Date', data.date);
      req.input('Line', data.line);
      req.input('Grade', data.grade);
      req.input('ProductName', data.productName);
      req.input('FileName', data.filename);
      req.input('ListFileUpload', listFileUpload);
      req.input('ListStorageTankUpload', listStorageTankUpload);

      req.input('Create_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_add_prod_daily',
        req,
      );

      const { Return_CD, Return_Name } = result.output;

      return {
        status: Return_CD !== 'Success' ? 1 : 0,
        message: Return_Name,
      };
    } catch (error) {
      return {
        status: 2,
        message: error.message,
      };
    }
  }

  async update(
    id: number,
    data: ProductionDailyVolumnRecordDto,
    userId: number,
  ): Promise<BaseResponse> {
    try {
      const shift1 = this.getMappingData(data.shifts[0]);
      const shift2 = this.getMappingData(data.shifts[1]);
      const shift3 = this.getMappingData(data.shifts[2]);

      const itemData = [...shift1, ...shift2, ...shift3];
      const storageTanks = await data.shifts.reduce((acc, shift) => {
        return acc.concat(shift.storageTanks);
      }, []);
      storageTanks.map((item) => {
        item.Full_Tank = item.Full_Tank !== 'Y' ? 'N' : 'Y';
      });
      const listFileUpload = JSON.stringify(itemData);
      const listStorageTankUpload = JSON.stringify(storageTanks);

      let req = await this.commonService.getConnection();
      req.input('Prod_Daily_Id', id);
      req.input('FileName', data.filename);
      req.input('ListFileUpload', listFileUpload);
      req.input('ListStorageTankUpload', listStorageTankUpload);

      req.input('Update_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_update_prod_daily',
        req,
      );

      const { Return_CD, Return_Name } = result.output;

      return {
        status: Return_CD !== 'Success' ? 1 : 0,
        message: Return_Name,
      };
    } catch (error) {
      return {
        status: 2,
        message: error.message,
      };
    }
  }

  async readExcelFile(buffer: Buffer) {
    var dto = new ProductionDailyVolumnRecordDto();

    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      const worksheet = workbook.Sheets['PD_DAILY_VOLUME'];

      dto.date = this.excelSheetDate(worksheet, 'C4');
      dto.line = this.excelSheetValue(worksheet, 'C6');
      dto.grade = this.excelSheetValue(worksheet, 'G4');
      dto.productName = this.excelSheetValue(worksheet, 'G6');

      const shift1 = this.getShift1(worksheet);
      const shift2 = this.getShift2(worksheet);
      const shift3 = this.getShift3(worksheet);

      // const timeShift1 = await this.commonService.executeQuery(
      //   "SELECT  [Start_time] ,[End_time] FROM co_shift WHERE Is_Active ='Y' AND Shift_Id = '1'",
      // );
      // const timeShift2 = await this.commonService.executeQuery(
      //   "SELECT  [Start_time] ,[End_time] FROM co_shift WHERE Is_Active ='Y' AND Shift_Id = '2'",
      // );
      // const timeShift3 = await this.commonService.executeQuery(
      //   "SELECT  [Start_time] ,[End_time] FROM co_shift WHERE Is_Active ='Y' AND Shift_Id = '3'",
      // );

      // // if start time is null then get from co_shift
      // if (!shift1.Shift_Start) {
      //   shift1.Shift_Start = timeShift1[0].Start_time;
      // }
      // if (!shift2.Shift_Start) {
      //   shift2.Shift_Start = timeShift2[0].Start_time;
      // }
      // if (!shift3.Shift_Start) {
      //   shift3.Shift_Start = timeShift3[0].Start_time;
      // }

      // // if end time is null then get from co_shift
      // if (!shift1.Shift_End) {
      //   shift1.Shift_End = timeShift1[0].End_time;
      // }
      // if (!shift2.Shift_End) {
      //   shift2.Shift_End = timeShift2[0].End_time;
      // }
      // if (!shift3.Shift_End) {
      //   shift3.Shift_End = timeShift3[0].End_time;
      // }

      shift1.Shift_Oper_Time = this.calculateShiftOperTime(
        shift1.Shift_Start,
        shift1.Shift_End,
      );
      shift2.Shift_Oper_Time = this.calculateShiftOperTime(
        shift2.Shift_Start,
        shift2.Shift_End,
      );
      shift3.Shift_Oper_Time = this.calculateShiftOperTime(
        shift3.Shift_Start,
        shift3.Shift_End,
      );

      dto.shifts = [shift1, shift2, shift3];
    } catch (error) {
      dto.result.status = 2;
      dto.result.message = error.message;
      console.error(error);
    }
    return dto;
  }

  setShift(data: any, storageTank: any): ProductionDailyVolumnRecordShift {
    const shift = new ProductionDailyVolumnRecordShift();
    shift.Shift = data.Shift ?? null;
    shift.Shift_Oper_Time = data.Shift_Oper_Time ?? null;
    shift.Shift_Start = data.Shift_Start ?? null;
    shift.Shift_End = data.Shift_End ?? null;
    shift.T1_EKINEN_CBO = data.T1_EKINEN_CBO ?? 0;
    shift.T1_EKINEN_EBO = data.T1_EKINEN_EBO ?? 0;
    shift.T1_EKINEN_EKN_Total = data.T1_EKINEN_EKN_Total ?? 0;
    shift.T1_EKINEN_FCC = data.T1_EKINEN_FCC ?? 0;
    shift.T1_Production_CBO = data.T1_Production_CBO ?? 0;
    shift.T1_Production_EBO = data.T1_Production_EBO ?? 0;
    shift.T1_PRODUCTION_EKINEN_CBO = data.T1_PRODUCTION_EKINEN_CBO ?? 0;
    shift.T1_PRODUCTION_EKINEN_EBO = data.T1_PRODUCTION_EKINEN_EBO ?? 0;
    shift.T1_PRODUCTION_EKINEN_FCC = data.T1_PRODUCTION_EKINEN_FCC ?? 0;
    shift.T1_PRODUCTION_EKINEN_Total = data.T1_PRODUCTION_EKINEN_Total ?? 0;
    shift.T1_Production_FCC = data.T1_Production_FCC ?? 0;
    shift.T1_Production_Prod_Total = data.T1_Production_Prod_Total ?? 0;
    shift.T2_NG_Drying = data.T2_NG_Drying ?? 0;
    shift.T2_NG_Drying_Total = data.T2_NG_Drying_Total ?? 0;
    shift.T2_NG_Oil_Spray_checking = data.T2_NG_Oil_Spray_checking ?? 0;
    shift.T2_NG_Oil_Spray_checking_Total =
      data.T2_NG_Oil_Spray_checking_Total ?? 0;
    shift.T2_NG_Preheat = data.T2_NG_Preheat ?? 0;

    shift.T2_EBO_Preheat = data.T2_EBO_Preheat ?? 0;
    shift.T2_CBO_Preheat = data.T2_CBO_Preheat ?? 0;
    shift.T2_FCC_Preheat = data.T2_FCC_Preheat ?? 0;

    shift.T2_Preheat_Total = data.T2_Preheat_Total ?? 0;
    shift.T2_NG_Production = data.T2_NG_Production ?? 0;
    shift.T2_NG_Production_Total = data.T2_NG_Production_Total ?? 0;
    shift.T2_NG_Warm_up = data.T2_NG_Warm_up ?? 0;
    shift.T2_NG_Warm_up_Total = data.T2_NG_Warm_up_Total ?? 0;

    shift.T3_Discharged_Volume_Other = data.T3_Discharged_Volume_Other ?? 0;
    shift.T3_Hoist_Other = data.T3_Hoist_Other ?? 0;
    shift.T3_Kande_Other = data.T3_Kande_Other ?? 0;
    shift.T3_KOH_Mixing_Other = data.T3_KOH_Mixing_Other ?? 0;
    shift.T3_Mixing_Other = data.T3_Mixing_Other ?? 0;
    shift.T3_NaOH_Consumption_Other = data.T3_NaOH_Consumption_Other ?? 0;
    shift.T3_Recycle_Hopper_Level_Other =
      data.T3_Recycle_Hopper_Level_Other ?? 0;
    shift.T3_Total_Mixing_Volume_Other = data.T3_Total_Mixing_Volume_Other ?? 0;

    // storage tank
    shift.storageTanks = storageTank;
    return shift;
  }

  getShift1(worksheet: any) {
    const shift = new ProductionDailyVolumnRecordShift();

    shift.Shift = this.excelSheetValue(worksheet, 'B13');
    shift.Shift_Start = this.excelSheetTime(worksheet, 'H23');
    shift.Shift_End = this.excelSheetTime(worksheet, 'I23');

    // ตาราง Feedstock Oil Consumption
    shift.T1_Production_EBO = this.excelSheetValue(worksheet, 'C13');
    shift.T1_Production_CBO = this.excelSheetValue(worksheet, 'D13');
    shift.T1_Production_FCC = this.excelSheetValue(worksheet, 'E13');
    shift.T1_Production_Prod_Total = this.excelSheetValue(worksheet, 'F13');

    shift.T1_EKINEN_EBO = this.excelSheetValue(worksheet, 'G13');
    shift.T1_EKINEN_CBO = this.excelSheetValue(worksheet, 'H13');
    shift.T1_EKINEN_FCC = this.excelSheetValue(worksheet, 'I13');
    shift.T1_EKINEN_EKN_Total = this.excelSheetValue(worksheet, 'J13');

    shift.T1_PRODUCTION_EKINEN_CBO =
      shift.T1_Production_CBO + shift.T1_EKINEN_CBO;
    shift.T1_PRODUCTION_EKINEN_EBO =
      shift.T1_Production_EBO + shift.T1_EKINEN_EBO;
    shift.T1_PRODUCTION_EKINEN_FCC =
      shift.T1_Production_FCC + shift.T1_EKINEN_FCC;
    shift.T1_PRODUCTION_EKINEN_Total =
      shift.T1_Production_Prod_Total + shift.T1_EKINEN_EKN_Total;

    // ตาราง FUEL
    shift.T2_NG_Production = this.excelSheetValue(worksheet, 'M13');
    shift.T2_NG_Warm_up = this.excelSheetValue(worksheet, 'N13');
    shift.T2_NG_Preheat = this.excelSheetValue(worksheet, 'O13');
    shift.T2_EBO_Preheat = this.excelSheetValue(worksheet, 'S13');
    shift.T2_CBO_Preheat = this.excelSheetValue(worksheet, 'T13');
    shift.T2_FCC_Preheat = this.excelSheetValue(worksheet, 'U13');
    shift.T2_NG_Drying = this.excelSheetValue(worksheet, 'P13');
    shift.T2_NG_Oil_Spray_checking = this.excelSheetValue(worksheet, 'Q13');

    shift.T3_Mixing_Other = this.excelSheetValue(worksheet, 'V13');
    shift.T3_Hoist_Other = this.excelSheetValue(worksheet, 'X13');
    shift.T3_Kande_Other = this.excelSheetValue(worksheet, 'Z13');
    shift.T3_Total_Mixing_Volume_Other = this.excelSheetValue(
      worksheet,
      'AB13',
    );
    shift.T3_Discharged_Volume_Other = this.excelSheetValue(worksheet, 'AD13');

    shift.T3_KOH_Mixing_Other = this.excelSheetValue(worksheet, 'AF13');
    shift.T3_NaOH_Consumption_Other = this.excelSheetValue(worksheet, 'AH13');
    shift.T3_Recycle_Hopper_Level_Other = this.excelSheetValue(
      worksheet,
      'AJ13',
    );

    shift.storageTanks = this.getstorageTank(
      worksheet,
      '1',
      40,
      'C',
      'D',
      'E',
      'F',
      'J',
    );

    return shift;
  }

  getstorageTank(
    worksheet: any,
    shift: string,
    indexRecord,
    colTank,
    colStartTime,
    colStopTime,
    colReason,
    colFullTank,
  ): ProductionDailyVolumnStorageTank[] {
    var storageTanks = [];
    let tank = '';
    do {
      tank = this.excelSheetValue(worksheet, colTank + indexRecord) || '';

      if (tank !== null && tank !== '') {
        let storageTank = new ProductionDailyVolumnStorageTank();
        storageTank.Shift = shift;
        storageTank.Tank = tank;
        storageTank.Tank_Start_Time = this.excelSheetTime(
          worksheet,
          colStartTime + indexRecord,
        );
        storageTank.Tank_Stop_Time = this.excelSheetTime(
          worksheet,
          colStopTime + indexRecord,
        );
        storageTank.Reason = this.excelSheetValue(
          worksheet,
          colReason + indexRecord,
        );
        storageTank.Full_Tank = this.excelSheetValue(
          worksheet,
          colFullTank + indexRecord,
        );
        if (storageTank.Full_Tank) {
          storageTank.Full_Tank = 'Y';
        }
        // if (storageTank.Tank_Start_Time) {
        //   storageTank.Tank_Start_Time = moment(
        //     storageTank.Tank_Start_Time,
        //     'HH:mm',
        //   ).format('HH:mm');
        // }
        // if (storageTank.Tank_Stop_Time) {
        //   storageTank.Tank_Stop_Time = moment(
        //     storageTank.Tank_Stop_Time,
        //     'HH:mm',
        //   ).format('HH:mm');
        // }
        storageTanks.push(storageTank);
        indexRecord++;
      }
    } while (tank !== '');

    return storageTanks;
  }

  calculateShiftOperTime(startTime, endTime) {
    if (startTime && endTime) {
      let shiftStart = moment(startTime, 'HH:mm');
      let shiftEnd = moment(endTime, 'HH:mm');

      const duration = moment.duration(shiftEnd.diff(shiftStart));
      return (
        duration.hours() + '.' + duration.minutes().toString().padStart(2, '0')
      );
    }
    return '0';
  }

  getShift2(worksheet: any) {
    const shift = new ProductionDailyVolumnRecordShift();

    shift.Shift = this.excelSheetValue(worksheet, 'B14');
    shift.Shift_Start = this.excelSheetTime(worksheet, 'V23');
    shift.Shift_End = this.excelSheetTime(worksheet, 'W23');

    // ตาราง Feedstock Oil Consumption
    shift.T1_Production_EBO = this.excelSheetValue(worksheet, 'C14');
    shift.T1_Production_CBO = this.excelSheetValue(worksheet, 'D14');
    shift.T1_Production_FCC = this.excelSheetValue(worksheet, 'E14');
    shift.T1_Production_Prod_Total = this.excelSheetValue(worksheet, 'F14');

    shift.T1_EKINEN_EBO = this.excelSheetValue(worksheet, 'G14');
    shift.T1_EKINEN_CBO = this.excelSheetValue(worksheet, 'H14');
    shift.T1_EKINEN_FCC = this.excelSheetValue(worksheet, 'I14');
    shift.T1_EKINEN_EKN_Total = this.excelSheetValue(worksheet, 'J14');

    shift.T1_PRODUCTION_EKINEN_CBO =
      shift.T1_Production_CBO + shift.T1_EKINEN_CBO;
    shift.T1_PRODUCTION_EKINEN_EBO =
      shift.T1_Production_EBO + shift.T1_EKINEN_EBO;
    shift.T1_PRODUCTION_EKINEN_FCC =
      shift.T1_Production_FCC + shift.T1_EKINEN_FCC;
    shift.T1_PRODUCTION_EKINEN_Total =
      shift.T1_Production_Prod_Total + shift.T1_EKINEN_EKN_Total;

    // ตาราง FUEL
    shift.T2_NG_Production = this.excelSheetValue(worksheet, 'M14');
    shift.T2_NG_Warm_up = this.excelSheetValue(worksheet, 'N14');
    shift.T2_NG_Preheat = this.excelSheetValue(worksheet, 'O14');
    shift.T2_EBO_Preheat = this.excelSheetValue(worksheet, 'S14');
    shift.T2_CBO_Preheat = this.excelSheetValue(worksheet, 'T14');
    shift.T2_FCC_Preheat = this.excelSheetValue(worksheet, 'U14');
    shift.T2_NG_Drying = this.excelSheetValue(worksheet, 'P14');
    shift.T2_NG_Oil_Spray_checking = this.excelSheetValue(worksheet, 'Q14');

    shift.T3_Mixing_Other = this.excelSheetValue(worksheet, 'V14');
    shift.T3_Hoist_Other = this.excelSheetValue(worksheet, 'X14');
    shift.T3_Kande_Other = this.excelSheetValue(worksheet, 'Z14');
    shift.T3_Total_Mixing_Volume_Other = this.excelSheetValue(
      worksheet,
      'AB14',
    );
    shift.T3_Discharged_Volume_Other = this.excelSheetValue(worksheet, 'AD14');

    shift.T3_KOH_Mixing_Other = this.excelSheetValue(worksheet, 'AF14');
    shift.T3_NaOH_Consumption_Other = this.excelSheetValue(worksheet, 'AH14');
    shift.T3_Recycle_Hopper_Level_Other = this.excelSheetValue(
      worksheet,
      'AJ14',
    );

    shift.storageTanks = this.getstorageTank(
      worksheet,
      '2',
      40,
      'N',
      'O',
      'P',
      'Q',
      'X',
    );

    return shift;
  }

  getShift3(worksheet: any) {
    const shift = new ProductionDailyVolumnRecordShift();

    shift.Shift = this.excelSheetValue(worksheet, 'B15');
    shift.Shift_Start = this.excelSheetTime(worksheet, 'AG23');
    shift.Shift_End = this.excelSheetTime(worksheet, 'AH23');

    // ตาราง Feedstock Oil Consumption
    shift.T1_Production_EBO = this.excelSheetValue(worksheet, 'C15');
    shift.T1_Production_CBO = this.excelSheetValue(worksheet, 'D15');
    shift.T1_Production_FCC = this.excelSheetValue(worksheet, 'E15');
    shift.T1_Production_Prod_Total = this.excelSheetValue(worksheet, 'F15');

    shift.T1_EKINEN_EBO = this.excelSheetValue(worksheet, 'G15');
    shift.T1_EKINEN_CBO = this.excelSheetValue(worksheet, 'H15');
    shift.T1_EKINEN_FCC = this.excelSheetValue(worksheet, 'I15');
    shift.T1_EKINEN_EKN_Total = this.excelSheetValue(worksheet, 'J15');

    shift.T1_PRODUCTION_EKINEN_CBO =
      shift.T1_Production_CBO + shift.T1_EKINEN_CBO;
    shift.T1_PRODUCTION_EKINEN_EBO =
      shift.T1_Production_EBO + shift.T1_EKINEN_EBO;
    shift.T1_PRODUCTION_EKINEN_FCC =
      shift.T1_Production_FCC + shift.T1_EKINEN_FCC;
    shift.T1_PRODUCTION_EKINEN_Total =
      shift.T1_Production_Prod_Total + shift.T1_EKINEN_EKN_Total;

    // ตาราง FUEL
    shift.T2_NG_Production = this.excelSheetValue(worksheet, 'M15');
    shift.T2_NG_Warm_up = this.excelSheetValue(worksheet, 'N15');
    shift.T2_NG_Preheat = this.excelSheetValue(worksheet, 'O15');
    shift.T2_EBO_Preheat = this.excelSheetValue(worksheet, 'S15');
    shift.T2_CBO_Preheat = this.excelSheetValue(worksheet, 'T15');
    shift.T2_FCC_Preheat = this.excelSheetValue(worksheet, 'U15');
    shift.T2_NG_Drying = this.excelSheetValue(worksheet, 'P15');
    shift.T2_NG_Oil_Spray_checking = this.excelSheetValue(worksheet, 'Q15');

    shift.T3_Mixing_Other = this.excelSheetValue(worksheet, 'V15');
    shift.T3_Hoist_Other = this.excelSheetValue(worksheet, 'X15');
    shift.T3_Kande_Other = this.excelSheetValue(worksheet, 'Z15');
    shift.T3_Total_Mixing_Volume_Other = this.excelSheetValue(
      worksheet,
      'AB15',
    );
    shift.T3_Discharged_Volume_Other = this.excelSheetValue(worksheet, 'AD15');

    shift.T3_KOH_Mixing_Other = this.excelSheetValue(worksheet, 'AF15');
    shift.T3_NaOH_Consumption_Other = this.excelSheetValue(worksheet, 'AH15');
    shift.T3_Recycle_Hopper_Level_Other = this.excelSheetValue(
      worksheet,
      'AJ15',
    );

    shift.storageTanks = this.getstorageTank(
      worksheet,
      '3',
      40,
      'AB',
      'AC',
      'AD',
      'AE',
      'AI',
    );

    return shift;
  }

  getMappingData(shift: ProductionDailyVolumnRecordShift) {
    let data = [];
    var d = {};

    /*  
     "Raw_Material_Type_Id": 
     Feedstock Oil Consumption  = 1,  
     FUEL =2, 
     Summarize Carbon, KOH Mixing (Litres),NaOH Consumption (Litres) ,Recycle Hopper Level (%) = 3, 
     Storage Tank = 4

     ,"Raw_Material_Name": data column  แรก ของตาราง Feedstock Oil Consumption , ตาราง FUEL, Summarize Carbon ชื่อ column ของตาราง
     */

    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'Production';
    d['Category'] = 'EBO';
    d['Value'] = shift.T1_Production_EBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'Production';
    d['Category'] = 'CBO';
    d['Value'] = shift.T1_Production_CBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'Production';
    d['Category'] = 'FCC';
    d['Value'] = shift.T1_Production_FCC;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'Production';
    d['Category'] = 'Prod_Total';
    d['Value'] = shift.T1_Production_Prod_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'EBO';
    d['Value'] = shift.T1_EKINEN_EBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'CBO';
    d['Value'] = shift.T1_EKINEN_CBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'FCC';
    d['Value'] = shift.T1_EKINEN_FCC;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'EKINEN';
    d['Category'] = 'EKN_Total';
    d['Value'] = shift.T1_EKINEN_EKN_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'PRODUCTION_EKINEN';
    d['Category'] = 'EBO';
    d['Value'] = shift.T1_PRODUCTION_EKINEN_EBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'PRODUCTION_EKINEN';
    d['Category'] = 'CBO';
    d['Value'] = shift.T1_PRODUCTION_EKINEN_CBO;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'PRODUCTION_EKINEN';
    d['Category'] = 'FCC';
    d['Value'] = shift.T1_PRODUCTION_EKINEN_FCC;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 1;
    d['Raw_Material_Name'] = 'PRODUCTION_EKINEN';
    d['Category'] = 'Total';
    d['Value'] = shift.T1_PRODUCTION_EKINEN_Total;
    data.push(d);

    // FUEL
    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Production';
    d['Value'] = shift.T2_NG_Production;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Production_Total';
    d['Value'] = shift.T2_NG_Production_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Warm_up';
    d['Value'] = shift.T2_NG_Warm_up;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Warm_up_Total';
    d['Value'] = shift.T2_NG_Warm_up_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Preheat';
    d['Value'] = shift.T2_NG_Preheat;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'EBO';
    d['Category'] = 'Preheat';
    d['Value'] = shift.T2_EBO_Preheat;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'CBO';
    d['Category'] = 'Preheat';
    d['Value'] = shift.T2_CBO_Preheat;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'FCC';
    d['Category'] = 'Preheat';
    d['Value'] = shift.T2_FCC_Preheat;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Preheat_Total';
    d['Value'] = shift.T2_Preheat_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Drying';
    d['Value'] = shift.T2_NG_Drying;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Drying_Total';
    d['Value'] = shift.T2_NG_Drying_Total;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Oil_Spray_checking';
    d['Value'] = shift.T2_NG_Oil_Spray_checking;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 2;
    d['Raw_Material_Name'] = 'NG';
    d['Category'] = 'Oil_Spray_checking_Total';
    d['Value'] = shift.T2_NG_Oil_Spray_checking_Total;
    data.push(d);

    // Summarize Carbon, KOH Mixing (Litres),NaOH Consumption (Litres) ,Recycle Hopper Level (%)
    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Mixing';
    d['Category'] = null;
    d['Value'] = shift.T3_Mixing_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Hoist';
    d['Category'] = null;
    d['Value'] = shift.T3_Hoist_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Kande';
    d['Category'] = null;
    d['Value'] = shift.T3_Kande_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Total_Mixing_Volume';
    d['Category'] = null;
    d['Value'] = shift.T3_Total_Mixing_Volume_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Discharged_Volume';
    d['Category'] = null;
    d['Value'] = shift.T3_Discharged_Volume_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'KOH_Mixing';
    d['Category'] = null;
    d['Value'] = shift.T3_KOH_Mixing_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'NaOH_Consumption';
    d['Category'] = null;
    d['Value'] = shift.T3_NaOH_Consumption_Other;
    data.push(d);

    d = {};
    d['Raw_Material_Type_Id'] = 3;
    d['Raw_Material_Name'] = 'Recycle_Hopper_Level';
    d['Category'] = null;
    d['Value'] = shift.T3_Recycle_Hopper_Level_Other;
    data.push(d);

    data.map((item) => {
      item['Shift'] = shift.Shift;
      item['Operating_Time'] = shift.Shift_Oper_Time;
      item['Shift_Start'] = shift.Shift_Start;
      item['Shift_End'] = shift.Shift_End;

      if (item['Value'] === null || item['Value'] === undefined) {
        item['Value'] = 0;
      }
    });

    return data;
  }

  excelSheetValue(worksheet: any, cell: string) {
    let val = worksheet[cell] ? worksheet[cell].v : null;
    if (typeof val === 'string') {
      val = val.trim();
    }
    return val;
  }

  excelSheetText(worksheet: any, cell: string): string {
    return worksheet[cell] ? worksheet[cell].w.toString().trim() : null;
  }

  excelSheetDate(worksheet: any, cell: string): string {
    if (worksheet[cell]) {
      const dateValue = worksheet[cell].w.toString().trim();
      return moment(dateValue, 'D-MMM-YY').format('YYYY-MM-DD');
    }
    return null;
  }

  excelSheetTime(worksheet: any, cell: string): string {
    if (worksheet[cell]) {
      const v = worksheet[cell].w.toString().trim();
      if (v.includes(':')) {
        const [h, m] = v.split(':');
        return h.padStart(2, '0') + ':' + m.padStart(2, '0');
      } else if (v.includes('.')) {
        const [h, m] = v.split('.');
        return h.padStart(2, '0') + ':' + m.padStart(2, '0');
      }
    }
    return null;
  }
}
