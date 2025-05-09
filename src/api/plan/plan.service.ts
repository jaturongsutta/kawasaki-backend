import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ProdPlan } from 'src/entity/prod-plan.entity';
import { Repository } from 'typeorm';
import { PlanSearchDto } from './dto/plan-search.dto';
import { getCurrentDate } from 'src/utils/utils';
import { MWorkingTime } from 'src/entity/m-working-time.entity';
import { PlanInfoDto } from './dto/plan-info.dto';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);
  constructor(
    @InjectRepository(ProdPlan)
    private planRepository: Repository<ProdPlan>,
    @InjectRepository(MWorkingTime)
    private workingTimeRepository: Repository<MWorkingTime>,
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
    this.logger.log(`Plan ${id} stopped by user ${userId}`);
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
        this.logger.error(`Failed to stop plan ${id}`);
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
      this.logger.error(`Error stopping plan ${id}: ${error.message}`);
      return {
        status: 2,
        message: 'Error stopping plan',
      };
    }
  }

  async getWorkingTimeAll() {
    //select all working time
    try {
      const workingTime = await this.workingTimeRepository.find();
      return workingTime;
    } catch (error) {
      this.logger.error(`Error getting working time: ${error.message}`);
      throw error;
    }
  }

  // get Line Model
  async getLineModel(line: string) {
    try {
      const qry = `
            select lm.Model_CD, m.Product_CD, m.Part_No, m.Part_Upper, m.Part_Lower, CONVERT(VARCHAR(8), CAST(m.Cycle_Time AS DATETIME), 108) Cycle_Time  from M_Line_Model lm
            inner join M_Model m on lm.model_cd = m.model_cd
            where Line_CD = '${line}'`;
      const data = await this.commonService.executeQuery(qry);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async newPlan(dto: PlanInfoDto, userId: number) {
    // log data dto
    this.logger.log(`New plan data: ${JSON.stringify(dto)}`);
    // Create a new plan
    const newPlan = new ProdPlan();
    newPlan.lineCd = dto.lineCd;
    newPlan.pkCd = dto.pkCd;
    newPlan.planDate = dto.planDate;
    newPlan.planStartTime = dto.planStartTime;
    newPlan.shiftTeam = dto.shiftTeam;
    newPlan.shiftPeriod = dto.shiftPeriod;
    newPlan.b1 = dto.b1 === 'Y' ? 'Y' : 'N';
    newPlan.b2 = dto.b2 === 'Y' ? 'Y' : 'N';
    newPlan.b3 = dto.b3 === 'Y' ? 'Y' : 'N';
    newPlan.b4 = dto.b4 === 'Y' ? 'Y' : 'N';
    newPlan.ot = dto.ot === 'Y' ? 'Y' : 'N';
    newPlan.modelCd = dto.modelCd;
    newPlan.productCd = dto.productCd;
    newPlan.cycleTime = dto.cycleTime;
    newPlan.operator = dto.operator;
    newPlan.leader = dto.leader;
    newPlan.planTotalTime = dto.planTotalTime;
    newPlan.planFgAmt = dto.planFgAmt;
    newPlan.status = '00';

    newPlan.okAmt = null;
    newPlan.ngAmt = null;
    newPlan.setupTime = null;
    newPlan.actualStartDt = null;
    newPlan.actualStopDt = null;
    newPlan.actualTotalTime = null;

    newPlan.createdBy = userId;
    newPlan.createdDate = getCurrentDate();
    newPlan.updatedBy = userId;
    newPlan.updatedDate = getCurrentDate();

    // Save the new plan to the database
    try {
      const result = await this.planRepository.save(newPlan);
      if (!result) {
        this.logger.error('Failed to create new plan');
        return {
          status: 1,
          message: 'Failed to create new plan',
        };
      }
      return {
        status: 0,
        message: 'New plan created successfully',
      };
    } catch (error) {
      this.logger.error(`Error creating new plan: ${error.message}`);
      return {
        status: 2,
        message: 'Error creating new plan',
      };
    }
  }

  updatePlan(planId: any, dto: any, userId: any) {
    throw new Error('Method not implemented.');
  }
}
