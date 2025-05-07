import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ProdPlan } from 'src/entity/prod-plan';
import { Repository } from 'typeorm';
import { PlanSearchDto } from './dto/plan-search.dto';
import { getCurrentDate } from 'src/utils/utils';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);
  constructor(
    @InjectRepository(ProdPlan)
    private planRepository: Repository<ProdPlan>,
    private commonService: CommonService,
  ) {}

  async planListCurrent(line: string) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Line_CD', line);
      const { recordset } = await this.commonService.executeStoreProcedure(
        'sp_Plan_List_Current',
        req,
      );
      return recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async search(dto: PlanSearchDto) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Line_CD', dto.line);
      req.input('Plan_Date_From', dto.dateFrom);
      req.input('Plan_Date_To', dto.dateTo);
      req.input('Model_CD', dto.lineModel);
      req.input('Status', dto.status);
      req.input('Row_No_From', dto.searchOptions.rowFrom);
      req.input('Row_No_To', dto.searchOptions.rowTo);

      return await this.commonService.getSearch('sp_Plan_Search', req);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async stopPlan(id: number, userId: number) {
    try {
      const plan = await this.planRepository.findOneBy({ id });
      if (!plan) {
        throw new Error('Plan not found');
      }
      plan.status = '30';
      plan.actualStopDt = getCurrentDate();
      plan.updatedBy = userId;
      plan.updatedDate = getCurrentDate();
      const result = await this.planRepository.save(plan);

      this.logger.log(`Plan ${id} stopped by user ${userId}`);
      if (!result) {
        return {
          status: 1,
          message: 'Failed to stop plan',
        };
      }
      return {
        status: 0,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 2,
        message: 'Error stopping plan',
      };
    }
  }
}
