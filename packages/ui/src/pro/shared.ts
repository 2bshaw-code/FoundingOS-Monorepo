/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Shared types and helpers for the professional finance, sales and marketing tools.

export type ProRecord = {
  id: string
  backendId?: string
  version?: number
  name: string
  secondary: string
  value: string
  status: string
  owner: string
  dueDate?: string
  email?: string
  phone?: string
  data?: Record<string, unknown>
}

export type ProPatch = { data?: Record<string, unknown>; valuePence?: number | null; status?: string; name?: string }
export type SaveRecord = (patch: ProPatch) => Promise<void>
export type LoadRecords = (workspace: string, module: string) => Promise<ProRecord[]>

export const todayIso = () => new Date().toISOString().slice(0, 10)

export const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export const daysBetween = (fromIso: string, toIso: string) =>
  Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86_400_000)

export const isoDate = (value: unknown): string => {
  if (typeof value !== 'string' || !value) return ''
  const match = /^\d{4}-\d{2}-\d{2}/.exec(value)
  if (match) return match[0]
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? '' : new Date(parsed).toISOString().slice(0, 10)
}

export const penceFrom = (value: unknown) => Math.round((Number(String(value ?? '').replace(/[^0-9.-]/g, '')) || 0) * 100)
export const poundsInput = (pence: number) => (pence / 100).toFixed(2)

export const money = (pence: number) =>
  `${pence < 0 ? '−' : ''}£${(Math.abs(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const shortMoney = (pence: number) => {
  const pounds = Math.abs(pence) / 100
  const sign = pence < 0 ? '−' : ''
  if (pounds >= 1_000_000) return `${sign}£${(pounds / 1_000_000).toFixed(1)}m`
  if (pounds >= 10_000) return `${sign}£${(pounds / 1000).toFixed(1)}k`
  return `${sign}£${Math.round(pounds).toLocaleString('en-GB')}`
}

export const ratio = (part: number, whole: number, digits = 1) => (whole ? `${((part / whole) * 100).toFixed(digits)}%` : '—')

export const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] as string))

// Neutralises spreadsheet formulas so exported files are safe to open in Excel or Sheets.
const csvCell = (value: unknown) => {
  let text = String(value ?? '')
  if (/^[=+\-@\t\r]/.test(text) && !/^-?\d/.test(text)) text = `'${text}`
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function downloadCsv(filename: string, rows: unknown[][]) {
  const blob = new Blob([rows.map((row) => row.map(csvCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const objectAt = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}

export const numberAt = (value: unknown, fallback = 0) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export const textAt = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback)

export type Period = { key: string; label: string; from: string; to: string }

export function reportingPeriods(now = new Date()): Period[] {
  const y = now.getUTCFullYear()
  const m = now.getUTCMonth()
  const iso = (year: number, month: number, day: number) => new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10)
  const quarterStart = Math.floor(m / 3) * 3
  const taxYearStart = now >= new Date(Date.UTC(y, 3, 6)) ? y : y - 1
  return [
    { key: 'this-month', label: 'This month', from: iso(y, m, 1), to: iso(y, m + 1, 0) },
    { key: 'last-month', label: 'Last month', from: iso(y, m - 1, 1), to: iso(y, m, 0) },
    { key: 'this-quarter', label: 'This quarter', from: iso(y, quarterStart, 1), to: iso(y, quarterStart + 3, 0) },
    { key: 'last-quarter', label: 'Last quarter', from: iso(y, quarterStart - 3, 1), to: iso(y, quarterStart, 0) },
    { key: 'this-year', label: 'This calendar year', from: iso(y, 0, 1), to: iso(y, 11, 31) },
    { key: 'tax-year', label: `Tax year ${taxYearStart}/${String(taxYearStart + 1).slice(2)}`, from: iso(taxYearStart, 3, 6), to: iso(taxYearStart + 1, 3, 5) },
    { key: 'last-12', label: 'Last 12 months', from: iso(y, m - 11, 1), to: iso(y, m + 1, 0) },
  ]
}

export const inPeriod = (date: string, period: Pick<Period, 'from' | 'to'>) => Boolean(date) && date >= period.from && date <= period.to

export const monthKey = (date: string) => date.slice(0, 7)
export const monthLabel = (key: string) => new Date(`${key}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' })
export const lastMonths = (count: number, now = new Date()) =>
  Array.from({ length: count }, (_, index) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (count - 1 - index), 1)).toISOString().slice(0, 7))
