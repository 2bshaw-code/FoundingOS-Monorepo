// Turns a spreadsheet saved as CSV (from Excel, Google Sheets, Xero, QuickBooks, Shopify or a
// FoundingOS export) into rows ready to become workspace records.

export type ImportField = 'name' | 'secondary' | 'value' | 'status' | 'owner' | 'email' | 'phone' | 'dueDate'
export type ImportMapping = Partial<Record<ImportField, number>>
export type ImportRow = { name: string; secondary: string; value: string; status?: string; owner?: string; email?: string; phone?: string; dueDate?: string }

export const IMPORT_FIELDS: ImportField[] = ['name', 'secondary', 'value', 'status', 'owner', 'email', 'phone', 'dueDate']
export const MAX_IMPORT_ROWS = 500
export const IMPORT_BATCH_SIZE = 50

const HEADER_HINTS: Record<ImportField, string[]> = {
  name: ['name', 'full name', 'customer name', 'customer', 'contact name', 'contact', 'client', 'company name', 'company', 'business name', 'product name', 'product', 'item name', 'item', 'title', 'supplier', 'supplier name', 'employee', 'candidate', 'lead', 'account name', 'display name'],
  secondary: ['detail', 'details', 'description', 'sku', 'category', 'type', 'notes', 'note', 'address', 'address line 1', 'city', 'job title', 'role', 'reference', 'invoice number', 'invoice no', 'number'],
  value: ['value', 'amount', 'total', 'total amount', 'price', 'sale price', 'selling price', 'unit price', 'balance', 'amount due', 'outstanding', 'salary', 'budget', 'cost'],
  status: ['status', 'stage', 'state'],
  owner: ['owner', 'assigned to', 'assignee', 'sales person', 'salesperson', 'account manager'],
  email: ['email', 'email address', 'e-mail', 'contact email'],
  phone: ['phone', 'phone number', 'mobile', 'mobile number', 'telephone', 'tel', 'whatsapp', 'whatsapp number'],
  dueDate: ['due date', 'date due', 'due', 'date', 'invoice date', 'start date', 'expiry date', 'expiry'],
}

// Reads CSV text. Handles quotes, commas inside quotes, line breaks inside quotes, Windows line
// endings, a byte order mark, and semicolon or tab separated files from European Excel.
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^\uFEFF/, '')
  const firstLine = source.slice(0, source.search(/\r?\n/) === -1 ? source.length : source.search(/\r?\n/))
  const count = (character: string) => firstLine.split(character).length - 1
  const delimiter = [',', ';', '\t'].reduce((best, candidate) => count(candidate) > count(best) ? candidate : best, ',')
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') { cell += '"'; index += 1 }
      else if (character === '"') quoted = false
      else cell += character
    } else if (character === '"' && cell === '') quoted = true
    else if (character === delimiter) { row.push(cell); cell = '' }
    else if (character === '\n' || character === '\r') {
      if (character === '\r' && source[index + 1] === '\n') index += 1
      row.push(cell); rows.push(row); row = []; cell = ''
    } else cell += character
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row) }
  return rows.map((cells) => cells.map((value) => value.trim())).filter((cells) => cells.some((value) => value !== ''))
}

const LAST_NAME_HEADERS = ['last name', 'lastname', 'surname', 'family name']
const normalise = (header: string) => header.toLowerCase().replace(/[_\-.]+/g, ' ').replace(/\s+/g, ' ').trim()

// Picks the most likely column for each field from the header row. Exact matches win over
// partial ones, and a column is never used for two fields.
export function guessMapping(headers: string[]): ImportMapping {
  const cleaned = headers.map(normalise)
  const used = new Set<number>()
  const mapping: ImportMapping = {}
  const order: ImportField[] = ['email', 'phone', 'status', 'owner', 'dueDate', 'value', 'name', 'secondary']
  for (const field of order) {
    const hints = HEADER_HINTS[field]
    let found = -1
    for (const hint of hints) {
      found = cleaned.findIndex((header, index) => !used.has(index) && header === hint)
      if (found !== -1) break
    }
    if (found === -1 && field !== 'secondary' && field !== 'dueDate') {
      for (const hint of hints) {
        found = cleaned.findIndex((header, index) => !used.has(index) && hint.length > 3 && header.includes(hint) && !(field === 'name' && LAST_NAME_HEADERS.includes(header)))
        if (found !== -1) break
      }
    }
    if (found !== -1) { mapping[field] = found; used.add(found) }
  }
  if (mapping.name === undefined) {
    const first = cleaned.findIndex((header) => header === 'first name' || header === 'firstname' || header === 'given name')
    if (first !== -1) mapping.name = first
    else {
      const fallback = cleaned.findIndex((_, index) => !used.has(index))
      if (fallback !== -1) mapping.name = fallback
    }
  }
  return mapping
}

// Turns 31/12/2026, 2026-12-31 or 31 Dec 2026 into 2026-12-31. UK day first order is assumed
// for slashes because that is how UK, African and Indian spreadsheets write dates.
export function normaliseDate(value: string): string | undefined {
  const text = value.trim()
  if (!text) return undefined
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (iso) return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`
  const dayFirst = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/)
  if (dayFirst) {
    const year = dayFirst[3].length === 2 ? `20${dayFirst[3]}` : dayFirst[3]
    const month = Number(dayFirst[2])
    const day = Number(dayFirst[1])
    if (month < 1 || month > 12 || day < 1 || day > 31) return undefined
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  const parsed = new Date(`${text} 12:00 UTC`)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10)
}

export function buildImportRows(rows: string[][], mapping: ImportMapping, statuses: string[]): { rows: ImportRow[]; skipped: number } {
  const [headers = [], ...body] = rows
  const cleaned = headers.map(normalise)
  const lastName = cleaned.findIndex((header) => LAST_NAME_HEADERS.includes(header))
  const joinLast = mapping.name !== undefined && ['first name', 'firstname', 'given name'].includes(cleaned[mapping.name] ?? '') && lastName !== -1
  const cell = (row: string[], field: ImportField) => mapping[field] === undefined ? '' : (row[mapping[field]!] ?? '').trim()
  const statusByLower = new Map(statuses.map((status) => [status.toLowerCase(), status]))
  const result: ImportRow[] = []
  let skipped = 0
  for (const row of body) {
    const name = joinLast ? `${cell(row, 'name')} ${(row[lastName] ?? '').trim()}`.trim() : cell(row, 'name')
    if (!name) { skipped += 1; continue }
    const email = cell(row, 'email')
    const phone = cell(row, 'phone')
    const status = statusByLower.get(cell(row, 'status').toLowerCase())
    result.push({
      name: name.slice(0, 200),
      secondary: (cell(row, 'secondary') || email || phone || 'Imported').slice(0, 300),
      value: cell(row, 'value') || '£0',
      ...(status ? { status } : {}),
      ...(cell(row, 'owner') ? { owner: cell(row, 'owner') } : {}),
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
      ...(normaliseDate(cell(row, 'dueDate')) ? { dueDate: normaliseDate(cell(row, 'dueDate')) } : {}),
    })
  }
  return { rows: result, skipped }
}

// A row counts as already imported when the name and email (or name and detail) match.
export function duplicateKey(row: { name: string; secondary?: string; email?: string }): string {
  return `${row.name.trim().toLowerCase()}|${(row.email || row.secondary || '').trim().toLowerCase()}`
}

export function importTemplateCsv(fields: { name: string; secondary: string; value: string }): string {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`
  return [
    [fields.name, fields.secondary, fields.value, 'Email', 'Phone', 'Due date'].map(quote).join(','),
    ['Harbour Cafe', 'Weekly coffee order', '£240', 'orders@harbourcafe.co.uk', '+44 7700 900123', '31/10/2026'].map(quote).join(','),
  ].join('\n')
}

// Runs the saves a few at a time so a large import is quick without overloading the server.
export async function runImport<T>(items: T[], save: (item: T) => Promise<unknown>, onProgress: (done: number) => void, concurrency = 3): Promise<{ saved: number; failed: T[] }> {
  let next = 0
  let done = 0
  let saved = 0
  const failed: T[] = []
  const worker = async () => {
    while (next < items.length) {
      const item = items[next]
      next += 1
      try { await save(item); saved += 1 } catch { failed.push(item) }
      done += 1
      onProgress(done)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
  return { saved, failed }
}
