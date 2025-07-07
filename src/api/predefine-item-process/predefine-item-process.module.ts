import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { PredefineItemProcessController } from './predefine-item-process.controller';
import { PredefineItemProcessService } from './predefine-item-process.service';
import { PredefineItem } from 'src/entity/predefine-item.entity';
import { Predefine } from 'src/entity/predefine.entity';
import { PredefineItemMachine } from 'src/entity/predefine-item-process.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PredefineItem, PredefineItemMachine])],
  exports: [TypeOrmModule],
  controllers: [PredefineItemProcessController],
  providers: [PredefineItemProcessService, CommonService],
})
export class PredefineItemProcessModule {}
