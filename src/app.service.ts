import { Injectable } from '@nestjs/common';
import { getCurrentDate } from './utils/utils';
import * as moment from 'moment';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      newDate: new Date(),
      getCurrentDate: getCurrentDate(),
      getCurrentDate_toISOString: getCurrentDate().toISOString(),
      moment: moment().format('YYYY-MM-DD HH:mm:ss'),
      moment_toISOString: moment().toISOString(),
      moment_utc: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      moment_utc_toISOString: moment().utc().toISOString(),
    };
    // return 'Hello World!';
  }
}
