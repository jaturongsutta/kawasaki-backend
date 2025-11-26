import { Module } from '@nestjs/common';
import { ReportCYHLeakTestService } from './report-cyh-leak-test.service';
import { ReportCYHLeakTestController } from './report-cyh-leak-test.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [ReportCYHLeakTestService, CommonService],
  controllers: [ReportCYHLeakTestController],
})
export class ReportCYHLeakTestModule { }
