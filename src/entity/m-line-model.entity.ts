import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { MModel } from './model.entity';

@Index('PK_M_Line_Model', ['lineCd', 'modelCd'], { unique: true })
@Entity('M_Line_Model', { schema: 'dbo' })
export class MLineModel {
  @Column('nvarchar', { primary: true, name: 'Line_CD', length: 10 })
  lineCd: string;

  @Column('nvarchar', { primary: true, name: 'Model_CD', length: 10 })
  modelCd: string;

  @Column('char', { name: 'is_Active', nullable: true, length: 1 })
  isActive: string | null;

  @Column('datetime', { name: 'CREATED_DATE', nullable: true })
  createdDate: Date | null;

  @Column('nvarchar', { name: 'CREATED_BY', nullable: true, length: 10 })
  createdBy: string | null;

  @Column('datetime', { name: 'UPDATED_DATE', nullable: true })
  updatedDate: Date | null;

  @Column('int', { name: 'UPDATED_BY', nullable: true })
  updatedBy: number | null;

  @ManyToOne(() => MModel)
  @JoinColumn({ name: 'Model_CD', referencedColumnName: 'modelCd' })
  model: MModel;
}
