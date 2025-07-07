import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { PredefineDto } from './dto/predefine-item-process.dto';
import { PredefineItemSearchDto } from './dto/predefine-item-process.search.dto';
import { BaseResponse } from 'src/common/base-response';
import { PredefineItem } from 'src/entity/predefine-item.entity';
import { getCurrentDate } from 'src/utils/utils';
import { Predefine } from 'src/entity/predefine.entity';
import { PredefineItemMachine } from 'src/entity/predefine-item-process.entity';

@Injectable()
export class PredefineItemProcessService {
  constructor(
    @InjectRepository(PredefineItemMachine)
    private predefineRepository: Repository<PredefineItemMachine>,
    private commonService: CommonService,
  ) { }

  async getDropDownPredefindGroup() {
    const sql = `select distinct predefine_group from co_predefine where Predefine_Group in ('NG_Reason','Stop_Reason')   `;
    return await this.predefineRepository.query(sql);
  }

  async getDropDownPredefind() {
    const sql = `select Predefine_CD value ,Value_EN title from co_Predefine  WHERE  Predefine_Group   in ('NG_Reason','Stop_Reason') `;
    return await this.predefineRepository.query(sql);
  }

  async getDropDownPredefindItem(group, predefineCd) {
    const sql = `select  Predefine_Item_CD value, Value_EN title from co_Predefine_item where  Predefine_Group= '${group}' and Predefine_CD = '${predefineCd}'`;
    return await this.predefineRepository.query(sql);
  }

  async getDropDownMachineProcess() {
    const sql = `select Process_CD value , Process_CD title from  M_Machine`;
    return await this.predefineRepository.query(sql);
  }

  async search(dto: PredefineItemSearchDto) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Predefine_Group', dto.predefineGroup);
      req.input('Predefine_CD', dto.predefineCd);
      req.input('Process_CD', dto.processCd);
      req.input('Value_TH', dto.valueTH);
      req.input('Value_EN', dto.valueEN);
      req.input('Is_Active', dto.isActive);
      req.input('Language', 'EN');
      req.input('Row_No_From', dto.searchOptions.rowFrom);
      req.input('Row_No_To', dto.searchOptions.rowTo);

      return await this.commonService.getSearch(
        'sp_co_Search_Predefine_Item_Machine',
        req,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(
    processCd: string,
    predefineItemCd: string,
  ): Promise<PredefineItemMachine> {
    const predefine = await this.predefineRepository.findOne({
      where: { processCd: processCd, predefineItemCd },
    });
    if (!predefine) {
      throw new NotFoundException(
        `Item not found`,
      );
    }
    return predefine;
  }

  async create(dto: PredefineDto, userId): Promise<BaseResponse> {
    try {
      dto.createBy = userId;
      dto.updateBy = userId;
      dto.createDate = getCurrentDate();
      dto.updateDate = getCurrentDate();

      console.log("Create Predefine item process", dto)
      const dbData = await this.predefineRepository.findOneBy({ predefineItemCd: dto.predefineItemCd, processCd: dto.processCd })
      if (dbData) {
        return {
          status: 1,
          message: 'Item already exists',
        };
      }

      console.log('before called ')

      const predefineItem = await this.predefineRepository.insert(dto);

      return {
        status: 0,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(
    processCd: string,
    predefineItemCd: string,
    predefineDto: PredefineDto,
    userId: number,
  ): Promise<BaseResponse> {
    console.log("Update predefine process: ", predefineDto)
    const team = await this.predefineRepository.findOneBy({ predefineItemCd: predefineDto.predefineItemCd, processCd: predefineDto.processCd });
    if (team) {
      if (team.processCd !== processCd || team.predefineItemCd !== predefineItemCd) {
        return {
          status: 2,
          message: 'Item already exists',
        };
      }
    }

    const result = await this.predefineRepository.update(
      {
        processCd: processCd,
        predefineItemCd: predefineItemCd
      },
      {
        predefineGroup: predefineDto.predefineGroup,
        predefineCd: predefineDto.predefineCd,
        predefineItemCd: predefineDto.predefineItemCd,
        processCd: predefineDto.processCd,
        isActive: predefineDto.isActive,
        updateBy: userId,
        updateDate: getCurrentDate(),
      },
    );
    console.log('result', result);

    if (!result) {
      return {
        status: 1,
        message: `Predefine item not found`,
      };
    }
    return {
      status: 0,
    };
  }

}
