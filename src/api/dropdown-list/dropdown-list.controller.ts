import { Controller, Get, Param, Query, Request } from '@nestjs/common';
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
      data.push({ value: e['predefine_group'], title: e['predefine_group'] });
    }
    return data;
  }

  @Get('predefine-group/:group')
  getPredefine(@Request() req: any, @Param('group') group: string) {
    return this.service.getPredefine(group, req.headers.language);
  }

  @Get('predefine-group-item/:group')
  getPredefineItem(@Request() req: any, @Param('group') group: string, @Query('search') search: string) {
    return this.service.getPredefineItem(group, search, req.headers.language);
  }

  @Get('user')
  getUser() {
    return this.service.getDropdownList(
      'um_User',
      'User_ID',
      'First_Name',
      "Is_Active = 'Y'",
      '',
      [`ISNULL(First_Name, '') + ' ' + ISNULL(Last_Name, '') fullName`],
    );
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
  getLine() {
    return this.service.getDropdownList(
      'm_line',
      'line_cd',
      'line_cd',
      "Is_Active = 'Y'",
    );
  }

  @Get('lineAll')
  getLineAll(@Request() req: any) {
    return this.service.getDropdownList('m_line', 'line_cd', 'line_cd');
  }

  @Get('line-model/:line?')
  getLineModel(@Param('line') line: string | null) {
    const _line = line ? line : '';
    return this.service.getDropdownList(
      'M_Line_Model',
      'DISTINCT Model_CD',
      'Model_CD',
      "Line_CD = '" + _line + "'  OR '" + _line + "' = ''",
    );
  }

  @Get('line-machine/:line?')
  getLineMachineWithLine(@Param('line') line: string | null) {
    const _line = line ? line : '';
    return this.service.getDropdownList(
      'M_Line_Machine',
      'DISTINCT Process_CD',
      'Process_CD',
      "Line_CD = '" + _line + "'  OR '" + _line + "' = ''",
    );
  }

  @Get('line-machine/:line/:model?')
  getLineMachine(
    @Param('line') line: string | null,
    @Param('model') model: string | null,
  ) {
    const _line = line ? line : '';
    const _model = model ? model : '';

    return this.service.getDropdownList(
      'M_Line_Machine',
      'DISTINCT Process_CD',
      'Process_CD',
      "Is_Active = 'Y' AND (Line_CD = '" +
        _line +
        "'  OR '" +
        _line +
        "' = '') AND (Model_CD = '" +
        _model +
        "'  OR '" +
        _model +
        "' = '')",
    );
  }

  @Get('line*')
  getLine_() {
    console.log('line all is ** ');
    return this.service.getDropdownList(
      'm_line',
      'line_cd',
      'line_cd',
      '',
      '',
      ['Line_CD lineCd', 'Line_Name lineName', 'PK_CD pkCd'],
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

  @Get('shift')
  getShift() {
    return this.service.getDropdownList(
      'm_team',
      'ID',
      'Team_Name',
      "Is_Active = 'Y'",
      '',
      [
        'ID id',
        'Team_Name TeamName',
        'Default_Operator defaultOperator',
        'Default_Leader defaultLeader',
      ],
    );
  }
}
