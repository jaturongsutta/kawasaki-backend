import { BaseDto } from 'src/common/base-dto';

export class LineDto extends BaseDto {
  lineId: number;
  lineNo: number;
  tank: string;
  isActive: string;
}
