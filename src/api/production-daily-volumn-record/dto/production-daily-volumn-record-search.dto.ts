import { BaseSearch } from 'src/common/base-search';

export class ProductionDailyVolumnRecordSearchDto extends BaseSearch {
  date: string;
  line: string;
  grade: string;
  productName: string;
}
