/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import Link from 'next/link'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

export type BrandMetric = { label: string; value: string; trend?: string; icon?: string; tone?: 'good' | 'watch' | 'risk' }
export type BrandModule = { id: string; label: string; description: string; metrics: BrandMetric[]; actions: string[]; workflow?: string[] }
export type BrandNavigationItem = { label: string; href: string; icon: string; section: string }
export type CRMRecord = { name: string; type: string; stage: string; value: string; nextAction: string }
export type BrandPackage = {
  slug: string
  name: string
  price: string
  description: string
  features: string[]
  benefits: string[]
  audience: string
}
export type BrandConsoleConfig = {
  name: string
  logo: string
  accent: string
  typography: { heading: string; body: string }
  colors: { primary: string; secondary: string; accent: string; background: string; panel: string; text: string; muted: string }
  dashboard: { title: string; subtitle: string; metrics: BrandMetric[]; tableTitle: string; tableHeaders: string[]; tableRows: string[][]; workflows: string[] }
  modules: BrandModule[]
  crm?: { title: string; summary: string; records: CRMRecord[]; pipeline: string[]; tasks: string[] }
  navigation: BrandNavigationItem[]
  quickActions: string[]
  settings: string[]
}

type DataField = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'file'
  options?: string[]
}

type DataRow = {
  id: string
  values: Record<string, string>
}

type WorkbenchProps = {
  title: string
  description: string
  fields: DataField[]
  rows: DataRow[]
  cards: Array<{ label: string; value: string; trend?: string; icon?: string }>
  accentStyle: CSSProperties
  pageSize?: number
  emptyCopy?: string
}

function parseMetricValue(value: string) {
  const match = value.trim().match(/^([^0-9+-]*)([+-]?[0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/)
  if (!match) return null

  const [, prefix, rawValue, suffix] = match
  const numeric = Number(rawValue.replaceAll(',', ''))
  if (!Number.isFinite(numeric)) return null

  const decimalPart = rawValue.split('.')[1] ?? ''
  return { prefix, numeric, suffix, decimals: decimalPart.length }
}

function formatMetricValue(value: number, metric: NonNullable<ReturnType<typeof parseMetricValue>>) {
  const fixed = metric.decimals > 0 ? value.toFixed(metric.decimals) : Math.round(value).toString()
  const [whole, fraction] = fixed.split('.')
  return `${metric.prefix}${Number(whole).toLocaleString('en-US')}${fraction ? `.${fraction}` : ''}${metric.suffix}`
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle - 90) * (Math.PI / 180)
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? '1' : '0'
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

function gaugeTarget(metric: NonNullable<ReturnType<typeof parseMetricValue>>, index: number) {
  if (metric.suffix.includes('%')) return clamp(metric.numeric, 8, 100)
  if (metric.suffix.toLowerCase().includes('k')) return clamp(metric.numeric * 4, 18, 100)
  if (metric.suffix.toLowerCase().includes('m')) return clamp(metric.numeric * 8, 25, 100)
  if (metric.numeric >= 1000) return clamp(metric.numeric / 15, 20, 100)
  return clamp(metric.numeric * 9 + index * 7, 18, 96)
}

function gaugeGeometry() {
  return { startAngle: 180, endAngle: 0, strokeWidth: 12, innerStrokeWidth: 8, outerStrokeWidth: 18, dual: false, full: false }
}

function GaugeChart({ metric, index, accent }: { metric: BrandMetric; index: number; accent: string }) {
  const parsed = useMemo(() => parseMetricValue(metric.value), [metric.value])
  const target = useMemo(() => (parsed ? gaugeTarget(parsed, index) : 0), [parsed, index])
  const [progress, setProgress] = useState(0)
  const instanceId = useId().replaceAll(':', '')
  const geometry = gaugeGeometry()

  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const duration = 900
    const from = 0

    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - elapsed) ** 3
      setProgress(from + (target - from) * eased)
      if (elapsed < 1) frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [target])

  const centerText = `${Math.round(progress)}%`
  const arcPath = geometry.full
    ? undefined
    : describeArc(100, 100, 72, geometry.startAngle, geometry.endAngle)
  const dash = `${progress} 100`

  return (
    <div className="gauge-shell">
      <svg className="gauge-svg" viewBox="0 0 200 200" role="img" aria-label={`${metric.label} gauge`}>
        <defs>
          <linearGradient id={`gauge-${instanceId}-glow`} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <circle
        className="gauge-track"
        cx="100"
        cy="100"
        r={72}
        fill="none"
        strokeWidth={geometry.outerStrokeWidth}
        strokeLinecap="round"
        opacity="0.22"
        />
        <path
        className="gauge-progress"
        d={arcPath}
        fill="none"
        stroke={`url(#gauge-${instanceId}-glow)`}
        strokeWidth={geometry.strokeWidth}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={dash}
        />
      </svg>
      <div className="gauge-copy">
        <strong><MetricOdometer value={centerText} /></strong>
        <span>{metric.label}</span>
      </div>
      <div className="gauge-halo" aria-hidden="true" />
    </div>
  )
}

function MetricOdometer({ value }: { value: string }) {
  const parsed = useMemo(() => parseMetricValue(value), [value])
  const [displayValue, setDisplayValue] = useState(() => parsed?.numeric ?? 0)
  const currentValueRef = useRef(displayValue)

  useEffect(() => {
    if (!parsed) return

    let frameId = 0
    const from = currentValueRef.current
    const to = parsed.numeric
    const duration = 900
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      const nextValue = from + (to - from) * eased
      currentValueRef.current = nextValue
      setDisplayValue(nextValue)
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [parsed])

  return (
    <span className="odometer metric-odometer" aria-label={value}>
      {parsed ? formatMetricValue(displayValue, parsed) : value}
    </span>
  )
}

function consoleTitle(config: BrandConsoleConfig) {
  switch (config.name) {
    case 'FoundRetail':
      return 'Retail Manager Console'
    case 'FoundMeat':
      return 'Meat Operations Console'
    case 'FoundThat':
      return 'IT Command Console'
    case 'FoundTalent':
      return 'Talent Command Console'
    case 'FoundCrypto':
      return 'Crypto Command Console'
    default:
      return `${config.name} Console`
  }
}

function consoleStyle(config: BrandConsoleConfig): CSSProperties {
  return {
    '--accent': config.colors.accent,
  } as CSSProperties
}

function moduleHref(moduleId: string) {
  return `/modules/${moduleId.toLowerCase().replaceAll(' ', '-')}`
}

function seedDraft(fields: DataField[]) {
  return Object.fromEntries(fields.map((field) => [field.key, ''])) as Record<string, string>
}

function cloneRows(rows: DataRow[]) {
  return rows.map((row) => ({ id: row.id, values: { ...row.values } }))
}

function makeRows(prefix: string, items: string[], fields: DataField[]) {
  return items.map((item, index) => ({
    id: `${prefix}-${index + 1}`,
    values: fields.reduce<Record<string, string>>((acc, field) => {
      const value = field.key === 'name'
        ? item
        : field.key === 'type'
          ? item
          : field.key === 'status'
            ? ['Active', 'Pending', 'Review'][index % 3]
            : field.key === 'owner'
              ? ['Ava', 'Noah', 'Mia', 'Zoe'][index % 4]
              : field.key === 'category'
                ? ['Core', 'Premium', 'Growth'][index % 3]
                : field.key === 'price'
                  ? ['£19', '£29', '£49', '£99'][index % 4]
                  : field.key === 'stock'
                    ? ['48', '22', '14', '6'][index % 4]
                    : field.key === 'supplier'
                      ? ['North Farm', 'Prime Supply', 'Harbour Group', 'Local Line'][index % 4]
                      : field.key === 'notes'
                        ? `${item} note`
                        : field.key === 'description'
                          ? `${item} description`
                          : field.key === 'pipeline'
                            ? ['Qualified', 'Active', 'Late stage', 'Review'][index % 4]
                            : field.key === 'value'
                              ? ['£3.2k', '£4.8k', '£8.5k', '£12.1k'][index % 4]
                              : field.key === 'nextAction'
                                ? ['Review', 'Follow up', 'Approve', 'Escalate'][index % 4]
                                : field.key === 'stage'
                                  ? ['New', 'Working', 'Blocked', 'Won'][index % 4]
                                  : `${item} ${field.label}`.trim()
      acc[field.key] = value
      return acc
    }, {}),
  }))
}

function workbenchFilterOptions(rows: DataRow[], fields: DataField[]) {
  const filterField = fields.find((field) => field.key === 'status' || field.key === 'category' || field.type === 'select')
  const options = filterField ? Array.from(new Set(rows.map((row) => row.values[filterField.key]).filter(Boolean))) : []
  return { filterField, options }
}

function DataWorkbench({ title, description, fields, rows, cards, accentStyle, pageSize = 4, emptyCopy = 'No records yet.' }: WorkbenchProps) {
  const [records, setRecords] = useState<DataRow[]>(() => cloneRows(rows))
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Record<string, string>>(() => seedDraft(fields))

  const { filterField, options } = useMemo(() => workbenchFilterOptions(records, fields), [records, fields])

  useEffect(() => {
    setPage(1)
  }, [query, filter])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return records.filter((row) => {
      const matchesSearch = q.length === 0 || Object.values(row.values).some((value) => value.toLowerCase().includes(q))
      const matchesFilter = filter === 'all' || (filterField ? row.values[filterField.key] === filter : true)
      return matchesSearch && matchesFilter
    })
  }, [records, query, filter, filterField])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const activePage = Math.min(page, pageCount)
  const visible = filtered.slice((activePage - 1) * pageSize, activePage * pageSize)

  const beginCreate = () => {
    setEditingId(null)
    setDraft(seedDraft(fields))
  }

  const beginEdit = (row: DataRow) => {
    setEditingId(row.id)
    setDraft({ ...seedDraft(fields), ...row.values })
  }

  const saveRow = () => {
    const next = draft
    const record: DataRow = { id: editingId ?? `${title.toLowerCase().replaceAll(' ', '-')}-${Date.now()}`, values: { ...next } }
    setRecords((current) => {
      if (editingId) return current.map((row) => (row.id === editingId ? record : row))
      return [record, ...current]
    })
    beginCreate()
  }

  const removeRow = (id: string) => {
    setRecords((current) => current.filter((row) => row.id !== id))
    if (editingId === id) beginCreate()
  }

  const summaryCards = cards.length > 0 ? cards : [
    { label: 'Records', value: String(records.length), trend: 'Live' },
    { label: 'Visible', value: String(visible.length), trend: 'Filtered' },
  ]

  return (
    <section className="manager-shell" style={accentStyle}>
      <header className="module-header">
        <p>{title}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </header>

      <div className="kpi-grid">
        {summaryCards.map((card) => (
          <article key={card.label} className="dashboard-card">
            <span>{card.icon ?? '◌'} {card.label}</span>
            <strong>{card.value}</strong>
            {card.trend && <small>{card.trend}</small>}
          </article>
        ))}
      </div>

      <div className="module-card-grid">
        <article className="panel">
          <h2>{editingId ? `Edit ${title}` : `Create ${title}`}</h2>
          <div className="manager-form">
            {fields.map((field) => (
              <label key={field.key} className="manager-field">
                <span>{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    value={draft[field.key] ?? ''}
                    onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                    rows={4}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={draft[field.key] ?? ''}
                    onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                  >
                    <option value="">Select</option>
                    {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : field.type === 'file' ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.files?.[0]?.name ?? '' }))}
                    />
                    <small>{draft[field.key] || 'No image selected'}</small>
                  </>
                ) : (
                  <input
                    type={field.type ?? 'text'}
                    value={draft[field.key] ?? ''}
                    onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="action-list">
            <button type="button" onClick={saveRow}>{editingId ? 'Save changes' : 'Create new'}</button>
            <button type="button" onClick={beginCreate}>Clear</button>
          </div>
        </article>

        <article className="panel">
          <h2>Search and filters</h2>
          <div className="manager-toolbar">
            <input
              className="input"
              placeholder={`Search ${title.toLowerCase()}`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {filterField && (
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">All {filterField.label}</option>
                {options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            )}
          </div>
          <div className="manager-empty">{filtered.length === 0 ? emptyCopy : `${filtered.length} records ready.`}</div>
        </article>
      </div>

      <div className="panel">
        <table className="manager-table">
          <thead>
            <tr>
              {fields.map((field) => <th key={field.key}>{field.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id}>
                {fields.map((field) => <td key={field.key}>{row.values[field.key] || '—'}</td>)}
                <td>
                  <div className="action-list">
                    <button type="button" onClick={() => beginEdit(row)}>Edit</button>
                    <button type="button" onClick={() => removeRow(row.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="manager-pagination">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={activePage === 1}>Previous</button>
          <span>Page {activePage} of {pageCount}</span>
          <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={activePage === pageCount}>Next</button>
        </div>
      </div>
    </section>
  )
}

function consoleModules(config: BrandConsoleConfig) {
  const base = config.modules.map((module) => ({
    label: module.label,
    href: moduleHref(module.id),
    icon: '▣',
    summary: module.description,
  }))

  if (config.name === 'FoundMeat' && !base.some((module) => module.href === '/modules/products')) {
    base.push({ label: 'Products', href: '/modules/products', icon: '◍', summary: 'Product management and stock control' })
  }

  return base
}

function bobLabel(config: BrandConsoleConfig) {
  switch (config.name) {
    case 'FoundRetail':
      return 'Retail Manager Console'
    case 'FoundMeat':
      return 'Meat Operations Console'
    case 'FoundThat':
      return 'IT Command Console'
    case 'FoundTalent':
      return 'Talent Command Console'
    case 'FoundCrypto':
      return 'Crypto Command Console'
    default:
      return `${config.name} Console`
  }
}

export function KPIWidget({ metric, index = 0 }: { metric: BrandMetric; index?: number }) {
  return (
    <article className={`dashboard-card ${metric.tone ?? 'good'}`}>
      <GaugeChart metric={metric} index={index} accent="var(--accent)" />
      {metric.trend && <small>{metric.trend}</small>}
    </article>
  )
}

export function DashboardCard({ metric }: { metric: BrandMetric }) {
  return <KPIWidget metric={metric} />
}

export function ModuleHeader({ config, title, description }: { config: BrandConsoleConfig; title: string; description: string }) {
  return <header className="module-header header-premium" style={consoleStyle(config)}><p>{bobLabel(config)}</p><h1>{title}</h1><span>{description}</span></header>
}

export function BrandDashboard({ config }: { config: BrandConsoleConfig }) {
  const crm = config.crm ?? defaultCRM(config)
  const moduleCards = consoleModules(config)
  const accentStyle = consoleStyle(config)
  return (
    <section className="console-page" style={accentStyle}>
      <ModuleHeader config={config} title={config.dashboard.title} description={config.dashboard.subtitle} />

      <div className="kpi-grid">
        {config.dashboard.metrics.map((metric, index) => <KPIWidget key={metric.label} metric={metric} index={index} />)}
      </div>

      <div className="module-card-grid">
        {moduleCards.map((module, index) => (
          <Link key={module.href} className="module-card card-premium" href={module.href}>
            <div className="module-card-top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{module.label}</strong>
            </div>
            <p>{module.summary}</p>
            <div className="module-card-meta">
              <small>Open module</small>
              <small>Live workflow</small>
            </div>
          </Link>
        ))}
      </div>

      <div className="console-grid">
        <article className="panel panel-premium wide">
          <h2>{config.dashboard.tableTitle}</h2>
          <table>
            <thead><tr>{config.dashboard.tableHeaders.map((header) => <th key={header}>{header}</th>)}</tr></thead>
            <tbody>{config.dashboard.tableRows.map((row) => <tr key={row.join('-')}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </article>
        <article className="panel panel-premium">
          <h2>Quick actions</h2>
          <div className="action-list">{config.quickActions.map((action) => <button key={action} type="button" className="btn-premium">{action}</button>)}</div>
        </article>
        <article className="panel panel-premium">
          <h2>CRM summary</h2>
          <p>{crm.summary}</p>
          <ul>{crm.pipeline.map((stage) => <li key={stage}>{stage}</li>)}</ul>
        </article>
        <article className="panel panel-premium">
          <h2>Active workflows</h2>
          <ul>{config.dashboard.workflows.map((workflow) => <li key={workflow}>{workflow}</li>)}</ul>
        </article>
      </div>
    </section>
  )
}

function extensionGroups(config: BrandConsoleConfig) {
  const shared = [
    {
      key: 'contacts',
      title: 'Contacts',
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type', type: 'select', options: ['Lead', 'Customer', 'Partner', 'Vendor'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Pending', 'Review', 'Closed'] },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ] satisfies DataField[],
      rows: makeRows('contact', config.crm?.records.map((record) => record.name) ?? config.dashboard.tableRows.map((row) => row[0] ?? 'Contact'), [
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Notes' },
      ]),
    },
    {
      key: 'companies',
      title: 'Companies',
      fields: [
        { key: 'name', label: 'Company' },
        { key: 'type', label: 'Segment', type: 'select', options: ['SMB', 'Mid-market', 'Enterprise'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Renewal', 'Review', 'On hold'] },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ] satisfies DataField[],
      rows: makeRows('company', ['North Group', 'Harbour Ltd', 'Summit Co', 'Bluebird'], [
        { key: 'name', label: 'Company' },
        { key: 'type', label: 'Segment' },
        { key: 'status', label: 'Status' },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Notes' },
      ]),
    },
    {
      key: 'deals',
      title: 'Deals',
      fields: [
        { key: 'name', label: 'Deal' },
        { key: 'stage', label: 'Stage', type: 'select', options: ['Discovery', 'Qualified', 'Proposal', 'Won', 'Lost'] },
        { key: 'value', label: 'Value' },
        { key: 'owner', label: 'Owner' },
        { key: 'nextAction', label: 'Next action', type: 'textarea' },
      ] satisfies DataField[],
      rows: makeRows('deal', ['Expansion', 'Upsell', 'New logo', 'Renewal'], [
        { key: 'name', label: 'Deal' },
        { key: 'stage', label: 'Stage' },
        { key: 'value', label: 'Value' },
        { key: 'owner', label: 'Owner' },
        { key: 'nextAction', label: 'Next action' },
      ]),
    },
    {
      key: 'pipeline',
      title: 'Pipeline',
      fields: [
        { key: 'name', label: 'Item' },
        { key: 'stage', label: 'Stage', type: 'select', options: ['New', 'Working', 'Risk', 'Complete'] },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ] satisfies DataField[],
      rows: makeRows('pipeline', config.crm?.pipeline ?? ['New contact', 'Qualified', 'Active workflow', 'Commercial review'], [
        { key: 'name', label: 'Item' },
        { key: 'stage', label: 'Stage' },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Notes' },
      ]),
    },
    {
      key: 'notes',
      title: 'Notes',
      fields: [
        { key: 'name', label: 'Note title' },
        { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Pinned', 'Done'] },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Note body', type: 'textarea' },
      ] satisfies DataField[],
      rows: makeRows('note', ['Call summary', 'Follow-up', 'Pricing note', 'Support note'], [
        { key: 'name', label: 'Note title' },
        { key: 'status', label: 'Status' },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Note body' },
      ]),
    },
    {
      key: 'tasks',
      title: 'Tasks',
      fields: [
        { key: 'name', label: 'Task' },
        { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Working', 'Waiting', 'Done'] },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ] satisfies DataField[],
      rows: makeRows('task', config.crm?.tasks ?? config.quickActions, [
        { key: 'name', label: 'Task' },
        { key: 'status', label: 'Status' },
        { key: 'owner', label: 'Owner' },
        { key: 'notes', label: 'Notes' },
      ]),
    },
    {
      key: 'activity',
      title: 'Activity timeline',
      fields: [
        { key: 'name', label: 'Event' },
        { key: 'status', label: 'Outcome', type: 'select', options: ['Success', 'Pending', 'Alert'] },
        { key: 'owner', label: 'Actor' },
        { key: 'notes', label: 'Details', type: 'textarea' },
      ] satisfies DataField[],
      rows: makeRows('activity', [`${config.name} workspace opened`, 'Subscription checked', 'Module permissions refreshed', 'FoundAI reviewed context'], [
        { key: 'name', label: 'Event' },
        { key: 'status', label: 'Outcome' },
        { key: 'owner', label: 'Actor' },
        { key: 'notes', label: 'Details' },
      ]),
    },
  ]

  const byBrand: Record<string, Array<{ key: string; title: string; fields: DataField[]; rows: DataRow[] }>> = {
    FoundRetail: [
      {
        key: 'customers',
        title: 'Customers',
        fields: [
          { key: 'name', label: 'Customer' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'New', 'Risk'] },
          { key: 'owner', label: 'Store owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('retail-customer', ['Ava Foods', 'Metro Market', 'North Corner', 'Bright Buy'], [
          { key: 'name', label: 'Customer' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Store owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'suppliers',
        title: 'Suppliers',
        fields: [
          { key: 'name', label: 'Supplier' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Waiting', 'Risk'] },
          { key: 'owner', label: 'Buyer' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('retail-supplier', ['North Farm', 'Prime Supply', 'Urban Source', 'Local Line'], [
          { key: 'name', label: 'Supplier' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Buyer' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'stores',
        title: 'Stores',
        fields: [
          { key: 'name', label: 'Store' },
          { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Busy', 'Needs stock'] },
          { key: 'owner', label: 'Manager' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('retail-store', ['Manchester', 'Leeds', 'Bristol', 'Cardiff'], [
          { key: 'name', label: 'Store' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Manager' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
    ],
    FoundMeat: [
      {
        key: 'farms',
        title: 'Farms',
        fields: [
          { key: 'name', label: 'Farm' },
          { key: 'status', label: 'Status', type: 'select', options: ['Approved', 'Review', 'Hold'] },
          { key: 'owner', label: 'Contact' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('meat-farm', ['North Farm', 'Hill Butchers', 'Prime Pastures', 'Green Acre'], [
          { key: 'name', label: 'Farm' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Contact' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'processors',
        title: 'Processors',
        fields: [
          { key: 'name', label: 'Processor' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Audit', 'Hold'] },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('meat-processor', ['Cold Chain Co', 'Prime Cut', 'West Pack', 'Fresh Flow'], [
          { key: 'name', label: 'Processor' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'logistics',
        title: 'Logistics partners',
        fields: [
          { key: 'name', label: 'Partner' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Delayed', 'Review'] },
          { key: 'owner', label: 'Coordinator' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('meat-logistics', ['Route 1', 'Route 2', 'Route 3', 'Route 4'], [
          { key: 'name', label: 'Partner' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Coordinator' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'products',
        title: 'Products',
        fields: [
          { key: 'name', label: 'Product' },
          { key: 'category', label: 'Category', type: 'select', options: ['Fresh', 'Frozen', 'Prepared'] },
          { key: 'price', label: 'Price' },
          { key: 'stock', label: 'Stock' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'image', label: 'Product image', type: 'file' },
        ],
        rows: makeRows('meat-product', ['Ribeye', 'Brisket', 'Sirloin', 'Pork Belly'], [
          { key: 'name', label: 'Product' },
          { key: 'category', label: 'Category' },
          { key: 'price', label: 'Price' },
          { key: 'stock', label: 'Stock' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'description', label: 'Description' },
          { key: 'image', label: 'Product image' },
        ]),
      },
    ],
    FoundThat: [
      {
        key: 'clients',
        title: 'Clients',
        fields: [
          { key: 'name', label: 'Client' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Paused', 'Alert'] },
          { key: 'owner', label: 'Account owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('it-client', ['North Systems', 'Metro Tech', 'Blue Signal', 'Civic Link'], [
          { key: 'name', label: 'Client' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Account owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'systems',
        title: 'Systems',
        fields: [
          { key: 'name', label: 'System' },
          { key: 'status', label: 'Status', type: 'select', options: ['Healthy', 'Warning', 'Down'] },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('it-system', ['API Gateway', 'CRM Sync', 'Data Jobs', 'Asset Monitor'], [
          { key: 'name', label: 'System' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'integrations',
        title: 'Integrations',
        fields: [
          { key: 'name', label: 'Integration' },
          { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Queued', 'Review'] },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('it-integration', ['Slack', 'Email', 'Warehouse', 'BI'], [
          { key: 'name', label: 'Integration' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
    ],
    FoundTalent: [
      {
        key: 'candidates',
        title: 'Candidates',
        fields: [
          { key: 'name', label: 'Candidate' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Screening', 'Interview', 'Offer'] },
          { key: 'owner', label: 'Recruiter' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('talent-candidate', ['Ava Chen', 'Noah Patel', 'Mia Jones', 'Leo Brown'], [
          { key: 'name', label: 'Candidate' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Recruiter' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'employers',
        title: 'Employers',
        fields: [
          { key: 'name', label: 'Employer' },
          { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Paused', 'Review'] },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('talent-employer', ['Retail Co', 'Founders Ltd', 'Studio Group', 'Market PLC'], [
          { key: 'name', label: 'Employer' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'jobs',
        title: 'Jobs',
        fields: [
          { key: 'name', label: 'Job' },
          { key: 'status', label: 'Status', type: 'select', options: ['Live', 'On hold', 'Filled'] },
          { key: 'owner', label: 'Hiring manager' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('talent-job', ['Store Manager', 'Data Analyst', 'Recruiter', 'Ops Lead'], [
          { key: 'name', label: 'Job' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Hiring manager' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'pipeline',
        title: 'Recruiter pipeline',
        fields: [
          { key: 'name', label: 'Stage' },
          { key: 'status', label: 'Status', type: 'select', options: ['Healthy', 'At risk', 'Blocked'] },
          { key: 'owner', label: 'Recruiter' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('talent-pipeline', ['Sourcing', 'Screening', 'Interviewing', 'Offer'], [
          { key: 'name', label: 'Stage' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Recruiter' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'portal',
        title: 'Applicant portal',
        fields: [
          { key: 'name', label: 'Applicant' },
          { key: 'status', label: 'Status', type: 'select', options: ['Submitted', 'Viewed', 'Interview', 'Offer'] },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('talent-applicant', ['Anna', 'Josh', 'Priya', 'Sam'], [
          { key: 'name', label: 'Applicant' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'intelligence',
        title: 'Workforce intelligence',
        fields: [
          { key: 'name', label: 'Insight' },
          { key: 'status', label: 'Status', type: 'select', options: ['Good', 'Watch', 'Risk'] },
          { key: 'owner', label: 'Analyst' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('talent-intel', ['Demand', 'Conversion', 'Response', 'Hiring speed'], [
          { key: 'name', label: 'Insight' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Analyst' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
    ],
    FoundCrypto: [
      {
        key: 'wallets',
        title: 'Wallets',
        fields: [
          { key: 'name', label: 'Wallet' },
          { key: 'status', label: 'Status', type: 'select', options: ['Connected', 'Watch', 'Review'] },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('crypto-wallet', ['Main treasury', 'Hot wallet', 'Vault', 'Trading desk'], [
          { key: 'name', label: 'Wallet' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'exchanges',
        title: 'Exchanges',
        fields: [
          { key: 'name', label: 'Exchange' },
          { key: 'status', label: 'Status', type: 'select', options: ['Live', 'Watch', 'Blocked'] },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('crypto-exchange', ['Binance', 'Coinbase', 'Kraken', 'Bybit'], [
          { key: 'name', label: 'Exchange' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'triggers',
        title: 'Triggers',
        fields: [
          { key: 'name', label: 'Trigger' },
          { key: 'status', label: 'Status', type: 'select', options: ['Ready', 'Queued', 'Review'] },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('crypto-trigger', ['Price breakout', 'Volatility alert', 'Risk guard', 'Momentum watch'], [
          { key: 'name', label: 'Trigger' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
      {
        key: 'portfolio',
        title: 'Portfolio intelligence',
        fields: [
          { key: 'name', label: 'Signal' },
          { key: 'stage', label: 'State', type: 'select', options: ['Bullish', 'Neutral', 'Risk'] },
          { key: 'value', label: 'Exposure' },
          { key: 'owner', label: 'Analyst' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
        rows: makeRows('crypto-portfolio', ['BTC', 'ETH', 'SOL', 'ARB'], [
          { key: 'name', label: 'Signal' },
          { key: 'stage', label: 'State' },
          { key: 'value', label: 'Exposure' },
          { key: 'owner', label: 'Analyst' },
          { key: 'notes', label: 'Notes' },
        ]),
      },
    ],
  }

  return [...shared, ...(byBrand[config.name] ?? [])]
}

export function defaultCRM(config: BrandConsoleConfig) {
  return {
    title: `${config.name} CRM`,
    summary: `${config.name} relationship pipeline across contacts, companies, deals, notes, tasks, and activity.`,
    records: config.dashboard.tableRows.slice(0, 4).map((row, index) => ({
      name: row[0] ?? `Record ${index + 1}`,
      type: config.modules[index % config.modules.length]?.label ?? 'Account',
      stage: row[1] ?? 'Active',
      value: row[2] ?? 'Tracked',
      nextAction: config.quickActions[index % config.quickActions.length] ?? 'Follow up',
    })),
    pipeline: ['New contact', 'Qualified', 'Active workflow', 'Commercial review'],
    tasks: config.quickActions,
  }
}

function CRMBoardSection({ title, fields, rows, accentStyle, description }: { title: string; fields: DataField[]; rows: DataRow[]; accentStyle: CSSProperties; description: string }) {
  return <DataWorkbench title={title} description={description} fields={fields} rows={rows} cards={[{ label: 'Records', value: String(rows.length), trend: 'Live' }]} accentStyle={accentStyle} pageSize={5} />
}

export function BrandModulePage({ config, moduleId }: { config: BrandConsoleConfig; moduleId: string }) {
  const module = config.modules.find((item) => item.id === moduleId) ?? { id: moduleId, label: `Module: ${moduleId}`, description: 'This module is active.', metrics: [], actions: ['Review activity', 'Configure module'] }
  const accentStyle = consoleStyle(config)

  if (module.id === 'products') {
    const productFields: DataField[] = [
      { key: 'name', label: 'Product' },
      { key: 'category', label: 'Category', type: 'select', options: ['Fresh', 'Frozen', 'Prepared', 'Core'] },
      { key: 'price', label: 'Price' },
      { key: 'stock', label: 'Stock' },
      { key: 'supplier', label: 'Supplier' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Product image', type: 'file' },
    ]
    return (
      <DataWorkbench
        title="Product management"
        description="Create products, upload pictures, update pricing, manage stock, and keep suppliers and inventory in one place."
        fields={productFields}
        rows={makeRows('products', ['Ribeye', 'Brisket', 'Sirloin', 'Pork Belly'], productFields)}
        cards={[
          { label: 'Products', value: '4', trend: 'Live', icon: '◍' },
          { label: 'Low stock', value: '2', trend: 'Needs review', icon: '!' },
          { label: 'Suppliers', value: '4', trend: 'Ready', icon: '▣' },
        ]}
        accentStyle={accentStyle}
        pageSize={4}
        emptyCopy="Add your first product to start managing the catalog."
      />
    )
  }

  const fields: DataField[] = [
    { key: 'name', label: 'Item' },
    { key: 'type', label: 'Type', type: 'select', options: ['Core', 'Workflow', 'Alert', 'Record'] },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Pending', 'Review', 'Done'] },
    { key: 'owner', label: 'Owner' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ]
  const rows = makeRows(module.id, module.actions.length > 0 ? module.actions : [module.label], fields)

  return (
    <DataWorkbench
      title={module.label}
      description={module.description}
      fields={fields}
      rows={rows}
      cards={[
        { label: 'Actions', value: String(module.actions.length), trend: 'Ready', icon: '▦' },
        { label: 'Metrics', value: String(module.metrics.length), trend: 'Live', icon: '◌' },
        { label: 'Workflow steps', value: String((module.workflow ?? []).length || 3), trend: 'Guided', icon: '◆' },
      ]}
      accentStyle={accentStyle}
      pageSize={5}
      emptyCopy={`No ${module.label.toLowerCase()} records yet.`}
    />
  )
}

export function BrandSettingsPage({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  return (
    <section className="console-page" style={accentStyle}>
      <ModuleHeader config={config} title="Settings" description={`${config.name} configuration, permissions, appearance, CRM, and module controls.`} />
      <div className="settings-grid">
        {config.settings.map((setting) => (
          <article key={setting} className="panel panel-premium">
            <h2>{setting}</h2>
            <p>{setting} can be configured here while authentication is disabled.</p>
            <label><span>Enabled</span><input type="checkbox" defaultChecked /></label>
          </article>
        ))}
      </div>
      <div className="panel panel-premium color-preview">
        <h2>Brand colors</h2>
        <span style={{ background: config.colors.primary }}>Primary</span>
        <span style={{ background: config.colors.secondary }}>Secondary</span>
        <span style={{ background: config.colors.accent }}>Accent</span>
      </div>
    </section>
  )
}

export function CRMBoard({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const crm = config.crm ?? defaultCRM(config)
  const sections = extensionGroups(config)
  const [activeSection, setActiveSection] = useState(sections[0]?.key ?? 'contacts')

  const current = sections.find((section) => section.key === activeSection) ?? sections[0]

  return (
    <section className="console-page" style={accentStyle}>
      <ModuleHeader config={config} title={crm.title} description={crm.summary} />

      <div className="module-card-grid">
        <article className="module-card card-premium module-card-static">
          <strong>Contacts</strong>
          <p>Contacts, companies, deals, tasks, notes, and activity are ready for daily use.</p>
        </article>
        <article className="module-card card-premium module-card-static">
          <strong>Brand extensions</strong>
          <p>{config.name === 'FoundRetail' ? 'Customers, suppliers, and stores.' : config.name === 'FoundMeat' ? 'Farms, processors, logistics partners, and products.' : config.name === 'FoundThat' ? 'Clients, systems, and integrations.' : config.name === 'FoundTalent' ? 'Candidates, employers, jobs, and intelligence.' : 'Wallets, exchanges, triggers, and portfolio intelligence.'}</p>
        </article>
      </div>

      <div className="manager-tabs">
        {sections.map((section) => (
          <button key={section.key} type="button" className={section.key === activeSection ? 'active' : ''} onClick={() => setActiveSection(section.key)}>
            {section.title}
          </button>
        ))}
      </div>

      {current && (
        <CRMBoardSection
          title={current.title}
          description={config.crm?.summary ?? crm.summary}
          fields={current.fields}
          rows={current.rows}
          accentStyle={accentStyle}
        />
      )}
    </section>
  )
}

export function BrandDashboardCardLink({ brand, module }: { brand: BrandConsoleConfig; module: BrandModule }) {
  return <Link href={moduleHref(module.id)} className="module-card card-premium" style={consoleStyle(brand)}>{module.label}</Link>
}

export function packageRouteUrl(baseUrl: string, packageSlug: string) {
  return `${baseUrl.replace(/\/+$/, '')}/console/packages/${packageSlug}`
}

export function packageCatalogForBrand(name: string) {
  return packageCatalog[name] ?? packageCatalog.FoundingOS
}

export function BrandPackagePage({ config, packageSlug }: { config: BrandConsoleConfig; packageSlug?: string }) {
  const packages = packageCatalogForBrand(config.name)
  const activePackage = packages.find((entry) => entry.slug === packageSlug) ?? packages[0]
  const [formState, setFormState] = useState({ name: '', email: '', company: '', teamSize: '', notes: '' })

  if (!activePackage) return null

  return (
    <section className="console-page package-page" style={consoleStyle(config)}>
      <header className="module-header">
        <p>{config.name} package selection</p>
        <h1>{activePackage.name}</h1>
        <span>{activePackage.description}</span>
      </header>

      <div className="package-switcher">
        {packages.map((entry) => (
          <Link key={entry.slug} href={`/console/packages/${entry.slug}`} className={`package-switcher-chip ${entry.slug === activePackage.slug ? 'active' : ''}`}>
            {entry.name}
          </Link>
        ))}
      </div>

      <div className="package-layout">
        <article className="panel package-form-panel">
          <h2>Tell us about your rollout</h2>
          <div className="manager-form">
            <label className="manager-field">
              <span>Your name</span>
              <input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="manager-field">
              <span>Email</span>
              <input type="email" value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label className="manager-field">
              <span>Company</span>
              <input value={formState.company} onChange={(event) => setFormState((current) => ({ ...current, company: event.target.value }))} />
            </label>
            <label className="manager-field">
              <span>Team size</span>
              <select value={formState.teamSize} onChange={(event) => setFormState((current) => ({ ...current, teamSize: event.target.value }))}>
                <option value="">Select</option>
                <option value="1-5">1-5</option>
                <option value="6-20">6-20</option>
                <option value="21-50">21-50</option>
                <option value="51+">51+</option>
              </select>
            </label>
            <label className="manager-field manager-field-wide">
              <span>What do you want to achieve?</span>
              <textarea rows={5} value={formState.notes} onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))} />
            </label>
          </div>
          <div className="action-list">
            <button type="button">Continue onboarding</button>
            <Link className="btn btn-secondary" href="/console">Back to console</Link>
          </div>
        </article>

        <aside className="panel package-summary-panel">
          <p className="eyebrow">What you get</p>
          <h2>{activePackage.name}</h2>
          <p>{activePackage.description}</p>
          <strong className="package-price">{activePackage.price}</strong>
          <div className="package-block">
            <h3>Features</h3>
            <ul>{activePackage.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </div>
          <div className="package-block">
            <h3>Benefits</h3>
            <ul>{activePackage.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
          </div>
          <div className="package-block">
            <h3>Best for</h3>
            <p>{activePackage.audience}</p>
          </div>
          <div className="signup-grid">
            <a href="#google" className="signup-chip">Google account signup</a>
            <a href="#apple" className="signup-chip">Apple account signup</a>
            <a href="#email" className="signup-chip">Email signup</a>
          </div>
        </aside>
      </div>
    </section>
  )
}

const packageCatalog: Record<string, BrandPackage[]> = {
  FoundingOS: [
    { slug: 'quantumos', name: 'QuantumOS', price: '£149/mo', description: 'The full FoundingOS command layer for leaders who want every brand, workflow, and AI decision in one view.', features: ['Portfolio command center', 'Globalisation controls', 'FoundAI orchestration', 'Cross-brand reporting'], benefits: ['See every brand at once', 'Standardise operations', 'Move faster with AI guidance'], audience: 'Best for founders and operators running the full ecosystem.' },
    { slug: 'intelligenceos', name: 'IntelligenceOS', price: '£99/mo', description: 'Sharper analytics and automated context for teams that need more signal and less manual review.', features: ['Live analytics', 'Decision snapshots', 'Context-aware alerts', 'Shared task queues'], benefits: ['Track what matters', 'Reduce follow-up work', 'Keep teams aligned'], audience: 'Best for leadership teams focused on insight and reporting.' },
    { slug: 'systemos', name: 'SystemOS', price: '£59/mo', description: 'A practical control stack for setup, structure, and team access across the core platform.', features: ['Workspace setup', 'Access governance', 'Brand scaffolding', 'Workflow templates'], benefits: ['Launch quickly', 'Keep permissions tidy', 'Create a stable base'], audience: 'Best for new rollouts and lean system administration.' },
  ],
  FoundRetail: [
    { slug: 'standard', name: 'Standard', price: '£49/mo', description: 'A focused retail package for smaller stores that need stock, sales, and customer visibility.', features: ['POS workflows', 'Stock monitoring', 'Customer records', 'Supplier alerts'], benefits: ['Stay organised', 'Reduce stockouts', 'Serve faster'], audience: 'Best for single-location teams.' },
    { slug: 'pro', name: 'Pro', price: '£89/mo', description: 'Expanded retail control with stronger reporting, order handling, and team collaboration.', features: ['Multi-store reporting', 'Advanced orders', 'Team handoffs', 'Forecast snapshots'], benefits: ['Scale across stores', 'See performance trends', 'Coordinate the team'], audience: 'Best for growing retail operators.' },
    { slug: 'enterprise', name: 'Enterprise', price: '£149/mo', description: 'High-volume retail operations with governance, automation, and deep operational insight.', features: ['Governance controls', 'Automation rules', 'Audit views', 'Regional analytics'], benefits: ['Run larger operations', 'Keep control tight', 'Improve decision speed'], audience: 'Best for multi-site retail organisations.' },
    { slug: 'owneros', name: 'OwnerOS', price: '£199/mo', description: 'The all-in command package for owners who want a premium control room for the full business.', features: ['Executive dashboard', 'Portfolio alerts', 'AI assistance', 'Priority support'], benefits: ['Lead from one view', 'React quickly', 'Keep the business aligned'], audience: 'Best for owners and directors.' },
  ],
  FoundMeat: [
    { slug: 'butcheros', name: 'ButcherOS', price: '£59/mo', description: 'Daily traceability and stock control for butcher shops and premium meat counters.', features: ['Batch tracking', 'QA checkpoints', 'Cut records', 'Supplier handling'], benefits: ['Protect quality', 'Track every batch', 'Keep counters moving'], audience: 'Best for shops and counters.' },
    { slug: 'factoryos', name: 'FactoryOS', price: '£109/mo', description: 'Factory-level production tooling for lines, compliance, and throughput management.', features: ['Production schedules', 'Compliance logs', 'Cold-chain alerts', 'Dispatch oversight'], benefits: ['Improve throughput', 'Stay audit-ready', 'Reduce manual checks'], audience: 'Best for processors and production teams.' },
    { slug: 'distributionos', name: 'DistributionOS', price: '£149/mo', description: 'A distribution control package for warehouses, routes, and regional fulfilment.', features: ['Route visibility', 'Warehouse batches', 'Delivery windows', 'QA summaries'], benefits: ['Keep deliveries accurate', 'Track regional flow', 'Spot risk early'], audience: 'Best for distributors and logistics teams.' },
  ],
  FoundThat: [
    { slug: 'supportos', name: 'SupportOS', price: '£69/mo', description: 'Service desk operations with ticket triage, alerts, and fast response paths.', features: ['Ticket queues', 'SLA reminders', 'Alert routing', 'Response templates'], benefits: ['Resolve issues faster', 'Keep service visible', 'Simplify handoffs'], audience: 'Best for support teams.' },
    { slug: 'networkos', name: 'NetworkOS', price: '£119/mo', description: 'Infrastructure and uptime tooling for teams running networks, services, and monitoring.', features: ['Uptime metrics', 'System alerts', 'Event tracking', 'Health checks'], benefits: ['Stay ahead of outages', 'See system health', 'React with clarity'], audience: 'Best for operations and infrastructure teams.' },
    { slug: 'enterpriseos', name: 'EnterpriseOS', price: '£169/mo', description: 'A premium IT command layer for larger organisations with more sites, data, and control needs.', features: ['Enterprise dashboards', 'Governance settings', 'Audit logs', 'Automation rules'], benefits: ['Scale with confidence', 'Keep standards high', 'Centralise oversight'], audience: 'Best for enterprise IT teams.' },
  ],
  FoundTalent: [
    { slug: 'recruiteros', name: 'RecruiterOS', price: '£79/mo', description: 'Recruiter workflow tooling for candidate pipelines, interviews, and fast follow-up.', features: ['Candidate pipeline', 'Interview scheduling', 'Email templates', 'Hiring dashboards'], benefits: ['Move candidates faster', 'Keep hiring organised', 'Reduce admin'], audience: 'Best for in-house recruiters.' },
    { slug: 'agencyos', name: 'AgencyOS', price: '£129/mo', description: 'Agency delivery tooling for multi-client recruiting and placement management.', features: ['Client pipelines', 'Role tracking', 'Placement reporting', 'Team coordination'], benefits: ['Manage multiple clients', 'Track delivery clearly', 'Improve placement speed'], audience: 'Best for recruitment agencies.' },
    { slug: 'hrproos', name: 'HRProOS', price: '£169/mo', description: 'HR-focused operations for larger teams with onboarding, compliance, and people data.', features: ['Onboarding flows', 'People records', 'Policy tasks', 'Workforce reporting'], benefits: ['Support HR at scale', 'Keep records tidy', 'Improve team readiness'], audience: 'Best for HR teams and people ops.' },
  ],
  FoundCrypto: [
    { slug: 'traderos', name: 'TraderOS', price: '£89/mo', description: 'Fast-moving trading dashboards for signals, positions, and live market action.', features: ['Signal boards', 'Wallet views', 'Risk snapshots', 'Automation hooks'], benefits: ['See market action fast', 'Track positions clearly', 'Stay responsive'], audience: 'Best for active traders.' },
    { slug: 'investoros', name: 'InvestorOS', price: '£139/mo', description: 'Portfolio oversight for investors who need calm, structured views of holdings and exposure.', features: ['Portfolio summaries', 'Allocation charts', 'Exposure analysis', 'Watchlists'], benefits: ['Understand exposure', 'Monitor performance', 'Keep a steady view'], audience: 'Best for portfolio investors.' },
    { slug: 'whaleos', name: 'WhaleOS', price: '£219/mo', description: 'Premium control for large wallets, automation, and higher-touch risk management.', features: ['Large-wallet oversight', 'Advanced automation', 'Risk alarms', 'Priority support'], benefits: ['Protect larger balances', 'Act on movement quickly', 'Keep operations private'], audience: 'Best for high-volume operators.' },
  ],
}

export default function RemovedLogin() {
  return null
}
