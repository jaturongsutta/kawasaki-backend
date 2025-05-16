import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK_M_Team", ["id"], { unique: true })
@Entity("M_Team", { schema: "dbo" })
export class MTeam {
    @PrimaryGeneratedColumn({ type: "int", name: "ID" })
    id: number;

    @Column("nvarchar", { name: "Team_Name", nullable: true, length: 20 })
    teamName: string | null;

    @Column("int", { name: "Default_Operator", nullable: true })
    defaultOperator: number | null;

    @Column("int", { name: "Default_Leader", nullable: true })
    defaultLeader: number | null;

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
