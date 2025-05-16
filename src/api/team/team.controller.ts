import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { BaseController } from 'src/base.controller';
import { TeamDto, TeamSearchDto } from './dto/team-search.dto';

@Controller('team')
export class TeamController extends BaseController {
  constructor(private service: TeamService) {
    super();
  }

  @Post('search')
  async search(@Body() dto: TeamSearchDto) {
    return await this.service.search(dto);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Post('add')
  async add(@Body() dto: TeamDto, @Request() req: any) {
    return await this.service.add(dto, req.user.userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: TeamDto,
    @Request() req: any,
  ) {
    return await this.service.update(id, dto, req.user.userId);
  }

}
