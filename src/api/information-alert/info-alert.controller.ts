import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { InfoAlertService } from './info-alert.service';
import { BaseController } from 'src/base.controller';
import { InfoAlertDto, InfoAlertSearchDto } from './dto/info-alert-search.dto';

@Controller('information-alert')
export class InfoAlerController extends BaseController {
  constructor(private service: InfoAlertService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: InfoAlertSearchDto) {
    return await this.service.search(dto);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: InfoAlertDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: InfoAlertDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

}
