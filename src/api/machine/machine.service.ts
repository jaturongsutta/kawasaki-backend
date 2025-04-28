import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { MachineDto, MachineSearchDto } from './dto/machine-search.dto';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { MMachine } from 'src/entity/machine.entity';

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
            const req = await this.commonService.getConnection();
            req.input('Machine_No', null);
            req.input('Process_CD', id);
            req.input('Status', null);
            req.input('Row_No_From', 1);
            req.input('Row_No_To', 1);

            const result = await this.commonService.getSearch('sp_m_Search_Machine', req);
            if (result.data.length > 0) {
                return { data: result.data[0] };
            }
            return { data: {} };
        }
        catch (e) {
            throw e;
        }
    }

    async add(data: MachineDto, userId: Number): Promise<BaseResponse> {
        try {
            const item = this.dtoToEntity(data, userId);
            item.createdBy = `${userId}`;
            item.createdDate = new Date();
            const result = await this.machineRepository.save(item);
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
            const item = this.dtoToEntity(data, userId);
            var r = await this.machineRepository.update(
                {
                    machineNo: id
                },
                item,
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

    dtoToEntity(data: MachineDto, userId: Number) {
        const item = new MMachine();
        item.machineNo = data.Machine_No;
        item.processCd = data.Process_CD;
        item.machineName = data.Machine_Name;
        item.mapCd = data.Map_CD;
        item.isActive = data.Status;
        item.updatedBy = `${userId}`;
        item.updatedDate = new Date();
        return item;
    }
}
