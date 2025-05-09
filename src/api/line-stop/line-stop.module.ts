import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { NgRecord } from 'src/entity/ng-record.entity';
import { MModel } from 'src/entity/model.entity';
import { Predefine } from 'src/entity/predefine.entity';
import { MLine } from 'src/entity/m-line.entity';
import { MLineModel } from 'src/entity/m-line-model.entity';
import { LineStopController } from './line-stop.controller';
import { LineStopService } from './line-stop.service';

@Module({
  imports: [TypeOrmModule.forFeature([NgRecord, MModel, Predefine, MLine, MLineModel])],
  exports: [TypeOrmModule],
  providers: [CommonService, LineStopService],
  controllers: [LineStopController]
})
export class LineStopModule { }
