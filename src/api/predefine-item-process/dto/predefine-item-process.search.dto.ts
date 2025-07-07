import { BaseSearch } from 'src/common/base-search';

export class PredefineItemSearchDto extends BaseSearch {
  predefineGroup: string;
  predefineCd: string;
  processCd: string;
  valueTH: string;
  valueEN: string;
  isActive: string;
}
