import { Module } from '@nestjs/common';
import { FailedManagementService } from './failed-management.service';
import { FailedManagementController } from './failed-management.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [FailedManagementService, CommonService],
  controllers: [FailedManagementController],
})
export class FailedManagementModule {}
