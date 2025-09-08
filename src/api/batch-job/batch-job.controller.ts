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

      this.Job_Line_CYH7();

      this.Job_Line_CRC9();
    }
  }

  async Job_Line_CYH6() {
    try {
      this.writeBatchLog('Job_Line_CYH6 started', 'CYH6'); // Log job start

      const result = await this.service.processLineCYH6_sp_AutoStart_CYH6();
      this.writeBatchLog(JSON.stringify(result), 'CYH6'); // Log job completion

      const result2 = await this.service.processLineCYH6_sp_MappedMES_CYH6();
      this.writeBatchLog(JSON.stringify(result2), 'CYH6'); // Log job completion

      const result3 =
        await this.service.processLineCYH6_sp_MappedMES_CYH6_003();
      this.writeBatchLog(JSON.stringify(result3), 'CYH6'); // Log job completion
    } catch (error) {
      this.writeBatchLog('[ERROR] ' + JSON.stringify(error), 'CYH6'); // Log error
    }
  }

  async Job_Line_CYH7() {
    try {
      this.writeBatchLog('Job_Line_CYH7 started', 'CYH7'); // Log job start

      const result = await this.service.processLineCYH7_sp_AutoStart_CYH7();
      this.writeBatchLog(JSON.stringify(result), 'CYH7'); // Log job completion

      const result2 = await this.service.processLineCYH7_sp_MappedMES_CYH7();
      this.writeBatchLog(JSON.stringify(result2), 'CYH7'); // Log job completion

      const result3 =
        await this.service.processLineCYH7_sp_MappedMES_CYH7_003();
      this.writeBatchLog(JSON.stringify(result3), 'CYH7'); // Log job completion
    } catch (error) {
      this.writeBatchLog('[ERROR] ' + JSON.stringify(error), 'CYH7'); // Log error
    }
  }

  async Job_Line_CRC9() {
    try {
      this.writeBatchLog('Job_Line_CRC9 started', 'CRC9'); // Log job start

      const result = await this.service.processLineCRC9_sp_AutoStart_CRC9();
      this.writeBatchLog(JSON.stringify(result), 'CRC9'); // Log job completion

      const result2 = await this.service.processLineCRC9_sp_MappedMES_CRC9();
      this.writeBatchLog(JSON.stringify(result2), 'CRC9'); // Log job completion

      const result3 =
        await this.service.processLineCRC9_sp_MappedMES_CRC9_003();
      this.writeBatchLog(JSON.stringify(result3), 'CRC9'); // Log job completion
    } catch (error) {
      this.writeBatchLog('[ERROR] ' + JSON.stringify(error), 'CRC9'); // Log error
    }
  }

  @Cron('*/5 * * * *') // every 5 minutes
  async Job_handheld_InfoAlert_Toollife() {
    try {
      const result = await this.service.processHandheldInfoAlertToollife();
      this.writeBatchLog(JSON.stringify(result), 'Handheld');
    } catch (error) {
      this.writeBatchLog('[ERROR] ' + JSON.stringify(error), 'Handheld'); // Log error
    }
  }

  @Cron('0 0 1 * * *') // every day at 01:00
  /**
   * Cleans up old log files from the log directory.
   *
   * This method iterates through all subdirectories (representing line folders) within the log directory,
   * identifies log files with names in the 'YYYY-MM-DD.log' format, and deletes those that are older than 30 days.
   * After cleaning, it writes a batch log entry indicating the operation's completion.
   * In case of errors during the process, it logs the error message.
   *
   * @async
   * @returns {Promise<void>} Resolves when the cleanup operation is complete.
   */
  async cleanOldLogs() {
    try {
      const logDir = this.logPath || path.resolve(__dirname, '../../../logs');
      if (!fs.existsSync(logDir)) return;

      // Loop through all line folders
      const lineFolders = await fs.promises.readdir(logDir, {
        withFileTypes: true,
      });
      for (const folder of lineFolders) {
        if (folder.isDirectory()) {
          const folderPath = path.join(logDir, folder.name);
          const files = await fs.promises.readdir(folderPath);
          for (const file of files) {
            if (file.endsWith('.log')) {
              const fileDateStr = file.replace('.log', ''); // 'YYYY-MM-DD'
              if (moment(fileDateStr, 'YYYY-MM-DD', true).isValid()) {
                const fileDate = moment(fileDateStr, 'YYYY-MM-DD');
                if (fileDate.isBefore(moment().subtract(30, 'days'), 'day')) {
                  // Delete file older than 30 days
                  await fs.promises.unlink(path.join(folderPath, file));
                }
              }
            }
          }
        }
      }
      this.writeBatchLog('Cleaned old log files', '_BatchClean');
    } catch (error) {
      this.writeBatchLog(
        `Error cleaning logs: ${error.message}`,
        '_BatchClean',
      );
    }
  }
}
