import { DateTime } from 'luxon';

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