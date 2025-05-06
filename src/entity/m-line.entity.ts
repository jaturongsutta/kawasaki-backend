import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Index('PK_M_Line', ['lineCd'], { unique: true })
@Entity('M_Line', { schema: 'dbo' })
export class MLine {
  @Column('nvarchar', { primary: true, name: 'Line_CD', length: 10 })
  lineCd: string;

  @Column('nvarchar', { name: 'Line_Name', nullable: true, length: 50 })
  lineName: string | null;

  @Column('nvarchar', { name: 'PK_CD', nullable: true, length: 10 })
  pkCd: string | null;

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
