import { Controller, Get, Param, Request } from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { CoConfigReportsService } from './co-config-reports.service';

@Controller('co-config-reports')
export class CoConfigReportsController extends BaseController {
    constructor(private service: CoConfigReportsService) {
        super();
      }
  
      @Get('findbyReportType/:key')
      getCoConfigReport(@Request() req: any, @Param('key') key: string) {
          return this.service.findbyReportType(key);
      }
}
