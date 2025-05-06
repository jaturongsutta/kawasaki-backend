import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class NGSearchDto extends BaseSearch {
  lineCd: string;
  modelCd: string | null;
  reason: string | null;
  status: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export class NGDto {
  @IsNotEmpty()
  lineCd: string;

  modelCd: string | null;

  reason: string | null;

  status: string | null;

  dateFrom: Date | null;
  dateTo: Date | null;

  // cycleTimeMins: string | null;

  // isActive: string | null;

  createdDate: Date | null;

  createdBy: string | null;

  updatedDate: Date | null;

  updatedBy: string | null;
}