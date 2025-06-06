import { Column, Entity, Index } from 'typeorm';

@Index('PK_M_Line_Machine', ['lineCd', 'modelCd', 'machineNo', 'processCd'], {
  unique: true,
})
@Entity('M_Line_Machine', { schema: 'dbo' })
export class MLineMachine {
  @Column('nvarchar', { primary: true, name: 'Line_CD', length: 10 })
  lineCd: string;

  @Column('nvarchar', { primary: true, name: 'Model_CD', length: 10 })
  modelCd: string;

  @Column('nvarchar', { primary: true, name: 'Machine_No', length: 10 })
  machineNo: string;

  @Column('nvarchar', { primary: true, name: 'Process_CD', length: 10 })
  processCd: string;

  @Column('time', { name: 'WT', nullable: true })
  wt: Date | null;

  @Column('time', { name: 'HT', nullable: true })
  ht: Date | null;

  @Column('time', { name: 'MT', nullable: true })
  mt: Date | null;

  @Column('char', { name: 'is_Active', nullable: true, length: 1 })
  isActive: string | null;

  @Column('datetime', { name: 'CREATED_DATE', nullable: true })
  createdDate: Date | null;

  @Column('int', { name: 'CREATED_BY', nullable: true })
  createdBy: number | null;

  @Column('datetime', { name: 'UPDATED_DATE', nullable: true })
  updatedDate: Date | null;

  @Column('int', { name: 'UPDATED_BY', nullable: true })
  updatedBy: number | null;
}
