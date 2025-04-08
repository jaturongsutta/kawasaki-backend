import { Test, TestingModule } from '@nestjs/testing';
import { FailedManagementController } from './failed-management.controller';

describe('FailedManagementController', () => {
  let controller: FailedManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FailedManagementController],
    }).compile();

    controller = module.get<FailedManagementController>(FailedManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
