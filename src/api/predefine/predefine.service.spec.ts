import { Test, TestingModule } from '@nestjs/testing';
import { PredefineService } from './predefine.service';

describe('PredefineService', () => {
  let service: PredefineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PredefineService],
    }).compile();

    service = module.get<PredefineService>(PredefineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
