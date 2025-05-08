import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { NGDto, NGSearchDto } from './dto/ng-search.dto';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate, minuteToTime, toLocalDateTime } from 'src/utils/utils';
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
        req.input('Reason', dto.reasonCd);
        req.input('Status', dto.statusCd);
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
            const req = await this.commonService.getConnection();
            req.input('Id', id);
            const result = await this.commonService.executeStoreProcedure(
                'sp_NG_Load',
                req,
            );
            if (result.recordsets.length > 0) {
                return {
                    data: result.recordsets[0][0],
                };
            } else {
                return {
                    data: {},
                };
            }
        } catch (error) {
            return {
                status: 2,
                message: error.message,
            };
        }
    }

    async add(data: NGDto, userId: number): Promise<BaseResponse> {
        try {
            data.createdBy = data.updatedBy = userId;
            data.createdDate = data.updatedDate = getCurrentDate();
            data.ngTime = minuteToTime(data.ngTime);
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
        id: number,
        data: NGDto,
        userId: number,
    ): Promise<BaseResponse> {
        try {
            data.updatedBy = userId;
            data.updatedDate = getCurrentDate();
            data.ngTime = minuteToTime(data.ngTime);
            var r = await this.ngRecordRepository.update(
                {
                    id: id
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

    async delete(id: number): Promise<BaseResponse> {
        try {
            var r = await this.ngRecordRepository.delete({ id: id });
            if (r.affected > 0) {
                return {
                    status: 0
                }
            }
            return {
                status: 1,
                message: 'Unable to delete data, Please try again.'
            };
        } catch (error) {
            console.log("Error : ", error)
            return {
                status: 2,
                message: error.message,
            };
        }
    }

}
