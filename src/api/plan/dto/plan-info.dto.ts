import { BaseDto } from 'src/common/base-dto';

export class PlanInfoDto extends BaseDto {
  id: number;
  lineCd?: string | null;
  pkCd?: string | null;
  lineName?: string | null;
  planDate?: Date | null;
  planStartTime?: Date | null;
  planStopTime?: Date | null;
  shiftTeam?: number | null;
  shiftPeriod?: string | null;
  b1?: string | null;
  b2?: string | null;
  b3?: string | null;
  b4?: string | null;
  ot?: string | null;
  modelCd?: string | null;
  productCd?: string | null;
  cycleTime?: Date | null;
  operator?: number | null;
  leader?: number | null;
  actualStartDt?: Date | null;
  actualStopDt?: Date | null;
  planTotalTime?: number | null;
  actualTotalTime?: number | null;
  setupTime?: number | null;
  planFgAmt?: number | null;
  actualFgAmt?: number | null;
  okAmt?: number | null;
  ngAmt?: number | null;
  status?: string | null;
  statusName?: string | null;
  createdDate?: Date | null;
  createdBy?: number | null;
  updatedDate?: Date | null;
  updatedBy?: number | null;
  updatedByName?: string | null;

  as400PlanAmt?: number | null;
  partNo: any;
  partUpper: any;
  partLower: any;
  productName: any;
}
