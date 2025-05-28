import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { PredefineItemController } from './predefine-item.controller';
import { PredefineItemService } from './predefine-item.service';
import { PredefineItem } from 'src/entity/predefine-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PredefineItem])],
  exports: [TypeOrmModule],
  controllers: [PredefineItemController],
  providers: [PredefineItemService, CommonService],
})
export class PredefineItemModule {}
