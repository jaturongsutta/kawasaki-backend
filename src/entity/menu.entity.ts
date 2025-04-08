import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('um_Menu')
export class Menu {
  @PrimaryColumn({ length: 10, name: 'Menu_No' })
  menuNo: string;

  @Column({ length: 255, name: 'Menu_Name_TH' })
  menuNameTH: string;

  @Column({ length: 255, name: 'Menu_Name_EN' })
  menuNameEN: string;

  @Column({ length: 255, name: 'URL', nullable: true })
  url: string;

  @Column({ length: 10, name: 'Menu_Group', nullable: true })
  menuGroup: string;

  @Column({ name: 'Menu_Icon', nullable: true })
  menuIcon: string;

  @Column({ length: 1, name: 'Is_MainMenu', nullable: true })
  isMainMenu: string;

  @Column({ length: 1, name: 'Is_Active', nullable: true })
  isActive: string;

  @Column({ name: 'Menu_Seq', type: 'int', nullable: true })
  menuSeq: number;

  @Column({ name: 'Created_By', type: 'int', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'Created_Date', type: 'datetime', nullable: true })
  createdDate: Date;

  @Column({ name: 'Updated_by', type: 'int', nullable: true })
  updatedBy: number;

  @UpdateDateColumn({ name: 'Updated_Date', type: 'datetime', nullable: true })
  updatedDate: Date;
}
