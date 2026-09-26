/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Professional tooling for every operational module (HR, Talent, Logistics, Health, Retail
// operations, Intelligence): a structured form per record plus the analysis a specialist would
// run on the whole list. Pure TypeScript so the web workspaces and the iOS app share it.

export type OpsTone = 'good' | 'watch' | 'risk' | 'info'
export type OpsFieldType = 'text' | 'textarea' | 'date' | 'time' | 'number' | 'money' | 'select' | 'checklist' | 'score'

export type OpsField = {
  key: string
  label: string
  type: OpsFieldType
  options?: string[]
  items?: string[]
  criteria?: string[]
  unit?: string
  placeholder?: string
  hint?: string
  fallback?: 'dueDate' | 'value' | 'owner' | 'name' | 'secondary'
  demo?: [number, number]
}

export type OpsValues = Record<string, unknown>
export type OpsRecordLike = { id: string; name: string; secondary?: string; status: string; owner?: string; dueDate?: string; valuePence?: number | null; data?: Record<string, unknown> | null }
export type OpsRow = { record: OpsRecordLike; v: OpsValues }
export type OpsStat = { label: string; value: string; tone?: OpsTone }
export type OpsTable = { title: string; columns: string[]; rows: string[][]; numeric?: number[] }
export type OpsBars = { title: string; items: Array<{ label: string; value: number; display: string }> }
export type OpsAlert = { text: string; tone: OpsTone; recordId?: string }
export type OpsInsight = { kpis: OpsStat[]; tables: OpsTable[]; bars: OpsBars[]; alerts: OpsAlert[] }
export type OpsContext = { statuses: string[] }

export type OpsSchema = {
  title: string
  intro: string
  fields: OpsField[]
  summary?: (v: OpsValues, record: OpsRecordLike) => OpsStat[]
  insights: (rows: OpsRow[], ctx: OpsContext) => OpsInsight
  letter?: { label: string; build: (v: OpsValues, record: OpsRecordLike) => string }
}

// ── helpers ────────────────────────────────────────────────────────────────
export const opsToday = () => new Date().toISOString().slice(0, 10)
const DAY = 86_400_000
export const daysUntil = (iso: string, from = opsToday()) => (iso ? Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY) : Number.NaN)
export const shiftDate = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10)
export const weekdaysBetween = (from: string, to: string) => {
  if (!from || !to || to < from) return 0
  let count = 0
  for (let day = from; day <= to; day = shiftDate(day, 1)) {
    const weekday = new Date(`${day}T00:00:00Z`).getUTCDay()
    if (weekday !== 0 && weekday !== 6) count += 1
    if (count > 400) break
  }
  return count
}
export const minutesOf = (time: string) => {
  const match = /^(\d{1,2}):(\d{2})/.exec(time || '')
  return match ? Number(match[1]) * 60 + Number(match[2]) : Number.NaN
}
export const shiftHours = (start: string, end: string, breakMins = 0) => {
  const a = minutesOf(start)
  let b = minutesOf(end)
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0
  if (b <= a) b += 24 * 60
  return Math.max(0, (b - a - (Number(breakMins) || 0)) / 60)
}
export const gbp = (pence: number) => `£${(Math.round(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
export const pctText = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : '—')
export const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : Number(value) || 0)
export const str = (value: unknown) => (typeof value === 'string' ? value : value == null ? '' : String(value))
export const list = (value: unknown) => (Array.isArray(value) ? value.map(String) : [])
export const scores = (value: unknown): Record<string, number> => (value && typeof value === 'object' && !Array.isArray(value) ? Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, score]) => [key, num(score)])) : {})
export const avgScore = (value: unknown) => {
  const values = Object.values(scores(value)).filter((score) => score > 0)
  return values.length ? values.reduce((total, score) => total + score, 0) / values.length : 0
}
export const personOf = (row: OpsRow) => str(row.v.person) || row.record.owner || row.record.name
export const emptyInsight = (): OpsInsight => ({ kpis: [], tables: [], bars: [], alerts: [] })
export const niceDate = (iso: string) => (iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '—')

export function countBy(rows: OpsRow[], key: string, title: string): OpsBars {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const label = str(row.v[key])
    if (label) counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return { title, items: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value, display: String(value) })) }
}

// Anything with an expiry or renewal date: what's overdue and what's due soon.
export function expiryInsight(rows: OpsRow[], fields: Array<[key: string, label: string]>, windowDays = 60): OpsInsight {
  const out = emptyInsight()
  const due: Array<{ days: number; row: string[]; id: string }> = []
  let overdue = 0
  let soon = 0
  for (const row of rows) {
    for (const [key, label] of fields) {
      const date = str(row.v[key])
      if (!date) continue
      const days = daysUntil(date)
      if (days < 0) overdue += 1
      else if (days <= 30) soon += 1
      if (days <= windowDays) due.push({ days, id: row.record.id, row: [row.record.name, label, niceDate(date), days < 0 ? `${-days} days overdue` : days === 0 ? 'Today' : `in ${days} days`] })
    }
  }
  due.sort((a, b) => a.days - b.days)
  out.kpis.push({ label: 'Expired / overdue', value: String(overdue), tone: overdue ? 'risk' : 'good' }, { label: 'Due in 30 days', value: String(soon), tone: soon ? 'watch' : 'good' })
  if (due.length) out.tables.push({ title: `Renewals in the next ${windowDays} days`, columns: ['Record', 'What', 'Date', 'When'], rows: due.map((item) => item.row) })
  for (const item of due.filter((entry) => entry.days < 0).slice(0, 3)) out.alerts.push({ text: `${item.row[0]}: ${item.row[1]} expired ${item.row[3].replace(' overdue', ' ago')}`, tone: 'risk', recordId: item.id })
  return out
}

export function checklistProgress(rows: OpsRow[], key: string, items: string[]) {
  const done = rows.reduce((total, row) => total + list(row.v[key]).filter((item) => items.includes(item)).length, 0)
  return { done, total: rows.length * items.length }
}

// Stable pseudo-random numbers so demo workspaces show realistic, repeatable figures.
const hash = (text: string) => {
  let value = 2166136261
  for (let index = 0; index < text.length; index += 1) value = Math.imul(value ^ text.charCodeAt(index), 16777619)
  return (value >>> 0) / 4294967295
}

function demoValue(field: OpsField, seed: string): unknown {
  const r = hash(`${seed}:${field.key}`)
  const [min, max] = field.demo ?? [0, 0]
  switch (field.type) {
    case 'date': return shiftDate(opsToday(), Math.round((field.demo ? min + r * (max - min) : -20 + r * 80)))
    case 'time': { const [h0, h1] = field.demo ?? [7, 10]; const minutes = Math.round((h0 + r * (h1 - h0)) * 4) * 15; return `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}` }
    case 'number': return field.demo ? Math.round(min + r * (max - min)) : undefined
    case 'money': return field.demo ? Math.round((min + r * (max - min))) * 100 : undefined
    case 'select': return field.options?.length ? field.options[Math.floor(r * field.options.length) % field.options.length] : undefined
    case 'checklist': return (field.items ?? []).filter((_, index) => hash(`${seed}:${field.key}:${index}`) < 0.62)
    case 'score': return Object.fromEntries((field.criteria ?? []).map((criterion) => [criterion, 2 + Math.round(hash(`${seed}:${criterion}`) * 3)]))
    default: return undefined
  }
}

export function readOps(record: OpsRecordLike, schema: OpsSchema, demo = false): OpsValues {
  const stored = record.data && typeof record.data.ops === 'object' && record.data.ops && !Array.isArray(record.data.ops) ? record.data.ops as OpsValues : {}
  const values: OpsValues = {}
  for (const field of schema.fields) {
    let value = stored[field.key]
    if (value === undefined || value === '') {
      if (field.fallback === 'dueDate') value = record.dueDate || undefined
      else if (field.fallback === 'value') value = record.valuePence ?? undefined
      else if (field.fallback === 'owner') value = record.owner && !/^unassigned$/i.test(record.owner) ? record.owner : undefined
      else if (field.fallback === 'name') value = record.name
      else if (field.fallback === 'secondary') value = record.secondary || undefined
    }
    if ((value === undefined || value === '') && demo) value = demoValue(field, record.id)
    if (value !== undefined) values[field.key] = value
  }
  return values
}

export const opsPatch = (values: OpsValues, schema: OpsSchema) => {
  const due = schema.fields.find((field) => field.fallback === 'dueDate')
  return { data: { ops: values, ...(due && str(values[due.key]) ? { dueDate: str(values[due.key]) } : {}) } }
}
