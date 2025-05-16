import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { CommonService } from 'src/common/common.service';
import { MTeam } from 'src/entity/m-team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MTeam])],
  exports: [TypeOrmModule],
  providers: [CommonService, TeamService],
  controllers: [TeamController]
})
export class TeamModule { }
