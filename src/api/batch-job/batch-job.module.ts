import { Module } from '@nestjs/common';
import { BatchJobService } from './batch-job.service';
import { BatchJobController } from './batch-job.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [BatchJobService, CommonService],
  controllers: [BatchJobController],
})
export class BatchJobModule {}
