import { BaseSearch } from 'src/common/base-search';

export class UserSearchDto extends BaseSearch {
  username: string;

  firstName: string;

  lastName: string;

  status: string;
}
