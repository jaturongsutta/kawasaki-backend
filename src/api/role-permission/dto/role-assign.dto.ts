export class RoleAssignDto {
  roleId: number;

  roleNameEn: string;

  roleNameTh: string;

  status: string;

  createdBy: number;

  updatedBy: number;

  roleMenuList: {
    Menu_No: number;
    Can_Update: string;
    Can_Add: string;
    Can_View: string;
  };
}
