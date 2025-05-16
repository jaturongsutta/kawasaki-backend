import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { LineStopDto, LineStopSearchDto } from './dto/line-stop-search.dto';
import { DataSource, Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate, minuteToTime, toLocalDateTime } from 'src/utils/utils';
import { NgRecord } from 'src/entity/ng-record.entity';
import { MLineMachine } from 'src/entity/m-line-machine.entity';
import { LineStopRecord } from 'src/entity/line-stop-record.entity';

@Injectable()
export class LineStopService {
    constructor(private commonService: CommonService,
        @InjectRepository(LineStopRecord) private lineStopRepository: Repository<LineStopRecord>,
        @InjectRepository(MLineMachine) private lineMachineRepository: Repository<MLineMachine>,
        private dataSource: DataSource,
    ) { }

    async search(dto: LineStopSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Line_CD', dto.lineCd);
        req.input('Date_From', dto.dateFrom);
        req.input('Date_To', dto.dateTo);
        req.input('Process_CD', dto.processCd);
        req.input('Reason', dto.reasonCd);
        req.input('Status', dto.statusCd);
        req.input('Row_No_From', dto.searchOptions.rowFrom);
        req.input('Row_No_To', dto.searchOptions.rowTo);

        return await this.commonService.getSearch('sp_LineStop_Search', req);
    }

    async searchPlan(dto: LineStopSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Line_CD', dto.lineCd);
        req.input('Plan_Date', dto.planDate);
        return await this.commonService.getSearch('sp_Line_Stop_Search_Plan', req);
    }

    async getById(id: string): Promise<any> {
        try {
            const req = await this.commonService.getConnection();
            req.input('Id', id);
            const result = await this.commonService.executeStoreProcedure(
                'sp_Line_Stop_Load',
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
            console.log("Before ", data)
            data.createdBy = data.updatedBy = userId;
            data.createdDate = data.updatedDate = getCurrentDate();
            data.lineStopTime = minuteToTime(data.lineStopTime);

            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.insert(LineStopRecord, data);
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
                message: error.message,
            };
        } finally {
            await queryRunner.release();
        }
    }

    async addFromPLC(data: LineStopDto, userId: number): Promise<BaseResponse> {
        try {
            const req = await this.commonService.getConnection();
            req.input('Line_CD', data.lineCd);
            req.input('Plan_id', data.planId);
            req.input('userid', userId);
            // req.output('Return_CD', '');
            // req.output('Return_Name', '');
            const result = await this.commonService.executeStoreProcedure(
                'sp_LineStop_PLC',
                req,
            );

            console.log("result ", result)
            // const { Return_CD, Return_Name } = result.output;

            if (result.recordset.length > 0) {
                const { Return_CD, Return_Name } = result.recordset[0];
                return {
                    status: Return_CD !== 'Success' ? 1 : 0,
                    message: Return_Name,
                };
            } else {
                return {
                    status: 1,
                    message: "Unable to create item",
                };
            }

        } catch (error) {
            return {
                status: 2,
                message: error.message,
            };
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
            data.lineStopTime = minuteToTime(data.lineStopTime);

            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.update(LineStopRecord, id, data);
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

    async delete(id: number): Promise<BaseResponse> {
        try {
            var r = await this.lineStopRepository.delete({ id: id });
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


    hhmmssToSeconds(timeStr) {
        const [hh, mm, ss] = timeStr.split(':').map(Number)
        return (hh * 3600) + (mm * 60) + ss
    }

    secondsToHHMMSS(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        const pad = (n) => String(n).padStart(2, '0')

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    }
}
