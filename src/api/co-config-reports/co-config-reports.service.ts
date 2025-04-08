import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoConfigReports } from 'src/entity/co-config-reports.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoConfigReportsService {
    constructor(
        @InjectRepository(CoConfigReports)
        private coSystemParameterRepository: Repository<CoConfigReports>,
      ) {}
    
      async findbyReportType(reportType: string): Promise<CoConfigReports[] | undefined> {
        return await this.coSystemParameterRepository.find({
          where: { reportType },
        });
      }
}
