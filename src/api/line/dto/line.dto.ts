import { BaseDto } from 'src/common/base-dto';

export class LineDto extends BaseDto {
  lineCd: string;
  lineName?: string | null;
  pkCd?: string | null;
  isActive?: string | null;
  createdDate?: Date | null;
  createdBy?: number | null;
  updatedDate?: Date | null;
  updatedBy?: number | null;

  lineModel: LineModel[];
}

export class LineModel {
  lineCd: string;
  modelCd: string;
  isActive: string;
}
