import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { NGService } from './ng.service';
import { BaseController } from 'src/base.controller';
import { NGDto, NGSearchDto } from './dto/ng-search.dto';

@Controller('ng')
export class NGController extends BaseController {
  constructor(private service: NGService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: NGSearchDto) {
    return await this.service.search(dto);
  }

  @Get('statusList')
  async getStatus() {
    return await this.service.getStatus();
  }

  @Get('reasonList')
  async getReason() {
    return await this.service.getReason();
  }

  @Get('lineList')
  async getLine() {
    return await this.service.getLine();
  }

  @Get('lineModelList/:lineCd')
  async getModel(@Param('lineCd') id: string) {
    return await this.service.getModelWithLineCd(id);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: NGDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: NGDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

}
