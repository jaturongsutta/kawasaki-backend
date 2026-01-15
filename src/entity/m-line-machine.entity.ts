import { Column, Entity, Index } from "typeorm";

@Index(
  "PK_M_Line_Machine",
  ["id", "lineCd", "modelCd", "processCd", "machineNo"],
  { unique: true }
)
@Entity("M_Line_Machine", { schema: "dbo" })
export class MLineMachine {
  @Column("nvarchar", { primary: true, name: "Line_CD", length: 10 })
  lineCd: string;

  @Column("nvarchar", { primary: true, name: "Model_CD", length: 10 })
  modelCd: string;

  @Column("nvarchar", { primary: true, name: "Machine_No", length: 10 })
  machineNo: string;

  @Column("nvarchar", { primary: true, name: "Process_CD", length: 20 })
  processCd: string;

  @Column("int", { primary: true, name: "Id" })
  id: number;

  @Column("time", { name: "WT", nullable: true })
  wt: Date | null;

  @Column("time", { name: "HT", nullable: true })
  ht: Date | null;

  @Column("time", { name: "MT", nullable: true })
  mt: Date | null;

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
