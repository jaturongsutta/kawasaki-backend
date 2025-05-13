import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdPlan } from 'src/entity/prod-plan.entity';
import { CommonService } from 'src/common/common.service';
import { MWorkingTime } from 'src/entity/m-working-time.entity';
import { MLine } from 'src/entity/m-line.entity';
import { Predefine } from 'src/entity/predefine.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProdPlan, MWorkingTime, MLine, Predefine, User]),
  ],
  exports: [TypeOrmModule],
  providers: [PlanService, CommonService],
  controllers: [PlanController],
})
export class PlanModule {}
