import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ModelDto, ModelSearchDto } from './dto/model-search.dto';
import { MModel } from 'src/entity/model.entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate, getMessageDuplicateError, minuteToTime, toLocalDateTime } from 'src/utils/utils';

@Injectable()
export class ModelService {
    constructor(private commonService: CommonService,
        @InjectRepository(MModel) private modelRepository: Repository<MModel>,
        private dataSource: DataSource,
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
                    'm.AS400_Product_Cd as as400ProductCd',
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
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.createdBy = data.updatedBy = `${userId}`;
            data.createdDate = data.updatedDate = getCurrentDate();
            data.cycleTime = minuteToTime(data.cycleTime);
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.insert(MModel, data);
            await queryRunner.commitTransaction();
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
            await queryRunner.rollbackTransaction();
            console.log("Error : ", error)
            return {
                status: 2,
                message: getMessageDuplicateError(error, 'Model Code already exists'),
            };
        } finally {
            await queryRunner.release();
        }
    }

    async update(
        id: string,
        data: ModelDto,
        userId: number,
    ): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.updatedBy = `${userId}`;
            data.updatedDate = getCurrentDate();
            data.cycleTime = minuteToTime(data.cycleTime);
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.update(MModel, id, data);
            await queryRunner.commitTransaction();
            if (result) {
                return {
                    status: 0
                }
            }
            return {
                status: 1,
                message: 'Unable to update data, Please try again.'
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log("Error : ", error)
            return {
                status: 2,
                message: error.message,
            };
        } finally {
            await queryRunner.release();
        }
    }
}
