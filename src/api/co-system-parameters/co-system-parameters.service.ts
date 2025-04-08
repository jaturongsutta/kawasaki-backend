import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoSystemParameters } from 'src/entity/co-system-parameters.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoSystemParametersService {
  constructor(
    @InjectRepository(CoSystemParameters)
    private coSystemParameterRepository: Repository<CoSystemParameters>,
  ) {}

  async findbyType(paramType: string): Promise<CoSystemParameters | undefined> {
    return await this.coSystemParameterRepository.findOne({
      where: { paramType },
    });
  }
}
