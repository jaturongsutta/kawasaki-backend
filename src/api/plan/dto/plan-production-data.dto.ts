import { BaseDto } from 'src/common/base-dto';

export class PlanProductionDataDto extends BaseDto {
  prodDataId: string;
  lineCd: string;
  planId: string;
  modelCd: string;
  planDate: Date;
  planStartTime: Date;
  productionDate: Date;
  status: string;
  confirmedStatus: string;
  ngProcess: string;
  ngReason: string;
  ngComment: string;
}
