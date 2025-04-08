import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Menu } from 'src/entity/menu.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  exports: [TypeOrmModule],
  controllers: [MenuController],
  providers: [MenuService, CommonService],
})
export class MenuModule {}
