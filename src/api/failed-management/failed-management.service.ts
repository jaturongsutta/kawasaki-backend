import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { FailedManagementSearchDto } from './dto/failed-management-search.dto';
import { BaseResponse } from 'src/common/base-response';
import { FailedManagementDto } from './dto/failed-management.dto';

@Injectable()
export class FailedManagementService {
  constructor(private commonService: CommonService) {}
  async search(dto: FailedManagementSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Month', dto.month);
    req.input('Year', dto.year);
    req.input('Line', dto.line);
    req.input('ProductName', dto.productName);
    req.input('Row_No_From', dto.searchOptions.rowFrom);
    req.input('Row_No_To', dto.searchOptions.rowTo);

    return await this.commonService.getSearch(
      'sp_search_failed_management',
      req,
    );
  }

  async getById(id: number): Promise<FailedManagementDto> {
    const dto = new FailedManagementDto();
    try {
      let req = await this.commonService.getConnection();
      req.input('Failed_Id', id);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_search_failed_management_detail',
        req,
      );

      const { Return_CD, Return_Name } = result.output;
      if (Return_CD === 'Success') {
        const data = result.recordset[0];

        dto.month = data.Month;
        dto.year = data.Year;
        dto.line = data.Line;
        dto.productName = data.Product_Name;
        dto.prodWeight2 = data.Prod_Weight_2;
        dto.failedValue = data.Failed_Value;
        dto.finalProd2 = data.Final_Prod_2;
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

  async getProductWeight(
    month: number,
    year: number,
    line: number,
    productName: string,
  ): Promise<BaseResponse> {
    try {
      let req = await this.commonService.getConnection();
      req.input('Month', month);
      req.input('Year', year);
      req.input('Line', line);
      req.input('Product_Name', productName);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_get_prod_weight2',
        req,
      );

      const { Return_CD, Return_Name } = result.output;

      return {
        data: result.recordset[0]['Result'],
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

  async add(data: FailedManagementDto, userId: number): Promise<BaseResponse> {
    try {
      let req = await this.commonService.getConnection();
      req.input('Month', data.month);
      req.input('Year', data.year);
      req.input('Line', data.line);
      req.input('Product_Name', data.productName);
      req.input('Prod_Weight2', data.prodWeight2);
      req.input('Failed_Value', data.failedValue);
      // req.input('Final_Prod2', data.finalProd2);
      req.input('Create_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_add_failed_management',
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
    data: FailedManagementDto,
    userId: number,
  ): Promise<BaseResponse> {
    try {
      let req = await this.commonService.getConnection();
      req.input('Failed_Id', id);
      req.input('Failed_Value', data.failedValue);
      // req.input('Final_Prod2', data.finalProd2);
      req.input('Update_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_update_failed_management',
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
      let req = await this.commonService.getConnection();
      req.input('Failed_Id', id);
      req.input('Create_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_delete_failed_management',
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
