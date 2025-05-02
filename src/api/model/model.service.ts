import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ModelDto, ModelSearchDto } from './dto/model-search.dto';
import { MModel } from 'src/entity/model.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate, toLocalDateTime } from 'src/utils/utils';

@Injectable()
export class ModelService {
    constructor(private commonService: CommonService,
        @InjectRepository(MModel) private modelRepository: Repository<MModel>
    ) { }

    async search(dto: ModelSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Model_CD', dto.model_cd);
        req.input('Product_CD', dto.product_cd);
        req.input('Status', dto.status);
        req.input('Row_No_From', dto.searchOptions.rowFrom);
        req.input('Row_No_To', dto.searchOptions.rowTo);
        return await this.commonService.getSearch('sp_m_Search_Model', req);
    }

    async getById(id: string): Promise<any> {
        try {
            const r = await this.modelRepository
                .createQueryBuilder('m')
                .leftJoin('um_User', 'u', 'u.User_ID = m.UPDATED_BY')
                .select([
                    'm.Model_CD as modelCd',
                    'm.Product_CD as productCd',
                    'm.Part_No as partNo',
                    'm.Part_Upper as partUpper',
                    'm.Part_Lower as partLower',
                    `RIGHT('0' + CAST(DATEPART(HOUR, m.Cycle_Time) * 60 + DATEPART(MINUTE, m.Cycle_Time) AS VARCHAR), 2) + ':' +
                    RIGHT('0' + CAST(DATEPART(SECOND, m.Cycle_Time) AS VARCHAR), 2) AS cycleTime`,
                    'm.is_Active as isActive',
                    'u.username as updatedBy',
                    'm.UPDATED_DATE as updatedDate'
                ])
                .where('m.modelCd = :id', { id })
                .getRawOne();
            if (!r) {
                return {
                    status: 2,
                    message: 'Model not found'
                }
            }
            r.updatedDate = toLocalDateTime(r.updatedDate);
            return {
                status: 0,
                data: r
            };
        }
        catch (error) {
            console.log("Error : ", error)
            throw error;
        }
    }

    async add(data: ModelDto, userId: Number): Promise<BaseResponse> {
        try {
            data.createdBy = data.updatedBy = `${userId}`;
            data.createdDate = data.updatedDate = getCurrentDate();
            data.cycleTime = this.minuteToTime(data.cycleTime);
            const result = await this.modelRepository.save(data);
            if (result) {
                return {
                    status: 0,
                };
            }
            return {
                status: 1,
                message: 'Unable to create data, Please try again.',
            };
        } catch (error) {
            console.log("Error : ", error)
            return {
                status: 2,
                message: error.message,
            };
        }
    }

    async update(
        id: string,
        data: ModelDto,
        userId: number,
    ): Promise<BaseResponse> {
        try {
            data.updatedBy = `${userId}`;
            data.updatedDate = getCurrentDate();
            data.cycleTime = this.minuteToTime(data.cycleTime);
            var r = await this.modelRepository.update(
                {
                    modelCd: id
                },
                data,
            );

            if (r.affected > 0) {
                return {
                    status: 0
                }
            }
            return {
                status: 1,
                message: 'Unable to update data, Please try again.'
            };
        } catch (error) {
            console.log("Error : ", error)
            return {
                status: 2,
                message: error.message,
            };
        }
    }

    minuteToTime(m) {
        if (m) {
            const [hh, mm, ss] = m.split(':').map(Number);
            return new Date(0, 0, 0, hh, mm, ss);
        }
        return null;
    }

}
