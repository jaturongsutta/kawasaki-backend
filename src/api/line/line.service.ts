import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { LineSearchDto } from './dto/line-search.dto';
import { LineDto } from './dto/line.dto';
import { BaseResponse } from 'src/common/base-response';

@Injectable()
export class LineService {
  constructor(private commonService: CommonService) {}

  async search(dto: LineSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Line', dto.line);
    req.input('Status', dto.status);
    req.input('Row_No_From', dto.searchOptions.rowFrom);
    req.input('Row_No_To', dto.searchOptions.rowTo);

    return await this.commonService.getSearch('sp_search_co_line', req);
  }

  async getById(id: number): Promise<LineDto> {
    const dto = new LineDto();
    try {
      const req = await this.commonService.getConnection();
      req.input('Line_Id', id);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_search_co_line_detail',
        req,
      );

      const { Return_CD, Return_Name } = result.output;
      if (Return_CD === 'Success') {
        const data = result.recordset[0];
        console.log(data);
        dto.lineId = data.Line_Id;
        dto.lineNo = data.Line;
        dto.tank = data.Tank;
        dto.isActive = data.Status_Id;
      } else {
        dto.result.status = 1;
        dto.result.message = Return_Name;
      }
    } catch (error) {
      dto.result.status = 2;
      dto.result.message = error.message;
    }

    return dto;
  }

  async add(data: LineDto, userId: number): Promise<BaseResponse> {
    try {
      const req = await this.commonService.getConnection();
      req.input('Line', data.lineNo);
      req.input('Tank', data.tank.trim());
      req.input('Status', data.isActive);

      req.input('Created_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_add_co_line',
        req,
      );

      const { Return_CD, Return_Name } = result.output;

      return {
        status: Return_CD !== 'Success' ? 1 : 0,
        message: Return_Name,
      };
    } catch (error) {
      return {
        status: 2,
        message: error.message,
      };
    }
  }

  async update(
    id: number,
    data: LineDto,
    userId: number,
  ): Promise<BaseResponse> {
    try {
      const req = await this.commonService.getConnection();
      req.input('Line_Id', id);
      req.input('Tank', data.tank.trim());
      req.input('Status', data.isActive);

      req.input('Updated_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_update_co_line',
        req,
      );

      const { Return_CD, Return_Name } = result.output;

      return {
        status: Return_CD !== 'Success' ? 1 : 0,
        message: Return_Name,
      };
    } catch (error) {
      return {
        status: 2,
        message: error.message,
      };
    }
  }

  async delete(id: number, userId: number): Promise<BaseResponse> {
    try {
      const req = await this.commonService.getConnection();
      req.input('Line_Id', id);
      req.input('Updated_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_delete_co_line',
        req,
      );

      const { Return_CD, Return_Name } = result.output;

      return {
        status: Return_CD !== 'Success' ? 1 : 0,
        message: Return_Name,
      };
    } catch (error) {
      return {
        status: 2,
        message: error.message,
      };
    }
  }
}
