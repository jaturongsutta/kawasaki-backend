import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EncryptData } from 'src/_services/encrypt';
import { LoginDto } from './dto/login.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<UserLoginDto> {
    const hashPassword = EncryptData.hash(body.password);
    return this.authService.signin(body.username, hashPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-menu-by-user-id')
  async getMenuByUserID(@Request() req: any) {
    const userId = req.user.userId;
    return this.authService.getMenuByUserID(userId, 'EN');
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-token')
  async refreshToken(@Request() req: any) {
    const userId = req.user.userId;
    return this.authService.refreshToken(userId);
  }
}
