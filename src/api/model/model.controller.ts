import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ModelService } from './model.service';
import { BaseController } from 'src/base.controller';
import { ModelDto, ModelSearchDto } from './dto/model-search.dto';

@Controller('model')
export class ModelController extends BaseController {
  constructor(private service: ModelService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: ModelSearchDto) {
    return await this.service.search(dto);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: ModelDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: ModelDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

}
