import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Predefine } from 'src/entity/predefine.entity';
import { Repository } from 'typeorm';
import { PredefineDto } from './dto/predefine.dto';
import { PredefineSearchDto } from './dto/predefine.search.dto';
import { BaseResponse } from 'src/common/base-response';

@Injectable()
export class PredefineService {
  constructor(
    @InjectRepository(Predefine)
    private predefineRepository: Repository<Predefine>,
    private commonService: CommonService,
  ) {}

  async search(dto: PredefineSearchDto) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Predefine_Group', dto.predefineGroup);
      req.input('Predefine_CD', dto.predefineCd);
      req.input('Value_TH', dto.valueTH);
      req.input('Value_EN', dto.valueEN);
      req.input('Is_Active', dto.isActive);
      req.input('Language', 'EN');
      req.input('Row_No_From', dto.searchOptions.rowFrom);
      req.input('Row_No_To', dto.searchOptions.rowTo);

      return await this.commonService.getSearch('sp_co_Search_Predefine', req);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async create(predefineDto: PredefineDto, userId): Promise<BaseResponse> {
    try {
      predefineDto.createBy = userId;
      predefineDto.updateBy = userId;
      predefineDto.createDate = new Date();
      predefineDto.updateDate = new Date();
      const data = await this.predefineRepository.findOne({
        where: {
          predefineGroup: predefineDto.predefineGroup,
          predefineCd: predefineDto.predefineCd,
        },
      });
      if (data) {
        return {
          status: 1,
          message: 'Predefine already exists',
        };
      }

      console.log('predefineDto : ', predefineDto);

      const predefine = this.predefineRepository.create(predefineDto);
      console.log('perdefine : ', predefine);
      await this.predefineRepository.insert(predefine);

      return {
        status: 0,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll(): Promise<Predefine[]> {
    return this.predefineRepository.find();
  }

  async findOne(
    predefineGroup: string,
    predefineCd: string,
  ): Promise<Predefine> {
    const predefine = await this.predefineRepository.findOne({
      where: { predefineGroup, predefineCd },
    });
    if (!predefine) {
      throw new NotFoundException(
        `Predefine with ID1 ${predefineGroup} and ID2 ${predefineCd} not found`,
      );
    }
    return predefine;
  }

  async update(
    predefineGroup: string,
    predefineCd: string,
    predefineDto: PredefineDto,
    userId: number,
  ): Promise<BaseResponse> {
    predefineDto.updateBy = userId;
    predefineDto.updateDate = new Date();

    await this.predefineRepository.update(
      { predefineGroup, predefineCd },
      predefineDto,
    );
    const updatedPredefine = await this.predefineRepository.findOne({
      where: { predefineGroup, predefineCd },
    });
    if (!updatedPredefine) {
      return {
        status: 1,
        message: `Predefine with ID1 ${predefineGroup} and ID2 ${predefineCd} not found`,
      };
    }
    return {
      status: 0,
    };
  }

  async remove(predefineGroup: string, predefineCd: string): Promise<void> {
    const result = await this.predefineRepository.delete({
      predefineGroup,
      predefineCd,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Predefine with ID1 ${predefineGroup} and ID2 ${predefineCd} not found`,
      );
    }
  }
}
