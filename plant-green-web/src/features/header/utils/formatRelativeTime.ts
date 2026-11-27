export function formatRelativeTime(
  timestamp: string,
  now: Date = new Date(),
  locale = 'en',
): string {
  const time = Date.parse(timestamp)
  if (Number.isNaN(time)) throw new RangeError('Invalid notification timestamp')

  const seconds = Math.round((time - now.getTime()) / 1000)
  const absoluteSeconds = Math.abs(seconds)
  let value: number
  let unit: Intl.RelativeTimeFormatUnit
  if (absoluteSeconds < 60) {
    value = seconds
    unit = 'second'
  } else if (absoluteSeconds < 3600) {
    value = Math.round(seconds / 60)
    unit = 'minute'
  } else if (absoluteSeconds < 86400) {
    value = Math.round(seconds / 3600)
    unit = 'hour'
  } else {
    value = Math.round(seconds / 86400)
    unit = 'day'
  }
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit)
}
