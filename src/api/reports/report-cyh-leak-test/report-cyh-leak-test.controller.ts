import { Controller, Res, Query, Get, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { ReportCYHLeakTestService } from './report-cyh-leak-test.service';
import { ReportCYHLeakTestDto } from './dto/report-cyh-leak-test.dto';

@Controller('report-cyh-leak-test')
export class ReportCYHLeakTestController {
  constructor(
    private readonly service: ReportCYHLeakTestService,
  ) { }

  @Get('machine')
  async getMachine() {
    return await this.service.getMachine()
  }

  @Get('worktype')
  async getWorkType() {
    return await this.service.getWorkType()
  }

  @Post('search-testing-result')
  async search(@Body() dto: ReportCYHLeakTestDto) {
    return await this.service.searchTestingResult(dto);
  }

  @Post('export')
  async exportReport(@Body() dto: ReportCYHLeakTestDto, @Res() res: Response) {
    const buffer = await this.service.exportExcel(dto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="Report1-Testing-Result.xlsx"',
    });
    res.end(buffer);
  }
}
