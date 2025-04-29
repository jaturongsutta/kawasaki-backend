import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_M_Tool_His", ["id"], { unique: true })
@Entity("M_Tool_His", { schema: "dbo" })
export class MToolHis {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("nvarchar", { name: "Process_CD", nullable: true, length: 10 })
  processCd: string | null;

  @Column("nvarchar", { name: "Tool_CD", nullable: true, length: 10 })
  toolCd: string | null;

  @Column("nvarchar", { name: "Tool_Name", nullable: true, length: 200 })
  toolName: string | null;

  @Column("int", { name: "Tool_Life", nullable: true })
  toolLife: number | null;

  @Column("int", { name: "Actual_Amt", nullable: true })
  actualAmt: number | null;

  @Column("datetime", { name: "CREATED_DATE", nullable: true })
  createdDate: Date | null;

  @Column("nvarchar", { name: "CREATED_BY", nullable: true, length: 10 })
  createdBy: string | null;
}
