import { Controller, Res, Query, Get, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { ReportCYHLeakTestService } from './report-cyh-leak-test.service';
import { ReportCYHLeakTestDto } from './dto/report-cyh-leak-test.dto';

@Controller('report-cyh-leak-test')
export class ReportCYHLeakTestController {
  constructor(
    private readonly service: ReportCYHLeakTestService,
  ) { }

   @Post('search-testing-result')
    async search(@Body() dto: ReportCYHLeakTestDto) {
      return await this.service.searchTestingResult(dto);
    }

  @Get('export')
  async exportReport(@Query() query: any, @Res() res: Response) {
    // Accept parameters from GET query
    const buffer = await this.service.exportExcel(query);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="report-efficiency-oper.xlsx"',
    });
    res.end(buffer);
  }
}
