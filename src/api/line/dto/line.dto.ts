import { BaseDto } from 'src/common/base-dto';

export class LineDto extends BaseDto {
  lineCd: string;
  lineName?: string | null;
  pkCd?: string | null;
  isActive?: string | null;
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
  partNo: string;
  isActive: string;
  rowState: string;
}

export class LineMachine {
  lineCd: string;
  modelCd: string;
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
  processCd: string;
  toolCd: string;
  isActive: string | null;
  // createdDate: Date | null;
  // createdBy: number | null;
  // updatedDate: Date | null;
  // updatedBy: number | null;

  rowState: string;
}
