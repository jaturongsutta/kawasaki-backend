import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { TeamDto, TeamSearchDto } from './dto/team-search.dto';
import { DataSource, Not, Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate, getMessageDuplicateError, minuteToTime, toLocalDateTime } from 'src/utils/utils';
import { MTeam } from 'src/entity/m-team.entity';

@Injectable()
export class TeamService {
    constructor(private commonService: CommonService,
        @InjectRepository(MTeam) private teamRepository: Repository<MTeam>,
        private dataSource: DataSource,
    ) { }

    async search(dto: TeamSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Team_Name', dto.teamName);
        req.input('Status', dto.status);
        req.input('Row_No_From', dto.searchOptions.rowFrom);
        req.input('Row_No_To', dto.searchOptions.rowTo);
        return await this.commonService.getSearch('sp_m_Search_Team', req);
    }

    async getById(id: string): Promise<any> {
        try {
            const r = await this.teamRepository
                .createQueryBuilder('x')
                .leftJoin('um_User', 'u', 'u.User_ID = x.UPDATED_BY')
                .select([
                    'x.ID id',
                    'x.Team_Name teamName',
                    `CAST(x.Default_Operator AS VARCHAR(10)) defaultOperator`,
                    `CAST(x.Default_Leader AS VARCHAR(10)) defaultLeader`,
                    'x.is_Active as isActive',
                    'u.username as updatedBy',
                    'x.UPDATED_DATE as updatedDate'
                ])
                .where(`x.ID = '${id}'`)
                .getRawOne();
            if (!r) {
                return {
                    status: 2,
                    message: 'Team not found'
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

    async add(data: TeamDto, userId: Number): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const team = await this.teamRepository.findOneBy({ teamName: data.teamName });
            if (team) {
                return {
                    status: 2,
                    message: 'Team name already exists',
                };
            }

            data.createdBy = data.updatedBy = `${userId}`;
            data.createdDate = data.updatedDate = getCurrentDate();
            delete data.id;
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.insert(MTeam, data);
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
                message: getMessageDuplicateError(error, 'Team name already exists'),
            };
        } finally {
            await queryRunner.release();
        }
    }

    async update(
        id: string,
        data: TeamDto,
        userId: number,
    ): Promise<BaseResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const team = await this.teamRepository.findOneBy({ teamName: data.teamName, id: Not(data.id) });
            if (team) {
                return {
                    status: 2,
                    message: 'Team name already exists',
                };
            }

            data.updatedBy = `${userId}`;
            data.updatedDate = getCurrentDate();
            delete data.id;
            await queryRunner.connect();
            await queryRunner.startTransaction();
            console.log('data : ', data);

            const result = await queryRunner.manager.update(MTeam, id, data);
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
                message: getMessageDuplicateError(error, 'Team name already exists'),
            };
        } finally {
            await queryRunner.release();
        }
    }
}
