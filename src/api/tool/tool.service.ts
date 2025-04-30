import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ToolDto, ToolHistoryDto, ToolSearchDto } from './dto/tool-search.dto';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { MTool } from 'src/entity/tool.entity';
import { MToolHis } from 'src/entity/tool-his.entity';
import { getCurrentDate, toLocalDateTime } from 'src/utils/utils';

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
            const r = await this.toolRepository
                .createQueryBuilder('t')
                .leftJoin('um_User', 'u', 'u.User_ID = t.UPDATED_BY')
                .select([
                    't.Tool_CD as toolCd',
                    't.Process_CD as processCd',
                    't.Tool_Name as toolName',
                    't.Tool_Life as toolLife',
                    't.Warning_Amt as warningAmt',
                    't.Alert_Amt as alertAmt',
                    't.Alarm_Amt as alarmAmt',
                    't.Actual_Amt as actualAmt',
                    't.Map_CD as mapCd',
                    't.is_Active as isActive',
                    'u.username as updatedBy',
                    't.UPDATED_DATE as updatedDate'
                ])
                .where(`t.processCd = '${processCd}'`)
                .andWhere(`t.toolCd = '${id}'`)
                .getRawOne();
            if (!r) {
                return {
                    status: 2,
                    message: 'Tool not found'
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

    async add(data: ToolDto, userId: Number): Promise<BaseResponse> {
        try {
            data.createdBy = data.updatedBy = `${userId}`;
            data.createdDate = data.updatedDate = getCurrentDate();
            const result = await this.toolRepository.save(data);
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
            const tool = await this.toolRepository.findOneBy({ processCd: data.Process_CD, toolCd: data.Tool_CD });
            if (!tool) {
                return {
                    status: 2,
                    message: 'Tool not found'
                }
            }

            tool.createdBy = `${userId}`;
            tool.createdDate = getCurrentDate();
            const result = await this.toolHistoryRepository.insert(tool);
            if (result.identifiers.length > 0) {
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
            data.updatedBy = `${userId}`;
            data.updatedDate = getCurrentDate();
            var r = await this.toolRepository.update(
                {
                    toolCd: id,
                    processCd: data.processCd
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
