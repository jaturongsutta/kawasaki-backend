import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { RolePermissionService } from './role-permission.service';
import { RoleSearchDto } from './dto/role-search.dto';

@Controller('role-permission')
export class RolePermissionController extends BaseController {
  constructor(private service: RolePermissionService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: RoleSearchDto) {
    return this.service.search(dto);
  }

  @Get('load-role-permission/:roleId')
  async loadRolePermission(@Param('roleId') roleId: number) {
    return this.service.loadRolePermission(roleId);
  }

  @Post()
  async addRolePermission(@Body() dto: any, @Request() req) {
    return this.service.addRolePermission(dto, req.user.userId);
  }

  @Put(':roleId')
  async updateRolePermission(
    @Param('roleId') roleId: number,
    @Body() dto: any,
    @Request() req,
  ) {
    console.log('roleId', roleId);
    return this.service.updateRolePermission(roleId, dto, req.user.userId);
  }
}
