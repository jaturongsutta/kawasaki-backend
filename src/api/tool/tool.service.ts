import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ToolDto, ToolHistoryDto, ToolSearchDto } from './dto/tool-search.dto';
import { DataSource, Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { MTool } from 'src/entity/tool.entity';
import { MToolHis } from 'src/entity/tool-his.entity';
import { getCurrentDate, getMessageDuplicateError, toLocalDateTime } from 'src/utils/utils';

@Injectable()
export class ToolService {
    constructor(private commonService: CommonService,
        @InjectRepository(MTool) private toolRepository: Repository<MTool>,
        @InjectRepository(MToolHis) private toolHistoryRepository: Repository<MToolHis>,
        private dataSource: DataSource,
    ) { }

    async search(dto: ToolSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Tool_CD', dto.tool_cd);
        req.input('H_Code', dto.h_Cd);
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
                    't.H_Code as hCode',
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
                .andWhere(`t.hCode = '${id}'`)
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
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.createdBy = data.updatedBy = `${userId}`;
            data.createdDate = data.updatedDate = getCurrentDate();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.insert(MTool, data);
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
                message: getMessageDuplicateError(error, 'H Code already exists'),
            };
        } finally {
            await queryRunner.release();
        }
    }

    async resetTool(data: ToolHistoryDto, userId: Number): Promise<BaseResponse> {
        try {
            const tool = await this.toolRepository.findOneBy({ processCd: data.Process_CD, hCode: data.H_Code });
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
                var r = await this.toolRepository.update(
                    {
                        hCode: data.H_Code,
                        processCd: data.Process_CD
                    },
                    {
                        actualAmt: null,
                        updatedBy: `${userId}`,
                        updatedDate: getCurrentDate()
                    },
                );

                if (r.affected > 0) {
                    return {
                        status: 0
                    }
                }
            }
            return {
                status: 1,
                message: 'Unable to Reset, Please try again.',
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
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            data.updatedBy = `${userId}`;
            data.updatedDate = getCurrentDate();

            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.update(MTool, {
                hCode: id,
                processCd: data.processCd
            }, data);
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
