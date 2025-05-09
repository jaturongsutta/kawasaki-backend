import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Request,
  Delete,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { LineStopDto, LineStopSearchDto } from './dto/line-stop-search.dto';
import { LineStopService } from './line-stop.service';

@Controller('line-stop')
export class LineStopController extends BaseController {
  constructor(private service: LineStopService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: LineStopSearchDto) {
    return await this.service.search(dto);
  }

  @Post('searchPlan')
  async searchPlan(@Body() dto: LineStopSearchDto) {
    return await this.service.searchPlan(dto);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: LineStopDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: LineStopDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.service.delete(id);
  }
}
