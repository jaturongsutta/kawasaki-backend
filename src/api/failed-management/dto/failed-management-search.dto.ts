import { BaseSearch } from 'src/common/base-search';

export class FailedManagementSearchDto extends BaseSearch {
  month: string;
  year: string;
  line: number;
  productName: string;
}
