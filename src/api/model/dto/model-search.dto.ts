import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class ModelSearchDto extends BaseSearch {
  model_cd: string;
  product_cd: string;
  status: string;
}

export class ModelDto {
  @IsNotEmpty()
  @MaxLength(20)
  Model_CD: string;

  @MaxLength(20)
  Product_CD: string;

  @MaxLength(20)
  Part_No: string;

  @MaxLength(20)
  Part_Upper: string;

  @MaxLength(20)
  Part_Lower: string;

  @MaxLength(20)
  Cycle_Time_Min: string;

  @MaxLength(1)
  Status: string;

  UpdateBy: number;

  UpdateDate: Date;
}