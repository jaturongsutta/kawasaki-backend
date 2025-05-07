import { Controller, Get, Query, Post, Body } from '@nestjs/common';
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
  async getPlanListCurrent(@Query('line') line: string) {
    return await this.service.planListCurrent(line);
  }

  // API to search plans
  @Post('search')
  async searchPlans(@Body() dto: PlanSearchDto) {
    return await this.service.search(dto);
  }
}
