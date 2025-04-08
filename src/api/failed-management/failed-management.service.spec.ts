import { Test, TestingModule } from '@nestjs/testing';
import { FailedManagementService } from './failed-management.service';

describe('FailedManagementService', () => {
  let service: FailedManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FailedManagementService],
    }).compile();

    service = module.get<FailedManagementService>(FailedManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
