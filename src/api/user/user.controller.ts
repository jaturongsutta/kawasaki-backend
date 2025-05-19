import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { BaseController } from 'src/base.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { EncryptData } from 'src/_services/encrypt';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { BaseResponse } from 'src/common/base-response';

@Controller('user')
export class UserController extends BaseController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {
    super();
  }

  @Get(':id')
  async getByID(@Param('id') id: number) {
    return await this.userService.getByID(id);
  }

  @Post('search')
  async search(@Body() data: any) {
    try {
      const result = await this.userService.search(data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async addUser(
    @Body() data: UserDto,
    @Request() req: any,
  ): Promise<BaseResponse> {
    data.createdBy = req.user.userId;

    try {
      if (data.password) {
        data.password = EncryptData.hash(data.password);
      }

      const result = await this.userService.addUser(data);

      if (result) {
        return {
          status: 0,
        };
      }
    } catch (error) {
      return {
        status: 1,
        message: error.message,
      };
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() data: UserDto,
    @Request() req: any,
  ): Promise<BaseResponse> {
    data.updatedBy = req.user.userId;
    if (data.password) {
      data.password = EncryptData.hash(data.password);
    }

    const result = await this.userService.updateUser(id, data);
    if (result) {
      return {
        status: 0,
      };
    }
  }

  @Post('change-password')
  async changePass(@Body() data: UserChangePasswordDto): Promise<BaseResponse> {
    try {
      this.logger.log('User ' + data.userId + ' Change password');
      const oldPassword = EncryptData.hash(data.oldPassword);
      const newPassword = EncryptData.hash(data.newPassword);

      const result = await this.userService.changePassword(
        data.userId,
        oldPassword,
        newPassword,
      );
      return result;
    } catch (error) {
      this.logger.error(error.message);
      return {
        status: 2,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  async deleteateUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
