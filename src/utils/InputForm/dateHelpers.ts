import dayjs from 'dayjs'

export function disableFutureDates(current: Date) {
  return current && dayjs(current).isAfter(dayjs(), 'day')
}

export function disablePastDates(current: Date) {
  return current && dayjs(current).isBefore(dayjs(), 'day')
}
