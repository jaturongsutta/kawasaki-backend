import { BaseDto } from 'src/common/base-dto';

export class PredefineDto extends BaseDto {
  predefineGroup: string;

  predefineCd: string;

  description: string;

  valueTH: string;

  valueEN: string;

  isActive: string;

  createBy: number;

  createDate: Date;

  updateBy: number;

  updateDate: Date;
}
