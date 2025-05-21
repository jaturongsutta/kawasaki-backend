import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BatchJobService } from './batch-job.service';
import * as fs from 'fs';
import * as path from 'path';
@Controller('batch-job')
export class BatchJobController {
  private dbTime: Date | null = null; // Initialize dbTime to null
  private logPath: string | null = null; // Initialize logPath to null

  constructor(private service: BatchJobService) {
    if (process.env.ENV !== 'production') {
      return;
    }
    this.service.getLogPath().then((path) => {
      this.logPath = path;
      console.log('Log path:', this.logPath);
    });
  }

  @Cron('* * * * * *') // every second
  async counterDatabaseTime() {
    if (process.env.ENV !== 'production') {
      return;
    }
    if (
      !this.dbTime ||
      (this.dbTime.getMinutes() % 5 === 0 && this.dbTime.getSeconds() === 30)
    ) {
      const _dbTime = await this.service.getDatabaseTime();
      // console.log('Database time ', this.dbTime);
      // console.log('Database time (sync from DB):', _dbTime);

      this.dbTime = _dbTime;
      return;
    } else {
      // add dbTime 1 second
      this.dbTime.setSeconds(this.dbTime.getSeconds() + 1);
      //   console.log('Database time (counter):', this.dbTime);
    }
  }

  private writeBatchLog(message: string) {
    // Use logPath if available, otherwise fallback to default
    const logDir = this.logPath || path.resolve(__dirname, '../../../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'batch-job.log');
    const logMsg = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(logFile, logMsg, { encoding: 'utf8' });
  }

  @Cron('* * * * * *') // every second
  async Jobs() {
    if (process.env.ENV !== 'production') {
      return;
    }
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
      this.writeBatchLog('Job_Line_CYH6 started'); // Log job start
      // Call the processLineCYH6 method from the service
      this.service.processLineCYH6_sp_AutoStart_CYH6().then((result) => {
        this.writeBatchLog(JSON.stringify(result)); // Log job completion
      });

      this.service.processLineCYH6_sp_MappedMES_CYH6().then((result2) => {
        this.writeBatchLog(JSON.stringify(result2)); // Log job completion
      });

      this.service.processLineCYH6_sp_MappedMES_CYH6_003().then((result3) => {
        this.writeBatchLog(JSON.stringify(result3)); // Log job completion
      });
    } catch (error) {
      this.writeBatchLog(error.message); // Log job completion
    }
  }
}
