import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class ReportEfficiencyOperService {
  constructor(private commonService: CommonService) {}
}
