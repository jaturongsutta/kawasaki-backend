import { BaseSearch } from 'src/common/base-search';

export class PredefineSearchDto extends BaseSearch {
  predefineGroup: string;
  predefineCd: string;
  valueTH: string;
  valueEN: string;
  isActive: string;
}
