import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class LineStopSearchDto extends BaseSearch {
  lineCd: string;
  modelCd: string | null;
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

  modelCd: string | null;

  processCd: string | null;

  ngDate: Date | null;

  ngTime: Date | null;

  quantity: number | null;

  reason: string | null;

  comment: string | null;

  idRef: string | null;

  status: string | null;

  createdDate: Date | null;

  createdBy: number | null;

  updatedDate: Date | null;

  updatedBy: number | null;
}