import { Controller, Get, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BatchJobService } from './batch-job.service';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { BaseController } from 'src/base.controller';

@Controller('batch-job')
export class BatchJobController extends BaseController {
  private readonly logger = new Logger(BatchJobController.name);
  private dbTime: Date | null = null; // Initialize dbTime to null
  private logPath: string | null = null; // Initialize logPath to null

  constructor(private service: BatchJobService) {
    super();
    try {
      if (process.env.ENV !== 'production') {
        const logDir = path.join(
          process.env.ENV_DEVELOP_DIR,
          'logs',
          'BatchJob',
        );
        this.logPath = logDir;

        this.writeBatchLog('BatchJob started', '_BatchStart'); // Log job start
      } else {
        this.service.getLogPath().then((_logPath) => {
          const logDir = path.join(_logPath, 'BatchJob');
          this.logPath = logDir;
          this.writeBatchLog('BatchJob started', '_BatchStart'); // Log job start
        });
      }
    } catch (error) {
      this.logger.error('Error initializing log path:', error.message);
    }
  }

  @Get('time') // get database time and schedule time
  async getDatabaseTime() {
    const databaseTime = await this.service.getDatabaseTime();

    return {
      databaseTime: databaseTime,
      scheduleTime: this.dbTime,
    };
  }

  // @Cron('* * * * * *') // every second
  async counterDatabaseTime() {
    // if (process.env.ENV !== 'production') {
    //   return;
    // }
    if (
      !this.dbTime ||
      (this.dbTime.getMinutes() % 3 === 0 && this.dbTime.getSeconds() === 0)
    ) {
      const _dbTime = await this.service.getDatabaseTime();
      // console.log('Database time ', this.dbTime);
      // console.log('Database time (sync from DB):', _dbTime);

      this.dbTime = _dbTime;
      return;
    } else {
      // add dbTime 1 second
      this.dbTime.setSeconds(this.dbTime.getSeconds() + 1);
      // console.log('Database time (counter):', this.dbTime);
    }
  }

  private writeBatchLog(message: string, line: string) {
    // Use logPath if available, otherwise fallback to default
    const logDir = this.logPath || path.resolve(__dirname, '../../../logs');
    const lineDir = path.join(logDir, line);
    if (!fs.existsSync(lineDir)) {
      fs.mkdirSync(lineDir, { recursive: true });
    }

    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const dateStr = currentDate.slice(0, 10); // YYYY-MM-DD
    const logFile = path.join(lineDir, `${dateStr}.log`);
    const logMsg = `[${currentDate}] ${message}\n`;
    fs.appendFileSync(logFile, logMsg, { encoding: 'utf8' });
  }

  @Cron('* * * * * *') // every second
  async Jobs() {
    if (process.env.ENV !== 'production') {
      return;
    }
    await this.counterDatabaseTime();

    if (
      this.dbTime &&
      this.dbTime.getMinutes() % 5 === 0 &&
      this.dbTime.getSeconds() === 0
    ) {
      // Run your 5-minute interval logic here
      console.log('Run job at:', this.dbTime);
      this.Job_Line_CYH6();
    }
  }

  Job_Line_CYH6() {
    try {
      this.writeBatchLog('Job_Line_CYH6 started', 'CYH6'); // Log job start
      // Call the processLineCYH6 method from the service
      this.service.processLineCYH6_sp_AutoStart_CYH6().then((result) => {
        this.writeBatchLog(JSON.stringify(result), 'CYH6'); // Log job completion
      });

      this.service.processLineCYH6_sp_MappedMES_CYH6().then((result2) => {
        this.writeBatchLog(JSON.stringify(result2), 'CYH6'); // Log job completion
      });

      this.service.processLineCYH6_sp_MappedMES_CYH6_003().then((result3) => {
        this.writeBatchLog(JSON.stringify(result3), 'CYH6'); // Log job completion
      });
    } catch (error) {
      this.writeBatchLog(error.message, 'CYH6'); // Log job completion
    }
  }
}
