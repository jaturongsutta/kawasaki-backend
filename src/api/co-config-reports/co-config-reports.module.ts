import { Module } from '@nestjs/common';
import { CoConfigReportsService } from './co-config-reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoConfigReports } from 'src/entity/co-config-reports.entity';
import { CoConfigReportsController } from './co-config-reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CoConfigReports])],
  providers: [CoConfigReportsService],
  controllers: [CoConfigReportsController],
})
export class CoConfigReportsModule {}
