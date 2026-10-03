import { escapeHtml, money, penceFrom, type ProRecord } from './pro/shared'
import { readOps, type OpsSchema } from './pro/ops'

export function registerPrintHtml(title: string, records: ProRecord[], schema?: OpsSchema) {
  const rows = records.map((record) => `<tr>${[record.id, record.name, record.secondary, record.status, record.owner, record.dueDate ?? '', record.value, [record.email, record.phone].filter(Boolean).join('\n')].map((value) => `<td>${escapeHtml(value)}</td>`).join('')}</tr>`).join('')
  const details = schema ? records.map((record) => {
    const values = readOps({ ...record, valuePence: record.value.trim() ? penceFrom(record.value) : undefined }, schema)
    return `<section><h2>${escapeHtml(record.name)} · ${escapeHtml(record.id)}</h2><dl>${schema.fields.map((field) => {
      const value = values[field.key]
      const text = value === undefined || value === null ? '' : field.type === 'money' && typeof value === 'number' && Number.isFinite(value) ? money(value) : Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : String(value)
      return `<dt>${escapeHtml(field.label)}</dt><dd>${escapeHtml(text)}</dd>`
    }).join('')}</dl></section>`
  }).join('') : ''
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)} · FoundingOS</title><style>
@page{size:A4 landscape;margin:12mm}body{font:12px Arial,sans-serif;color:#10263e;background:white}h1{font-size:24px}h2{font-size:16px}header{border-bottom:2px solid #10263e;margin-bottom:16px;padding-bottom:10px}table{width:100%;border-collapse:collapse}th,td{padding:7px;border-bottom:1px solid #cbd5e1;text-align:left;vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere}th{background:#edf3f8}thead{display:table-header-group}tr{break-inside:avoid}section{margin-top:24px}dl{display:grid;grid-template-columns:180px 1fr;gap:6px}dt{font-weight:bold}dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}@media print{button{display:none}}
</style></head><body><header><strong>FoundingOS</strong><h1>${escapeHtml(title)}</h1><p>${records.length} record(s) · Generated ${new Date().toISOString().slice(0, 10)} · Print / Save as PDF</p><button onclick="window.print()">Print / Save as PDF</button></header><table><thead><tr>${['Reference', 'Name', 'Detail', 'Status', 'Owner', 'Due date', 'Value', 'Contact'].map((label) => `<th>${label}</th>`).join('')}</tr></thead><tbody>${rows || '<tr><td colspan="8">No matching records.</td></tr>'}</tbody></table>${details}<script>window.onload=()=>setTimeout(()=>window.print(),250)</script></body></html>`
}

export function printRecordRegister(title: string, records: ProRecord[], schema?: OpsSchema) {
  const popup = window.open('', '_blank')
  if (!popup) return false
  popup.document.open()
  popup.document.write(registerPrintHtml(title, records, schema))
  popup.document.close()
  return true
}
