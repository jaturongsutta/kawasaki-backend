import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';

import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportEfficiencyOperService {
  constructor(private commonService: CommonService) {}

  async exportExcel(query: any): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    // Get params from query or use default
    const lineCd = query.Line_CD || 'CYH#6';
    const dateMonth = query.Date_Month || null;
    const dateYear = query.Date_Year || null;

    // Call sp_rp_PlanProd
    const req1 = await this.commonService.getConnection();
    req1.input('Line_CD', lineCd);
    req1.input('Date_Month', dateMonth);
    req1.input('Date_Year', dateYear);
    const planProdResult = await this.commonService.executeStoreProcedure(
      'sp_rp_PlanProd',
      req1,
    );
    const planProdData = planProdResult.recordset || [];

    // Call sp_rp_LossStop
    const req2 = await this.commonService.getConnection();
    req2.input('Line_CD', lineCd);
    req2.input('Date_Month', dateMonth);
    req2.input('Date_Year', dateYear);
    const lossStopResult = await this.commonService.executeStoreProcedure(
      'sp_rp_LossStop',
      req2,
    );
    const lossStopData = lossStopResult.recordset || [];

    console.log('PlanProd Data:', planProdData);
    console.log('LossStop Data:', lossStopData);

    // Sheet 1: PlanProd
    const wsPlanProd = workbook.addWorksheet('PlanProd');
    if (planProdData.length > 0) {
      wsPlanProd.addRow(Object.keys(planProdData[0]));
      planProdData.forEach((row) => wsPlanProd.addRow(Object.values(row)));
    } else {
      wsPlanProd.addRow(['No data']);
    }

    // Sheet 2: LossStop
    const wsLossStop = workbook.addWorksheet('LossStop');
    if (lossStopData.length > 0) {
      wsLossStop.addRow(Object.keys(lossStopData[0]));
      lossStopData.forEach((row) => wsLossStop.addRow(Object.values(row)));
    } else {
      wsLossStop.addRow(['No data']);
    }

    const result = await workbook.xlsx.writeBuffer();
    // If running in Node.js, convert Uint8Array to Buffer for compatibility
    if (typeof Buffer !== 'undefined' && result instanceof Uint8Array) {
      return Buffer.from(result);
    }
    return result;
  }
}
