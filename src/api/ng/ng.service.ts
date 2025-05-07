import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { NGDto, NGSearchDto } from './dto/ng-search.dto';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate, toLocalDateTime } from 'src/utils/utils';
import { NgRecord } from 'src/entity/ng-record.entity';

@Injectable()
export class NGService {
    constructor(private commonService: CommonService,
        @InjectRepository(NgRecord) private ngRecordRepository: Repository<NgRecord>
    ) { }

    async search(dto: NGSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Line_CD', dto.lineCd);
        req.input('Date_From', dto.dateFrom);
        req.input('Date_To', dto.dateTo);
        req.input('Model_CD', dto.modelCd);
        req.input('Reason', dto.reason);
        req.input('Status', dto.status);
        req.input('Row_No_From', dto.searchOptions.rowFrom);
        req.input('Row_No_To', dto.searchOptions.rowTo);
        return await this.commonService.getSearch('sp_NG_Search', req);
    }

    async searchPlan(dto: NGSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Line_CD', dto.lineCd);
        req.input('Plan_Date', dto.planDate);
        return await this.commonService.getSearch('sp_NG_Search_Plan', req);
    }

    async getById(id: string): Promise<any> {
        try {
            const r = await this.ngRecordRepository
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

    async add(data: NGDto, userId: number): Promise<BaseResponse> {
        try {
            data.createdBy = data.updatedBy = userId;
            data.createdDate = data.updatedDate = getCurrentDate();
            data.ngTime = this.minuteToTime(data.ngTime);
            const result = await this.ngRecordRepository.save(data);
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
        data: NGDto,
        userId: number,
    ): Promise<BaseResponse> {
        try {
            // data.updatedBy = `${userId}`;
            // data.updatedDate = getCurrentDate();
            // data.cycleTime = this.minuteToTime(data.cycleTime);
            // var r = await this.modelRepository.update(
            //     {
            //         modelCd: id
            //     },
            //     data,
            // );

            // if (r.affected > 0) {
            //     return {
            //         status: 0
            //     }
            // }
            // return {
            //     status: 1,
            //     message: 'Unable to update data, Please try again.'
            // };
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
