import { Test, TestingModule } from '@nestjs/testing';
import { ReportEfficiencyOperService } from './report-efficiency-oper.service';

describe('ReportEfficiencyOperService', () => {
  let service: ReportEfficiencyOperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportEfficiencyOperService],
    }).compile();

    service = module.get<ReportEfficiencyOperService>(ReportEfficiencyOperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
