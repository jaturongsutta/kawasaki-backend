import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { MachineDto, MachineSearchDto, ToolAlertDto } from './dto/machine-search.dto';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { MMachine } from 'src/entity/machine.entity';
import { getCurrentDate, getMessageDuplicateError, toLocalDateTime } from 'src/utils/utils';
import { MToolAlert } from 'src/entity/m-tool-alert.entity';

@Injectable()
export class MachineService {
    constructor(private commonService: CommonService,
        @InjectRepository(MMachine) private machineRepository: Repository<MMachine>,
        @InjectRepository(MToolAlert) private toolAlertRepository: Repository<MToolAlert>,
        private dataSource: DataSource,
    ) { }

    async search(dto: MachineSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Machine_No', dto.machine_no);
        req.input('Process_CD', dto.process_cd);
        req.input('Status', dto.status);
        req.input('Row_No_From', dto.searchOptions.rowFrom);
        req.input('Row_No_To', dto.searchOptions.rowTo);
        return await this.commonService.getSearch('sp_m_Search_Machine', req);
    }

    async getById(machineNo: string, processCd: string): Promise<any> {
        try {
            const r = await this.machineRepository
                .createQueryBuilder('m')
                .leftJoin('um_User', 'u', 'u.User_ID = m.UPDATED_BY')
                .select([
                    'm.Process_CD as processCd',
                    'm.Machine_No as machineNo',
                    'm.Machine_Name as machineName',
                    'm.Map_CD as mapCd',
                    'm.is_Active as isActive',
                    'u.username as updatedBy',
                    'm.UPDATED_DATE as updatedDate'
                ])
                .where(`m.machineNo = '${machineNo}' and m.processCd = '${processCd}'`)
                .getRawOne();
            if (!r) {
                return {
                    status: 2,
                    message: 'Machine not found'
                }
            }
            r.updatedDate = toLocalDateTime(r.updatedDate);
            return {
                status: 0,
                data: r
            };
        }
        catch (e) {
            throw e;
        }
    }

    async getToolLifeAlarm(dto: MachineSearchDto): Promise<any> {
        try {
            const req = await this.commonService.getConnection();
            req.input('Row_No_From', dto.searchOptions.rowFrom);
            req.input('Row_No_To', dto.searchOptions.rowTo);
            return await this.commonService.getSearch('sp_m_Search_Tool_Alert', req);
        }
        catch (e) {
            throw e;
        }
    }

    async add(data: MachineDto, userId: Number): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.createdBy = data.updatedBy = `${userId}`;
            data.createdDate = data.updatedDate = getCurrentDate();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.insert(MMachine, data);
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
            return {
                status: 2,
                message: getMessageDuplicateError(error, "Process Code already exists"),
            };
        } finally {
            await queryRunner.release();
        }
    }

    async update(
        machineNo: string,
        processCd: string,
        data: MachineDto,
        userId: number,
    ): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.updatedBy = `${userId}`;
            data.updatedDate = getCurrentDate();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.update(MMachine, { machineNo: machineNo, processCd: processCd }, data);
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
            return {
                status: 2,
                message: error.message,
            };
        } finally {
            await queryRunner.release();
        }
    }


    async addToolLifeAlarm(data: ToolAlertDto, userId: Number): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.createdBy = data.updatedBy = `${userId}`;
            data.createdDate = data.updatedDate = getCurrentDate();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.insert(MToolAlert, data);
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
            return {
                status: 2,
                message: getMessageDuplicateError(error, "Process Code already exists"),
            };
        } finally {
            await queryRunner.release();
        }
    }


    async updateToolLifeAlarm(
        id: string,
        data: ToolAlertDto,
        userId: number,
    ): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.updatedBy = `${userId}`;
            data.updatedDate = getCurrentDate();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.update(MToolAlert, { id: id }, data);
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
            return {
                status: 2,
                message: error.message,
            };
        } finally {
            await queryRunner.release();
        }
    }

    async deleteToolLifeAlarm(id: number): Promise<BaseResponse> {
        const r = await this.toolAlertRepository.delete({ id: id });
        if (r.affected > 0) {
            return {
                status: 0
            }
        }

        return {
            status: 1,
            message: 'Unable to remove data, Please try again.'
        };
    }
}
