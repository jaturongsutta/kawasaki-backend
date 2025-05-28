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
import { PredefineItemService } from './predefine-item.service';
import { Response } from 'express';
import { PredefineItemDto } from './dto/predefine-item.dto';
import { PredefineItemSearchDto } from './dto/predefine-item.search.dto';
import { BaseController } from 'src/base.controller';

@Controller('predefine-item')
export class PredefineItemController extends BaseController {
  constructor(private service: PredefineItemService) {
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

  @Post('search')
  async search(
    @Body() predefineSearchDto: PredefineItemSearchDto,
    @Res() res: Response,
  ) {
    const predefines = await this.service.search(predefineSearchDto);
    return res.status(200).json(predefines);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const predefines = await this.service.findAll();
    return res.status(200).json(predefines);
  }

  @Get(':predefineGroup/:predefineCd/:predefineItemCd')
  async findOne(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCd') predefineCd: string,
    @Param('predefineItemCd') predefineItemCd: string,
    @Res() res: Response,
  ) {
    const predefine = await this.service.findOne(
      predefineGroup,
      predefineCd,
      predefineItemCd,
    );
    return res.status(200).json(predefine);
  }

  @Post()
  async create(
    @Body() predefineDto: PredefineItemDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const predefine = await this.service.create(predefineDto, req.user.userId);
    return res.status(201).json(predefine);
  }

  @Put(':predefineGroup/:predefineCd/:predefineItemCd')
  async update(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCd') predefineCd: string,
    @Param('predefineItemCd') predefineItemCd: string,
    @Body() predefineDto: PredefineItemDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const updatedPredefine = await this.service.update(
      predefineGroup,
      predefineCd,
      predefineItemCd,
      predefineDto,
      req.user.userId,
    );
    return res.status(200).json(updatedPredefine);
  }

  @Delete(':predefineGroup/:predefineCD/:predefineItemCd')
  async remove(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCD') predefineCD: string,
    @Param('predefineItemCd') predefineItemCd: string,
    @Res() res: Response,
  ) {
    await this.service.remove(predefineGroup, predefineCD, predefineItemCd);
    return res.status(204).send();
  }
}
