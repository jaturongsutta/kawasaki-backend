import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class ModelSearchDto extends BaseSearch {
  model_cd: string;
  product_cd: string;
  status: string;
}

export class ModelDto {
  @IsNotEmpty()
  modelCd: string;

  productCd: string | null;

  partNo: string | null;

  partUpper: string | null;

  partLower: string | null;

  cycleTime: Date | null;

  cycleTimeMins: string | null;

  isActive: string | null;

  createdDate: Date | null;

  createdBy: string | null;

  updatedDate: Date | null;

  updatedBy: string | null;
}