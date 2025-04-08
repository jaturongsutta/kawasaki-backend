import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Predefine } from 'src/entity/predefine.entity';
import { DropdownListController } from './dropdown-list.controller';
import { DropdownListService } from './dropdown-list.service';

@Module({
  imports: [TypeOrmModule.forFeature([Predefine])],
  exports: [TypeOrmModule],
  controllers: [DropdownListController],
  providers: [DropdownListService, CommonService],
})
export class DropdownListModule {}
