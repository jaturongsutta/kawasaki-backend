import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { TankShippingDto } from './dto/tank-shipping.dto';
import { TankShippingSearchDto } from './dto/tank-shipping-search.dto';
import { BaseResponse } from 'src/common/base-response';

@Injectable()
export class TankShippingService {
  constructor(private commonService: CommonService) {}

  async search(dto: TankShippingSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Date', dto.date);
    req.input('Tank', dto.tank);
    req.input('ProductName', dto.product);
    req.input('Row_No_From', dto.searchOptions.rowFrom);
    req.input('Row_No_To', dto.searchOptions.rowTo);

    return await this.commonService.getSearch('sp_search_tank_shipping', req);
  }

  async getById(id: number): Promise<TankShippingDto> {
    const dto = new TankShippingDto();
    try {
      let req = await this.commonService.getConnection();
      req.input('Tank_Shipping_Id', id);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_search_tank_shipping_detail',
        req,
      );

      const { Return_CD, Return_Name } = result.output;
      if (Return_CD === 'Success') {
        const data = result.recordset[0];

        dto.tankShippingId = data.Tank_Shipping_Id;
        dto.lineTank = data.Tank;
        dto.product = data.Product;
        dto.date = data.Date;
        // dto.grade = data.Grade;
        dto.productName = data.Product_Name;
        dto.shippingType = data.Shipping_Type;
        dto.class = data.Class;
        dto.lotNo = data.Lot_No;
        dto.packingWeight = data.Packing_Weight;
        dto.totalQty = data.Total_Qty;
        dto.workingTimeStart = data.Work_Time_Start;
        dto.workingTimeStop = data.Work_Time_Stop;
        dto.adjValue = data.Adj_Value;
        dto.additionalAdj = data.Additional_Adj;
        dto.empty = data.Tank_Empty;
        dto.emptyTime = data.Empty_Time;
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

  async getAdjectValue(dto: TankShippingDto): Promise<BaseResponse> {
    try {
      let req = await this.commonService.getConnection();

      req.input('Date', dto.date);
      req.input('Tank', dto.lineTank);
      // req.input('Grade', dto.grade);
      req.input('Product_Name', dto.productName);
      req.input('Total_Qty', dto.totalQty);
      req.input('Empty', dto.empty === 'Y' ? 'Y' : 'N');
      req.input(
        'Tank_Shipping_Id',
        dto.tankShippingId ? dto.tankShippingId : null,
      );
      req.input('Working_Time_Start', dto.workingTimeStart);
      req.input('Working_Time_Stop', dto.workingTimeStop);

      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_adjust_value_calculate',
        req,
      );

      console.log(result.recordset);

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

  async add(data: TankShippingDto, userId: number): Promise<BaseResponse> {
    try {
      let req = await this.commonService.getConnection();
      req.input('Date', data.date);
      req.input('Tank', data.lineTank);
      // req.input('Grade', data.grade);
      req.input('Product_Name', data.productName);
      req.input('Shipping_Type', data.shippingType);
      req.input('Class', data.class);
      req.input('Lot_No', data.lotNo);
      req.input('Packing_Weight', data.packingWeight);
      req.input('Total_Qty', data.totalQty);
      req.input('Working_Time_Start', data.workingTimeStart);
      req.input('Working_Time_Stop', data.workingTimeStop);
      req.input('Adj_Value', data.adjValue);
      req.input('Additional_Adj', data.additionalAdj);
      req.input('Empty', data.empty);
      req.input('Empty_Time', data.emptyTime);
      req.input('Create_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_add_tank_shipping',
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
    data: TankShippingDto,
    userId: number,
  ): Promise<BaseResponse> {
    try {
      let req = await this.commonService.getConnection();
      req.input('Tank_Shipping_Id', id);
      req.input('Shipping_Type', data.shippingType);
      req.input('Class', data.class);
      req.input('Lot_No', data.lotNo);
      req.input('Packing_Weight', data.packingWeight);
      req.input('Total_Qty', data.totalQty);
      req.input('Working_Time_Start', data.workingTimeStart);
      req.input('Working_Time_Stop', data.workingTimeStop);
      req.input('Adj_Value', data.adjValue);
      req.input('Additional_Adj', data.additionalAdj);
      req.input('Empty', data.empty);
      req.input('Empty_Time', data.emptyTime);
      req.input('Updated_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_update_tank_shipping',
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
      req.input('Tank_Shipping_Id', id);
      req.input('Create_By', userId);
      req.output('Return_CD', '');
      req.output('Return_Name', '');

      let result = await this.commonService.executeStoreProcedure(
        'sp_delete_tank_shipping',
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
