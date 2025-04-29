import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ToolDto, ToolHistoryDto, ToolSearchDto } from './dto/tool-search.dto';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { MTool } from 'src/entity/tool.entity';
import { MToolHis } from 'src/entity/tool-his.entity';

@Injectable()
export class ToolService {
    constructor(private commonService: CommonService,
        @InjectRepository(MTool) private toolRepository: Repository<MTool>,
        @InjectRepository(MToolHis) private toolHistoryRepository: Repository<MToolHis>
    ) { }

    async search(dto: ToolSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Tool_CD', dto.tool_cd);
        req.input('Process_CD', dto.process_cd);
        req.input('Status', dto.status);
        req.input('Row_No_From', dto.searchOptions.rowFrom);
        req.input('Row_No_To', dto.searchOptions.rowTo);

        return await this.commonService.getSearch('sp_m_Search_Tool', req);
    }

    async getById(processCd: string, id: string): Promise<any> {
        try {
            const req = await this.commonService.getConnection();
            req.input('Tool_CD', id);
            req.input('Process_CD', processCd);
            req.input('Status', null);
            req.input('Row_No_From', 1);
            req.input('Row_No_To', 1);

            const result = await this.commonService.getSearch('sp_m_Search_Tool', req);
            if (result.data.length > 0) {
                return { data: result.data[0] };
            }
            return { data: {} };
        }
        catch (e) {
            throw e;
        }
    }

    async add(data: ToolDto, userId: Number): Promise<BaseResponse> {
        try {
            const item = this.dtoToEntity(data, userId);
            item.createdBy = `${userId}`;
            item.createdDate = new Date();
            const result = await this.toolRepository.save(item);
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

    async createHistory(data: ToolHistoryDto, userId: Number): Promise<BaseResponse> {
        try {
            const item = new MTool();
            item.toolCd = data.Tool_CD;
            item.processCd = data.Process_CD;
            item.toolName = data.Tool_Name;
            item.toolLife = data.Tool_Life;
            item.actualAmt = data.Actual_Amt;
            item.createdBy = `${userId}`;
            item.createdDate = new Date();
            const result = await this.toolHistoryRepository.save(item);
            if (result) {
                return {
                    status: 0,
                };
            }
            return {
                status: 1,
                message: 'Unable to save tool history, Please try again.',
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
        data: ToolDto,
        userId: number,
    ): Promise<BaseResponse> {
        try {
            const item = this.dtoToEntity(data, userId);
            var r = await this.toolRepository.update(
                {
                    toolCd: id,
                    processCd: data.Process_CD
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

    dtoToEntity(data: ToolDto, userId: Number) {
        const item = new MTool();
        item.toolCd = data.Tool_CD;
        item.processCd = data.Process_CD;
        item.toolName = data.Tool_Name;
        item.toolLife = data.Tool_Life;
        item.warningAmt = data.Warning_Amt;
        item.alertAmt = data.Alert_Amt;
        item.alarmAmt = data.Alarm_Amt;
        item.mapCd = data.Map_CD;
        item.isActive = data.Status;
        item.updatedBy = `${userId}`;
        item.updatedDate = new Date();
        return item;
    }
}
