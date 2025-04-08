import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('um_User')
export class User {
  @PrimaryGeneratedColumn({ name: 'User_ID' })
  userId: number;

  @Column({ name: 'Username', unique: true, length: 40 })
  username: string;

  @Column({ name: 'User_Password', nullable: true, select: false, length: 200 })
  userPassword: string;

  @Column({ name: 'First_Name', nullable: true, length: 200 })
  firstName: string;

  @Column({ name: 'Last_Name', nullable: true, length: 200 })
  lastName: string;

  @Column({
    name: 'Position_Name',
    nullable: true,
    length: 200,
  })
  positionName: string;

  @Column({ name: 'Is_Active', nullable: true, length: 1 })
  isActive: string;

  @Column({ name: 'Created_By', nullable: true, type: 'int' })
  createdBy: number;

  @CreateDateColumn({
    name: 'Created_Date',
    nullable: true,
    type: 'datetime',
  })
  createdDate: Date;

  @Column({ name: 'Updated_By', nullable: true, type: 'int' })
  updateBy: number;

  @UpdateDateColumn({
    name: 'Updated_Date',
    nullable: true,
    type: 'datetime',
  })
  updateDate: Date;
}
