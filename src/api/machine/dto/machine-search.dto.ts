import { IsNotEmpty } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class MachineSearchDto extends BaseSearch {
  machine_no: string;
  process_cd: string;
  status: string;
}

export class MachineDto {
  @IsNotEmpty()
  processCd: string;

  @IsNotEmpty()
  machineNo: string | null;

  machineName: string | null;

  isActive: string | null;

  mapCd: string | null;

  createdDate: Date | null;

  createdBy: string | null;

  updatedDate: Date | null;

  updatedBy: string | null;
}