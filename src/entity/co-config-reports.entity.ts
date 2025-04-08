import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('co_config_report')
export class CoConfigReports {
  @PrimaryColumn({ name: 'Config_Report_Id' })
  configReportId: number;

  @Column({ name: 'Report_Type' })
  reportType: string;

  @Column({ name: 'Report_Name' })
  reportName: string;

  @Column({ name: 'Path' })
  path: string;
}
