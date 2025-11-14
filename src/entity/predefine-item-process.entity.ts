import { Column, Entity, Index } from "typeorm";

@Index(
  "PK__co_Prede__F1309367FDFE7C56",
  ["predefineCd", "predefineItemCd", "processCd", "machineNo"],
  { unique: true }
)
@Entity("co_Predefine_Item_Machine", { schema: "dbo" })
export class PredefineItemMachine {
  @Column("nvarchar", { name: "Predefine_Group", length: 20 })
  predefineGroup: string;

  @Column("nvarchar", { primary: true, name: "Predefine_CD", length: 20 })
  predefineCd: string;

  @Column("nvarchar", { primary: true, name: "Predefine_Item_CD", length: 20 })
  predefineItemCd: string;

  @Column("nvarchar", { primary: true, name: "Process_CD", length: 20 })
  processCd: string;

  @Column("nvarchar", { primary: true, name: "Machine_No", length: 10 })
  machineNo: string;

  @Column("char", { name: "Is_Active", nullable: true, length: 1 })
  isActive: string | null;

  @Column("int", { name: "Create_By", nullable: true })
  createBy: number | null;

  @Column("datetime", { name: "Create_Date", nullable: true })
  createDate: Date | null;

  @Column("int", { name: "Update_By", nullable: true })
  updateBy: number | null;

  @Column("datetime", { name: "Update_Date", nullable: true })
  updateDate: Date | null;
}
