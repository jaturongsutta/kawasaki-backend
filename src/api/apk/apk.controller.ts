import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('apk')
export class ApkController {
  @Get()
  async downloadApk(@Res() res: Response) {
    const filePath = process.env.APK_PATH || './apk/app.apk';
    console.log(`Attempting to download APK from: ${filePath}`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    return res.download(filePath, path.basename(filePath));
  }
}
