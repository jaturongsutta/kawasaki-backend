import { Module } from '@nestjs/common';
import { ProductionDailyVolumnRecordService } from './production-daily-volumn-record.service';
import { ProductionDailyVolumnRecordController } from './production-daily-volumn-record.controller';
import { CommonService } from 'src/common/common.service';
import { CoSystemParametersService } from '../co-system-parameters/co-system-parameters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoSystemParameters } from 'src/entity/co-system-parameters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoSystemParameters])],
  providers: [
    ProductionDailyVolumnRecordService,
    CoSystemParametersService,
    CommonService,
  ],
  controllers: [ProductionDailyVolumnRecordController],
})
export class ProductionDailyVolumnRecordModule {}
