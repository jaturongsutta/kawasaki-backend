import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class MachineSearchDto extends BaseSearch {
  machine_no: string;
  process_cd: string;
  status: string;
}

export class MachineDto {
  @IsNotEmpty()
  @MaxLength(20)
  Machine_No: string;

  @MaxLength(20)
  Process_CD: string;

  @MaxLength(20)
  Map_CD: string;

  @MaxLength(255)
  Machine_Name: string;

  @MaxLength(1)
  Status: string;

  UpdateBy: number;

  UpdateDate: Date;
}