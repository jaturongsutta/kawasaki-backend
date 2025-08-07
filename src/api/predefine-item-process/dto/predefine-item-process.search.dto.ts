import { BaseSearch } from 'src/common/base-search';

export class PredefineItemSearchDto extends BaseSearch {
  lineCd: string;
  predefineGroup: string;
  predefineCd: string;
  processCd: string;
  machineNo: string;
  valueTH: string;
  valueEN: string;
  isActive: string;
}
