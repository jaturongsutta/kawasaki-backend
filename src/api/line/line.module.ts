import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [LineService, CommonService],
  controllers: [LineController],
})
export class LineModule {}
