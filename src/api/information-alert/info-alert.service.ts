import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { InfoAlertDto, InfoAlertSearchDto } from './dto/info-alert-search.dto';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate, getMessageDuplicateError, minuteToTime, toLocalDateTime } from 'src/utils/utils';
import { InfoAlert } from 'src/entity/info-alert.entity';

@Injectable()
export class InfoAlertService {
    constructor(private commonService: CommonService,
        @InjectRepository(InfoAlert) private infoAlertRepository: Repository<InfoAlert>,
        private dataSource: DataSource,
    ) { }

    async search(dto: InfoAlertSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Line_CD', dto.lineCd);
        req.input('Date_From', dto.dateFrom);
        req.input('Date_To', dto.dateTo);
        req.input('Row_No_From', dto.searchOptions.rowFrom);
        req.input('Row_No_To', dto.searchOptions.rowTo);
        return await this.commonService.getSearch('sp_m_Search_InfoAlert', req);
    }

    async getById(id: string): Promise<any> {
        try {
            const r = await this.infoAlertRepository
                .createQueryBuilder('x')
                .leftJoin('um_User', 'u', 'u.User_ID = x.UPDATED_BY')
                .select([
                    'x.ID as id ',
                    'x.Line_CD as lineCd',
                    'x.Info_Alert as infoAlert',
                    'x.Alert_Start_Date as alertStartDate',
                    `LEFT(CONVERT(VARCHAR(8), x.Alert_Start_Time, 108), 5)  as alertStartTime`,
                    'x.Alert_End_Date as alertEndDate',
                    `LEFT(CONVERT(VARCHAR(8), x.Alert_End_Time, 108), 5)  as alertEndTime`,
                    'x.is_Active as isActive',
                    'u.username as updatedBy',
                    'x.UPDATED_DATE as updatedDate'
                ])
                .where(`x.ID = '${id}'`)
                .getRawOne();
            if (!r) {
                return {
                    status: 2,
                    message: 'Info Alert not found'
                }
            }
            r.alertStartDate = toLocalDateTime(r.alertStartDate);
            r.alertEndDate = toLocalDateTime(r.alertEndDate);
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

    async add(data: InfoAlertDto, userId: Number): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.createdBy = data.updatedBy = `${userId}`;
            data.createdDate = data.updatedDate = getCurrentDate();
            data.alertStartTime = minuteToTime(data.alertStartTime);
            data.alertEndTime = minuteToTime(data.alertEndTime);
            delete data.id;
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.insert(InfoAlert, data);
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
        data: InfoAlertDto,
        userId: number,
    ): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.updatedBy = `${userId}`;
            data.updatedDate = getCurrentDate();
            data.alertStartTime = minuteToTime(data.alertStartTime);
            data.alertEndTime = minuteToTime(data.alertEndTime);
            delete data.id;
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.update(InfoAlert, id, data);
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
