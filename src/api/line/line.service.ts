import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { LineSearchDto } from './dto/line-search.dto';
import { LineDto } from './dto/line.dto';
import { BaseResponse } from 'src/common/base-response';
import { Repository } from 'typeorm';
import { MLine } from 'src/entity/m-line.entity';
import { MLineModel } from 'src/entity/m-line-model.entity';
import { DataSource } from 'typeorm'; // Import DataSource for transactions

@Injectable()
export class LineService {
  constructor(
    private commonService: CommonService,
    @InjectRepository(MLine)
    private lineRepository: Repository<MLine>,
    @InjectRepository(MLineModel)
    private lineModel: Repository<MLineModel>,
    private dataSource: DataSource, // Inject DataSource for transactions
  ) {}

  async search(dto: LineSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Line_CD', dto.line_cd);
    req.input('Line_Name', dto.line_name);
    req.input('Status', dto.status);
    req.input('Row_No_From', dto.searchOptions.rowFrom);
    req.input('Row_No_To', dto.searchOptions.rowTo);

    return await this.commonService.getSearch('sp_m_search_line', req);
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
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Start a transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();
      console.log('data : ', data);
      data.createdBy = userId;
      data.updatedBy = userId;
      data.createdDate = new Date();
      data.updatedDate = new Date();
      await this.lineRepository.save(data);

      await queryRunner.manager.save(MLine, data);

      // Save line models
      for (const model of data.lineModel) {
        const lineModel = new MLineModel();
        lineModel.lineCd = data.lineCd;
        lineModel.modelCd = model.modelCd;
        lineModel.isActive = model.isActive;

        // await this.lineModel.save(lineModel);
        await queryRunner.manager.save(MLineModel, lineModel);
      }

      // Commit the transaction
      await queryRunner.commitTransaction();

      return {
        status: 0, // success
        message: '',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return {
        status: 2,
        message: error.message,
      };
    } finally {
      // Release the query runner
      await queryRunner.release();
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
