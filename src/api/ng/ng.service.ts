import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { NGDto, NGSearchDto } from './dto/ng-search.dto';
import { MModel } from 'src/entity/model.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate, toLocalDateTime } from 'src/utils/utils';
import { Predefine } from 'src/entity/predefine.entity';
import { MLineModel } from 'src/entity/line-model.entity';
import { MLine } from 'src/entity/line.entity';

@Injectable()
export class NGService {
    constructor(private commonService: CommonService,
        @InjectRepository(Predefine) private predefineRepository: Repository<Predefine>,
        @InjectRepository(MLineModel) private lineModelRepository: Repository<MLineModel>,
        @InjectRepository(MLine) private lineRepository: Repository<MLine>,
        @InjectRepository(MModel) private modelRepository: Repository<MModel>
    ) { }

    async search(dto: NGSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Line_CD', dto.lineCd);
        req.input('Date_From', dto.dateFrom);
        req.input('Date_To', dto.dateTo);
        req.input('Model_CD', dto.modelCd);
        req.input('Reason', dto.reason);
        req.input('Status', dto.status);
        req.input('Row_No_From', dto.searchOptions.rowFrom);
        req.input('Row_No_To', dto.searchOptions.rowTo);
        return await this.commonService.getSearch('sp_NG_Search', req);
    }

    async getStatus(): Promise<any> {
        try {
            const r = await this.predefineRepository
                .createQueryBuilder('x')
                .select([
                    'x.Predefine_CD as statusCd',
                    'x.Value_EN as statusName',
                ])
                .where(`x.Predefine_Group='NG_Status'`)
                .getRawMany();
            if (!r) {
                return {
                    status: 2,
                    message: 'Predefine Status not found'
                }
            }
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

    async getLine(): Promise<any> {
        try {
            const r = await this.lineRepository
                .createQueryBuilder('x')
                .select([
                    'x.Line_CD as lineCd',
                ])
                .getRawMany();
            if (!r) {
                return {
                    status: 2,
                    message: 'Line not found'
                }
            }
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

    async getReason(): Promise<any> {
        try {
            const r = await this.predefineRepository
                .createQueryBuilder('x')
                .select([
                    'x.Predefine_CD as reasonCd',
                    'x.Value_EN as reasonName',
                ])
                .where(`x.Predefine_Group='NG_Reason'`)
                .getRawMany();
            if (!r) {
                return {
                    status: 2,
                    message: 'Predefine Reason not found'
                }
            }
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

    async getModelWithLineCd(lineCd: string): Promise<any> {
        try {
            const r = await this.lineModelRepository
                .createQueryBuilder('x')
                .select([
                    'x.Model_CD as modelCd',
                ])
                .where(`x.Line_CD='${lineCd}'`)
                .getRawMany();
            if (!r) {
                return {
                    status: 2,
                    message: 'Line Model not found'
                }
            }
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

    async getById(id: string): Promise<any> {
        try {
            const r = await this.modelRepository
                .createQueryBuilder('m')
                .leftJoin('um_User', 'u', 'u.User_ID = m.UPDATED_BY')
                .select([
                    'm.Model_CD as modelCd',
                    'm.Product_CD as productCd',
                    'm.Part_No as partNo',
                    'm.Part_Upper as partUpper',
                    'm.Part_Lower as partLower',
                    `RIGHT('0' + CAST(DATEPART(HOUR, m.Cycle_Time) * 60 + DATEPART(MINUTE, m.Cycle_Time) AS VARCHAR), 2) + ':' +
                    RIGHT('0' + CAST(DATEPART(SECOND, m.Cycle_Time) AS VARCHAR), 2) AS cycleTime`,
                    'm.is_Active as isActive',
                    'u.username as updatedBy',
                    'm.UPDATED_DATE as updatedDate'
                ])
                .where('m.modelCd = :id', { id })
                .getRawOne();
            if (!r) {
                return {
                    status: 2,
                    message: 'Model not found'
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

    async add(data: NGDto, userId: Number): Promise<BaseResponse> {
        try {
            // data.createdBy = data.updatedBy = `${userId}`;
            // data.createdDate = data.updatedDate = getCurrentDate();
            // data.cycleTime = this.minuteToTime(data.cycleTime);
            // const result = await this.modelRepository.save(data);
            // if (result) {
            //     return {
            //         status: 0,
            //     };
            // }
            // return {
            //     status: 1,
            //     message: 'Unable to create data, Please try again.',
            // };
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
        data: NGDto,
        userId: number,
    ): Promise<BaseResponse> {
        try {
            // data.updatedBy = `${userId}`;
            // data.updatedDate = getCurrentDate();
            // data.cycleTime = this.minuteToTime(data.cycleTime);
            // var r = await this.modelRepository.update(
            //     {
            //         modelCd: id
            //     },
            //     data,
            // );

            // if (r.affected > 0) {
            //     return {
            //         status: 0
            //     }
            // }
            // return {
            //     status: 1,
            //     message: 'Unable to update data, Please try again.'
            // };
        } catch (error) {
            console.log("Error : ", error)
            return {
                status: 2,
                message: error.message,
            };
        }
    }

    minuteToTime(m) {
        if (m) {
            const [hh, mm, ss] = m.split(':').map(Number);
            return new Date(0, 0, 0, hh, mm, ss);
        }
        return null;
    }

}
