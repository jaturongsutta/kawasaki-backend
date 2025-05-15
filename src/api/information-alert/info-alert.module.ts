import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfoAlerController } from './info-alert.controller';
import { InfoAlertService } from './info-alert.service';
import { CommonService } from 'src/common/common.service';
import { InfoAlert } from 'src/entity/info-alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InfoAlert])],
  exports: [TypeOrmModule],
  providers: [CommonService, InfoAlertService],
  controllers: [InfoAlerController]
})
export class InfoAlertModule { }
