import { Module } from '@nestjs/common';
import { CoSystemParametersService } from './co-system-parameters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoSystemParameters } from 'src/entity/co-system-parameters.entity';
import { CoSystemParametersController } from './co-system-parameters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CoSystemParameters])],
  providers: [CoSystemParametersService],
  exports: [CoSystemParametersService],
  controllers: [CoSystemParametersController],
})
export class CoSystemParametersModule {}
