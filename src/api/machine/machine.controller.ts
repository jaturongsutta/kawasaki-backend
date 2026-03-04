import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Request,
  Delete,
} from '@nestjs/common';
import { MachineService } from './machine.service';
import { BaseController } from 'src/base.controller';
import { MachineDto, MachineSearchDto, ToolAlertDto } from './dto/machine-search.dto';

@Controller('machine')
export class MachineController extends BaseController {
  constructor(private service: MachineService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: MachineSearchDto) {
    return await this.service.search(dto);
  }

  @Get('getById/:machineNo/:processCd')
  async getById(@Param('machineNo') machineNo: string, @Param('processCd') processCd: string) {
    return await this.service.getById(machineNo, processCd);
  }

  @Post('add')
  async add(@Body() dto: MachineDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:machineNo/:processCd')
  async update(
    @Param('machineNo') machineNo: string,
    @Param('processCd') processCd: string,
    @Body() dto: MachineDto,
    @Request() req: any,
  ) {
    return await this.service.update(machineNo, processCd, dto, req.user.userId);
  }


  @Post('tooLifeAlarm')
  async getToolLifeAlarm(@Body() dto: MachineSearchDto) {
    return await this.service.getToolLifeAlarm(dto);
  }

  @Post('addToolLifeAlarm')
  async addToolLifeAlarm(@Body() dto: ToolAlertDto, @Request() req: any) {
    return await this.service.addToolLifeAlarm(dto, req.user.userId);
  }

  @Put('updateToolLifeAlarm/:id')
  async updateToolLifeAlarm(
    @Param('id') id: string,
    @Body() dto: ToolAlertDto,
    @Request() req: any,
  ) {
    return await this.service.updateToolLifeAlarm(id, dto, req.user.userId);
  }


  @Delete('deleteToolLifeAlarm/:id')
  async deleteToolLifeAlarm(@Param('id') id: number, @Request() req: any) {
    return await this.service.deleteToolLifeAlarm(id,);
  }

}
