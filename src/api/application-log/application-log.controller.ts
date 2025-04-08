import { Controller, Get, Param, Post } from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { ApplicationLogService } from './application-log.service';

@Controller('application-log')
export class ApplicationLogController extends BaseController {
  constructor(private readonly service: ApplicationLogService) {
    super();
  }

  @Post('search')
  async search(dto: any) {
    return this.service.search();
  }

  @Get('content-log/:filename/:type')
  async getContentLog(
    @Param('filename') filename: string,
    @Param('type') type: string,
  ) {
    return this.service.getContentLog(filename, type);
  }
}
