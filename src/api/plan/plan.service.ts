import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ProdPlan } from 'src/entity/prod-plan';
import { Repository } from 'typeorm';
import { PlanSearchDto } from './dto/plan-search.dto';

@Injectable()
export class PlanService {
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
}
