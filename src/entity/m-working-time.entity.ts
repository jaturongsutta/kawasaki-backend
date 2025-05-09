import { Column, Entity, Index } from 'typeorm';

@Index('PK_M_Working_Time', ['timeCd'], { unique: true })
@Entity('M_Working_Time', { schema: 'dbo' })
export class MWorkingTime {
  @Column('nvarchar', { primary: true, name: 'Time_CD', length: 3 })
  timeCd: string;

  @Column('char', { name: 'D_N', nullable: true, length: 1 })
  dN: string | null;

  @Column('nvarchar', { name: 'Time_Name', nullable: true, length: 20 })
  timeName: string | null;

  @Column('time', { name: 'Time_Start', nullable: true })
  timeStart: Date | null;

  @Column('time', { name: 'Time_End', nullable: true })
  timeEnd: Date | null;

  @Column('char', { name: 'Work_Type', nullable: true, length: 2 })
  workType: string | null;

  @Column('int', { name: 'Time_Mins', nullable: true })
  timeMins: number | null;

  @Column('datetime', { name: 'UPDATED_DATE', nullable: true })
  updatedDate: Date | null;

  @Column('nvarchar', { name: 'UPDATED_BY', nullable: true, length: 10 })
  updatedBy: string | null;
}
