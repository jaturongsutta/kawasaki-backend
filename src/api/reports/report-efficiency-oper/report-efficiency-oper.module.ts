import { Module } from '@nestjs/common';
import { ReportEfficiencyOperService } from './report-efficiency-oper.service';
import { ReportEfficiencyOperController } from './report-efficiency-oper.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [ReportEfficiencyOperService, CommonService],
  controllers: [ReportEfficiencyOperController],
})
export class ReportEfficiencyOperModule {}
