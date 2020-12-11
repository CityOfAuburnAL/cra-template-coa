import moment from 'moment';

export const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DISPLAY_FORMAT = 'L';
export const ISO_FORMAT = 'YYYY-MM-DD';

//https://github.com/airbnb/react-dates/blob/2971aabf45841150953c0ba684670ca2c5b50e14/src/utils/isBeforeDay.js
export function isSameDay(a, b) {
    if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
    // Compare least significant, most likely to change units first
    // Moment's isSame clones moment inputs and is a tad slow
    return a.date() === b.date()
      && a.month() === b.month()
      && a.year() === b.year();
  }

export function isBeforeDay(a, b) {
    if (!moment.isMoment(a) || !moment.isMoment(b)) return false;

    const aYear = a.year();
    const aMonth = a.month();

    const bYear = b.year();
    const bMonth = b.month();

    const isSameYear = aYear === bYear;
    const isSameMonth = aMonth === bMonth;

    if (isSameYear && isSameMonth) return a.date() < b.date();
    if (isSameYear) return aMonth < bMonth;
    return aYear < bYear;
}

export function isAfterDay(a, b) {
    if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
    return !isBeforeDay(a, b) && !isSameDay(a, b);
  }

export function isInclusivelyAfterDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b);
}

export function isInclusivelyBeforeDay(a, b) {
    if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
    return !isAfterDay(a, b);
  }

  export function isAfterToday(a) {
      return isAfterDay(a, moment());
  }

  export function isTodayOrAfter(a) {
      return isInclusivelyAfterDay(a, moment());
  }

export function lastMonth() {
    return moment().subtract(1, 'month');
}

export function lastMonthStartEnd() {
  return [new moment().subtract(1, 'months').date(1), new moment().date(0)];
}

export function toISODateString(date, currentFormat) {
  const dateObj = moment.isMoment(date) ? date : toMomentObject(date, currentFormat);
  if (!dateObj) return null;

  // Template strings compiled in strict mode uses concat, which is slow. Since
  // this code is in a hot path and we want it to be as fast as possible, we
  // want to use old-fashioned +.
  // eslint-disable-next-line prefer-template
  return dateObj.year() + '-' + String(dateObj.month() + 1).padStart(2, '0') + '-' + String(dateObj.date()).padStart(2, '0');
}

export function toMomentObject(dateString, customFormat) {
  const dateFormats = customFormat
    ? [customFormat, DISPLAY_FORMAT, ISO_FORMAT]
    : [DISPLAY_FORMAT, ISO_FORMAT];

  const date = moment(dateString, dateFormats, true);
  return date.isValid() ? date.hour(12) : null;
}

export function dateToString(date) {
  return date.toISOString().substring(0, 10)
}

export function firstAndLastOfMonth(y,m) {
  const firstOfMonth = toMomentObject(`${y}-${m.padStart(2, '0')}-01`);
  let nextMonth = firstOfMonth.clone().add(1, 'month');
  return [
    toISODateString(firstOfMonth),
    toISODateString(nextMonth.subtract(1, 'day'))
  ];
}