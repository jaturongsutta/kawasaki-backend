import { DateTime } from 'luxon';

export const getCurrentDate = () => {
    return DateTime.now().setZone('Asia/Bangkok').toJSDate();
}

export const toLocalDateTime = (d) => {
    return DateTime.fromJSDate(d)
        .setZone('utc', { keepLocalTime: true })
        .toISO();
}
