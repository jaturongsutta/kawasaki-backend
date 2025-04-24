import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelController } from './model.controller';
import { MModel } from '../../entity/model.entity';
import { ModelService } from './model.service';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [TypeOrmModule.forFeature([MModel])],
  exports: [TypeOrmModule],
  providers: [CommonService, ModelService],
  controllers: [ModelController]
})
export class ModelModule { }
