import { Controller, Res, Query, Get } from '@nestjs/common';
import { Response } from 'express';
import { BaseController } from 'src/base.controller';
import { ReportEfficiencyOperService } from './report-efficiency-oper.service';

@Controller('report-efficiency-oper')
export class ReportEfficiencyOperController {
  constructor(
    private readonly reportEfficiencyOperService: ReportEfficiencyOperService,
  ) {}

  @Get('export')
  async exportReport(@Query() query: any, @Res() res: Response) {
    // Accept parameters from GET query
    const buffer = await this.reportEfficiencyOperService.exportExcel(query);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="report-efficiency-oper.xlsx"',
    });
    res.end(buffer);
  }
}
