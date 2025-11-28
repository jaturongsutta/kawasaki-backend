import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';

import * as ExcelJS from 'exceljs';
import { ReportCYHLeakTestDto } from './dto/report-cyh-leak-test.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportCYHLeakTestService {
  constructor(private commonService: CommonService, private dataSource: DataSource,) { }

  // Helper function to truncate decimal places without rounding
  private truncateToDecimals(value: number, decimals: number): string {
    const multiplier = Math.pow(10, decimals);
    const truncated = Math.trunc(value * multiplier) / multiplier;
    return truncated.toFixed(decimals);
  }

  async searchTestingResult(dto: ReportCYHLeakTestDto) {
    const req = await this.commonService.getConnection();
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);
    req.input('Work_Type', dto.workType);
    req.input('MC_Date', dto.mcDate);
    req.input('Row_From', dto.searchOptions.rowFrom);
    req.input('Row_To', dto.searchOptions.rowTo);
    return await this.commonService.getSearch('sp_rp_Leak_CYH_Testing_Result', req);
  }

  async searchTestingResultSummary(dto: ReportCYHLeakTestDto) {
    const req = await this.commonService.getConnection();
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);
    req.input('Work_Type', dto.workType);
    return await this.commonService.getSearch('sp_rp_Leak_CYH_Testing_Result_Summary', req);
  }

  async searchMachineTracking(dto: ReportCYHLeakTestDto) {
    const req = await this.commonService.getConnection();
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);
    req.input('Work_Type', dto.workType);
    req.input('Row_From', dto.searchOptions.rowFrom);
    req.input('Row_To', dto.searchOptions.rowTo);
    return await this.commonService.getSearch('sp_rp_Leak_CYH_Machine_Tracking', req);
  }

  async searchMachineRunning(dto: ReportCYHLeakTestDto) {
    const req = await this.commonService.getConnection();
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);
    req.input('Work_Type', dto.workType);
    req.input('Row_From', dto.searchOptions.rowFrom);
    req.input('Row_To', dto.searchOptions.rowTo);
    return await this.commonService.getSearch('sp_rp_Leak_CYH_Machine_Running', req);
  }

  async searchMachineNoPlanSummary(dto: ReportCYHLeakTestDto) {
    const req = await this.commonService.getConnection();
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);
    return await this.commonService.getSearch('sp_rp_Leak_CYH_Machine_NoPlan', req);
  }

  async getMachine(): Promise<any> {
    try {
      const q = `SELECT  Predefine_CD as value, Predefine_CD as title FROM co_Predefine where Predefine_Group='Leak_CYH_Machine' and Is_Active='Y'`
      const request = this.dataSource.createQueryRunner()
      await request.connect()
      const valueList = await request.query(q)

      return {
        data: valueList
      }
    } catch (error) {
      return {
        result: false,
        message: error.message,
      }
    }
  }

  async getWorkType(): Promise<any> {
    try {
      const q = `SELECT  Predefine_CD as value, Predefine_CD as title FROM co_Predefine where Predefine_Group='CYH_Work_Type' and Is_Active='Y'`
      const request = this.dataSource.createQueryRunner()
      await request.connect()
      const valueList = await request.query(q)

      return {
        data: valueList
      }
    } catch (error) {
      return {
        result: false,
        message: error.message,
      }
    }
  }

  async exportExcelTestingResult(dto: ReportCYHLeakTestDto): Promise<any> {

    const req = await this.commonService.getConnection();
    console.log("DTO is ", dto)
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);
    req.input('Work_Type', dto.workType);
    req.input('MC_Date', dto.mcDate);
    req.input('Row_From', 1);
    req.input('Row_To', null);

    const d = await this.commonService.getSearch('sp_rp_Leak_CYH_Testing_Result', req);
    const data = d.data;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Testing Result Report', {
      views: [{ state: 'frozen', ySplit: 1 }], // freeze header row
    });

    // ---------- กำหนดคอลัมน์ ----------
    ws.columns = [
      { header: 'Machine', key: 'Machine_No', width: 8 },
      { header: 'Start Date', key: 'Start_Date', width: 24 },
      { header: 'End Date', key: 'End_Date', width: 24 },
      { header: 'Plan Year', key: 'plan_year', width: 10 },
      { header: 'Plan Month', key: 'plan_month', width: 10 },
      { header: 'Plan Day', key: 'plan_day', width: 8 },
      { header: 'Shift', key: 'Shift_Period', width: 10 },
      { header: 'Machine Type', key: 'Machine_Type', width: 12 },

      { header: 'M/C Date', key: 'MC_Date', width: 15 },
      { header: 'Original M/C Date', key: 'ori_MC_Date', width: 18 },

      { header: 'M/C No', key: 'MC_No', width: 8 },
      { header: 'M/C Day', key: 'MC_Day', width: 8 },
      { header: 'M/C Month', key: 'MC_Month', width: 10 },
      { header: 'M/C Year', key: 'MC_Year', width: 10 },
      { header: 'M/C Line', key: 'MC_Line', width: 8 },
      { header: 'M/C Shift', key: 'MC_Shift', width: 8 },

      { header: 'Work Type', key: 'Work_Type', width: 12 },
      { header: 'Model', key: 'Model_CD', width: 12 },
      { header: 'Part No.', key: 'part', width: 20 },
      { header: 'G', key: 'GS_No', width: 5 },
      { header: 'FG', key: 'FG', width: 5 },

      { header: 'P1, OH, CH1', key: 'NG_P1', width: 12 },
      { header: 'P2, WJ, CH2', key: 'NG_P2', width: 12 },
      { header: 'P3, CC, CH3', key: 'NG_P3', width: 12 },
      { header: 'P4, -, CH4', key: 'NG_P4', width: 12 },
      { header: 'P5, T/B, CH5', key: 'NG_TB', width: 12 },

      { header: 'P1, OH, CH1 Value', key: 'NG_P1_Value', width: 16 },
      { header: 'P2, WJ, CH2 Value', key: 'NG_P2_Value', width: 16 },
      { header: 'P3, CC, CH3 Value', key: 'NG_P3_Value', width: 16 },
      { header: 'P4, -, CH4 Value', key: 'NG_P4_Value', width: 16 },
      { header: 'P5, T/B, CH5 Value', key: 'NG_TB_Value', width: 16 },

      { header: 'C/A Date', key: 'Casting_Date', width: 12 },
      { header: 'Mold No', key: 'Mold_No', width: 10 },
      { header: 'C/A No', key: 'Casting_No', width: 10 },
      { header: 'Casting Day', key: 'Casting_Day', width: 10 },
      { header: 'Casting Month', key: 'Casting_Month', width: 12 },
      { header: 'Casting Year', key: 'Casting_Year', width: 12 },
      { header: 'Mold Number', key: 'Mold_Number', width: 12 },
    ];

    // ---------- header style ----------
    const headerRow = ws.getRow(1);
    headerRow.height = 25;

    const headerFill: ExcelJS.FillPattern = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }, // เทาอ่อน
    };

    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = headerFill;
      cell.border = thinBorder;
    });

    // helper แปลงวันที่ให้ excel
    const toExcelDate = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d;
    };

    // ---------- เติมข้อมูล ----------
    data.forEach((r) => {
      ws.addRow({
        Machine_No: r.Machine_No,
        Start_Date: toExcelDate(r.Start_Date),
        End_Date: toExcelDate(r.End_Date),
        plan_year: r.plan_year,
        plan_month: r.plan_month,
        plan_day: r.plan_day,
        Shift_Period: r.Shift_Period,
        Machine_Type: r.Machine_Type,

        MC_Date: r.MC_Date,
        ori_MC_Date: r.ori_MC_Date,
        MC_No: r.MC_No,
        MC_Day: r.MC_Day,
        MC_Month: r.MC_Month,
        MC_Year: r.MC_Year,
        MC_Line: r.MC_Line,
        MC_Shift: r.MC_Shift,

        Work_Type: r.Work_Type,
        Model_CD: r.Model_CD,
        part: r.part,
        GS_No: r.GS_No,
        FG: r.FG,

        NG_P1: r.NG_P1,
        NG_P2: r.NG_P2,
        NG_P3: r.NG_P3,
        NG_P4: r.NG_P4,
        NG_TB: r.NG_TB,

        NG_P1_Value: r.NG_P1_Value,
        NG_P2_Value: r.NG_P2_Value,
        NG_P3_Value: r.NG_P3_Value,
        NG_P4_Value: r.NG_P4_Value,
        NG_TB_Value: r.NG_TB_Value,

        Casting_Date: r.Casting_Date,
        Mold_No: r.Mold_No,
        Casting_No: r.Casting_No,
        Casting_Day: r.Casting_Day,
        Casting_Month: r.Casting_Month,
        Casting_Year: r.Casting_Year,
        Mold_Number: r.Mold_Number,
      });
    });

    // format cell วันที่
    ['Start_Date', 'End_Date'].forEach((key) => {
      const col = ws.getColumn(key);
      col.numFmt = 'yyyy MMM dd hh:mm:ss';
    });

    // ---------- style ทุกช่อง (border + center) ----------
    const totalRows = ws.rowCount;
    const totalCols = ws.columnCount;

    for (let r = 1; r <= totalRows; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= totalCols; c++) {
        const cell = row.getCell(c); // create cell แม้ไม่มีค่า
        cell.border = thinBorder;
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
      }
    }

    // ---------- สี FG / NG ตามเงื่อนไข ----------
    const fgColIndex = ws.getColumn('FG').number;
    const ngKeys = ['NG_P1', 'NG_P2', 'NG_P3', 'NG_P4', 'NG_TB'];
    const ngColIndex = ngKeys.map((k) => ws.getColumn(k).number);

    const greenFill: ExcelJS.FillPattern = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4CAF50' }, // เขียวอ่อน
    };

    const redFill: ExcelJS.FillPattern = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF0000' }, // แดง
    };

    const boldWhiteFont = { color: { argb: 'FFFFFFFF' }, bold: true };

    for (let r = 2; r <= totalRows; r++) {
      const row = ws.getRow(r);

      for (let c = 1; c <= totalCols; c++) {
        const cell = row.getCell(c);

        // FG: 1=เขียว, 0=แดง, อื่นๆ = ไม่ใส่สี
        if (c === fgColIndex) {
          const v = cell.value === null || cell.value === undefined ? null : Number(cell.value);

          if (v === 1) {
            cell.fill = greenFill;
            cell.font = { ...(cell.font || {}), ...boldWhiteFont };
          } else if (v === 0) {
            cell.fill = redFill;
            cell.font = { ...(cell.font || {}), ...boldWhiteFont };
          }

          continue;
        }

        // NG_Px: 1=เขียว, 2=แดง, else = ไม่ใส่สี
        if (ngColIndex.includes(c)) {
          const v = cell.value === null || cell.value === undefined ? null : Number(cell.value);

          if (v === 1) {
            cell.fill = greenFill;
            cell.font = { ...(cell.font || {}), ...boldWhiteFont };
          } else if (v === 2) {
            cell.fill = redFill;
            cell.font = { ...(cell.font || {}), ...boldWhiteFont };
          }

          continue;
        }
      }
    }

    // ---------- ส่งออกเป็น buffer ----------
    const result = await wb.xlsx.writeBuffer();

    if (typeof Buffer !== 'undefined' && result instanceof Uint8Array) {
      return Buffer.from(result);
    }

    return result;
  }


  async exportExcelTestingResultSummary(dto: ReportCYHLeakTestDto): Promise<any> {

    const req = await this.commonService.getConnection();
    console.log("DTO is ", dto)
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);
    req.input('Work_Type', dto.workType);

    const d = await this.commonService.getSearch('sp_rp_Leak_CYH_Testing_Result_Summary', req);
    const data = d.data;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Testing Result Summary Report', {
      views: [{ state: 'frozen', ySplit: 1 }], // freeze header row
    });

    // ---------- กำหนดคอลัมน์ ----------
    ws.columns = [
      { header: 'Plan Start Date', key: 'Plan_Start_Date', width: 24 },
      { header: 'Plan End Date', key: 'Plan_End_Date', width: 24 },
      { header: 'Machine', key: 'Machine_No', width: 8 },
      { header: 'Total Test', key: 'Total_Test', width: 10 },

      { header: 'FG', key: 'FG', width: 5 },

      { header: 'P1, OH, CH1', key: 'NG1', width: 12 },
      { header: 'P2, WJ, CH2', key: 'NG2', width: 12 },
      { header: 'P3, CC, CH3', key: 'NG3', width: 12 },
      { header: 'P4, -, CH4', key: 'NG4', width: 12 },
      { header: 'P5, T/B, CH5', key: 'NG5', width: 12 },
    ];

    // ---------- header style ----------
    const headerRow = ws.getRow(1);
    headerRow.height = 25;

    const headerFill: ExcelJS.FillPattern = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }, // เทาอ่อน
    };

    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = headerFill;
      cell.border = thinBorder;
    });

    // helper แปลงวันที่ให้ excel
    const toExcelDate = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d;
    };

    // ---------- เติมข้อมูล ----------
    data.forEach((r) => {
      ws.addRow({
        Plan_Start_Date: toExcelDate(r.Plan_Start_Date),
        Plan_End_Date: toExcelDate(r.Plan_End_Date),
        Machine_No: r.Machine_No,
        Total_Test: r.Total_Test,

        FG: r.FG,

        NG1: r.NG1,
        NG2: r.NG2,
        NG3: r.NG3,
        NG4: r.NG4,
        NG5: r.NG5,
      });
    });

    // format cell วันที่
    ['Plan_Start_Date', 'Plan_End_Date'].forEach((key) => {
      const col = ws.getColumn(key);
      col.numFmt = 'yyyy MMM dd';
    });

    // ---------- style ทุกช่อง (border + center) ----------
    const totalRows = ws.rowCount;
    const totalCols = ws.columnCount;

    for (let r = 1; r <= totalRows; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= totalCols; c++) {
        const cell = row.getCell(c); // create cell แม้ไม่มีค่า
        cell.border = thinBorder;
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
      }
    }

    // ---------- ส่งออกเป็น buffer ----------
    const result = await wb.xlsx.writeBuffer();

    if (typeof Buffer !== 'undefined' && result instanceof Uint8Array) {
      return Buffer.from(result);
    }

    return result;
  }

  async exportExcelMachineTracking(dto: ReportCYHLeakTestDto): Promise<any> {

    const req = await this.commonService.getConnection();
    console.log("DTO is ", dto)
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);
    req.input('Work_Type', dto.workType);
    req.input('Row_From', 1);
    req.input('Row_To', null);

    const d = await this.commonService.getSearch('sp_rp_Leak_CYH_Machine_Tracking', req);
    const data = d.data;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Machine Tracking Report', {
      views: [{ state: 'frozen', ySplit: 1 }], // freeze header row
    });

    // ---------- กำหนดคอลัมน์ ----------
    ws.columns = [
      { header: 'State Date', key: 'State_Date', width: 30 },
      { header: 'Machine', key: 'Machine_No', width: 8 },
      { header: 'Machine State', key: 'Machine_State', width: 22 },
      { header: 'Machine Type', key: 'Machine_Type', width: 18 },
      { header: 'M/C Date', key: 'MC_Date', width: 15 },
    ];

    // ---------- header style ----------
    const headerRow = ws.getRow(1);
    headerRow.height = 25;

    const headerFill: ExcelJS.FillPattern = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }, // เทาอ่อน
    };

    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = headerFill;
      cell.border = thinBorder;
    });

    // helper แปลงวันที่ให้ excel
    const toExcelDate = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d;
    };

    // ---------- เติมข้อมูล ----------
    data.forEach((r) => {
      ws.addRow({
        State_Date: toExcelDate(r.State_Date),
        Machine_No: r.Machine_No,
        Machine_State: r.Machine_State,
        Machine_Type: r.Machine_Type,
        MC_Date: r.MC_Date,
      });
    });

    // format cell วันที่
    ['State_Date'].forEach((key) => {
      const col = ws.getColumn(key);
      col.numFmt = 'yyyy MMM dd hh:mm:ss';
    });

    // ---------- style ทุกช่อง (border + center) ----------
    const totalRows = ws.rowCount;
    const totalCols = ws.columnCount;

    for (let r = 1; r <= totalRows; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= totalCols; c++) {
        const cell = row.getCell(c); // create cell แม้ไม่มีค่า
        cell.border = thinBorder;
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
      }
    }

    // ---------- ส่งออกเป็น buffer ----------
    const result = await wb.xlsx.writeBuffer();

    if (typeof Buffer !== 'undefined' && result instanceof Uint8Array) {
      return Buffer.from(result);
    }

    return result;
  }

  async exportExcelMachineRunning(dto: ReportCYHLeakTestDto): Promise<any> {

    const req = await this.commonService.getConnection();
    console.log("DTO is ", dto)
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);
    req.input('Work_Type', dto.workType);
    req.input('Row_From', 1);
    req.input('Row_To', null);

    const d = await this.commonService.getSearch('sp_rp_Leak_CYH_Machine_Running', req);
    const data = d.data;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Machine Running Report', {
      views: [{ state: 'frozen', ySplit: 1 }], // freeze header row
    });

    // ---------- กำหนดคอลัมน์ ----------
    ws.columns = [
      { header: 'Machine Type', key: 'Machine_Type', width: 20 },
      { header: 'Machine', key: 'Machine_No', width: 8 },
      { header: 'Model', key: 'Model_cd', width: 20 },
      { header: 'M/C Date', key: 'MC_Date', width: 15 },

      // Start Date มี width ที่กำหนด
      { header: 'Start Date', key: 'Start_Date', width: 24 },

      // End Date มี width ที่กำหนด
      { header: 'End Date', key: 'End_Date', width: 24 },

      { header: 'Process Duration', key: 'process_duration', width: 20 },
      { header: 'Wait OCR Scan', key: 'Wait_OCR', width: 20 },
      { header: 'Test Time', key: 'Test_Time', width: 20 },
    ];

    // ---------- header style ----------
    const headerRow = ws.getRow(1);
    headerRow.height = 25;

    const headerFill: ExcelJS.FillPattern = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }, // เทาอ่อน
    };

    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = headerFill;
      cell.border = thinBorder;
    });

    // helper แปลงวันที่ให้ excel
    const toExcelDate = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d;
    };

    // ---------- เติมข้อมูล ----------
    data.forEach((r) => {
      ws.addRow({
        Machine_Type: r.Machine_Type,
        Machine_No: r.Machine_No,
        Model_cd: r.Model_cd,
        MC_Date: r.MC_Date,

        Start_Date: toExcelDate(r.Start_Date),
        End_Date: toExcelDate(r.End_Date),

        process_duration: r.process_duration,
        Wait_OCR: r.Wait_OCR,
        Test_Time: r.Test_Time,
      });
    });

    // format cell วันที่
    ['Start_Date', 'End_Date'].forEach((key) => {
      const col = ws.getColumn(key);
      col.numFmt = 'yyyy MMM dd hh:mm:ss';
    });

    // ---------- style ทุกช่อง (border + center) ----------
    const totalRows = ws.rowCount;
    const totalCols = ws.columnCount;

    for (let r = 1; r <= totalRows; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= totalCols; c++) {
        const cell = row.getCell(c); // create cell แม้ไม่มีค่า
        cell.border = thinBorder;
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
      }
    }

    // ---------- ส่งออกเป็น buffer ----------
    const result = await wb.xlsx.writeBuffer();

    if (typeof Buffer !== 'undefined' && result instanceof Uint8Array) {
      return Buffer.from(result);
    }

    return result;
  }

  async exportExcelMachineNoPlanSummary(dto: ReportCYHLeakTestDto): Promise<any> {

    const req = await this.commonService.getConnection();
    req.input('Plan_Date_start', dto.planDateStart);
    req.input('Plan_Date_End', dto.planDateEnd);
    req.input('Machine_No', dto.machineNo);

    const d = await this.commonService.getSearch('sp_rp_Leak_CYH_Machine_NoPlan', req);
    const data = d.data;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Machine No Plan Summary Report', {
      views: [{ state: 'frozen', ySplit: 1 }], // freeze header row
    });

    // ---------- กำหนดคอลัมน์ ----------
    ws.columns = [
      { header: 'Plan Start Date', key: 'Plan_Start_Date', width: 24 },
      { header: 'Plan End Date', key: 'Plan_End_Date', width: 24 },
      { header: 'Machine', key: 'machine_no', width: 8 },
      { header: 'No Plan (Min.)', key: 'Loss_mins', width: 14 },
    ];

    // ---------- header style ----------
    const headerRow = ws.getRow(1);
    headerRow.height = 25;

    const headerFill: ExcelJS.FillPattern = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }, // เทาอ่อน
    };

    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = headerFill;
      cell.border = thinBorder;
    });

    // helper แปลงวันที่ให้ excel
    const toExcelDate = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d;
    };

    // ---------- เติมข้อมูล ----------
    data.forEach((r) => {
      ws.addRow({
        Plan_Start_Date: toExcelDate(r.Plan_Start_Date),
        Plan_End_Date: toExcelDate(r.Plan_End_Date),
        machine_no: r.machine_no,
        Loss_mins: r.Loss_mins,
      });
    });

    // format cell วันที่
    ['Plan_Start_Date', 'Plan_End_Date'].forEach((key) => {
      const col = ws.getColumn(key);
      col.numFmt = 'yyyy MMM dd';
    });

    // ---------- style ทุกช่อง (border + center) ----------
    const totalRows = ws.rowCount;
    const totalCols = ws.columnCount;

    for (let r = 1; r <= totalRows; r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= totalCols; c++) {
        const cell = row.getCell(c); // create cell แม้ไม่มีค่า
        cell.border = thinBorder;
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
      }
    }

    // ---------- ส่งออกเป็น buffer ----------
    const result = await wb.xlsx.writeBuffer();

    if (typeof Buffer !== 'undefined' && result instanceof Uint8Array) {
      return Buffer.from(result);
    }

    return result;
  }
}
