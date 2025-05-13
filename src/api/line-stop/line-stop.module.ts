import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Predefine } from 'src/entity/predefine.entity';
import { MLine } from 'src/entity/m-line.entity';
import { MLineModel } from 'src/entity/m-line-model.entity';
import { LineStopController } from './line-stop.controller';
import { LineStopService } from './line-stop.service';
import { MLineMachine } from 'src/entity/m-line-machine.entity';
import { LineStopRecord } from 'src/entity/line-stop-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LineStopRecord, MLineMachine, Predefine, MLine, MLineModel])],
  exports: [TypeOrmModule],
  providers: [CommonService, LineStopService],
  controllers: [LineStopController]
})
export class LineStopModule { }
