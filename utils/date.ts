import dayjs from 'dayjs';

export function toMonthYear(date: Date) {
  return dayjs(date).format('MMM YYYY');
}
