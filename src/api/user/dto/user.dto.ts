import { BaseDto } from 'src/common/base-dto';

export class UserDto extends BaseDto {
  userId: number;

  username: string;

  password: string;

  firstName: string;

  lastName: string;

  positionName: string;

  // roleID: number;

  isActive: string;

  createdBy: number;

  createdDate: Date;

  updatedBy: number;

  updatedDate: Date;

  status: string;

  roles: number[];
}
