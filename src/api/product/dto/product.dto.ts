import { BaseDto } from 'src/common/base-dto';

export class ProductDto extends BaseDto {
  productId: number;
  productName: string;
  isActive: string;
}
