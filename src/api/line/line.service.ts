import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { LineSearchDto } from './dto/line-search.dto';
import { LineDto } from './dto/line.dto';
import { BaseResponse } from 'src/common/base-response';
import { Repository } from 'typeorm';
import { MLine } from 'src/entity/m-line.entity';
import { MLineModel } from 'src/entity/m-line-model.entity';
import { DataSource } from 'typeorm'; // Import DataSource for transactions
import { MLineMachine } from 'src/entity/m-line-machine.entity';
import { MLineTool } from 'src/entity/m-line-tool.entity';
import { MTool } from 'src/entity/tool.entity';
import { convertTimeStringToDate } from 'src/utils/utils';

@Injectable()
export class LineService {
  private readonly logger = new Logger(LineService.name);
  constructor(
    private commonService: CommonService,
    @InjectRepository(MLine)
    private lineRepository: Repository<MLine>,
    @InjectRepository(MLineModel)
    private lineModelRepository: Repository<MLineModel>,
    @InjectRepository(MLineMachine)
    private lineMachineRepository: Repository<MLineMachine>,
    @InjectRepository(MLineTool)
    private lineToolRepository: Repository<MLineTool>,
    @InjectRepository(MTool)
    private mToolRepository: Repository<MTool>,
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

  async getById(id: string): Promise<LineDto> {
    const dto = new LineDto();
    try {
      const line = await this.lineRepository.findOne({ where: { lineCd: id } });

      if (!line) {
        throw new Error('Line not found');
      }

      // Map MLine to LineDto
      dto.lineCd = line.lineCd;
      dto.lineName = line.lineName;
      dto.pkCd = line.pkCd;
      dto.isActive = line.isActive;
      dto.createdDate = line.createdDate;
      dto.createdBy = line.createdBy;
      dto.updatedDate = line.updatedDate;
      dto.updatedBy = line.updatedBy;

      // Fetch related MLineModel and MModel using a left join
      const lineModels = await this.lineModelRepository
        .createQueryBuilder('MLineModel')
        .leftJoinAndSelect('MLineModel.model', 'model')
        .leftJoin(
          'Predefine',
          'predefine',
          'MLineModel.isActive = predefine.predefineCd AND predefine.predefineGroup = :group',
          { group: 'Is_Active' },
        )
        .where('MLineModel.lineCd = :lineCd', { lineCd: id })
        .select([
          'MLineModel.lineCd',
          'MLineModel.modelCd',
          'MLineModel.isActive',
          'model.partNo',
          'predefine.valueEn AS statusName',
        ])
        .getRawMany();

      // Map the result to LineModelDto
      dto.lineModel = lineModels.map((lineModel) => ({
        lineCd: lineModel.MLineModel_Line_CD,
        modelCd: lineModel.MLineModel_Model_CD,
        partNo: lineModel.model_Part_No, // Handle null for unmatched records
        isActive: lineModel.MLineModel_is_Active,
        statusName: lineModel.statusName,
        rowState: '', // Default value for rowState
      }));

      // Fetch related MLineMachine
      const lineMachines = await this.lineMachineRepository
        .createQueryBuilder('MLineMachine')
        .where('MLineMachine.lineCd = :lineCd', { lineCd: id })
        .select([
          'MLineMachine.lineCd',
          'MLineMachine.modelCd',
          'MLineMachine.processCd',
          'MLineMachine.wt',
          'MLineMachine.ht',
          'MLineMachine.mt',
          'MLineMachine.isActive',
        ])
        .getMany();
      // Map the result to LineMachineDto
      dto.lineMachine = lineMachines.map((lineMachine) => ({
        lineCd: lineMachine.lineCd,
        modelCd: lineMachine.modelCd,
        processCd: lineMachine.processCd,
        wt: lineMachine.wt,
        ht: lineMachine.ht,
        mt: lineMachine.mt,
        isActive: lineMachine.isActive,
        rowState: '', // Default value for rowState
      }));
      console.log('dto.lineMachine : ', dto.lineMachine);
      // Fetch related MLineTool
      const lineTools = await this.lineToolRepository
        .createQueryBuilder('MLineTool')
        .where('MLineTool.lineCd = :lineCd', { lineCd: id })
        .select([
          'MLineTool.lineCd',
          'MLineTool.modelCd',
          'MLineTool.processCd',
          'MLineTool.toolCd',
          'MLineTool.isActive',
        ])
        .getMany();
      console.log('lineTools : ', lineTools);
      // Map the result to LineToolDto
      dto.lineTool = lineTools.map((lineTool) => ({
        lineCd: lineTool.lineCd,
        modelCd: lineTool.modelCd,
        processCd: lineTool.processCd,
        toolCd: lineTool.toolCd,
        isActive: lineTool.isActive,
        rowState: '', // Default value for rowState
      }));
      console.log('dto.lineTool : ', dto.lineTool);

      return dto;
    } catch (error) {
      dto.result.status = 2;
      dto.result.message = error.message;
      console.error('Error fetching line by ID:', error);
    }

    return dto;
  }

  async getProcessByModel(lineCd: string, modelCd: string): Promise<any> {
    try {
      console.log('modelCd : ', modelCd);
      const lineMachine = await this.lineMachineRepository.find({
        where: { lineCd: lineCd, modelCd: modelCd },
      });
      console.log('lineMachine : ', lineMachine);

      return lineMachine;
    } catch (error) {
      console.error('Error fetching process by model:', error);
      throw error;
    }
  }

  async getTool(
    lineCd: string,
    modelCd: string,
    processCd: string,
  ): Promise<any> {
    try {
      console.log('lineCd : ', lineCd);
      console.log('modelCd : ', modelCd);
      console.log('processCd : ', processCd);
      // const lineTool = await this.lineToolRepository.find({
      //   where: { lineCd: lineCd, modelCd: modelCd, processCd: processCd },
      // });

      // // Fetch related MLineModel and MModel using a left join
      // const lineModels = await this.lineModelRepository
      //   .createQueryBuilder('MLineModel')
      //   .leftJoinAndSelect('MLineModel.model', 'model') // Left join with MModel
      //   .where('MLineModel.lineCd = :lineCd', { lineCd: id })
      //   .select([
      //     'MLineModel.lineCd',
      //     'MLineModel.modelCd',
      //     'MLineModel.isActive',
      //     'model.partNo', // Include fields from MModel
      //   ])
      //   .getMany();

      const lineTool = await this.mToolRepository
        .createQueryBuilder('tool')
        .leftJoinAndSelect(
          'M_Line_Tool',
          'lineTool',
          'tool.processCd = lineTool.processCd AND tool.toolCd = lineTool.toolCd',
        ) // Left outer join
        .where('tool.processCd = :processCd', { processCd }) // Filter by processCd
        .select([
          'tool.processCd',

          'lineTool.lineCd', // Fields from M_Line_Tool
          'lineTool.isActive as lineToolIsActive',
        ])
        .getRawMany(); // Use getRawMany to retrieve raw results

      console.log('lineTool : ', lineTool);

      return lineTool;
    } catch (error) {
      console.error('Error fetching process by model:', error);
      throw error;
    }
  }

  // get mtool all data
  async getToolAll(): Promise<any> {
    try {
      const tools = await this.mToolRepository.find();
      return tools;
    } catch (error) {
      console.error('Error fetching all tools:', error);
      throw error;
    }
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
    id: string,
    data: LineDto,
    userId: number,
  ): Promise<BaseResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    // console.log('update line data : ', data);
    try {
      // Start a transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const line = await this.lineRepository.findOneBy({ lineCd: id });
      if (!line) {
        throw new Error('Line not found');
      }
      data.updatedBy = userId;
      data.updatedDate = new Date();

      await queryRunner.manager.save(MLine, data);

      // Save line models
      for (const model of data.lineModel) {
        if (model.rowState === 'DELETE') {
          await queryRunner.manager.delete(MLineModel, {
            lineCd: data.lineCd,
            modelCd: model.modelCd,
          });
        } else if (model.rowState === 'NEW') {
          const newLineModel = new MLineModel();
          newLineModel.lineCd = data.lineCd;
          newLineModel.modelCd = model.modelCd;
          newLineModel.isActive = model.isActive;
          await queryRunner.manager.save(MLineModel, newLineModel);
        } else if (model.rowState === 'UPDATE') {
          const existingLineModel = await queryRunner.manager.findOne(
            MLineModel,
            {
              where: { lineCd: data.lineCd, modelCd: model.modelCd },
            },
          );

          console.log('existingLineModel : ', existingLineModel);
          if (existingLineModel) {
            existingLineModel.isActive = model.isActive;
            existingLineModel.updatedBy = userId;
            existingLineModel.updatedDate = new Date();
            // Add more fields to update if needed
            await queryRunner.manager.save(MLineModel, existingLineModel);
          }
        }
      }

      // save line machine
      for (const machine of data.lineMachine) {
        machine.wt = convertTimeStringToDate(machine.wt);
        machine.ht = convertTimeStringToDate(machine.ht);
        machine.mt = convertTimeStringToDate(machine.mt);

        if (machine.rowState === 'DELETE') {
          await queryRunner.manager.delete(MLineMachine, {
            lineCd: data.lineCd,
            modelCd: machine.modelCd,
          });
        } else if (machine.rowState === 'NEW') {
          const newLineMachine = new MLineMachine();
          newLineMachine.lineCd = data.lineCd;
          newLineMachine.modelCd = machine.modelCd;
          newLineMachine.processCd = machine.processCd;
          newLineMachine.wt = machine.wt;
          newLineMachine.ht = machine.ht;
          newLineMachine.mt = machine.mt;
          newLineMachine.isActive = machine.isActive;
          newLineMachine.createdBy = userId;
          newLineMachine.updatedBy = userId;
          newLineMachine.createdDate = new Date();
          newLineMachine.updatedDate = new Date();
          await queryRunner.manager.save(MLineMachine, newLineMachine);
        } else if (machine.rowState === 'UPDATE') {
          const existingLineMachine = await this.lineMachineRepository.findOne({
            where: { lineCd: data.lineCd, modelCd: machine.modelCd },
          });
          if (existingLineMachine) {
            existingLineMachine.wt = machine.wt;
            existingLineMachine.ht = machine.ht;
            existingLineMachine.mt = machine.mt;
            existingLineMachine.updatedBy = userId;
            existingLineMachine.updatedDate = new Date();
            await queryRunner.manager.save(MLineMachine, existingLineMachine);
          }
        }
      }

      // save line tool
      for (const tool of data.lineTool) {
        if (tool.rowState === 'DELETE') {
          await queryRunner.manager.delete(MLineTool, {
            lineCd: data.lineCd,
            modelCd: tool.modelCd,
            processCd: tool.processCd,
            toolCd: tool.toolCd,
          });
        } else if (tool.rowState === 'NEW') {
          const newLineTool = new MLineTool();
          newLineTool.lineCd = data.lineCd;
          newLineTool.modelCd = tool.modelCd;
          newLineTool.processCd = tool.processCd;
          newLineTool.toolCd = tool.toolCd;
          newLineTool.isActive = tool.isActive;
          newLineTool.createdBy = userId;
          newLineTool.updatedBy = userId;
          newLineTool.createdDate = new Date();
          newLineTool.updatedDate = new Date();
          await queryRunner.manager.save(MLineTool, newLineTool);
        } else if (tool.rowState === 'UPDATE') {
          const existingLineTool = await this.lineToolRepository.findOne({
            where: {
              lineCd: data.lineCd,
              modelCd: tool.modelCd,
              processCd: tool.processCd,
              toolCd: tool.toolCd,
            },
          });
          if (existingLineTool) {
            existingLineTool.isActive = tool.isActive;
            existingLineTool.updatedBy = userId;
            existingLineTool.updatedDate = new Date();
            await queryRunner.manager.save(MLineTool, existingLineTool);
          }
        }
      }

      // Commit the transaction
      await queryRunner.commitTransaction();

      return {
        status: 0, // success
        message: '',
      };
    } catch (error) {
      console.error('Error updating line:', error);
      // Rollback the transaction in case of error
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

  async delete(lineCd: string, userId: number): Promise<BaseResponse> {
    try {
      // Update isActive to 'N' for the main line

      // log
      this.logger.log(`Deleting line with lineCd: ${lineCd}`);
      this.logger.log(`User ID: ${userId}`);

      const lineResult = await this.lineRepository.update(
        { lineCd },
        { isActive: 'N', updatedBy: userId, updatedDate: new Date() },
      );
      if (lineResult.affected === 0) {
        return {
          status: 1,
          message: 'Line not found',
        };
      }

      // Update isActive to 'N' for related line models
      await this.lineModelRepository.update({ lineCd }, { isActive: 'N' });

      // Update isActive to 'N' for related line machines
      await this.lineMachineRepository.update({ lineCd }, { isActive: 'N' });

      // Update isActive to 'N' for related line tools
      await this.lineToolRepository.update({ lineCd }, { isActive: 'N' });

      return {
        status: 0,
        message: 'Line and related entities set to inactive successfully',
      };
    } catch (error) {
      return {
        status: 2,
        message: error.message,
      };
    }
  }

  async deleteLineModel(
    lineCd: string,
    modelCd: string,
  ): Promise<BaseResponse> {
    try {
      // Update isActive to 'N' for line model
      this.logger.log(
        `Deleting line model with lineCd: ${lineCd}, modelCd: ${modelCd}`,
      );

      const result = await this.lineModelRepository.update(
        { lineCd, modelCd },
        { isActive: 'N' },
      );
      if (result.affected === 0) {
        return {
          status: 1,
          message: 'Line model not found',
        };
      }

      // Update isActive to 'N' for related line tools
      await this.lineToolRepository.update(
        { lineCd, modelCd },
        { isActive: 'N' },
      );
      // Update isActive to 'N' for related line machines
      await this.lineMachineRepository.update(
        { lineCd, modelCd },
        { isActive: 'N' },
      );

      return {
        status: 0,
        message: 'Line model set to inactive successfully',
      };
    } catch (error) {
      return {
        status: 2,
        message: error.message,
      };
    }
  }
}
