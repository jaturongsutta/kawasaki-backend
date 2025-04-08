import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity('um_Role')
export class Role {
  @PrimaryGeneratedColumn({ name: 'Role_ID', type: 'int' })
  roleId: number;

  @Column({ name: 'Role_Name_TH', length: 200 })
  roleNameTh: string;

  @Column({ name: 'Role_Name_EN', length: 200 })
  roleNameEn: string;

  @Column({ name: 'Is_Active', length: 1 })
  isActive: string;

  @Column({ name: 'Created_By', type: 'int', nullable: true })
  createBy: number;

  @CreateDateColumn({ name: 'Created_Date', type: 'datetime', nullable: true })
  createDate: Date;

  @Column({ name: 'Updated_By', type: 'int', nullable: true })
  updateBy: number;

  @UpdateDateColumn({ name: 'Updated_Date', type: 'datetime', nullable: true })
  updateDate: Date;

  @OneToMany(() => RolePermission, (role) => role.roleId)
  rolePermissions: RolePermission[];
}
