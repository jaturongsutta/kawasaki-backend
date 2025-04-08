import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRole } from 'src/entity/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  exports: [TypeOrmModule, UserService],
  controllers: [UserController],
  providers: [UserService, CommonService],
})
export class UserModule {}
