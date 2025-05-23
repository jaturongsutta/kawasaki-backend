import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from 'src/common/common.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private commonService: CommonService,
  ) {}
  async signin(username: string, password: string): Promise<UserLoginDto> {
    const user = await this.userRepository.findOneBy({
      username: username,
      userPassword: password,
    });

    const userLoginDto = new UserLoginDto();
    const tokenOptions = { expiresIn: '50m' };
    if (user) {
      userLoginDto.user = user;
      if (user.isActive === 'Y') {
        const menuPermissions = await this.getMenuByUserID(user.userId, 'EN');

        const payload = { userId: user.userId, username: username };
        const token = await this.jwtService.signAsync(payload, tokenOptions);
        userLoginDto.permissions = menuPermissions.data;
        userLoginDto.token = token;
        userLoginDto.result.status = 0;
      } else {
        userLoginDto.result.status = 1;
        userLoginDto.result.message = 'User is inactive';
      }
    } else {
      userLoginDto.result.status = 1;
      userLoginDto.result.message = 'Invalid username or password';
    }

    return userLoginDto;
  }

  async getMenuByUserID(userID: number, lang: string) {
    const req = await this.commonService.getConnection();
    req.input('User_ID', userID);
    req.input('Language', lang);
    req.output('Return_CD', '');

    const execute = await this.commonService.executeStoreProcedure(
      'sp_um_User_Role_Permission',
      req,
      false, // false = not log
    );

    let res;

    if (execute && execute.recordset !== undefined) {
      res = {
        result: true,
        data: execute.recordset,
      };
    } else {
      res = {
        result: false,
      };
    }

    return res;
  }

  async refreshToken(userId: number): Promise<any> {
    // // Assuming there's a method to verify the refresh token and a method to get a new access token
    // const isValidRefreshToken = await this.verifyRefreshToken(refreshToken);
    // if (!isValidRefreshToken) {
    //   return {
    //     status: 401,
    //     message: 'Invalid refresh token',
    //   };
    // }
    const expireValue = '50m';
    // const tokenExpire =
    //   await this.systemParametersService.findbyType('TOKEN_EXPIRATION');
    // if (tokenExpire !== null) {
    //   expireValue = tokenExpire.paramValue;
    // }

    const user = await this.userRepository.findOneBy({ userId: userId });
    if (!user) {
      return {
        status: 404,
        message: 'User not found',
      };
    }

    // Assuming the payload for the new token is similar to the one used in signIn
    const payload = { username: user.username, userId: user.userId };
    const tokenOptions = { expiresIn: expireValue };
    const newAccessToken = await this.jwtService.signAsync(
      payload,
      tokenOptions,
    );

    return {
      status: 0,
      accessToken: newAccessToken,
    };
  }
}
