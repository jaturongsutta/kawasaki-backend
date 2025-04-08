import { BaseSearch } from 'src/common/base-search';

export class ProductSearchDto extends BaseSearch {
  product: string;
  status: string;
}
