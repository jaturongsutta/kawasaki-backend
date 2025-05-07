import { BaseSearch } from 'src/common/base-search';

export class PlanSearchDto extends BaseSearch {
  line: string;
  dateFrom: string;
  dateTo: string;
  lineModel: string;
  status: string;
}
