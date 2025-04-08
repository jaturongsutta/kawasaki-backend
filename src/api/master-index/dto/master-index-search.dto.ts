import { BaseSearch } from 'src/common/base-search';

export class MasterIndexSearchDto extends BaseSearch {
  line: string;
  product: string;
  status: string;
}
