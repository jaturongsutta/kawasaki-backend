import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolController } from './tool.controller';
import { ToolService } from './tool.service';
import { CommonService } from 'src/common/common.service';
import { MTool } from 'src/entity/tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MTool])],
  exports: [TypeOrmModule],
  providers: [CommonService, ToolService],
  controllers: [ToolController]
})
export class ToolModule { }
