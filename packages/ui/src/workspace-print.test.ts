import assert from 'node:assert/strict'
import test from 'node:test'
import { registerPrintHtml } from './workspace-print'
import { outreachSchema } from './pro/ops-talent-recruiter'
import type { OpsSchema } from './pro/ops'
import { documentHtml, emptyProfile, type BusinessDocument } from './pro/documents'

test('bulk register print contains all 500 rows and no interactive app navigation', () => {
  const records = Array.from({ length: 500 }, (_, index) => ({ id: `QA-${index}`, backendId: `db-${index}`, name: `Candidate ${index}`, secondary: 'Role', status: 'Applied', owner: 'Amina', value: '' }))
  const html = registerPrintHtml('Candidate register', records)
  assert.equal((html.match(/<tr>/g) ?? []).length, 501)
  assert.ok(html.includes('Candidate 499'))
  assert.ok(html.includes('500 record(s)'))
  assert.ok(html.includes('table-header-group'))
  assert.ok(!html.includes('retail-product-sidebar'))
})

test('print escapes user data and includes complete saved specialist fields', () => {
  const html = registerPrintHtml('<Recruiter>', [{ id: 'QA', backendId: 'db-QA', name: '<script>alert(1)</script>', secondary: '', owner: '', value: '', status: 'Planned', data: { ops: { draft: 'Full message\nWith another line and "quotes".', contactRestriction: 'Do not contact' } } }], outreachSchema)
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
  assert.ok(!html.includes('<script>alert(1)</script>'))
  assert.ok(html.includes('Full message\nWith another line and &quot;quotes&quot;.'))
  assert.ok(html.includes('Do not contact'))
  assert.ok(html.includes('window.print()'))
})

test('print formats monetary pence and never invents demo specialist details for unsaved fields', () => {
  const schema: OpsSchema = {
    title: 'Fees', intro: '', insights: () => ({ kpis: [], tables: [], bars: [], alerts: [] }),
    fields: [{ key: 'fee', label: 'Fee', type: 'money' }, { key: 'due', label: 'Date', type: 'date', demo: [1, 5] }],
  }
  const html = registerPrintHtml('Fees', [{ id: 'QA', name: 'Local candidate', secondary: '', status: 'Applied', owner: '', value: '', data: { ops: { fee: 12345 } } }], schema)
  assert.ok(html.includes('£123.45'))
  assert.ok(html.includes('<dt>Date</dt><dd></dd>'))
})

test('accounting documents retain line items, VAT and business identity with formal labels', () => {
  const doc: BusinessDocument = {
    kind: 'invoice', number: 'INV-QA', issueDate: '2026-10-03', dueDate: '2026-11-02', termsDays: 30,
    party: { name: 'Client', address: '', email: '', vatNumber: '' }, poReference: '',
    lines: [{ id: 'line', description: 'Recruitment service', quantity: 2, unitPence: 12345, vatRate: 20 }],
    discountPercent: 0, notes: '', payments: [],
  }
  for (const [kind, label] of [['invoice', 'Sales invoice'], ['bill', 'Supplier invoice'], ['quote', 'Quotation']] as const) {
    const html = documentHtml({ ...doc, kind }, { ...emptyProfile, businessName: 'QA agency' }, true)
    assert.ok(html.includes(`<h1>${label}</h1>`))
    assert.ok(html.includes('QA agency'))
    assert.ok(html.includes('Recruitment service'))
    assert.ok(html.includes('£296.28'))
    assert.ok(html.includes('window.print()'))
  }
})
