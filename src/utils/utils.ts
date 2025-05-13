import { DateTime } from 'luxon';
import { QueryFailedError } from 'typeorm';

export const getCurrentDate = () => {
    return DateTime.now().setZone('Asia/Bangkok').toJSDate();
}

export const toLocalDateTime = (d) => {
    return DateTime.fromJSDate(d)
        .setZone('utc', { keepLocalTime: true })
        .toISO();
}

export const minuteToTime = (m) => {
    if (m) {
        const [hh, mm, ss] = m.split(':').map(Number);
        return new Date(0, 0, 0, hh, mm, ss);
    }
    return null;
}

export const getMessageDuplicateError = (error, message) => {
    if (error instanceof QueryFailedError && (error as any).number === 2627) {
        return message;
    }
    return error.message;
}