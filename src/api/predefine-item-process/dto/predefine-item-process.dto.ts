import { BaseDto } from 'src/common/base-dto';

export class PredefineDto extends BaseDto {
  predefineGroup: string;

  predefineCd: string;

  predefineItemCd: string;

  processCd: string;

  isActive: string;

  createBy: number;

  createDate: Date;

  updateBy: number;

  updateDate: Date;
}
