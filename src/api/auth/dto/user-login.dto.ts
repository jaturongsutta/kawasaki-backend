import { BaseDto } from 'src/common/base-dto';
import { User } from 'src/entity/user.entity';

export class UserLoginDto extends BaseDto {
  user: User;
  token: string;
  menus: any;
  permissions: any;
}
