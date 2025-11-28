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

  @Post('search-testing-result-summary')
  async searchTestingResultSummary(@Body() dto: ReportCYHLeakTestDto) {
    return await this.service.searchTestingResultSummary(dto);
  }

  @Post('search-machine-tracking')
  async searchMachineTracking(@Body() dto: ReportCYHLeakTestDto) {
    return await this.service.searchMachineTracking(dto);
  }

  @Post('search-machine-running')
  async searchMachineRunning(@Body() dto: ReportCYHLeakTestDto) {
    return await this.service.searchMachineRunning(dto);
  }

  @Post('search-machine-noplan-summary')
  async searchMachineNoPlanSummary(@Body() dto: ReportCYHLeakTestDto) {
    return await this.service.searchMachineNoPlanSummary(dto);
  }

  @Post('export')
  async exportReport(@Body() dto: ReportCYHLeakTestDto, @Res() res: Response) {
    const buffer = await this.service.exportExcelTestingResult(dto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="Report1-Testing-Result.xlsx"',
    });
    res.end(buffer);
  }

  @Post('export-testing-result-summary')
  async exportTestingResultSummary(@Body() dto: ReportCYHLeakTestDto, @Res() res: Response) {
    const buffer = await this.service.exportExcelTestingResultSummary(dto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="Report2-Testing-Result-Summary.xlsx"',
    });
    res.end(buffer);
  }

  @Post('export-machine-tracking')
  async exportMachineTracking(@Body() dto: ReportCYHLeakTestDto, @Res() res: Response) {
    const buffer = await this.service.exportExcelMachineTracking(dto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="Report3-Machine-Tracking.xlsx"',
    });
    res.end(buffer);
  }

  @Post('export-machine-running')
  async exportMachineRunning(@Body() dto: ReportCYHLeakTestDto, @Res() res: Response) {
    const buffer = await this.service.exportExcelMachineRunning(dto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="Report4-Machine-Running.xlsx"',
    });
    res.end(buffer);
  }

  @Post('export-machine-noplan-summary')
  async exportMachineNoPlanSummary(@Body() dto: ReportCYHLeakTestDto, @Res() res: Response) {
    const buffer = await this.service.exportExcelMachineNoPlanSummary(dto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="Report5-Machine-No-Plan-Summary.xlsx"',
    });
    res.end(buffer);
  }
}
