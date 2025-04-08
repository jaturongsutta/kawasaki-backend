import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { BaseController } from 'src/base.controller';
import { ProductSearchDto } from './dto/product-search.dto';

@Controller('product')
export class ProductController extends BaseController {
  constructor(private service: ProductService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: ProductSearchDto) {
    return await this.service.search(dto);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: ProductDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: ProductDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number, @Request() req: any) {
    return await this.service.delete(id, req.user.userId);
  }
}
