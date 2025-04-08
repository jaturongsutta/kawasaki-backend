import { Test, TestingModule } from '@nestjs/testing';
import { TankShippingController } from './tank-shipping.controller';

describe('TankShippingController', () => {
  let controller: TankShippingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TankShippingController],
    }).compile();

    controller = module.get<TankShippingController>(TankShippingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
