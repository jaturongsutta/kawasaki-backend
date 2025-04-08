import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { MasterIndexSearchDto } from './dto/master-index-search.dto';
import { MasterIndexDto } from './dto/master-index.dto';
import { BaseResponse } from 'src/common/base-response';

@Injectable()
export class MasterIndexService {
  constructor(private commonService: CommonService) {}

  async search(dto: MasterIndexSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Line', dto.line);
    req.input('Product_Id', dto.product);
    req.input('Status', dto.status);
    req.input('Row_No_From', dto.searchOptions.rowFrom);
    req.input('Row_No_To', dto.searchOptions.rowTo);

    return await this.commonService.getSearch('sp_search_co_master_index', req);
  }

  async getById(id: number): Promise<MasterIndexDto> {
    const dto = new MasterIndexDto();
    try {
      const req = await this.commonService.getConnection();
      req.input('Master_Id', id);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_search_co_master_index_detail',
        req,
      );

      const { Return_CD, Return_Name } = result.output;
      if (Return_CD === 'Success') {
        const data = result.recordset[0];
        console.log(data);
        dto.masterId = data.Master_Id;
        dto.lineId = data.Line;
        dto.productId = data.Product_Id;
        dto.yield = data.Yield;
        dto.rH = data.R_H;
        dto.capProdTank = data.Cap_Prod_Tank;
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

  async add(data: MasterIndexDto, userId: number): Promise<BaseResponse> {
    try {
      const req = await this.commonService.getConnection();
      req.input('Line', data.lineId);
      req.input('Product_Id', data.productId);
      req.input('Yield', data.yield);
      req.input('R_H', data.rH);
      req.input('Cap_Prod_Tank', data.capProdTank);
      req.input('Status', data.isActive);

      req.input('Created_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_add_co_master_index',
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
    data: MasterIndexDto,
    userId: number,
  ): Promise<BaseResponse> {
    try {
      const req = await this.commonService.getConnection();
      req.input('Master_Id', data.masterId);
      req.input('Yield', data.yield);
      req.input('R_H', data.rH);
      req.input('Cap_Prod_Tank', data.capProdTank);
      req.input('Status', data.isActive);

      req.input('Updated_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_update_co_master_index',
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
      req.input('Master_Id', id);
      req.input('Updated_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_delete_co_master_index',
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
