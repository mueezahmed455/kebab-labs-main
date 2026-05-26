import { BUSINESS_CONFIG } from '@/lib/constants'

export function isOpenNow(): boolean {
  const now = new Date()
  const day = now.getDay()
  const hours = BUSINESS_CONFIG.openingHours[day as keyof typeof BUSINESS_CONFIG.openingHours]
  if (!hours.isOpen || !hours.open) return false
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const [openH, openM] = hours.open.split(':').map(Number)
  const [closeH, closeM] = hours.close!.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  let closeMinutes = closeH * 60 + closeM
  if (closeMinutes <= openMinutes) closeMinutes += 1440
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}
