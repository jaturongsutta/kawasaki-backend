import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { RolePermission } from 'src/entity/role-permission.entity';
import { Role } from 'src/entity/role.entity';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission, Role])],
  exports: [TypeOrmModule, RolePermissionService],
  controllers: [RolePermissionController],
  providers: [RolePermissionService, CommonService],
})
export class RolePermissionModule {}
