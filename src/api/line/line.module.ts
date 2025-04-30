import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { CommonService } from 'src/common/common.service';
import { MLine } from 'src/entity/m-line.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MLineModel } from 'src/entity/m-line-model.entity';
import { MLineMachine } from 'src/entity/m-line-machine.entity';
import { MLineTool } from 'src/entity/m-line-tool.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MLine, MLineModel, MLineMachine, MLineTool]),
  ],
  providers: [LineService, CommonService],
  controllers: [LineController],
})
export class LineModule {}
