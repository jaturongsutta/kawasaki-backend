import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './api/auth/guard/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class BaseController {
  constructor() {}
}
