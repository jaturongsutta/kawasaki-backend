import { Column, Entity, Index } from "typeorm";

@Index("PK_M_Model", ["modelCd"], { unique: true })
@Entity("M_Model", { schema: "dbo" })
export class MModel {
  @Column("nvarchar", { primary: true, name: "Model_CD", length: 10 })
  modelCd: string;

  @Column("nvarchar", { name: "Product_CD", nullable: true, length: 10 })
  productCd: string | null;

  @Column("nvarchar", { name: "Part_No", nullable: true, length: 10 })
  partNo: string | null;

  @Column("nvarchar", { name: "Part_Upper", nullable: true, length: 10 })
  partUpper: string | null;

  @Column("nvarchar", { name: "Part_Lower", nullable: true, length: 10 })
  partLower: string | null;

  @Column("nvarchar", { name: "AS400_Product_Cd", nullable: true, length: 10 })
  as400ProductCd: string | null;

  @Column("time", { name: "Cycle_Time", nullable: true })
  cycleTime: Date | null;

  @Column("char", { name: "is_Active", nullable: true, length: 1 })
  isActive: string | null;

  @Column("datetime", { name: "CREATED_DATE", nullable: true })
  createdDate: Date | null;

  @Column("nvarchar", { name: "CREATED_BY", nullable: true, length: 10 })
  createdBy: string | null;

  @Column("datetime", { name: "UPDATED_DATE", nullable: true })
  updatedDate: Date | null;

  @Column("nvarchar", { name: "UPDATED_BY", nullable: true, length: 10 })
  updatedBy: string | null;
}
