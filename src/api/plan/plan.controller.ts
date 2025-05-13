import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { PlanService } from './plan.service';
import { PlanSearchDto } from './dto/plan-search.dto';
import { PlanProductionDataDto } from './dto/plan-production-data.dto';

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

  // API to get the plan by id
  @Get('/:id')
  async getPlanById(@Param('id') id: number) {
    return await this.service.getPlanById(id);
  }

  @Get('product-data/:id')
  async getProductData(@Param('id') id: number) {
    return await this.service.getProductionDataByPlanId(id);
  }

  @Get('product-data-by-id/:id')
  async getProductDataById(@Param('id') id: any) {
    return await this.service.getProductionDataById(id);
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

  @Delete('delete-plan/:id')
  async deletePlan(@Param('id') id: number, @Request() req: any) {
    return await this.service.deletePlan(id, req.user.userId);
  }

  @Put('update-production-data/:id')
  async updateProductionData(
    @Param('id') id,
    @Body() dto: PlanProductionDataDto,
    @Request() req: any,
  ) {
    return await this.service.updateProductionData(id, dto, req.user.userId);
  }

  @Post('confirm-list')
  async confirmList(@Body() dto: any, @Request() req: any) {
    console.log('confirmList', dto);
    return await this.service.confirmList(dto, req.user.userId);
  }
}
