import { Test, TestingModule } from '@nestjs/testing';
import { PredefineController } from './predefine.controller';

describe('PredefineController', () => {
  let controller: PredefineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredefineController],
    }).compile();

    controller = module.get<PredefineController>(PredefineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
