import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { ProductSearchDto } from './dto/product-search.dto';
import { ProductDto } from './dto/product.dto';
import { BaseResponse } from 'src/common/base-response';

@Injectable()
export class ProductService {
  constructor(private commonService: CommonService) {}

  async search(dto: ProductSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Product_Name', dto.product ? dto.product : null);
    req.input('Status', dto.status);
    req.input('Row_No_From', dto.searchOptions.rowFrom);
    req.input('Row_No_To', dto.searchOptions.rowTo);

    return await this.commonService.getSearch('sp_search_co_product', req);
  }

  async getById(id: number): Promise<ProductDto> {
    const dto = new ProductDto();
    try {
      const req = await this.commonService.getConnection();
      req.input('Product_Id', id);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_search_co_product_detail',
        req,
      );

      const { Return_CD, Return_Name } = result.output;
      if (Return_CD === 'Success') {
        const data = result.recordset[0];
        console.log(data);
        dto.productId = data.Product_Id;
        dto.productName = data.Product_Name;
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

  async add(data: ProductDto, userId: number): Promise<BaseResponse> {
    try {
      const req = await this.commonService.getConnection();
      req.input('Product_Name', data.productName.trim());
      req.input('Status', data.isActive);

      req.input('Created_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_add_co_product',
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
    data: ProductDto,
    userId: number,
  ): Promise<BaseResponse> {
    try {
      const req = await this.commonService.getConnection();
      req.input('Product_Id', id);
      req.input('Product_Name', data.productName.trim());
      req.input('Status', data.isActive);

      req.input('Updated_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_update_co_product',
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
      req.input('Product_Id', id);
      req.input('Updated_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      const result = await this.commonService.executeStoreProcedure(
        'sp_delete_co_product',
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
