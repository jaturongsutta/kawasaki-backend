import { BaseDto } from 'src/common/base-dto';

export class MasterIndexDto extends BaseDto {
  masterId: number;
  lineId: number;
  productId: number;
  yield: number;
  rH: number;
  capProdTank: number;
  isActive: string;
}
