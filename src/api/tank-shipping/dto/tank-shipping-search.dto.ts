import { BaseSearch } from 'src/common/base-search';

export class TankShippingSearchDto extends BaseSearch {
  tank: string;
  product: string;
  date: string;
}
