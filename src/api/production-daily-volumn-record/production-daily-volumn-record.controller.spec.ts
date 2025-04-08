import { Test, TestingModule } from '@nestjs/testing';
import { ProductionDailyVolumnRecordController } from './production-daily-volumn-record.controller';

describe('ProductionDailyVolumnRecordController', () => {
  let controller: ProductionDailyVolumnRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionDailyVolumnRecordController],
    }).compile();

    controller = module.get<ProductionDailyVolumnRecordController>(ProductionDailyVolumnRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
