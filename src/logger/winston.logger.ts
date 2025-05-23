import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as mssql from 'mssql';
import * as path from 'path';
import * as fs from 'fs';
const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

// Custom filter to exclude NestJS start-up messages
const excludeNestJsStart = format((info) => {
  const excludeMessages = [
    'dependencies initialized',
    'Mapped {/api',
    'Controller {/api',
  ];

  if (excludeMessages.some((msg) => (info.message as string).includes(msg))) {
    return false; // Exclude these logs
  }

  return info; // Log everything else
});

const timezoned = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Bangkok',
    hour12: false,
  });
};

// custom log display format
const customFormat = format.combine(
  excludeNestJsStart(),
  format.timestamp({ format: timezoned }),
  format.printf(({ timestamp, level, stack, message }) => {
    return `${timestamp} - [${level.toUpperCase()}] - ${stack || message}`;
  }),
);

const options = {
  file: {
    filename: `logs/error.log`,
    level: 'error',
    format: format.combine(format.timestamp(), format.json()),
  },
  console: {
    level: 'silly',
  },
};

const _createLogger = async () => {
  let logDir = path.join(process.env.ENV_DEVELOP_DIR, 'logs');
  let logDirCombined = path.join(logDir, 'combined', '%DATE%.log');
  let logDirError = path.join(logDir, 'error', '%DATE%-error.log');
  if (process.env.ENV !== 'develop') {
    try {
      await mssql.connect(config);
      const result =
        await mssql.query`SELECT VALUE_EN FROM co_Predefine where Predefine_Group ='ConfigPath' and Predefine_CD = 'LOG'`;
      logDir = result.recordset[0].VALUE_EN;
      if (result.recordset.length > 0) {
        let existsSync = fs.existsSync(logDir);
        if (!existsSync) {
          console.log('Create log directory');
          fs.mkdirSync(logDir, { recursive: true }); // create log directory if not exists
        }
        existsSync = fs.existsSync(logDir);
        if (existsSync) {
          logDirCombined = path.join(logDir, 'combined', '%DATE%.log');
          logDirError = path.join(logDir, 'error', '%DATE%-error.log');
        } else {
          console.error('Log directory not found');
        }
      }
    } catch (error) {
      console.error('Error get log directory from database', error);
    }
  }

  const loggerOption = {
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      customFormat,
    ),
    transports: [
      new transports.Console(options.console),
      new transports.DailyRotateFile({
        filename: logDirCombined,
        format: customFormat, //format.combine(format.timestamp(), format.json()),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
      new transports.DailyRotateFile({
        level: 'error',
        filename: logDirError,
        format: customFormat,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
      ,
    ],
  };
  return await createLogger(loggerOption);
};

export const instance = _createLogger(); // createLogger(instanceLogger);
