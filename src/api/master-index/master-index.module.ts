import { Module } from '@nestjs/common';
import { MasterIndexService } from './master-index.service';
import { ProductController } from './master-index.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [MasterIndexService, CommonService],
  controllers: [ProductController],
})
export class MasterIndexModule {}
