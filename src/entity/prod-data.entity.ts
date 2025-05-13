import { Column, Entity, Index } from 'typeorm';

@Index('PK_Prod_Data', ['id'], { unique: true })
@Entity('Prod_Data', { schema: 'dbo' })
export class ProdData {
  @Column('uniqueidentifier', {
    primary: true,
    name: 'ID',
    default: () => 'newid()',
  })
  id: string;

  @Column('nvarchar', { name: 'Line_CD', nullable: true, length: 10 })
  lineCd: string | null;

  @Column('datetime', { name: 'Production_Date', nullable: true })
  productionDate: Date | null;

  @Column('nvarchar', { name: 'Product_CD', nullable: true, length: 10 })
  productCd: string | null;

  @Column('int', { name: 'Mapped_Plan_ID', nullable: true })
  mappedPlanId: number | null;

  @Column('nvarchar', { name: 'Status', nullable: true, length: 2 })
  status: string | null;

  @Column('nvarchar', { name: 'Confirmed_Status', nullable: true, length: 2 })
  confirmedStatus: string | null;

  @Column('datetime', { name: 'Confirmed_DATE', nullable: true })
  confirmedDate: Date | null;

  @Column('int', { name: 'Confirmed_BY', nullable: true })
  confirmedBy: number | null;
}
