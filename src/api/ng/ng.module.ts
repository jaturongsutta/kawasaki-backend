import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NGController } from './ng.controller';
import { NGService } from './ng.service';
import { CommonService } from 'src/common/common.service';
import { NgRecord } from 'src/entity/ng-record.entity';
import { MModel } from 'src/entity/model.entity';
import { Predefine } from 'src/entity/predefine.entity';
import { MLine } from 'src/entity/line.entity';
import { MLineModel } from 'src/entity/line-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NgRecord, MModel, Predefine, MLine, MLineModel])],
  exports: [TypeOrmModule],
  providers: [CommonService, NGService],
  controllers: [NGController]
})
export class NGModule { }
