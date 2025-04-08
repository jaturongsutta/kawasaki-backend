export class UserChangePasswordDto {
  userId: string;

  changeByAdmin: string;

  oldPassword: string;

  newPassword: string;

  createdBy: number;
}
