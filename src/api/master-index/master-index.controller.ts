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
import { MasterIndexService } from './master-index.service';
import { MasterIndexDto } from './dto/master-index.dto';
import { BaseController } from 'src/base.controller';
import { MasterIndexSearchDto } from './dto/master-index-search.dto';

@Controller('master-index')
export class ProductController extends BaseController {
  constructor(private service: MasterIndexService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: MasterIndexSearchDto) {
    return await this.service.search(dto);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: MasterIndexDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: MasterIndexDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number, @Request() req: any) {
    return await this.service.delete(id, req.user.userId);
  }
}
