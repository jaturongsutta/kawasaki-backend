import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class InfoAlertSearchDto extends BaseSearch {
  lineCd: string;
  dateFrom: string;
  dateTo: string;
}

export class InfoAlertDto {
  id: number;

  lineCd: string | null;

  infoAlert: string | null;

  alertStartDate: Date | null;

  alertStartTime: Date | null;

  alertEndDate: Date | null;

  alertEndTime: Date | null;

  isActive: string | null;

  createdDate: Date | null;

  createdBy: string | null;

  updatedDate: Date | null;

  updatedBy: string | null;
}