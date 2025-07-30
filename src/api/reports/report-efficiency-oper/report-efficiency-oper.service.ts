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

    // console.log('PlanProd Data:', planProdData);
    // console.log('LossStop Data:', lossStopData);

    const startColData = 3;

    // Sheet 1: PlanProd
    const wsPlanProd = workbook.addWorksheet('PlanProd');
    // Prepare month/year
    const month = dateMonth ? Number(dateMonth) : new Date().getMonth() + 1;
    const year = dateYear ? Number(dateYear) : new Date().getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    // --- Header rows ---
    // Row 1: Title (merge)
    const totalCols = 2 + daysInMonth * 2 + 1; // ValuePlan + (D/N * days) + total
    wsPlanProd.mergeCells(1, 1, 1, totalCols - 1);
    wsPlanProd.getCell(1, 1).value =
      `Progressive mass production of new ${lineCd} in ${new Date(year, month - 1).toLocaleString('en-US', { month: 'short' })}'${year.toString().slice(-2)}`;
    wsPlanProd.getCell(1, 1).font = { bold: true, size: 14 };
    wsPlanProd.getRow(1).alignment = { horizontal: 'left' };

    // Update Date column
    const now = new Date();
    const updateDate =
      now.getDate().toString().padStart(2, '0') +
      '/' +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      now.getFullYear();
    wsPlanProd.getCell(1, totalCols).value = 'Update :';
    wsPlanProd.getColumn(totalCols).width = 8;
    wsPlanProd.getCell(1, totalCols + 1).value = updateDate;
    wsPlanProd.getColumn(totalCols + 1).width = 8;

    // Row 2: blank for ValuePlan, then merge for month label, then blank for total
    wsPlanProd.getCell(2, 1).value = '';
    wsPlanProd.mergeCells(2, 3, 2, totalCols - 1);
    wsPlanProd.getCell(2, 3).value =
      `${new Date(year, month - 1).toLocaleString('en-US', { month: 'short' })}'${year.toString().slice(-2)}`;
    wsPlanProd.getCell(2, 3).font = { bold: true };
    wsPlanProd.getCell(2, 3).alignment = { horizontal: 'left' };
    wsPlanProd.getCell(2, totalCols).value = '';

    // Row 3: 'Date' and day numbers, then 'Total'
    wsPlanProd.getCell(3, 1).value = 'Date';
    let colIdx = startColData;
    for (let d = 1; d <= daysInMonth; d++) {
      wsPlanProd.mergeCells(3, colIdx, 3, colIdx + 1);
      wsPlanProd.getCell(3, colIdx).value = d;
      wsPlanProd.getCell(3, colIdx).alignment = { horizontal: 'center' };
      colIdx += 2;
    }
    wsPlanProd.getCell(3, totalCols).value = 'Total';
    wsPlanProd.getRow(3).font = { bold: true };

    const efficiencyRow = this.calculateEfficiency(
      planProdData,
      year,
      month,
      daysInMonth,
    );

    const totalEfficiencyRow = this.calculateTotalEfficiency(
      planProdData,
      year,
      month,
      daysInMonth,
    );

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
      const dataRow = [row.ValuePlan, ''];
      for (let d = 1; d <= daysInMonth; d++) {
        const dKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_D`;
        const nKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_N`;
        dataRow.push(row[dKey] ?? null);
        dataRow.push(row[nKey] ?? null);
      }
      dataRow.push(row.total ?? null);
      wsPlanProd.addRow(dataRow);
    });

    wsPlanProd.getColumn(1).width = 15;
    wsPlanProd.getColumn(2).width = 15;

    // row shift
    const header = ['Shift', ''];
    for (let d = 1; d <= daysInMonth; d++) {
      header.push('D');
      header.push('N');
    }
    // header.push('total');
    wsPlanProd.insertRow(5, header);
    wsPlanProd.getRow(5).alignment = { horizontal: 'center' };
    wsPlanProd.getCell(5, 1).alignment = { horizontal: 'left' };

    // Insert efficiency row
    wsPlanProd.insertRow(8, efficiencyRow);

    // Insert total efficiency row
    wsPlanProd.insertRow(9, totalEfficiencyRow);

    // // row working time
    // const rWorkingTime = planProdData.filter(
    //   (row) => row.ValuePlan === 'Working Time',
    // );
    // rWorkingTime.forEach((row) => {
    //   const dataRow = [row.ValuePlan];
    //   for (let d = 1; d <= daysInMonth; d++) {
    //     const dKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_D`;
    //     const nKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_N`;
    //     dataRow.push(row[dKey] ?? null);
    //     dataRow.push(row[nKey] ?? null);
    //   }
    //   dataRow.push(row.total ?? null);
    //   wsPlanProd.addRow(dataRow);
    // });
    colIdx = startColData; // Reset column index for days

    for (let d = 1; d <= daysInMonth; d++) {
      wsPlanProd.mergeCells(9, colIdx, 9, colIdx + 1);
      wsPlanProd.getCell(9, colIdx).alignment = { horizontal: 'center' };
      colIdx += 2;
    }
    colIdx = startColData; // Reset column index for days

    for (let d = 1; d <= daysInMonth; d++) {
      wsPlanProd.mergeCells(10, colIdx, 10, colIdx + 1);
      wsPlanProd.getCell(10, colIdx).alignment = { horizontal: 'center' };
      colIdx += 2;
    }

    // row shift
    let row = ['Loss Efficiency (Min)', ''];
    for (let d = 1; d <= daysInMonth; d++) {
      row.push('D');
      row.push('N');
    }
    const exRow = wsPlanProd.addRow(row);
    exRow.alignment = { horizontal: 'center' };
    wsPlanProd.getCell(11, 1).font = { bold: true };

    // Auto width for columns
    wsPlanProd.columns.forEach((column, idx) => {
      if (idx < startColData - 1 || idx >= totalCols - 1) return; // skip first column, already set
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = 5; //maxLength + 2;
    });

    //   LossStop

    if (lossStopData.length > 0) {
      // wsPlanProd.addRow(Object.keys(lossStopData[0]));
      lossStopData.forEach((row) => {
        // is null or undefined, set to '-'
        const values = Object.values(row).map((value) =>
          value === null || value === undefined ? '-' : value,
        );
        if (values[0] === 'M/C Trouble' && values[1] !== '') {
          values[0] = '';
        }
        const exRow = wsPlanProd.addRow(values);
        exRow.alignment = { horizontal: 'center' };
        exRow.getCell(1).alignment = { horizontal: 'left' };
      });
    }

    const result = await workbook.xlsx.writeBuffer();
    // If running in Node.js, convert Uint8Array to Buffer for compatibility
    if (typeof Buffer !== 'undefined' && result instanceof Uint8Array) {
      return Buffer.from(result);
    }
    return result;
  }

  calculateEfficiency(planProdData, year, month, daysInMonth) {
    let dataRow = ['Efficiency.(%)'];
    const rAct = planProdData.filter(
      (row) => row.ValuePlan === 'Actual Prod.plan',
    );
    const rPlan = planProdData.filter(
      (row) => row.ValuePlan === 'Prod. Machine Plan',
    );
    for (let d = 1; d <= daysInMonth; d++) {
      const dKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_D`;
      const nKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_N`;
      // dataRow[dKey] = (rAct[0][dKey] / rPlan[0][dKey]) * 100;
      // dataRow[nKey] = (rAct[0][nKey] / rPlan[0][nKey]) * 100;

      const D = rPlan[0][dKey] ? (rAct[0][dKey] / rPlan[0][dKey]) * 100 : 0;
      const N = rPlan[0][nKey] ? (rAct[0][nKey] / rPlan[0][nKey]) * 100 : 0;
      dataRow.push(D ? D.toFixed(2) : null);
      dataRow.push(N ? N.toFixed(2) : null);
    }

    // console.log('dataRow:', dataRow);

    return dataRow;
  }

  calculateTotalEfficiency(planProdData, year, month, daysInMonth) {
    let dataRow = ['Total Efficiency.(%)'];
    const rAct = planProdData.filter(
      (row) => row.ValuePlan === 'Actual Prod.plan',
    );
    const rPlan = planProdData.filter(
      (row) => row.ValuePlan === 'Prod. Machine Plan',
    );
    for (let d = 1; d <= daysInMonth; d++) {
      const dKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_D`;
      const nKey = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}_N`;
      // dataRow[dKey] = (rAct[0][dKey] / rPlan[0][dKey]) * 100;
      // dataRow[nKey] = (rAct[0][nKey] / rPlan[0][nKey]) * 100;

      const DN =
        (rAct[0][dKey] + rAct[0][nKey]) /
        (rPlan[0][dKey] + rPlan[0][nKey]) /
        100;
      dataRow.push(DN ? DN.toFixed(2) : null);
      dataRow.push(DN ? DN.toFixed(2) : null);
    }

    console.log('Total Efficiency.(%):', dataRow);

    return dataRow;
  }
}
