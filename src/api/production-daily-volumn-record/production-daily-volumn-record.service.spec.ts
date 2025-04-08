import { Test, TestingModule } from '@nestjs/testing';
import { ProductionDailyVolumnRecordService } from './production-daily-volumn-record.service';

describe('ProductionDailyVolumnRecordService', () => {
  let service: ProductionDailyVolumnRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionDailyVolumnRecordService],
    }).compile();

    service = module.get<ProductionDailyVolumnRecordService>(ProductionDailyVolumnRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
