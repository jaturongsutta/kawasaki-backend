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
    // console.log('LossStop Data:', lossStopData);

    // Sheet 1: PlanProd
    const wsPlanProd = workbook.addWorksheet('PlanProd');
    // Prepare month/year
    const month = dateMonth ? Number(dateMonth) : new Date().getMonth() + 1;
    const year = dateYear ? Number(dateYear) : new Date().getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    // --- Header rows ---
    // Row 1: Title (merge)
    const totalCols = 1 + daysInMonth * 2 + 1; // ValuePlan + (D/N * days) + total
    wsPlanProd.mergeCells(1, 1, 1, totalCols);
    wsPlanProd.getCell(1, 1).value =
      `Progressive mass production of new ${lineCd} in ${new Date(year, month - 1).toLocaleString('en-US', { month: 'short' })}'${year.toString().slice(-2)}`;
    wsPlanProd.getCell(1, 1).font = { bold: true, size: 14 };
    wsPlanProd.getRow(1).alignment = { horizontal: 'left' };

    // Row 2: blank for ValuePlan, then merge for month label, then blank for total
    wsPlanProd.getCell(2, 1).value = '';
    wsPlanProd.mergeCells(2, 2, 2, totalCols - 1);
    wsPlanProd.getCell(2, 2).value =
      `${new Date(year, month - 1).toLocaleString('en-US', { month: 'short' })}'${year.toString().slice(-2)}`;
    wsPlanProd.getCell(2, 2).font = { bold: true };
    wsPlanProd.getCell(2, 2).alignment = { horizontal: 'left' };
    wsPlanProd.getCell(2, totalCols).value = '';

    // Row 3: 'Date' and day numbers, then 'Total'
    wsPlanProd.getCell(3, 1).value = 'Date';
    let colIdx = 2;
    for (let d = 1; d <= daysInMonth; d++) {
      wsPlanProd.mergeCells(3, colIdx, 3, colIdx + 1);
      wsPlanProd.getCell(3, colIdx).value = d;
      wsPlanProd.getCell(3, colIdx).alignment = { horizontal: 'center' };
      colIdx += 2;
    }
    wsPlanProd.getCell(3, totalCols).value = 'Total';
    wsPlanProd.getRow(3).font = { bold: true };

    // Row 4: ValuePlan, D/N for each day, total
    // const header = ['ValuePlan'];
    // for (let d = 1; d <= daysInMonth; d++) {
    //   header.push('D');
    //   header.push('N');
    // }
    // header.push('total');
    // wsPlanProd.addRow(header);
    // wsPlanProd.getRow(4).font = { bold: true };

    // Add data rows
    planProdData.forEach((row) => {
      const dataRow = [row.ValuePlan];
      for (let d = 1; d <= daysInMonth; d++) {
        const dKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_D`;
        const nKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_N`;
        dataRow.push(row[dKey] ?? null);
        dataRow.push(row[nKey] ?? null);
      }
      dataRow.push(row.total ?? null);
      wsPlanProd.addRow(dataRow);
    });

    // row working time
    const rWorkingTime = planProdData.find(
      (row) => row.ValuePlan === 'Working Time',
    );

    // Auto width for columns
    wsPlanProd.getColumn(1).width = 20;
    wsPlanProd.columns.forEach((column, idx) => {
      if (idx === 0) return; // skip first column, already set
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = 5; //maxLength + 2;
    });

    const result = await workbook.xlsx.writeBuffer();
    // If running in Node.js, convert Uint8Array to Buffer for compatibility
    if (typeof Buffer !== 'undefined' && result instanceof Uint8Array) {
      return Buffer.from(result);
    }
    return result;
  }
}
