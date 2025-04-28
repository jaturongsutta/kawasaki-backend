import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { BaseController } from 'src/base.controller';
import { ToolDto, ToolSearchDto } from './dto/tool-search.dto';

@Controller('tool')
export class ToolController extends BaseController {
  constructor(private service: ToolService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: ToolSearchDto) {
    return await this.service.search(dto);
  }

  @Get('getByProcess_CD/:cd')
  async getById(@Param('cd') id: string) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: ToolDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: ToolDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

}
