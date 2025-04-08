import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { CommonModule } from './common/common.module';
import * as dotenv from 'dotenv';
import { MenuRouteModule } from './api/menu-route/menu-route.module';
import { MenuModule } from './api/menu/menu.module';
import { PredefineModule } from './api/predefine/predefine.module';
import { DropdownListModule } from './api/dropdown-list/dropdown-list.module';
import { RolePermissionModule } from './api/role-permission/role-permission.module';
import { ApplicationLogModule } from './api/application-log/application-log.module';
import { TankShippingModule } from './api/tank-shipping/tank-shipping.module';
import { FailedManagementModule } from './api/failed-management/failed-management.module';
import { ProductionDailyVolumnRecordModule } from './api/production-daily-volumn-record/production-daily-volumn-record.module';
import { CoSystemParametersModule } from './api/co-system-parameters/co-system-parameters.module';
import { CoConfigReportsModule } from './api/co-config-reports/co-config-reports.module';
import { LineModule } from './api/line/line.module';
import { ProductModule } from './api/product/product.module';
import { MasterIndexModule } from './api/master-index/master-index.module';

dotenv.config(); // Load environment variables from .env file
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        extra: {
          trustServerCertificate: true,
        },
      }),
    }),
    ApplicationLogModule,
    UserModule,
    AuthModule,
    CommonModule,
    CoSystemParametersModule,
    MenuModule,
    MenuRouteModule,
    PredefineModule,
    UserModule,
    DropdownListModule,
    RolePermissionModule,
    TankShippingModule,
    FailedManagementModule,
    ProductionDailyVolumnRecordModule,
    CoSystemParametersModule,
    CoConfigReportsModule,
    LineModule,
    ProductModule,
    MasterIndexModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
