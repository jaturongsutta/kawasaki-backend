import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('um_Menu_Route')
export class MenuRoute {
  @PrimaryGeneratedColumn({ name: 'Menu_Route_ID', type: 'int' })
  menuRouteId: number;

  @Column({ name: 'Menu_No', length: 5 })
  menuNo: string;

  @Column({ name: 'Route_Name', length: 200 })
  routeName: string;

  @Column({ name: 'Route_Path', length: 200 })
  routePath: string;

  @Column({ name: 'Physical_Path', length: 500 })
  physicalPath: string;

  @Column({ name: 'Is_Require_Auth', type: 'bit' })
  isRequireAuth: boolean;

  @Column({ name: 'Is_Main', type: 'bit' })
  isMain: boolean;
}
