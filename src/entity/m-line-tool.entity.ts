import { Column, Entity, Index } from "typeorm";

@Index(
  "PK_M_Line_Tool",
  ["id", "lineCd", "modelCd", "processCd", "machineNo", "hCode"],
  { unique: true }
)
@Entity("M_Line_Tool", { schema: "dbo" })
export class MLineTool {
  @Column("nvarchar", { primary: true, name: "Line_CD", length: 10 })
  lineCd: string;

  @Column("nvarchar", { primary: true, name: "Model_CD", length: 10 })
  modelCd: string;

  @Column("nvarchar", {
    primary: true,
    name: "Machine_No",
    length: 10,
    default: () => "''",
  })
  machineNo: string;

  @Column("nvarchar", { primary: true, name: "Process_CD", length: 20 })
  processCd: string;

  @Column("nvarchar", { primary: true, name: "H_Code", length: 10 })
  hCode: string;

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

  @Column("nvarchar", { name: "Tool_CD", nullable: true, length: 10 })
  toolCd: string | null;

  @Column("int", { primary: true, name: "Id" })
  id: number;
}
