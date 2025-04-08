import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('um_Role_Permission')
export class RolePermission {
  @PrimaryColumn({ name: 'Role_ID', type: 'int' })
  roleId: number;

  @PrimaryColumn({ name: 'Menu_No', length: 5 })
  menuNo: string;

  @Column({ name: 'Can_Add', length: 1 })
  canAdd: string;

  @Column({ name: 'Can_Update', length: 1 })
  canUpdate: string;

  @Column({ name: 'Can_View', length: 1 })
  canView: string;
}
