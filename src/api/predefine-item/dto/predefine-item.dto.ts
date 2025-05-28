import { BaseDto } from 'src/common/base-dto';

export class PredefineItemDto extends BaseDto {
  predefineGroup: string;

  predefineCd: string;

  predefineItemCd: string;

  description: string;

  valueTh: string;

  valueEn: string;

  isActive: string;

  createBy: number;

  createDate: Date;

  updateBy: number;

  updateDate: Date;

  isPredefineCdChange: boolean;
  currentPredefineCd: string;
}
