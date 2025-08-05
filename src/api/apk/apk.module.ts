import { Module } from '@nestjs/common';
import { ApkController } from './apk.controller';

@Module({
  controllers: [ApkController],
})
export class ApkModule {}
