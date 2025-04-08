import { BaseSearch } from 'src/common/base-search';

export class RoleSearchDto extends BaseSearch {
  roleId: number;

  roleNameEn: string;

  roleNameTh: string;

  status: string;

  createdBy: number;

  updatedBy: number;
}
