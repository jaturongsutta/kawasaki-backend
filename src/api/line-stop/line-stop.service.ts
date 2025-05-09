import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { LineStopDto, LineStopSearchDto } from './dto/line-stop-search.dto';
import { DataSource, Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate, minuteToTime, toLocalDateTime } from 'src/utils/utils';
import { NgRecord } from 'src/entity/ng-record.entity';

@Injectable()
export class LineStopService {
    constructor(private commonService: CommonService,
        @InjectRepository(NgRecord) private ngRecordRepository: Repository<NgRecord>,
        private dataSource: DataSource,
    ) { }

    async search(dto: LineStopSearchDto) {
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

    async searchPlan(dto: LineStopSearchDto) {
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

    async add(data: LineStopDto, userId: number): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.createdBy = data.updatedBy = userId;
            data.createdDate = data.updatedDate = getCurrentDate();
            data.ngTime = minuteToTime(data.ngTime);

            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.insert(NgRecord, data);
            await queryRunner.commitTransaction();
            await this.updateToolLifeCount(data, userId);

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
                message: error.message,
            };
        } finally {
            await queryRunner.release();
        }
    }

    async update(
        id: number,
        data: LineStopDto,
        userId: number,
    ): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.updatedBy = userId;
            data.updatedDate = getCurrentDate();
            data.ngTime = minuteToTime(data.ngTime);

            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const item = { ...data };
            delete item.modelCd;
            const result = await queryRunner.manager.update(NgRecord, id, item);
            await queryRunner.commitTransaction();
            await this.updateToolLifeCount(data, userId);

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

    async updateToolLifeCount(data: LineStopDto, userId: number) {
        if (data.idRef === null && data.status === '90') { /* idRef == null and status == '90' confirmed */
            console.log("updateToolLifeCount")
            const req = await this.commonService.getConnection();
            req.input('line', data.lineCd);
            req.input('model', data.modelCd);
            req.input('user_id', userId);
            await this.commonService.executeStoreProcedure(
                'sp_ToolLife_Count',
                req,
            );
        }
    }
}
