import { BaseDto } from 'src/common/base-dto';

export class FailedManagementDto extends BaseDto {
  month: string;
  year: string;
  line: string;
  failedId: number;
  productName: string;
  prodWeight2: any;
  failedValue: any;
  finalProd2: any;
}
