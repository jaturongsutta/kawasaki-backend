import { Column, Entity, Index } from 'typeorm';

@Index('PK_M_Machine', ['processCd'], { unique: true })
@Entity('M_Machine', { schema: 'dbo' })
export class MMachine {
  @Column('nvarchar', { primary: true, name: 'Process_CD', length: 10 })
  processCd: string;

  @Column('nvarchar', { name: 'Machine_No', nullable: true, length: 10 })
  machineNo: string | null;

  @Column('nvarchar', { name: 'Machine_Name', nullable: true, length: 200 })
  machineName: string | null;

  @Column('char', { name: 'is_Active', nullable: true, length: 1 })
  isActive: string | null;

  @Column('nvarchar', { name: 'Map_CD', nullable: true, length: 50 })
  mapCd: string | null;

  @Column('datetime', { name: 'CREATED_DATE', nullable: true })
  createdDate: Date | null;

  @Column('nvarchar', { name: 'CREATED_BY', nullable: true, length: 10 })
  createdBy: string | null;

  @Column('datetime', { name: 'UPDATED_DATE', nullable: true })
  updatedDate: Date | null;

  @Column('nvarchar', { name: 'UPDATED_BY', nullable: true, length: 10 })
  updatedBy: string | null;
}
