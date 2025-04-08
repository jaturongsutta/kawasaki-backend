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
import { TankShippingService } from './tank-shipping.service';
import { TankShippingDto } from './dto/tank-shipping.dto';
import { BaseController } from 'src/base.controller';
import { TankShippingSearchDto } from './dto/tank-shipping-search.dto';

@Controller('tank-shipping')
export class TankShippingController extends BaseController {
  constructor(private service: TankShippingService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: TankShippingSearchDto) {
    return await this.service.search(dto);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }

  @Post('getAdjectValue')
  async getAdjectValue(@Body() dto: TankShippingDto) {
    return await this.service.getAdjectValue(dto);
  }

  @Post('add')
  async add(@Body() dto: TankShippingDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: TankShippingDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number, @Request() req: any) {
    return await this.service.delete(id, req.user.userId);
  }
}
