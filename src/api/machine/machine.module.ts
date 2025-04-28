import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { CommonService } from 'src/common/common.service';
import { MMachine } from 'src/entity/machine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MMachine])],
  exports: [TypeOrmModule],
  providers: [CommonService, MachineService],
  controllers: [MachineController]
})
export class MachineModule { }
