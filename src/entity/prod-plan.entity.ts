import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK_Prod_Plan', ['id'], { unique: true })
@Entity('Prod_Plan', { schema: 'dbo' })
export class ProdPlan {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('nvarchar', { name: 'Line_CD', nullable: true, length: 10 })
  lineCd: string | null;

  @Column('nvarchar', { name: 'PK_CD', nullable: true, length: 10 })
  pkCd: string | null;

  @Column('date', { name: 'Plan_Date', nullable: true })
  planDate: Date | null;

  @Column('time', { name: 'Plan_Start_Time', nullable: true })
  planStartTime: Date | null;

  @Column('time', { name: 'Plan_Stop_Time', nullable: true })
  planStopTime: Date | null;

  @Column('int', { name: 'Shift_Team', nullable: true })
  shiftTeam: number | null;

  @Column('nvarchar', { name: 'Shift_Period', nullable: true, length: 2 })
  shiftPeriod: string | null;

  @Column('char', { name: 'B1', nullable: true, length: 1 })
  b1: string | null;

  @Column('char', { name: 'B2', nullable: true, length: 1 })
  b2: string | null;

  @Column('char', { name: 'B3', nullable: true, length: 1 })
  b3: string | null;

  @Column('char', { name: 'B4', nullable: true, length: 1 })
  b4: string | null;

  @Column('char', { name: 'OT', nullable: true, length: 1 })
  ot: string | null;

  @Column('nvarchar', { name: 'Model_CD', nullable: true, length: 10 })
  modelCd: string | null;

  @Column('nvarchar', { name: 'Product_CD', nullable: true, length: 10 })
  productCd: string | null;

  @Column('time', { name: 'Cycle_Time', nullable: true })
  cycleTime: Date | null;

  @Column('int', { name: 'Operator', nullable: true })
  operator: number | null;

  @Column('int', { name: 'Leader', nullable: true })
  leader: number | null;

  @Column('datetime', { name: 'Actual_Start_DT', nullable: true })
  actualStartDt: Date | null;

  @Column('datetime', { name: 'Actual_Stop_DT', nullable: true })
  actualStopDt: Date | null;

  @Column('int', { name: 'Plan_Total_Time', nullable: true })
  planTotalTime: number | null;

  @Column('int', { name: 'Actual_Total_Time', nullable: true })
  actualTotalTime: number | null;

  @Column('int', { name: 'Setup_Time', nullable: true })
  setupTime: number | null;

  @Column('int', { name: 'Plan_FG_Amt', nullable: true })
  planFgAmt: number | null;

  @Column('int', { name: 'Actual_FG_Amt', nullable: true })
  actualFgAmt: number | null;

  @Column('int', { name: 'OK_Amt', nullable: true })
  okAmt: number | null;

  @Column('int', { name: 'NG_Amt', nullable: true })
  ngAmt: number | null;

  @Column('nvarchar', { name: 'Status', nullable: true, length: 2 })
  status: string | null;

  @Column('datetime', { name: 'CREATED_DATE', nullable: true })
  createdDate: Date | null;

  @Column('int', { name: 'CREATED_BY', nullable: true })
  createdBy: number | null;

  @Column('datetime', { name: 'UPDATED_DATE', nullable: true })
  updatedDate: Date | null;

  @Column('int', { name: 'UPDATED_BY', nullable: true })
  updatedBy: number | null;
}
