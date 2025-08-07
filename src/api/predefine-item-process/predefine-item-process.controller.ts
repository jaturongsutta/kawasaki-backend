import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
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
  async getDropDownPredefindItem(
    @Param('predefineGroup') predefineGroup: string,
    @Param('predefineCd') predefineCd: string,
  ) {
    return await this.service.getDropDownPredefindItem(
      predefineGroup,
      predefineCd,
    );
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

  @Get('/:processCd/:predefineItemCd/:machineNo')
  async findOne(
    @Param('processCd') processCd: string,
    @Param('predefineItemCd') predefineItemCd: string,
    @Param('machineNo') machineNo: string,
    @Res() res: Response,
  ) {
    const predefine = await this.service.findOne(processCd, predefineItemCd, machineNo);
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

  @Put('/:processCd/:predefineItemCd/:machineNo')
  async update(
    @Param('processCd') processCd: string,
    @Param('predefineItemCd') predefineItemCd: string,
    @Param('machineNo') machineNo: string,
    @Body() predefineDto: PredefineDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const updatedPredefine = await this.service.update(
      processCd,
      predefineItemCd,
      machineNo,
      predefineDto,
      req.user.userId,
    );
    return res.status(200).json(updatedPredefine);
  }

  @Post('export')
  async export(
    @Body()
    exportParams: {
      lineCd?: string;
      predefineGroup?: string;
      predefineCd?: string;
      machineNo?: string,
      processCd?: string;
      valueEN?: string;
      valueTH?: string;
      isActive?: string;
    },
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.service.export(
      exportParams.lineCd,
      exportParams.predefineGroup,
      exportParams.predefineCd,
      exportParams.machineNo,
      exportParams.processCd,
      exportParams.valueEN,
      exportParams.valueTH,
      exportParams.isActive,
    );

    // Set PDF response headers
    const filename = `reason_process_qr_${new Date().toISOString().slice(0, 10)}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    return res.send(pdfBuffer);
  }
}
