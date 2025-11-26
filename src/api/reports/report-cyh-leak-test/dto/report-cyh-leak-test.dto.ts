import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class ReportCYHLeakTestDto extends BaseSearch {
  planDateStart: Date | null;
  planDateEnd: Date | null;
  machineNo: string | null;
  workType: string | null;
  mcDate: string | null;
}