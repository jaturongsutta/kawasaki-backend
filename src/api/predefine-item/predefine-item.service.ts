import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { PredefineItemDto } from './dto/predefine-item.dto';
import { PredefineItemSearchDto } from './dto/predefine-item.search.dto';
import { BaseResponse } from 'src/common/base-response';
import { PredefineItem } from 'src/entity/predefine-item.entity';
import { getCurrentDate } from 'src/utils/utils';
import { Predefine } from 'src/entity/predefine.entity';

@Injectable()
export class PredefineItemService {
  constructor(
    @InjectRepository(Predefine)
    private predefineRepository: Repository<Predefine>,
    @InjectRepository(PredefineItem)
    private predefineItemRepository: Repository<PredefineItem>,
    private commonService: CommonService,
  ) {}

  async getDropDownPredefindGroup() {
    // const sql = `select predefine_group , predefine_group + ' : ' + display as display from (select predefine_group, max(Value_EN) display from co_predefine   group by predefine_group) x`;
    const sql = `select distinct predefine_group from co_predefine where Predefine_Group in ('NG_Reason','Stop_Reason')   `;
    return await this.predefineRepository.query(sql);
    // return this.predefineRepository.findBy({Predefine_Group : group , Is_Active : 'Y'});
  }

  async search(dto: PredefineItemSearchDto) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Predefine_Group', dto.predefineGroup);
      req.input('Predefine_CD', null);
      req.input('Predefine_Item_CD', dto.predefineItemCd);
      req.input('Value_TH', dto.valueTH);
      req.input('Value_EN', dto.valueEN);
      req.input('Is_Active', dto.isActive);
      req.input('Language', 'EN');
      req.input('Row_No_From', dto.searchOptions.rowFrom);
      req.input('Row_No_To', dto.searchOptions.rowTo);

      return await this.commonService.getSearch(
        'sp_co_Search_Predefine_Item',
        req,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async create(dto: PredefineItemDto, userId): Promise<BaseResponse> {
    try {
      dto.createBy = userId;
      dto.updateBy = userId;
      dto.createDate = new Date();
      dto.updateDate = new Date();

      const data = this.predefineItemRepository.create(dto);

      // select all  max from predefine item , record canable convert to number
      const maxItem = await this.predefineItemRepository
        .createQueryBuilder('predefineItem')
        .select('MAX(CAST(predefineItem.predefineItemCd AS INT))', 'maxCd')
        .getRawOne();

      const maxItemCd = maxItem.maxCd;

      if (maxItemCd) {
        const nextItemCd = parseInt(maxItemCd, 10) + 1;
        data.predefineItemCd = nextItemCd.toString();
      } else {
        data.predefineItemCd = '1'; // Start with 001 if no items exist
      }

      const dbData = await this.predefineItemRepository.findOne({
        where: {
          predefineGroup: dto.predefineGroup,
          predefineCd: dto.predefineCd,
          predefineItemCd: dto.predefineItemCd,
        },
      });
      if (dbData) {
        return {
          status: 1,
          message: 'Predefine item already exists',
        };
      }

      const predefineItem = this.predefineItemRepository.create(data);
      await this.predefineItemRepository.insert(predefineItem);

      return {
        status: 0,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll(): Promise<PredefineItem[]> {
    return this.predefineItemRepository.find();
  }

  async findOne(
    predefineGroup: string,
    predefineCd: string,
    predefineItemCd: string,
  ): Promise<PredefineItem> {
    const predefine = await this.predefineItemRepository.findOne({
      where: { predefineGroup, predefineCd, predefineItemCd },
    });
    if (!predefine) {
      throw new NotFoundException(
        `Predefine with Group ${predefineGroup}, Code ${predefineCd}, and Item Code ${predefineItemCd} not found`,
      );
    }
    return predefine;
  }

  async update(
    predefineGroup: string,
    predefineCd: string,
    predefineItemCd: string,
    predefineDto: PredefineItemDto,
    userId: number,
  ): Promise<BaseResponse> {
    console.log('predefineGroup', predefineGroup);
    console.log('predefineCd', predefineCd);
    console.log('predefineItemCd', predefineItemCd);
    console.log(predefineDto);

    const currentPredefineCd = predefineCd;

    const existingPredefine = await this.predefineItemRepository.findOne({
      where: { predefineGroup, predefineCd, predefineItemCd },
    });
    if (!existingPredefine) {
      return {
        status: 1,
        message: `Predefine with ID1 ${predefineGroup} and ID2 ${predefineCd} not found`,
      };
    }

    const result = await this.predefineItemRepository.update(
      {
        predefineGroup,
        predefineCd: currentPredefineCd,
        predefineItemCd,
      },
      {
        predefineCd: predefineDto.predefineCd,
        description: predefineDto.description,
        valueTh: predefineDto.valueTh,
        valueEn: predefineDto.valueEn,
        isActive: predefineDto.isActive,
        updateBy: userId,
        updateDate: getCurrentDate(),
      },
    );
    console.log('result', result);

    if (!result) {
      return {
        status: 1,
        message: `Predefine with ID1 ${predefineGroup} and ID2 ${predefineCd} not found`,
      };
    }
    return {
      status: 0,
    };
  }

  async remove(
    predefineGroup: string,
    predefineCd: string,
    predefineItemCd: string,
  ): Promise<void> {
    const result = await this.predefineItemRepository.delete({
      predefineGroup,
      predefineCd,
      predefineItemCd,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Predefine with Group ${predefineGroup}, Code ${predefineCd}, and Item Code ${predefineItemCd} not found`,
      );
    }
  }
}
