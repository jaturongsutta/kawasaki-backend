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
import { LineService } from './line.service';
import { LineDto } from './dto/line.dto';
import { BaseController } from 'src/base.controller';
import { LineSearchDto } from './dto/line-search.dto';

@Controller('line')
export class LineController extends BaseController {
  constructor(private service: LineService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: LineSearchDto) {
    return await this.service.search(dto);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: LineDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: LineDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number, @Request() req: any) {
    return await this.service.delete(id, req.user.userId);
  }
}
