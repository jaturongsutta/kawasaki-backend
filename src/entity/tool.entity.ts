import { Column, Entity, Index } from "typeorm";

@Index("PK_M_Tool", ["processCd", "machineNo","hCode"], { unique: true })
@Entity("M_Tool", { schema: "dbo" })
export class MTool {
  @Column("nvarchar", { primary: true, name: "Process_CD", length: 10 })
  processCd: string;
  
  @Column("nvarchar", { primary: true, name: "Machine_No", length: 10 })
  machineNo: string;

  @Column("nvarchar", { primary: true, name: "H_Code", length: 10 })
  hCode: string;

  @Column("nvarchar", { name: "Tool_CD", length: 10 })
  toolCd: string;

  @Column("nvarchar", { name: "Tool_Name", nullable: true, length: 200 })
  toolName: string | null;

  @Column("int", { name: "Tool_Life", nullable: true })
  toolLife: number | null;

  @Column("int", { name: "Warning_Amt", nullable: true })
  warningAmt: number | null;

  @Column("int", { name: "Alert_Amt", nullable: true })
  alertAmt: number | null;

  @Column("int", { name: "Alarm_Amt", nullable: true })
  alarmAmt: number | null;

  @Column("int", { name: "Actual_Amt", nullable: true })
  actualAmt: number | null;

  @Column("char", { name: "is_Active", nullable: true, length: 1 })
  isActive: string | null;

  @Column("nvarchar", { name: "Map_CD", nullable: true, length: 50 })
  mapCd: string | null;

  @Column("datetime", { name: "CREATED_DATE", nullable: true })
  createdDate: Date | null;

  @Column("nvarchar", { name: "CREATED_BY", nullable: true, length: 10 })
  createdBy: string | null;

  @Column("datetime", { name: "UPDATED_DATE", nullable: true })
  updatedDate: Date | null;

  @Column("nvarchar", { name: "UPDATED_BY", nullable: true, length: 10 })
  updatedBy: string | null;
}
