import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_M_Tool_Alert", ["id"], { unique: true })
@Entity("M_Tool_Alert", { schema: "dbo" })
export class MToolAlert {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("int", { name: "Tool_Life_Limit", nullable: true })
  toolLifeLimit: number | null;

  @Column("int", { name: "Warning_Amt", nullable: true })
  warningAmt: number | null;

  @Column("int", { name: "Alert_Amt", nullable: true })
  alertAmt: number | null;

  @Column("int", { name: "Alarm_Amt", nullable: true })
  alarmAmt: number | null;

  @Column("datetime", { name: "UPDATED_DATE", nullable: true })
  updatedDate: Date | null;

  @Column("nvarchar", { name: "UPDATED_BY", nullable: true, length: 10 })
  updatedBy: string | null;
}
