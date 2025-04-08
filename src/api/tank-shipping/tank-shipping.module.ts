import { Module } from '@nestjs/common';
import { TankShippingService } from './tank-shipping.service';
import { TankShippingController } from './tank-shipping.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [TankShippingService, CommonService],
  controllers: [TankShippingController],
})
export class TankShippingModule {}
