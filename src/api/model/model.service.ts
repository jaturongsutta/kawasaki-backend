import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ModelDto, ModelSearchDto } from './dto/model-search.dto';
import { MModel } from 'src/entity/model.entity';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/common/base-response';

@Injectable()
export class ModelService {
    constructor(private commonService: CommonService,
        @InjectRepository(MModel) private modelRepository: Repository<MModel>
    ) { }

    async search(dto: ModelSearchDto) {
        const req = await this.commonService.getConnection();
        req.input('Model_CD', dto.model_cd);
        req.input('Product_CD', dto.product_cd);
        req.input('Status', dto.status);
        req.input('Row_No_From', dto.searchOptions.rowFrom);
        req.input('Row_No_To', dto.searchOptions.rowTo);

        return await this.commonService.getSearch('sp_m_Search_Model', req);
    }

    async getById(id: string): Promise<any> {
        try {
            const req = await this.commonService.getConnection();
            req.input('Model_CD', id);
            req.input('Product_CD', null);
            req.input('Status', null);
            req.input('Row_No_From', 1);
            req.input('Row_No_To', 1);

            const result = await this.commonService.getSearch('sp_m_Search_Model', req);
            if (result.data.length > 0) {
                return { data: result.data[0] };
            }
            return { data: {} };
        }
        catch (e) {
            throw e;
        }
    }

    async add(data: ModelDto, userId: Number): Promise<BaseResponse> {
        try {
            const model = this.dtoToEntity(data, userId);
            const result = await this.modelRepository.save(model);
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
        data: ModelDto,
        userId: number,
    ): Promise<BaseResponse> {
        try {
            const model = this.dtoToEntity(data, userId);
            var r = await this.modelRepository.update(
                {
                    modelCd: id
                },
                model,
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

    dtoToEntity(data: ModelDto, userId: Number) {
        const model = new MModel();
        model.modelCd = data.Model_CD;
        model.productCd = data.Product_CD;
        model.partNo = data.Part_No;
        model.partUpper = data.Part_Upper;
        model.partLower = data.Part_Lower;
        model.isActive = data.Status;
        model.updatedBy = `${userId}`;
        model.updatedDate = new Date();

        const date = new Date(0, 0, 0, 0, Number(data.Cycle_Time_Min), 0);
        model.cycleTime = date;
        return model;
    }
}
