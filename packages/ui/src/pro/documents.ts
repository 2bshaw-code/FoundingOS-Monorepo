/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { addDays, escapeHtml, isoDate, money, numberAt, objectAt, penceFrom, ProRecord, textAt, todayIso } from './shared'

export type DocumentKind = 'invoice' | 'bill' | 'quote' | 'credit-note'
export type VatRate = 20 | 5 | 0 | -1 // -1 = exempt / outside scope

export type DocumentLine = { id: string; description: string; quantity: number; unitPence: number; vatRate: VatRate }
export type DocumentPayment = { id: string; date: string; amountPence: number; method: string; reference: string }
export type DocumentParty = { name: string; email: string; address: string; vatNumber: string }

export type BusinessDocument = {
  kind: DocumentKind
  number: string
  issueDate: string
  dueDate: string
  termsDays: number
  party: DocumentParty
  poReference: string
  lines: DocumentLine[]
  discountPercent: number
  notes: string
  payments: DocumentPayment[]
  sentAt?: string
}

export type DocumentProfile = {
  businessName: string
  address: string
  email: string
  phone: string
  vatNumber: string
  companyNumber: string
  bankName: string
  accountName: string
  sortCode: string
  accountNumber: string
  iban: string
  footer: string
  defaultTermsDays: number
}

export const emptyProfile: DocumentProfile = {
  businessName: '', address: '', email: '', phone: '', vatNumber: '', companyNumber: '',
  bankName: '', accountName: '', sortCode: '', accountNumber: '', iban: '', footer: 'Thank you for your business.', defaultTermsDays: 30,
}

export const vatRates: { value: VatRate; label: string }[] = [
  { value: 20, label: '20% Standard' },
  { value: 5, label: '5% Reduced' },
  { value: 0, label: '0% Zero rated' },
  { value: -1, label: 'Exempt' },
]

export const documentLabel: Record<DocumentKind, string> = { invoice: 'Invoice', bill: 'Bill', quote: 'Quote', 'credit-note': 'Credit note' }

export const lineId = () => `ln_${Math.random().toString(36).slice(2, 10)}`

export function documentTotals(doc: Pick<BusinessDocument, 'lines' | 'discountPercent' | 'payments'>) {
  const factor = 1 - Math.min(100, Math.max(0, doc.discountPercent || 0)) / 100
  const gross = doc.lines.reduce((sum, line) => sum + Math.round(line.quantity * line.unitPence), 0)
  const vatByRate = new Map<VatRate, { net: number; vat: number }>()
  let net = 0
  let vat = 0
  for (const line of doc.lines) {
    const lineNet = Math.round(line.quantity * line.unitPence * factor)
    const lineVat = line.vatRate > 0 ? Math.round((lineNet * line.vatRate) / 100) : 0
    net += lineNet
    vat += lineVat
    const bucket = vatByRate.get(line.vatRate) ?? { net: 0, vat: 0 }
    bucket.net += lineNet
    bucket.vat += lineVat
    vatByRate.set(line.vatRate, bucket)
  }
  const total = net + vat
  const paid = doc.payments.reduce((sum, payment) => sum + payment.amountPence, 0)
  return { gross, discount: gross - net, net, vat, total, paid, balance: total - paid, vatByRate }
}

const readLine = (value: unknown): DocumentLine => {
  const line = objectAt(value)
  const rate = numberAt(line.vatRate, 20)
  return {
    id: textAt(line.id) || lineId(),
    description: textAt(line.description),
    quantity: numberAt(line.quantity, 1),
    unitPence: Math.round(numberAt(line.unitPence)),
    vatRate: ([20, 5, 0, -1].includes(rate) ? rate : 20) as VatRate,
  }
}

const readPayment = (value: unknown): DocumentPayment => {
  const payment = objectAt(value)
  return {
    id: textAt(payment.id) || lineId(),
    date: isoDate(payment.date) || todayIso(),
    amountPence: Math.round(numberAt(payment.amountPence)),
    method: textAt(payment.method, 'Bank transfer'),
    reference: textAt(payment.reference),
  }
}

// Reads a structured document from record data, falling back to the basic record fields.
export function readDocument(record: ProRecord, kind: DocumentKind, profile?: DocumentProfile): BusinessDocument {
  const stored = objectAt(record.data?.document)
  const party = objectAt(stored.party)
  const issueDate = isoDate(stored.issueDate) || todayIso()
  const termsDays = numberAt(stored.termsDays, profile?.defaultTermsDays ?? 30)
  const storedLines = Array.isArray(stored.lines) ? stored.lines.map(readLine) : []
  const fallbackPence = penceFrom(record.value)
  const lines = storedLines.length
    ? storedLines
    : [{ id: lineId(), description: kind === 'quote' ? record.name : `${documentLabel[kind]} ${record.name}`, quantity: 1, unitPence: fallbackPence, vatRate: 0 as VatRate }]
  const payments = Array.isArray(stored.payments) ? stored.payments.map(readPayment) : []
  // Bills are listed by supplier (name) with the bill number in the detail line.
  const fallbackParty = kind === 'bill' ? record.name : record.secondary.split(' · ')[0]
  const fallbackNumber = kind === 'bill' ? (/bill\s+([\w-]+)/i.exec(record.secondary)?.[1] ?? record.id) : record.name
  return {
    kind,
    number: textAt(stored.number) || fallbackNumber,
    issueDate,
    dueDate: isoDate(stored.dueDate) || isoDate(record.dueDate) || addDays(issueDate, termsDays),
    termsDays,
    party: {
      name: textAt(party.name) || fallbackParty,
      email: textAt(party.email) || record.email || '',
      address: textAt(party.address),
      vatNumber: textAt(party.vatNumber),
    },
    poReference: textAt(stored.poReference),
    lines,
    discountPercent: numberAt(stored.discountPercent),
    notes: textAt(stored.notes),
    payments,
    sentAt: textAt(stored.sentAt) || undefined,
  }
}

export const readProfile = (value: unknown): DocumentProfile => {
  const data = objectAt(value)
  const profile = { ...emptyProfile }
  for (const key of Object.keys(emptyProfile) as (keyof DocumentProfile)[]) {
    if (key === 'defaultTermsDays') profile.defaultTermsDays = numberAt(data.defaultTermsDays, 30)
    else if (typeof data[key] === 'string') profile[key] = data[key] as string
  }
  return profile
}

export function printDocument(doc: BusinessDocument, profile: DocumentProfile) {
  const totals = documentTotals(doc)
  const title = documentLabel[doc.kind]
  const fromLabel = doc.kind === 'bill' ? 'Supplier' : 'Bill to'
  const rows = doc.lines.map((line) => {
    const lineNet = Math.round(line.quantity * line.unitPence)
    return `<tr><td>${escapeHtml(line.description)}</td><td class="n">${line.quantity}</td><td class="n">${money(line.unitPence)}</td><td class="n">${line.vatRate < 0 ? 'Exempt' : `${line.vatRate}%`}</td><td class="n">${money(lineNet)}</td></tr>`
  }).join('')
  const vatRows = [...totals.vatByRate.entries()].filter(([rate]) => rate > 0)
    .map(([rate, bucket]) => `<tr><td>VAT ${rate}% on ${money(bucket.net)}</td><td class="n">${money(bucket.vat)}</td></tr>`).join('')
  const bank = profile.accountNumber || profile.iban
    ? `<div class="box"><h3>Payment details</h3>${profile.bankName ? `<p>${escapeHtml(profile.bankName)}</p>` : ''}${profile.accountName ? `<p>Account name: ${escapeHtml(profile.accountName)}</p>` : ''}${profile.sortCode ? `<p>Sort code: ${escapeHtml(profile.sortCode)}</p>` : ''}${profile.accountNumber ? `<p>Account no: ${escapeHtml(profile.accountNumber)}</p>` : ''}${profile.iban ? `<p>IBAN: ${escapeHtml(profile.iban)}</p>` : ''}<p>Reference: ${escapeHtml(doc.number)}</p></div>`
    : ''
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title} ${escapeHtml(doc.number)}</title><style>
body{font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a;margin:40px;font-size:13px}
header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0f172a;padding-bottom:16px}
h1{font-size:30px;margin:0;letter-spacing:.04em;text-transform:uppercase}h2{margin:0 0 4px;font-size:18px}h3{margin:0 0 6px;font-size:12px;text-transform:uppercase;color:#64748b;letter-spacing:.06em}
p{margin:2px 0}.meta{display:grid;grid-template-columns:auto auto;gap:4px 16px;text-align:right}.meta b{text-align:left}
.parties{display:flex;justify-content:space-between;margin:24px 0}table{width:100%;border-collapse:collapse;margin-top:8px}
th{background:#f1f5f9;text-align:left;padding:8px;font-size:11px;text-transform:uppercase;letter-spacing:.05em}td{padding:8px;border-bottom:1px solid #e2e8f0}
.n{text-align:right}.totals{width:320px;margin-left:auto;margin-top:12px}.totals td{border:none;padding:4px 8px}.grand td{font-size:16px;font-weight:700;border-top:2px solid #0f172a}
.box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-top:20px}footer{margin-top:32px;color:#64748b;font-size:11px;border-top:1px solid #e2e8f0;padding-top:10px}
.paid{color:#15803d;font-weight:700}@media print{body{margin:16mm}}</style></head><body>
<header><div><h2>${escapeHtml(profile.businessName || 'Your business')}</h2><p>${escapeHtml(profile.address).replace(/\n/g, '<br>')}</p>${profile.email ? `<p>${escapeHtml(profile.email)}</p>` : ''}${profile.phone ? `<p>${escapeHtml(profile.phone)}</p>` : ''}</div>
<div><h1>${title}</h1><div class="meta"><b>Number</b><span>${escapeHtml(doc.number)}</span><b>Date</b><span>${escapeHtml(doc.issueDate)}</span><b>${doc.kind === 'quote' ? 'Valid until' : 'Due'}</b><span>${escapeHtml(doc.dueDate)}</span>${doc.poReference ? `<b>PO ref</b><span>${escapeHtml(doc.poReference)}</span>` : ''}</div></div></header>
<div class="parties"><div><h3>${fromLabel}</h3><p><b>${escapeHtml(doc.party.name)}</b></p><p>${escapeHtml(doc.party.address).replace(/\n/g, '<br>')}</p>${doc.party.email ? `<p>${escapeHtml(doc.party.email)}</p>` : ''}${doc.party.vatNumber ? `<p>VAT: ${escapeHtml(doc.party.vatNumber)}</p>` : ''}</div></div>
<table><thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Unit price</th><th class="n">VAT</th><th class="n">Net</th></tr></thead><tbody>${rows}</tbody></table>
<table class="totals"><tbody><tr><td>Subtotal</td><td class="n">${money(totals.gross)}</td></tr>${totals.discount ? `<tr><td>Discount (${doc.discountPercent}%)</td><td class="n">−${money(totals.discount)}</td></tr>` : ''}<tr><td>Net</td><td class="n">${money(totals.net)}</td></tr>${vatRows}
<tr class="grand"><td>Total</td><td class="n">${money(totals.total)}</td></tr>${totals.paid ? `<tr><td>Paid</td><td class="n">−${money(totals.paid)}</td></tr><tr><td><b>Balance due</b></td><td class="n ${totals.balance <= 0 ? 'paid' : ''}"><b>${totals.balance <= 0 ? 'PAID' : money(totals.balance)}</b></td></tr>` : ''}</tbody></table>
${bank}${doc.notes ? `<div class="box"><h3>Notes</h3><p>${escapeHtml(doc.notes).replace(/\n/g, '<br>')}</p></div>` : ''}
<footer>${escapeHtml(profile.footer)}${profile.companyNumber ? ` · Company no. ${escapeHtml(profile.companyNumber)}` : ''}${profile.vatNumber ? ` · VAT reg. ${escapeHtml(profile.vatNumber)}` : ''}</footer>
<script>window.onload=()=>setTimeout(()=>window.print(),250)</script></body></html>`
  const win = window.open('', '_blank')
  if (!win) return false
  win.document.open()
  win.document.write(html)
  win.document.close()
  return true
}

export function emailDocumentLink(doc: BusinessDocument, profile: DocumentProfile) {
  const totals = documentTotals(doc)
  const title = documentLabel[doc.kind]
  const subject = `${title} ${doc.number} from ${profile.businessName || 'us'}`
  const body = [
    `Hi ${doc.party.name || 'there'},`,
    '',
    doc.kind === 'quote'
      ? `Please find our quote ${doc.number} for ${money(totals.total)}, valid until ${doc.dueDate}.`
      : `Please find ${title.toLowerCase()} ${doc.number} for ${money(totals.balance)}, due on ${doc.dueDate}.`,
    profile.accountNumber ? `\nBank: ${profile.accountName} · ${profile.sortCode} · ${profile.accountNumber} · Ref ${doc.number}` : '',
    '',
    'Kind regards,',
    profile.businessName,
  ].join('\n')
  return `mailto:${encodeURIComponent(doc.party.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
