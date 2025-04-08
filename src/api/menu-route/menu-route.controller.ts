import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { MenuRoute } from 'src/entity/menu-route.entity';
import { MenuRouteService } from './menu-route.service';
import { BaseController } from 'src/base.controller';

@Controller('menu-route')
export class MenuRouteController extends BaseController {
  constructor(private service: MenuRouteService) {
    super();
  }
  @Get('get-menu-route-permission')
  async getMenuRoutePermission(): Promise<MenuRoute[]> {
    return this.service.getMenuRoutePermission();
  }

  @Get('get-by-menu-no/:menuNo')
  async getByMenuNo(@Param('menuNo') menuNo: string): Promise<MenuRoute[]> {
    return this.service.getByMenuNo(menuNo);
  }

  @Post('save')
  async addMenuRoute(@Body() data: MenuRoute) {
    try {
      const is_success = await this.service.add(data);
      console.log(is_success);
      if (is_success) {
        return { status: 0 };
      } else {
        return { status: 1 };
      }
    } catch (error) {
      console.log(error);
      return { status: 2, message: error.message };
    }
  }

  @Put('save/:menuRouteId')
  async updateMenuRoute(
    @Param('menuRouteId') menuRouteId: number,
    @Body() data: MenuRoute,
  ) {
    try {
      const is_success = await this.service.add(data);
      console.log(is_success);
      if (is_success) {
        return { status: 0 };
      } else {
        return { status: 1 };
      }
    } catch (error) {
      console.log(error);
      return { status: 2, message: error.message };
    }
  }
  @Delete('delete/:menuRouteId')
  async delete(@Param('menuRouteId') menuRouteId: number) {
    try {
      const is_success = await this.service.delete(menuRouteId);
      console.log(is_success);
      if (is_success) {
        return { status: 0 };
      } else {
        return { status: 1 };
      }
    } catch (error) {
      console.log(error);
      return { status: 2, message: error.message };
    }
  }
}
