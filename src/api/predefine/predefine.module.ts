import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Predefine } from 'src/entity/predefine.entity';
import { PredefineController } from './predefine.controller';
import { PredefineService } from './predefine.service';

@Module({
  imports: [TypeOrmModule.forFeature([Predefine])],
  exports: [TypeOrmModule],
  controllers: [PredefineController],
  providers: [PredefineService, CommonService],
})
export class PredefineModule {}
