import { Test, TestingModule } from '@nestjs/testing';
import { ReportEfficiencyOperController } from './report-efficiency-oper.controller';

describe('ReportEfficiencyOperController', () => {
  let controller: ReportEfficiencyOperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportEfficiencyOperController],
    }).compile();

    controller = module.get<ReportEfficiencyOperController>(ReportEfficiencyOperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
