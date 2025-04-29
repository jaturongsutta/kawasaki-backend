import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class ToolSearchDto extends BaseSearch {
  tool_cd: string;
  process_cd: string;
  status: string;
}

export class ToolDto {
  @IsNotEmpty()
  @MaxLength(20)
  Tool_CD: string;

  @MaxLength(20)
  Process_CD: string;

  Tool_Name: string;
  Tool_Life: number;
  Warning_Amt: number;
  Alert_Amt: number;
  Alarm_Amt: number;

  @MaxLength(20)
  Map_CD: string;

  @MaxLength(255)
  Machine_Name: string;

  @MaxLength(1)
  Status: string;

  UpdateBy: number;

  UpdateDate: Date;
}

export class ToolHistoryDto {
  @IsNotEmpty()
  @MaxLength(20)
  Tool_CD: string;

  @IsNotEmpty()
  @MaxLength(20)
  Process_CD: string;

  Tool_Name: string;
  Tool_Life: number;
  Actual_Amt: number;
  CreateBy: number;
  CreateDate: Date;
}