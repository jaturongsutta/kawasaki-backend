import { Module, Logger } from '@nestjs/common';
import { ApplicationLogService } from './application-log.service';
import { ApplicationLogController } from './application-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Predefine } from 'src/entity/predefine.entity';
import { PredefineService } from '../predefine/predefine.service';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [TypeOrmModule.forFeature([Predefine])],
  providers: [ApplicationLogService, Logger, PredefineService, CommonService],
  controllers: [ApplicationLogController],
})
export class ApplicationLogModule {}
