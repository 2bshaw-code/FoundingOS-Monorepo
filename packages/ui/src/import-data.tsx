/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useMemo, useRef, useState } from 'react'
import type { DataField, DataRow } from './console'

// Real, working "Import my data" flow — CSV, Excel (.xlsx/.xls), and JSON, all parsed and
// mapped entirely in the browser (no server round-trip, no data leaves the tester's machine).
// Wired directly into DataWorkbench (see console.tsx) so every module built on it — Retail's
// Inventory/Suppliers/Customers/Orders/Promotions/Products, Accounting's Expenses/Tax
// Summary/Cashflow, Marketing, Messaging, Customer Service, Sales, and the generic module
// fallback — gets real import for free. Upload → auto-mapped preview → confirm → done, exactly
// as requested; any category value in the imported data that doesn't already exist (e.g. a
// retailer importing "Chicken" into a Products sheet whose category field only listed "Fresh/
// Frozen/Prepared/Core") is genuinely added, not silently dropped.

type ParsedTable = { headers: string[]; rows: string[][] }

function normalize(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Small, explicit synonym list for the fields real modules actually use — kept short and
// honest rather than a huge speculative dictionary; unmatched columns just show up in the
// mapping dropdown for the tester to pick manually, they're never silently dropped.
const FIELD_SYNONYMS: Record<string, string[]> = {
  name: ['product', 'productname', 'item', 'title'],
  price: ['cost', 'unitprice', 'amount', 'sellingprice', 'rrp'],
  stock: ['qty', 'quantity', 'onhand', 'unitsinstock'],
  category: ['type', 'group', 'department'],
  email: ['emailaddress', 'contactemail'],
  supplier: ['vendor', 'suppliername'],
  customer: ['client', 'account'],
  status: ['state'],
  reorderAt: ['reorderpoint', 'reorderlevel', 'minstock'],
}

function guessMapping(fields: DataField[], headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {}
  const normalizedHeaders = headers.map((h) => ({ raw: h, norm: normalize(h) }))
  for (const field of fields) {
    const fieldNorm = normalize(field.key)
    const labelNorm = normalize(field.label)
    const synonyms = (FIELD_SYNONYMS[field.key] ?? []).map(normalize)
    const match = normalizedHeaders.find((h) => h.norm === fieldNorm || h.norm === labelNorm || synonyms.includes(h.norm))
      ?? normalizedHeaders.find((h) => h.norm.includes(fieldNorm) || fieldNorm.includes(h.norm))
    mapping[field.key] = match?.raw ?? ''
  }
  return mapping
}

function parseCsvText(text: string): ParsedTable {
  // Minimal, dependency-free CSV parser handling quoted fields and escaped quotes ("") —
  // covers the real-world CSVs testers export from Excel/Sheets without pulling in a library
  // just for comma-splitting.
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1 } else { inQuotes = false }
      } else field += char
    } else if (char === '"') inQuotes = true
    else if (char === ',') { row.push(field); field = '' }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i += 1
      row.push(field); field = ''
      if (row.some((cell) => cell.length > 0)) rows.push(row)
      row = []
    } else field += char
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  const [headers, ...body] = rows
  return { headers: headers ?? [], rows: body }
}

function parseJsonText(text: string): ParsedTable {
  const data = JSON.parse(text)
  const records: Record<string, unknown>[] = Array.isArray(data) ? data : [data]
  const headerSet = new Set<string>()
  records.forEach((record) => Object.keys(record ?? {}).forEach((key) => headerSet.add(key)))
  const headers = Array.from(headerSet)
  const rows = records.map((record) => headers.map((h) => (record?.[h] != null ? String(record[h]) : '')))
  return { headers, rows }
}

async function parseWorkbook(buffer: ArrayBuffer): Promise<ParsedTable> {
  // Lazy-loaded only when a tester actually picks an .xlsx/.xls file — keeps the ~110KB xlsx
  // library out of every page's initial bundle (CSV/JSON need no library at all), which matters
  // a lot for the low-bandwidth/basic-smartphone users this system explicitly needs to serve.
  const XLSX = await import('xlsx')
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const grid = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, raw: false, defval: '' })
  const [headers, ...body] = grid
  return { headers: (headers ?? []).map(String), rows: body.filter((r) => r.some((cell) => String(cell ?? '').length > 0)).map((r) => r.map(String)) }
}

export function ImportDataButton({ fields, onImport, idPrefix }: { fields: DataField[]; onImport: (rows: DataRow[]) => void; idPrefix: string }) {
  const [open, setOpen] = useState(false)
  const [table, setTable] = useState<ParsedTable | null>(null)
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [imported, setImported] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const preview = useMemo(() => {
    if (!table) return []
    return table.rows.slice(0, 5).map((row) => {
      const values: Record<string, string> = {}
      for (const field of fields) {
        const header = mapping[field.key]
        const headerIndex = header ? table.headers.indexOf(header) : -1
        values[field.key] = headerIndex >= 0 ? (row[headerIndex] ?? '') : ''
      }
      return values
    })
  }, [table, mapping, fields])

  async function handleFile(file: File) {
    setError('')
    setImported(null)
    setFileName(file.name)
    try {
      let parsed: ParsedTable
      if (file.name.toLowerCase().endsWith('.json')) {
        parsed = parseJsonText(await file.text())
      } else if (file.name.toLowerCase().match(/\.xlsx?$/)) {
        parsed = await parseWorkbook(await file.arrayBuffer())
      } else {
        parsed = parseCsvText(await file.text())
      }
      if (parsed.headers.length === 0 || parsed.rows.length === 0) {
        setError('That file has no recognizable rows — check it has a header row plus at least one data row.')
        setTable(null)
        return
      }
      setTable(parsed)
      setMapping(guessMapping(fields, parsed.headers))
    } catch {
      setError('Could not read that file. Supported formats: CSV, Excel (.xlsx/.xls), and JSON.')
      setTable(null)
    }
  }

  function confirmImport() {
    if (!table) return
    const newRows: DataRow[] = table.rows.map((row, index) => {
      const values: Record<string, string> = {}
      for (const field of fields) {
        const header = mapping[field.key]
        const headerIndex = header ? table.headers.indexOf(header) : -1
        values[field.key] = headerIndex >= 0 ? (row[headerIndex] ?? '') : ''
      }
      return { id: `${idPrefix}-import-${Date.now()}-${index}`, values }
    })
    onImport(newRows)
    setImported(newRows.length)
    setTable(null)
    setMapping({})
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <button type="button" className="btn btn-secondary quantum-btn" onClick={() => setOpen((v) => !v)}>
        📥 Import my data
      </button>
      {open && (
        <article className="module-card fo-card quantum-frame" style={{ marginTop: 10 }}>
          <div className="module-card-top"><span>📥</span><strong>Import my data</strong></div>
          <p><small>Upload a CSV, Excel, or JSON file → check the column mapping → preview → confirm. Everything is read in your browser; nothing is uploaded anywhere.</small></p>
          <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) handleFile(file) }} />
          {error && <p style={{ color: '#ff5470' }}><small>{error}</small></p>}
          {imported !== null && <p style={{ color: '#1f9d55' }}><small>✓ Imported {imported} row{imported === 1 ? '' : 's'} from {fileName}.</small></p>}
          {table && (
            <>
              <h2 style={{ fontSize: 15, marginTop: 14 }}>Match your columns</h2>
              <div className="manager-form">
                {fields.map((field) => (
                  <label key={field.key} className="manager-field">
                    <span>{field.label}</span>
                    <select value={mapping[field.key] ?? ''} onChange={(event) => setMapping((current) => ({ ...current, [field.key]: event.target.value }))}>
                      <option value="">Don&rsquo;t import this field</option>
                      {table.headers.map((header) => <option key={header} value={header}>{header}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              <h2 style={{ fontSize: 15, marginTop: 14 }}>Preview (first {preview.length} of {table.rows.length} rows)</h2>
              <table className="manager-table">
                <thead>
                  <tr>{fields.map((field) => <th key={field.key}>{field.label}</th>)}</tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i}>{fields.map((field) => <td key={field.key}>{row[field.key] || '—'}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              <div className="action-list" style={{ marginTop: 10 }}>
                <button type="button" className="btn btn-primary quantum-btn" onClick={confirmImport}>
                  Confirm import ({table.rows.length} row{table.rows.length === 1 ? '' : 's'})
                </button>
                <button type="button" className="btn btn-secondary quantum-btn" onClick={() => { setTable(null); setMapping({}) }}>Cancel</button>
              </div>
            </>
          )}
        </article>
      )}
    </>
  )
}
