import { Controller, Get, Param, Request } from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { CoSystemParametersService } from './co-system-parameters.service';

@Controller('co-system-parameters')
export class CoSystemParametersController extends BaseController {
    constructor(private service: CoSystemParametersService) {
      super();
    }

    @Get('findbyType/:key')
    getCoSystemParameter(@Request() req: any, @Param('key') key: string) {
        return this.service.findbyType(key);
    }
}


