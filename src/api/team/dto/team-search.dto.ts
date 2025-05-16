import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseSearch } from 'src/common/base-search';

export class TeamSearchDto extends BaseSearch {
  teamName: string;
  status: string;
}

export class TeamDto {
  id: number;

  teamName: string | null;

  defaultOperator: number | null;

  defaultLeader: number | null;

  isActive: string | null;

  createdDate: Date | null;

  createdBy: string | null;

  updatedDate: Date | null;

  updatedBy: string | null;
}