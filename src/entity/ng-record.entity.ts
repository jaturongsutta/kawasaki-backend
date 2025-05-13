import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_NG_Record", ["id"], { unique: true })
@Entity("NG_Record", { schema: "dbo" })
export class NgRecord {
    @PrimaryGeneratedColumn({ type: "int", name: "Id" })
    id: number;

    @Column("nvarchar", { name: "Plan_ID", nullable: true, length: 10 })
    planId: string | null;

    @Column("nvarchar", { name: "Line_CD", nullable: true, length: 10 })
    lineCd: string | null;

    @Column("nvarchar", { name: "Process_CD", nullable: true, length: 10 })
    processCd: string | null;

    @Column("datetime", { name: "NG_Date", nullable: true })
    ngDate: Date | null;

    @Column("time", { name: "NG_Time", nullable: true })
    ngTime: Date | null;

    @Column("int", { name: "Quantity", nullable: true })
    quantity: number | null;

    @Column("nvarchar", { name: "Reason", nullable: true, length: 10 })
    reason: string | null;

    @Column("nvarchar", { name: "Comment", nullable: true, length: 250 })
    comment: string | null;

    @Column("nvarchar", { name: "ID_Ref", nullable: true , length: 50 })
    idRef: string | null;

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
}
