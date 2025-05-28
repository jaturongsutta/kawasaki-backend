import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class ToolSearchDto extends BaseSearch {
  tool_cd: string;
  h_Cd: string;
  process_cd: string;
  status: string;
}

export class ToolDto {
  @IsNotEmpty()
  processCd: string;

  hCode: string;

  @IsNotEmpty()
  toolCd: string;

  toolName: string | null;

  toolLife: number | null;

  warningAmt: number | null;

  alertAmt: number | null;

  alarmAmt: number | null;

  actualAmt: number | null;

  isActive: string | null;

  mapCd: string | null;

  createdDate: Date | null;

  createdBy: string | null;

  updatedDate: Date | null;

  updatedBy: string | null;
}

export class ToolHistoryDto {
  @IsNotEmpty()
  @MaxLength(20)
  Tool_CD: string;

  @IsNotEmpty()
  @MaxLength(20)
  H_Code: string;

  Process_CD: string;

  Tool_Name: string;
  Tool_Life: number;
  Actual_Amt: number;
  CreateBy: number;
  CreateDate: Date;
}