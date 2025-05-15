import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class LineStopSearchDto extends BaseSearch {
  lineCd: string;
  processCd: string | null;
  reasonCd: string | null;
  statusCd: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  planDate: Date | null;
}

export class LineStopDto {
  id: number;

  planId: string | null;

  lineCd: string | null;

  processCd: string | null;

  lineStopDate: Date | null;

  lineStopTime: Date | null;

  lossTime: number | null;

  reason: string | null;

  comment: string | null;

  status: string | null;

  createdDate: Date | null;

  createdBy: number | null;

  updatedDate: Date | null;

  updatedBy: number | null;

  idRef: number | null;
}