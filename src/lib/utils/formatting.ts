export function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`
}

const UK_PHONE_PATTERNS = [
  { match: /^(\d{5})(\d{6})$/, replace: '$1 $2' },   // 01282 454626
  { match: /^(\d{4})(\d{3})(\d{4})$/, replace: '$1 $2 $3' }, // 0161 123 4567
  { match: /^(\d{3})(\d{3})(\d{5})$/, replace: '$1 $2 $3' }, // 020 7123 45678
]

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\s/g, '')
  for (const { match, replace } of UK_PHONE_PATTERNS) {
    if (match.test(digits)) return digits.replace(match, replace)
  }
  return phone
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
