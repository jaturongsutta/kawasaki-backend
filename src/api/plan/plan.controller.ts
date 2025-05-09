import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { PlanService } from './plan.service';
import { PlanSearchDto } from './dto/plan-search.dto';

@Controller('plan')
export class PlanController extends BaseController {
  constructor(private service: PlanService) {
    super();
  }

  // API to get the current plan list by line
  @Get('plan-list-current/:line')
  async getPlanListCurrent(@Param('line') line: string) {
    return await this.service.planListCurrent(line);
  }

  // API to search plans
  @Post('search')
  async searchPlans(@Body() dto: PlanSearchDto) {
    return await this.service.search(dto);
  }

  @Put('stop-plan/:id')
  async stopPlan(@Param('id') id: number, @Request() req: any) {
    return await this.service.stopPlan(id, req.user.userId);
  }

  @Get('working-time-all')
  async getWorkingTimeAll() {
    return await this.service.getWorkingTimeAll();
  }

  @Get('line-model/:line')
  async getLineModel(@Param('line') line: string) {
    return await this.service.getLineModel(line);
  }

  @Post('new-plan')
  async newPlan(@Body() dto: any, @Request() req: any) {
    return await this.service.newPlan(dto, req.user.userId);
  }
  @Put('update-plan/:planId')
  async updatePlan(
    @Param('planId') planId,
    @Body() dto: any,
    @Request() req: any,
  ) {
    return await this.service.updatePlan(planId, dto, req.user.userId);
  }
}
