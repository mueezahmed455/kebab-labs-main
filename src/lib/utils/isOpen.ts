import { BRAND } from '@/lib/data/brand'

const DAY_INDEX = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

export function isOpenNow(): boolean {
  const now = new Date()
  const day = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()

  // Midnight to 12:40 AM — check PREVIOUS day's schedule (the closing time
  // carries into the next calendar day). If the previous day was closed
  // (e.g. Tuesday→Wednesday), this window is also closed.
  if (mins <= 40) {
    const prevDay = day === 0 ? 6 : day - 1
    return BRAND.hours[prevDay].isOpen
  }

  // 4:00 PM (960 mins) to midnight — check today's schedule
  if (mins >= 960) {
    return BRAND.hours[day].isOpen
  }

  return false
}

export function getNextOpenTime(): string | null {
  const now = new Date()
  const day = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()

  if (isOpenNow()) return null

  // Can we open later today?
  if (mins < 960 && BRAND.hours[day].isOpen) {
    return 'Opens today at 4:00 PM'
  }

  // Scan forward up to 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDay = (day + i) % 7
    if (BRAND.hours[nextDay].isOpen) {
      return `Opens ${DAY_INDEX[nextDay]} at 4:00 PM`
    }
  }

  return null
}
