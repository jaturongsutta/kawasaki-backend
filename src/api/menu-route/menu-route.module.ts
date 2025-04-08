import { Module } from '@nestjs/common';
import { MenuRouteService } from './menu-route.service';
import { MenuRouteController } from './menu-route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuRoute } from 'src/entity/menu-route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuRoute])],
  providers: [MenuRouteService],
  controllers: [MenuRouteController],
})
export class MenuRouteModule {}
