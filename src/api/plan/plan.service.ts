import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ProdPlan } from 'src/entity/prod-plan.entity';
import { Repository, DataSource } from 'typeorm';
import { PlanSearchDto } from './dto/plan-search.dto';
import { getCurrentDate } from 'src/utils/utils';
import { MWorkingTime } from 'src/entity/m-working-time.entity';
import { PlanInfoDto } from './dto/plan-info.dto';
import { MLine } from 'src/entity/m-line.entity';
import { Predefine } from 'src/entity/predefine.entity';
import { User } from 'src/entity/user.entity';
import { PlanProductionDataDto } from './dto/plan-production-data.dto';
import { ProdData } from 'src/entity/prod-data.entity';
import * as moment from 'moment';
import { convertTimeStringToDate } from 'src/utils/utils';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);
  constructor(
    @InjectRepository(ProdPlan)
    private planRepository: Repository<ProdPlan>,
    @InjectRepository(ProdData)
    private prodDataRepository: Repository<ProdData>,
    @InjectRepository(MWorkingTime)
    private workingTimeRepository: Repository<MWorkingTime>,

    @InjectRepository(MLine)
    private lineRepository: Repository<MLine>,

    @InjectRepository(Predefine)
    private predefineRepository: Repository<Predefine>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    private commonService: CommonService,
    private dataSource: DataSource, // Inject DataSource
  ) {}

  async getPlanById(id: number): Promise<PlanInfoDto> {
    try {
      const req = await this.commonService.getConnection();
      req.input('Id', id);

      const result = await this.commonService.executeStoreProcedure(
        'sp_Plan_Load',
        req,
      );

      console.log(result.recordset);

      const item = result.recordset[0];

      if (!item) {
        this.logger.error(`Plan with id ${id} not found`);
        throw new Error('Plan not found');
      }

      // Map entity to DTO
      const planInfo = new PlanInfoDto();
      planInfo.id = item.id;
      planInfo.lineCd = item.Line_CD;
      planInfo.lineName = item.Line_Name;
      planInfo.pkCd = item.PK_CD;
      planInfo.planDate = item.Plan_Date;
      planInfo.planStartTime = item.Plan_Start_Time;
      planInfo.planStopTime = item.Plan_Stop_Time;
      planInfo.shiftTeam = item.shift_team;
      planInfo.shiftPeriod = item.Shift_Period;
      planInfo.b1 = item.B1 === 'Y' ? 'Y' : 'N';
      planInfo.b2 = item.B2 === 'Y' ? 'Y' : 'N';
      planInfo.b3 = item.B3 === 'Y' ? 'Y' : 'N';
      planInfo.b4 = item.B4 === 'Y' ? 'Y' : 'N';
      planInfo.ot = item.OT === 'Y' ? 'Y' : 'N';
      planInfo.modelCd = item.Model_CD;
      planInfo.productCd = item.Product_CD;
      planInfo.cycleTime = item.Cycle_Time;
      planInfo.operator = item.Operator;
      planInfo.leader = item.Leader;
      planInfo.actualStartDt = item.Actual_Start_DT;
      planInfo.actualStopDt = item.Actual_Stop_DT;
      planInfo.setupTime = item.Setup_Time;
      planInfo.actualTotalTime = item.Actual_Total_Time;
      planInfo.status = item.status;
      planInfo.statusName = item.status_name;
      planInfo.updatedBy = item.updated_by;
      planInfo.updatedByName = item.updated_by;
      planInfo.updatedDate = item.updated_date;

      planInfo.as400PlanAmt = item.AS400_Plan_Amt;
      planInfo.planTotalTime = item.plan_total_time;
      planInfo.planFgAmt = item.plan_fg_amt;
      planInfo.okAmt = item.OK_Amt;
      planInfo.ngAmt = item.NG_Amt;
      planInfo.actualFgAmt = item.Actual_FG_Amt;

      planInfo.partNo = item.Part_No;
      planInfo.partUpper = item.Part_Upper;
      planInfo.partLower = item.Part_Lower;

      return planInfo;
    } catch (error) {
      this.logger.error(
        `Error getting plan info by id ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async planListCurrent(line: string) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Line_CD', line);
      // execute stored procedure without log
      const { recordset } = await req.execute('sp_Plan_List_Current');
      // const { recordset } = await this.commonService.executeStoreProcedure(
      //   'sp_Plan_List_Current',
      //   req,
      // );
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

  // get plan info by id
  async getPlanInfo(id: number) {
    try {
      const plan = await this.planRepository.findOneBy({ id });
      if (!plan) {
        this.logger.error(`Plan with id ${id} not found`);
        return {
          status: 1,
          message: 'Plan not found',
        };
      }
      return {
        status: 0,
        data: plan,
      };
    } catch (error) {
      this.logger.error(`Error getting plan info: ${error.message}`);
      return {
        status: 2,
        message: 'Error getting plan info',
      };
    }
  }

  async getProductionDataByPlanId(planId: number) {
    const req = await this.commonService.getConnection();
    req.input('Plan_Id', planId);

    const result = await this.commonService.executeStoreProcedure(
      'sp_Plan_List_ProdData',
      req,
    );

    return result.recordset;
  }

  async getProductionDataById(id: any): Promise<PlanProductionDataDto> {
    const req = await this.commonService.getConnection();
    req.input('Id', id);

    const result = await this.commonService.executeStoreProcedure(
      'sp_Plan_Load_ProdData',
      req,
    );

    if (result.recordset.length === 0) {
      this.logger.error(`No production data found for plan id ${id}`);
      return null;
    }
    console.log(result.recordset[0]);
    // Map the first record to the DTO
    const productionData = new PlanProductionDataDto();
    productionData.prodDataId = id;
    productionData.lineCd = result.recordset[0].Line_CD;
    productionData.planId = result.recordset[0].plan_id;
    productionData.modelCd = result.recordset[0].Model_CD;
    productionData.status = result.recordset[0].status;
    productionData.confirmedStatus = result.recordset[0].Confirmed_Status;
    productionData.ngProcess = result.recordset[0].process_cd;
    productionData.ngReason = result.recordset[0].reason;
    productionData.ngComment = result.recordset[0].comment;
    productionData.productionDate = result.recordset[0].production_date;
    productionData.planDate = result.recordset[0].Plan_Date;
    productionData.planStartTime = result.recordset[0].Plan_Start_Time;

    return productionData;
  }

  async newPlan(dto: PlanInfoDto, userId: number) {
    // log data dto
    this.logger.log(`New plan data: ${JSON.stringify(dto)}`);
    this.logger.log(`New plan userId: ${userId}`);

    // // Check if the line exists
    // const { valid, message } = await this.validateDuplicatePlan(
    //   null,
    //   dto.lineCd,
    //   dto.planDate,
    //   dto.modelCd,
    //   dto.shiftPeriod,
    // );
    // if (!valid) {
    //   this.logger.error(`Duplicate plan found: ${message}`);
    //   return {
    //     status: 1,
    //     message: message,
    //   };
    // }

    dto.planStartTime = convertTimeStringToDate(dto.planStartTime);
    dto.planStopTime = convertTimeStringToDate(dto.planStopTime);

    // Create a new plan
    const newPlan = new ProdPlan();
    newPlan.lineCd = dto.lineCd;
    newPlan.pkCd = dto.pkCd;
    newPlan.planDate = dto.planDate;
    newPlan.planStartTime = dto.planStartTime;
    newPlan.planStopTime = dto.planStopTime;
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

  async updatePlan(planId: number, dto: PlanInfoDto, userId: number) {
    //  update plan by id
    this.logger.log(`Update plan data: ${JSON.stringify(dto)}`);
    this.logger.log(`Update plan id: ${planId}`);
    this.logger.log(`Update plan userId: ${userId}`);

    // // Check if the line exists
    // const { valid, message } = await this.validateDuplicatePlan(
    //   dto.id,
    //   dto.lineCd,
    //   dto.planDate,
    //   dto.modelCd,
    //   dto.shiftPeriod,
    // );
    // if (!valid) {
    //   this.logger.error(`Duplicate plan found: ${message}`);
    //   return {
    //     status: 1,
    //     message: message,
    //   };
    // }

    try {
      const plan = await this.planRepository.findOneBy({ id: planId });
      if (!plan) {
        this.logger.error(`Plan with id ${planId} not found`);
        return {
          status: 1,
          message: 'Plan not found',
        };
      }

      dto.planStartTime = convertTimeStringToDate(dto.planStartTime);
      dto.planStopTime = convertTimeStringToDate(dto.planStopTime);
      console.log('planStartTime', dto.planStartTime);
      if (plan.status === '00') {
        plan.planDate = dto.planDate;
        plan.planStartTime = dto.planStartTime;
        plan.planStopTime = dto.planStopTime;
        plan.shiftTeam = dto.shiftTeam;
        plan.shiftPeriod = dto.shiftPeriod;
        plan.modelCd = dto.modelCd;
        plan.productCd = dto.productCd;
        plan.cycleTime = dto.cycleTime;
        plan.operator = dto.operator;
        plan.leader = dto.leader;
      }

      plan.b1 = dto.b1 === 'Y' ? 'Y' : 'N';
      plan.b2 = dto.b2 === 'Y' ? 'Y' : 'N';
      plan.b3 = dto.b3 === 'Y' ? 'Y' : 'N';
      plan.b4 = dto.b4 === 'Y' ? 'Y' : 'N';
      plan.ot = dto.ot === 'Y' ? 'Y' : 'N';
      plan.planTotalTime = dto.planTotalTime;
      plan.planFgAmt = dto.planFgAmt;

      // Save the updated plan to the database
      const result = this.planRepository.save(plan);
      if (!result) {
        this.logger.error('Failed to update new plan');
        return {
          status: 1,
          message: 'Failed to update new plan',
        };
      }
    } catch (error) {
      this.logger.error(`Error updating new plan: ${error.message}`);
      return {
        status: 2,
        message: 'Error updating new plan',
      };
    }
    return {
      status: 0,
      message: 'Update plan successfully',
    };
  }

  async deletePlan(id: number, userId: number) {
    this.logger.log(`Delete plan id: ${id}`);
    this.logger.log(`Delete plan userId: ${userId}`);
    try {
      const plan = await this.planRepository.findOneBy({ id });
      if (!plan) {
        this.logger.error(`Plan with id ${id} not found`);
        return {
          status: 1,
          message: 'Plan not found',
        };
      }

      // Delete the plan
      const result = await this.planRepository.delete(id);
      if (result.affected === 0) {
        this.logger.error(`Failed to delete plan with id ${id}`);
        return {
          status: 1,
          message: 'Failed to delete plan',
        };
      }
      this.logger.log(`Plan with id ${id} deleted successfully`);
      return {
        status: 0,
        message: 'Plan deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting plan with id ${id}: ${error.message}`);
      return {
        status: 2,
        message: 'Error deleting plan',
      };
    }
  }

  async updateProductionData(
    id: number,
    dto: PlanProductionDataDto,
    userId: number,
  ): Promise<any> {
    try {
      console.log(dto);

      const _productionDate = moment(
        dto.productionDate,
        'DD/MM/YYYY HH:mm:ss',
      ).format('YYYY-MM-DD HH:mm:ss');

      const req = await this.commonService.getConnection();
      req.input('ProdData_Id', id);
      req.input('Plan_Id', dto.planId);
      req.input('Line', dto.lineCd);
      req.input('Production_Date', _productionDate);
      req.input('Status', dto.status);
      req.input('Confirmed_Status', dto.confirmedStatus);
      req.input('userid', userId);
      req.input('NG_Process', dto.ngProcess);
      req.input('NG_Reason', dto.ngReason);
      req.input('NG_Comment', dto.ngComment);

      const result = await this.commonService.executeStoreProcedure(
        'sp_Plan_Update_ProdData',
        req,
      );
      return {
        status: 0,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 2,
        message: 'Error updating production data',
      };
    }
  }

  async confirmList(dto: any, userId: number): Promise<any> {
    try {
      this.logger.log(`Confirm list data: ${JSON.stringify(dto.confirmList)}`);
      this.logger.log(`Confirm list userId: ${userId}`);

      for (let i = 0; i < dto.confirmList.length; i++) {
        const req = await this.commonService.getConnection();

        const item = dto.confirmList[i];
        req.input('ProdData_Id', item.prod_data_id);
        req.input('Plan_Id', item.Plan_Id);
        req.input('Line', item.Line_CD);
        req.input('Production_Date', item.dt);
        req.input('Status', item.Status);
        req.input('Confirmed_Status', '90');
        req.input('userid', userId);
        req.input('NG_Process', item.Process_CD);
        req.input('NG_Reason', item.Reason);
        req.input('NG_Comment', item.Comment);
        const result = await this.commonService.executeStoreProcedure(
          'sp_Plan_Update_ProdData',
          req,
        );

        this.logger.log(`Confirm production data ${item} successfully`);
      }

      // // update by typeorm
      // const ids = dto.confirmList.map((item) => item);
      // const result = await this.prodDataRepository
      //   .createQueryBuilder()
      //   .update(ProdData)
      //   .set({
      //     confirmedStatus: '90',
      //     confirmedDate: getCurrentDate(),
      //     confirmedBy: userId,
      //   })
      //   .where('id IN (:...ids)', { ids })
      //   .execute();
      // if (result.affected === 0) {
      //   this.logger.error(`Failed to confirm production data`);
      //   return {
      //     status: 1,
      //     message: 'Failed to confirm production data',
      //   };
      // }
      // this.logger.log(`Confirm production data successfully`);
      return {
        status: 0,
      };
    } catch (error) {
      console.error(error);

      return {
        status: 2,
        message: 'Error confirming production data',
      };
    }
  }

  async getAS400PlanAmt(pkCd: string, partNo, planDate: string) {
    try {
      const qry = ` SELECT Plan_Amt 
      FROM Inf_Plan 
      where PK_CD = '${pkCd}' and Part_No = '${partNo}' and Plan_Date = '${planDate}'
        `;
      const data = await this.commonService.executeQuery(qry);
      if (data.length === 0) {
        return { planAmt: null };
      } else {
        return { planAmt: data[0].Plan_Amt };
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getPlanTotalTime(dto: any): Promise<any | null> {
    try {
      const {
        lineCd,
        planDate,
        planStartTime,
        planStopTime,
        b1,
        b2,
        b3,
        b4,
        ot,
      } = dto;

      const sql = `
      SELECT dbo.fn_get_Plan_OperTime(
        @0, @1, @2, @3, @4, @5, @6, @7, @8
      ) AS Total_Plan_Time
    `;

      const result = await this.dataSource.query(sql, [
        lineCd,
        planDate,
        planStartTime,
        planStopTime,
        b1,
        b2,
        b3,
        b4,
        ot,
      ]);
      return {
        planTotalTime: result[0]?.Total_Plan_Time ?? null,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(`Error in getPlanTotalTime: ${error.message}`);
      return {
        planTotalTime: null,
        message: 'Error in getPlanTotalTime',
      };
    }
  }

  /**
   * Validate that the new plan's time does not overlap with existing plans for the same line.
   * Returns { valid: boolean, message?: string }
   */
  async validatePlanTimeOverlap(
    lineCd: string,
    planStartTime: string,
    planStopTime: string,
    id: number,
  ): Promise<{ valid: boolean; message?: string }> {
    const sql = `
    SELECT dbo.fn_chk_Plan_Time_Duplicate(
      '${lineCd}', '${planStartTime}', '${planStopTime}', '${id}'
    ) AS cnt
  `;

    const result = await this.commonService.executeQuery(sql);
    return {
      valid: result[0]?.cnt === 0,
      message: result[0]?.cnt > 0 ? 'มี Plan ที่ช่วงเวลาซ้ำ' : '',
    };
  }

  async validatePlanBreakTime(
    lineCd: string,
    planStartTime: string,
    planStopTime: string,
    b1: string,
    b2: string,
    b3: string,
    b4: string,
    ot: string,
    shiftPeriod: string,
    id: number,
  ): Promise<{ valid: boolean; message?: string }> {
    const sql = `
    SELECT dbo.fn_chk_Plan_Break_Time(
      '${lineCd}', '${planStartTime}', '${planStopTime}','${b1}', '${b2}', '${b3}', '${b4}', '${ot}', '${shiftPeriod}', '${id}'
    ) AS cnt
  `;

    // console.log('validatePlanBreakTime sql', sql);

    const result = await this.commonService.executeQuery(sql);
    return {
      valid: result[0]?.cnt === 0 || result[0]?.cnt === null,
      message:
        result[0]?.cnt > 0
          ? 'กรุณาตรวจสอบ ช่วงเวลา Break/OT ไม่อยู่ในช่วงเวลา Plan Start and Stop time'
          : '',
    };
  }

  /**
   * Validate duplication of plan by Line_CD, Plan_Date, Model_CD, and shift_period.
   * Returns { valid: boolean, message?: string }
   */
  async validateDuplicatePlan(
    id: number,
    lineCd: string,
    planDate: Date,
    modelCd: string,
    shiftPeriod: string,
  ): Promise<{ valid: boolean; message?: string }> {
    const _planDate = moment(planDate).format('YYYY-MM-DD');
    let sql = `
    SELECT COUNT(*) as cnt
    FROM Prod_Plan
    WHERE Line_CD = '${lineCd}'
      AND Plan_Date = '${_planDate}'
      AND Model_CD = '${modelCd}'
      AND shift_period = '${shiftPeriod}'
  `;
    // Exclude current id if provided (for update case)
    if (id) {
      sql += ` AND id != '${id}'`;
    }
    const result = await this.commonService.executeQuery(sql);
    const cnt = result[0]?.cnt ?? 0;

    const valid = cnt === 0;
    const message =
      cnt > 0
        ? `มี Plan สำหรับ Model ${modelCd} วันที่ ${_planDate} ช่วง ${shiftPeriod} แล้ว`
        : '';
    return {
      valid,
      message,
    };
  }

  // get default stop time
  async getDefaultStopTime(shiftPeriod: string): Promise<string | null> {
    const sql = `
    SELECT TOP(1) CONVERT(time, t.Time_End) AS x
    FROM (
      SELECT
        CASE
          WHEN CONVERT(VARCHAR(8), Time_Start, 108) < '08:00:00'
            THEN DATEADD(ms, DATEDIFF(ms, '00:00:00', Time_End), CONVERT(DATETIME, DATEADD(DAY, 1, CAST(GETDATE() AS date))))
          ELSE DATEADD(ms, DATEDIFF(ms, '00:00:00', Time_End), CONVERT(DATETIME, CAST(GETDATE() AS date)))
        END AS Time_End
      FROM M_Working_Time
      WHERE D_N = '${shiftPeriod}'
    ) t
    ORDER BY Time_End DESC
  `;
    const result = await this.commonService.executeQuery(sql);
    return result[0]?.x ?? null;
  }
}
