import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { MachineDto, MachineSearchDto } from './dto/machine-search.dto';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { MMachine } from 'src/entity/machine.entity';
import { getCurrentDate, toLocalDateTime } from 'src/utils/utils';

@Injectable()
export class MachineService {
    constructor(private commonService: CommonService,
        @InjectRepository(MMachine) private machineRepository: Repository<MMachine>
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

    async getById(id: string): Promise<any> {
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
                .where(`m.processCd = '${id}'`)
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

    async add(data: MachineDto, userId: Number): Promise<BaseResponse> {
        try {
            data.createdBy = data.updatedBy = `${userId}`;
            data.createdDate = data.updatedDate = getCurrentDate();
            const result = await this.machineRepository.save(data);
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
        data: MachineDto,
        userId: number,
    ): Promise<BaseResponse> {
        try {
            data.updatedBy = `${userId}`;
            data.updatedDate = getCurrentDate();
            var r = await this.machineRepository.update(
                {
                    processCd: id
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
            return {
                status: 2,
                message: error.message,
            };
        }
    }
}
