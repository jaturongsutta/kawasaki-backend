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
}
