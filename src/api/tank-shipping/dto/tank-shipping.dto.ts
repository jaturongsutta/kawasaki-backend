import { BaseDto } from 'src/common/base-dto';

export class TankShippingDto extends BaseDto {
  tankShippingId: number;
  lineTank: string;
  product: string;
  date: string;
  grade: string;
  productName: string;
  shippingType: number;
  class: string;
  lotNo: string;
  packingWeight: number;
  totalQty: number;
  workingTimeStart: string;
  workingTimeStop: string;
  adjValue: number;
  additionalAdj: number;
  empty: string;
  emptyTime: number;
}
