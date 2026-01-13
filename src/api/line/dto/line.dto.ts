import { BaseDto } from 'src/common/base-dto';

export class LineDto extends BaseDto {
  lineCd: string;
  lineName?: string | null;
  efficiencyPercent?: number | null;
  pkCd?: string | null;
  isActive?: string | null;
  isLeak?: string | null;
  createdDate?: string | null;
  createdBy?: number | null;
  updatedDate?: string | null;
  updatedBy?: number | null;

  lineModel: LineModel[];
  lineMachine: LineMachine[];
  lineTool: LineTool[];
}

export class LineModel {
  lineCd: string;
  modelCd: string;
  productCd: string;
  partNo: string;
  partUpper: string;
  partLower: string;
  cycleTime: Date | null;
  as400ProductCd: string;
  isActive: string;
  rowState: string;
  statusName: string | null;
  worker: number;
}

export class LineMachine {
  lineCd: string;
  modelCd: string;
  machineNo: string;
  processCd: string;
  wt: Date | null;
  ht: Date | null;
  mt: Date | null;
  isActive: string | null;
  // createdDate: Date | null;
  // createdBy: number | null;
  // updatedDate: Date | null;
  // updatedBy: number | null;

  rowState: string;
}

export class LineTool {
  lineCd: string;
  modelCd: string;
  machineNo: string;
  processCd: string;
  hCode: string;
  isActive: string | null;
  // createdDate: Date | null;
  // createdBy: number | null;
  // updatedDate: Date | null;
  // updatedBy: number | null;

  rowState: string;
}
