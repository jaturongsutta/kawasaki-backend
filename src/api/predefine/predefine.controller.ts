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
import { PredefineService } from './predefine.service';
import { Response } from 'express';
import { PredefineDto } from './dto/predefine.dto';
import { PredefineSearchDto } from './dto/predefine.search.dto';
import { BaseController } from 'src/base.controller';

@Controller('predefine')
export class PredefineController extends BaseController {
  constructor(private service: PredefineService) {
    super();
  }

  @Post('search')
  async search(
    @Body() predefineSearchDto: PredefineSearchDto,
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

  @Get(':predefineGroup/:predefineCd')
  async findOne(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCd') predefineCd: string,
    @Res() res: Response,
  ) {
    const predefine = await this.service.findOne(predefineGroup, predefineCd);
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

  @Put(':predefineGroup/:predefineCd')
  async update(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCd') predefineCd: string,
    @Body() predefineDto: PredefineDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const updatedPredefine = await this.service.update(
      predefineGroup,
      predefineCd,
      predefineDto,
      req.user.userId,
    );
    return res.status(200).json(updatedPredefine);
  }

  @Delete(':predefineGroup/:predefineCD')
  async remove(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCD') predefineCD: string,
    @Res() res: Response,
  ) {
    await this.service.remove(predefineGroup, predefineCD);
    return res.status(204).send();
  }
}
