import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { RolePermission } from 'src/entity/role-permission.entity';
import { Role } from 'src/entity/role.entity';
import { Repository } from 'typeorm';
import { RoleSearchDto } from './dto/role-search.dto';
import { RoleDto } from './dto/role.dto';
import { BaseResponse } from 'src/common/base-response';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private commonService: CommonService,
  ) {}

  async search(data: RoleSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Role_Name_EN', data.roleNameEn ? data.roleNameEn : null);
    req.input('Role_Name_TH', data.roleNameTh ? data.roleNameTh : null);
    req.input('Status', data.status ? data.status : null);
    req.input('Row_No_From', data.searchOptions.rowFrom);
    req.input('Row_No_To', data.searchOptions.rowTo);
    return this.commonService.getSearch('sp_um_Search_Role', req);
  }

  async loadRolePermission(roleId: number): Promise<RoleDto> {
    const dto = new RoleDto();
    const req = await this.commonService.getConnection();
    req.input('Role_ID', roleId);
    req.input('Language', 'EN');
    const result = await this.commonService.executeStoreProcedure(
      'sp_um_Load_Role_Permission',
      req,
    );

    const data = result.recordset;

    const role = await this.roleRepository.findOneBy({ roleId });
    console.log('data', data);
    if (role) {
      Object.assign(dto, role);
    }

    if (data.length > 0) {
      dto.items = [];

      data.map((item) => {
        const rp = {} as any;
        rp.menuNo = item['Menu_No'];
        rp.menuName = item['Menu_Name'];
        rp.canAdd = item['Can_Add'];
        rp.canUpdate = item['Can_Update'];
        rp.canView = item['Can_View'];
        dto.items.push(rp);
      });
    }

    return dto;
  }

  async addRolePermission(
    data: RoleDto,
    userLogin: number,
  ): Promise<BaseResponse> {
    // Create a new Role entity
    const role = new Role();
    role.roleNameTh = data.roleNameTh;
    role.roleNameEn = data.roleNameEn;
    role.isActive = data.isActive;
    role.createBy = role.updateBy = userLogin;
    role.createDate = role.updateDate = new Date();

    // Save the Role entity
    const savedRole = await this.roleRepository.save(role);

    // Iterate over the items in the RoleDto and create RolePermission entities
    for (const item of data.items) {
      const rolePermission = new RolePermission();
      rolePermission.roleId = savedRole.roleId;
      rolePermission.menuNo = item.menuNo;
      rolePermission.canAdd = item.canAdd === 'Y' ? 'Y' : 'N';
      rolePermission.canUpdate = item.canUpdate === 'Y' ? 'Y' : 'N';
      rolePermission.canView = item.canView === 'Y' ? 'Y' : 'N';

      // Save each RolePermission entity
      await this.rolePermissionRepository.save(rolePermission);
    }

    return {
      status: 0,
    };
  }

  async updateRolePermission(
    roleId: number,
    data: RoleDto,
    userlogin: number,
  ): Promise<BaseResponse> {
    // Update the Role entity
    const role = await this.roleRepository.findOneBy({ roleId });
    console.log('role', data);
    if (role) {
      role.roleNameTh = data.roleNameTh;
      role.roleNameEn = data.roleNameEn;
      role.isActive = data.isActive;
      role.updateBy = userlogin;
      role.updateDate = new Date();
      await this.roleRepository.save(role);
    }

    // Delete all RolePermission entries by roleId
    await this.rolePermissionRepository.delete({ roleId });

    // Insert new RolePermission entries
    for (const item of data.items) {
      const rolePermission = new RolePermission();
      rolePermission.roleId = roleId;
      rolePermission.menuNo = item.menuNo;
      rolePermission.canAdd = item.canAdd === 'Y' ? 'Y' : 'N';
      rolePermission.canUpdate = item.canUpdate === 'Y' ? 'Y' : 'N';
      rolePermission.canView = item.canView === 'Y' ? 'Y' : 'N';

      // Save each RolePermission entity
      await this.rolePermissionRepository.save(rolePermission);
    }

    return {
      status: 0,
    };
  }
}
