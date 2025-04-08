import {
  Request,
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { BaseController } from 'src/base.controller';
import { MenuSearchDto } from './dto/menu/menu-search.dto';
import { Menu } from 'src/entity/menu.entity';

@Controller('menu')
export class MenuController extends BaseController {
  constructor(private service: MenuService) {
    super();
  }

  @Get('/:Menu_No')
  getByID(@Param('Menu_No') Menu_No: string) {
    return this.service.getByID(Menu_No);
  }

  @Post('search')
  async search(@Body() body: MenuSearchDto) {
    return this.service.search(body);
  }

  @Delete('/:Menu_No/')
  async deleteateMenu(@Param('Menu_No') Menu_No: string) {
    try {
      const is_success = await this.service.deleteMenu(Menu_No);
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

  @Get('/get-main-menu/:Role_ID')
  async getMainMenu(@Param('Role_ID') Role_ID: number) {
    return this.service.getMainMenu(Role_ID);
  }

  @Post('save')
  async saveAdd(@Body() data: Menu, @Request() req: any) {
    data.createdBy = req.user.userId;
    data.updatedBy = req.user.userId;
    console.log(data);
    return this.service.addMenu(data);
  }

  @Put('save/:id')
  async saveEdit(
    @Param('id') id: string,
    @Body() data: Menu,
    @Request() req: any,
  ) {
    data.updatedBy = req.user.userId;

    return this.service.updateMenu(data);
  }
}
