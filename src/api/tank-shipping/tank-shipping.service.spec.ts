import { Test, TestingModule } from '@nestjs/testing';
import { TankShippingService } from './tank-shipping.service';

describe('TankShippingService', () => {
  let service: TankShippingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TankShippingService],
    }).compile();

    service = module.get<TankShippingService>(TankShippingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
