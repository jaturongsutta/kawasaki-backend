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
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Get('getProcessByModel/:lineCd/:modelCd')
  async getProcessByModel(
    @Param('lineCd') lineCd,
    @Param('modelCd') modelCd: string,
  ) {
    return await this.service.getProcessByModel(lineCd, modelCd);
  }

  @Get('getTool/:lineCd/:modelCd/:processCd')
  async getTool(
    @Param('lineCd') lineCd,
    @Param('modelCd') modelCd: string,
    @Param('processCd') processCd: string,
  ) {
    return await this.service.getTool(lineCd, modelCd, processCd);
  }

  // get tool all data
  @Get('getToolAll')
  async getToolAll() {
    return await this.service.getToolAll();
  }

  @Post('add')
  async add(@Body() dto: LineDto, @Request() req: any) {
    console.log('dto : ', dto);
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: LineDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

  // @Delete('delete/:id')
  // async delete(@Param('id') id: number, @Request() req: any) {
  //   return await this.service.delete(id, req.user.userId);
  // }

  @Delete('delete-line-model/:lineCd/:modelCd')
  async deleteLineModel(
    @Param('lineCd') lineCd: string,
    @Param('modelCd') modelCd: string,
  ) {
    return await this.service.deleteLineModel(lineCd, modelCd);
  }
}
