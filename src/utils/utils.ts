import { DateTime } from 'luxon';
import { QueryFailedError } from 'typeorm';
import * as moment from 'moment';
export const getCurrentDate = () => {
  return DateTime.now().setZone('Asia/Bangkok').toJSDate();
};

export const convertTimeStringToDate = (strTime): Date | null => {
  // if tinme format "08:00" to "08:00:00"
  let ret = null;
  if (strTime) {
    let timeFormat = '';
    if (strTime.length === 5) {
      timeFormat = moment(strTime, 'HH:mm').format('YYYY-MM-DD HH:mm:ss');
    } else if (strTime.length === 8) {
      timeFormat = moment(strTime, 'HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    }
    ret = moment(timeFormat, 'YYYY-MM-DD HH:mm:ss').toDate();
  } else {
    throw new Error('Invalid time format');
  }

  return ret;
};

export const toLocalDateTime = (d) => {
  return DateTime.fromJSDate(d).setZone('utc', { keepLocalTime: true }).toISO();
};

export const minuteToTime = (m) => {
  if (m) {
    const [hh, mm, ss] = m.split(':').map(Number);
    return new Date(0, 0, 0, hh, mm, ss);
  }
  return null;
};

export const getMessageDuplicateError = (error, message) => {
  if (error instanceof QueryFailedError && (error as any).number === 2627) {
    return message;
  }
  return error.message;
};
