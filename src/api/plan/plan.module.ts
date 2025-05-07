import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdPlan } from 'src/entity/prod-plan.entity';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProdPlan])],
  exports: [TypeOrmModule],
  providers: [PlanService, CommonService],
  controllers: [PlanController],
})
export class PlanModule {}
