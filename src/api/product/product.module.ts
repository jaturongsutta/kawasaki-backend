import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [ProductService, CommonService],
  controllers: [ProductController],
})
export class ProductModule {}
