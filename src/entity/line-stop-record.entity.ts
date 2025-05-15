import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Line_Stop_Record", ["id"], { unique: true })
@Entity("Line_Stop_Record", { schema: "dbo" })
export class LineStopRecord {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("nvarchar", { name: "Plan_ID", nullable: true, length: 10 })
  planId: string | null;

  @Column("nvarchar", { name: "Line_CD", nullable: true, length: 10 })
  lineCd: string | null;

  @Column("nvarchar", { name: "Process_CD", nullable: true, length: 10 })
  processCd: string | null;

  @Column("datetime", { name: "Line_Stop_Date", nullable: true })
  lineStopDate: Date | null;

  @Column("time", { name: "Line_Stop_Time", nullable: true })
  lineStopTime: Date | null;

  @Column("int", { name: "Loss_Time", nullable: true })
  lossTime: number | null;

  @Column("nvarchar", { name: "Reason", nullable: true, length: 10 })
  reason: string | null;

  @Column("nvarchar", { name: "Comment", nullable: true, length: 250 })
  comment: string | null;

  @Column("nvarchar", { name: "Status", nullable: true, length: 2 })
  status: string | null;

  @Column("datetime", { name: "CREATED_DATE", nullable: true })
  createdDate: Date | null;

  @Column("int", { name: "CREATED_BY", nullable: true })
  createdBy: number | null;

  @Column("datetime", { name: "UPDATED_DATE", nullable: true })
  updatedDate: Date | null;

  @Column("int", { name: "UPDATED_BY", nullable: true })
  updatedBy: number | null;

  @Column("int", { name: "ID_Ref", nullable: true })
  idRef: number | null;
}
