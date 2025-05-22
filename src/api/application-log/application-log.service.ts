import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Predefine } from 'src/entity/predefine.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ApplicationLogService {
  private readonly logPath = 'logs';

  constructor(
    private readonly logger: Logger,
    @InjectRepository(Predefine)
    private predefineRepository: Repository<Predefine>,
  ) {}

  async search() {
    let logDir = path.join(process.env.ENV_DEVELOP_DIR, 'logs');
    if (process.env.ENV !== 'develop') {
      const data = await this.predefineRepository.findOne({
        where: { predefineGroup: 'ConfigPath', predefineCd: 'Log' },
      });

      logDir = data.valueEn;
    }

    const directoryPathCombined = path.join(logDir, 'combined');
    const directoryPathError = path.join(logDir, 'error');
    const directoryPathBatchJob = path.join(logDir, 'BatchJob');

    try {
      const filesCombined = await fs.promises.readdir(directoryPathCombined);
      const logFilesCombined = filesCombined
        .filter((file) => file.endsWith('.log'))
        .map((file) => ({
          filename: file,
        }));

      const filesError = await fs.promises.readdir(directoryPathError);
      const logFilesError = filesError
        .filter((file) => file.endsWith('.log'))
        .map((file) => ({
          filename: file,
        }));

      // BatchJob log files, get folder name and file name
      const logFilesBatchJob: Array<{ folders: string; filename: string }> = [];
      if (fs.existsSync(directoryPathBatchJob)) {
        const batchFolders = await fs.promises.readdir(directoryPathBatchJob, {
          withFileTypes: true,
        });
        for (const folder of batchFolders) {
          if (folder.isDirectory()) {
            const folderPath = path.join(directoryPathBatchJob, folder.name);
            const files = await fs.promises.readdir(folderPath);
            files
              .filter((file) => file.endsWith('.log'))
              .forEach((file) => {
                logFilesBatchJob.push({
                  folders: folder.name,
                  filename: file,
                });
              });
          }
        }
      }

      return {
        logCombined: logFilesCombined,
        logError: logFilesError,
        logBatchJob: logFilesBatchJob,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to read directory');
    }
  }

  async getContentLog(filename: string, type: string) {
    const logPath = await this.getLogPath(type, filename);
    try {
      const content = await fs.promises.readFile(logPath, 'utf8');
      return content;
    } catch (error) {
      throw new Error(error.message || 'Failed to read file');
    }
  }

  async getLogPath(logType: string, filename: string): Promise<string> {
    let logDir = path.join(process.env.ENV_DEVELOP_DIR, 'logs');
    if (process.env.ENV !== 'develop') {
      const data = await this.predefineRepository.findOne({
        where: { predefineGroup: 'ConfigPath', predefineCd: 'Log' },
      });

      logDir = data.valueEn;
    }

    let directoryPathSelected = '';

    if (logType === 'BatchJob') {
      const sp = filename.split('|');
      const folderName = sp[0];
      filename = sp[1];
      directoryPathSelected = path.join(logDir, 'BatchJob', folderName);
    } else if (logType === 'error') {
      directoryPathSelected = path.join(logDir, 'error');
    } else {
      directoryPathSelected = path.join(logDir, 'combined');
    }

    return path.join(directoryPathSelected, filename);
  }
}
