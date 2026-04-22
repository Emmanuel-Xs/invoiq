export function generateId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetters = Array.from({ length: 2 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length)),
  ).join('')
  const randomNumbers = Math.floor(1000 + Math.random() * 9000)
  return `${randomLetters}${randomNumbers}`
}

export function calcPaymentDue(createdAt: string, terms: number): string {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + terms)
  return date.toISOString().split('T')[0]
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}
