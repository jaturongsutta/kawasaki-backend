import { Controller, Get, Param, Request } from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { DropdownListService } from './dropdown-list.service';

@Controller('dropdown-list')
export class DropdownListController extends BaseController {
  constructor(private service: DropdownListService) {
    super();
  }

  @Get('predefine-group-all')
  async getPredefineGroupAll() {
    const rows = await this.service.getPredefindAll();
    const data = [];
    for (let i = 0; i < rows.length; i++) {
      const e = rows[i];
      data.push({ value: e['predefine_group'], text: e['display'] });
    }
    return data;
  }

  @Get('predefine-group/:group')
  getPredefine(@Request() req: any, @Param('group') group: string) {
    return this.service.getPredefine(group, req.headers.language);
  }

  @Get('role')
  getRole(@Request() req: any) {
    return this.service.getDropdownList(
      'um_role',
      'Role_ID',
      'Role_Name_EN',
      "Is_Active = 'Y'",
    );
  }

  @Get('line')
  getLine(@Request() req: any) {
    return this.service.getDropdownList(
      'm_line',
      'line_cd',
      'line_cd',
      "Is_Active = 'Y'",
    );
  }

  @Get('lineAll')
  getLineAll(@Request() req: any) {
    return this.service.getDropdownList(
      'm_line',
      'line_cd',
      'line_cd',
    );
  }

  @Get('model')
  getModel(@Request() req: any) {
    return this.service.getDropdownList(
      'M_Model',
      'Model_CD',
      'Product_CD',
      "Is_Active = 'Y'",
    );
  }

  @Get('model*')
  getModel_() {
    return this.service.getDropdownList(
      'M_Model',
      'Model_CD',
      'Product_CD',
      "Is_Active = 'Y'",
      '',
      ['Part_No partNo', 'is_Active isActive'],
    );
  }

  @Get('machine')
  getMachine() {
    return this.service.getDropdownList(
      'M_Machine',
      'Process_CD',
      'Machine_No',
      "Is_Active = 'Y'",
    );
  }

  @Get('line-model/:line?')
  getLineModel(@Param('line') line: string | null) {
    const _line = line ? line : '';

    return this.service.getDropdownList(
      'M_Line_Model',
      'DISTINCT Model_CD',
      'Model_CD',
      "Is_Active = 'Y' AND Line_CD = '" + _line + "'  OR '" + _line + "' = ''",
    );
  }
}
