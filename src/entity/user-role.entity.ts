import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('um_user_role')
export class UserRole {
  @PrimaryGeneratedColumn({ name: 'User_Role_ID', type: 'int' })
  userRoleId: number;

  @Column({ name: 'User_ID', type: 'int' })
  userId: number;

  @Column({ name: 'Role_ID', type: 'int' })
  roleId: number;
}
