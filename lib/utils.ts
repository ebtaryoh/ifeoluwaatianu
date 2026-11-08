import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function formatToWAT(d: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Lagos',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    const parts = formatter.formatToParts(d)
    const month = parts.find((p) => p.type === 'month')?.value || ''
    const day = parts.find((p) => p.type === 'day')?.value || ''
    const year = parts.find((p) => p.type === 'year')?.value || ''
    const hour = parts.find((p) => p.type === 'hour')?.value || ''
    const minute = parts.find((p) => p.type === 'minute')?.value || ''
    const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || ''
    return `${month} ${day}, ${year} · ${hour}:${minute} ${dayPeriod}`
  } catch {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[d.getMonth()]
    const day = d.getDate()
    const year = d.getFullYear()
    let hours = d.getHours()
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    return `${month} ${day}, ${year} · ${hours}:${minutes} ${ampm}`
  }
}

export function formatWishDateTime(dateInput?: string | number | Date, wishId?: string): string {
  // If already formatted with date and time (contains ":" and either "AM", "PM", or "·")
  if (typeof dateInput === 'string' && dateInput.includes(':') && (dateInput.includes('AM') || dateInput.includes('PM'))) {
    return dateInput
  }

  // If wishId or dateInput is a numeric epoch timestamp (e.g. "1794157834613")
  const numId = wishId && /^\d{12,14}$/.test(wishId) ? parseInt(wishId, 10) : null
  const numDate = typeof dateInput === 'string' && /^\d{12,14}$/.test(dateInput) ? parseInt(dateInput, 10) : null
  const timestamp = typeof dateInput === 'number' ? dateInput : (numId || numDate)

  if (timestamp) {
    const d = new Date(timestamp)
    if (!isNaN(d.getTime())) return formatToWAT(d)
  }

  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    return formatToWAT(dateInput)
  }

  if (dateInput === 'Just now') {
    return formatToWAT(new Date())
  }

  if (dateInput && dateInput !== 'November 2026') {
    const parsed = new Date(dateInput)
    if (!isNaN(parsed.getTime())) return formatToWAT(parsed)
    return typeof dateInput === 'string' ? dateInput : String(dateInput)
  }

  // Custom fallback dates for sample initial wishes
  if (wishId === '1') return 'Nov 8, 2026 · 10:30 AM'
  if (wishId === '2') return 'Nov 8, 2026 · 11:45 AM'
  if (wishId === '3') return 'Nov 8, 2026 · 2:15 PM'

  return 'Nov 8, 2026 · 10:30 AM'
}

