import { Controller } from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { ReportEfficiencyOperService } from './report-efficiency-oper.service';

@Controller('report-efficiency-oper')
export class ReportEfficiencyOperController extends BaseController {
  constructor(
    private readonly reportEfficiencyOperService: ReportEfficiencyOperService,
  ) {
    super();
  }
}
