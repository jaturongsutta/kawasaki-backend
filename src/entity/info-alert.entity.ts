import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_Info_Alert", ["id"], { unique: true })
@Entity("Info_Alert", { schema: "dbo" })
export class InfoAlert {
    @PrimaryGeneratedColumn({ type: "int", name: "ID" })
    id: number;

    @Column("nvarchar", { name: "Line_CD", nullable: true, length: 10 })
    lineCd: string | null;

    @Column("nvarchar", { name: "Info_Alert", nullable: true, length: 250 })
    infoAlert: string | null;

    @Column("date", { name: "Alert_Start_Date", nullable: true })
    alertStartDate: Date | null;

    @Column("time", { name: "Alert_Start_Time", nullable: true })
    alertStartTime: Date | null;

    @Column("date", { name: "Alert_End_Date", nullable: true })
    alertEndDate: Date | null;

    @Column("time", { name: "Alert_End_Time", nullable: true })
    alertEndTime: Date | null;

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
