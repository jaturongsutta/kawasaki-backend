import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Res,
  Request,
} from '@nestjs/common';
import { PredefineItemProcessService } from './predefine-item-process.service';
import { Response } from 'express';
import { PredefineDto } from './dto/predefine-item-process.dto';
import { PredefineItemSearchDto } from './dto/predefine-item-process.search.dto';
import { BaseController } from 'src/base.controller';

@Controller('predefine-item-process')
export class PredefineItemProcessController extends BaseController {
  constructor(private service: PredefineItemProcessService) {
    super();
  }

  @Get('get-dropdown-predefine-group')
  async getDropDownPredefindGroup() {
    const rows = await this.service.getDropDownPredefindGroup();
    const data = [];
    for (let i = 0; i < rows.length; i++) {
      const e = rows[i];
      data.push({ value: e['predefine_group'], title: e['predefine_group'] });
    }
    return data;
  }

  @Get('get-dropdown-predefine')
  async getDropDownPredefind() {
    return await this.service.getDropDownPredefind();
  }

  @Get('get-dropdown-predefine-item/:predefineGroup/:predefineCd')
  async getDropDownPredefindItem(@Param('predefineGroup') predefineGroup: string, @Param('predefineCd') predefineCd: string) {
    return await this.service.getDropDownPredefindItem(predefineGroup, predefineCd);
  }

  @Get('get-dropdown-machine-process')
  async getDropDownMachineProcess() {
    return await this.service.getDropDownMachineProcess();
  }

  @Post('search')
  async search(
    @Body() predefineSearchDto: PredefineItemSearchDto,
    @Res() res: Response,
  ) {
    const predefines = await this.service.search(predefineSearchDto);
    return res.status(200).json(predefines);
  }

  @Get('/:processCd/:predefineItemCd')
  async findOne(
    @Param('processCd') processCd: string,
    @Param('predefineItemCd') predefineItemCd: string,
    @Res() res: Response,
  ) {
    const predefine = await this.service.findOne(
      processCd,
      predefineItemCd,
    );
    return res.status(200).json(predefine);
  }

  @Post()
  async create(
    @Body() predefineDto: PredefineDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const predefine = await this.service.create(predefineDto, req.user.userId);
    return res.status(201).json(predefine);
  }

  @Put('/:processCd/:predefineItemCd')
  async update(
    @Param('processCd') processCd: string,
    @Param('predefineItemCd') predefineItemCd: string,
    @Body() predefineDto: PredefineDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const updatedPredefine = await this.service.update(
      processCd,
      predefineItemCd,
      predefineDto,
      req.user.userId,
    );
    return res.status(200).json(updatedPredefine);
  }

}
