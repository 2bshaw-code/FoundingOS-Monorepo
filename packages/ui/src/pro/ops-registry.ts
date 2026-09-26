/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Health (clinic operations), Retail operations and Intelligence specialist tools, plus the
// registry that picks the right tool for a workspace module.
import {
  countBy, daysUntil, emptyInsight, expiryInsight, gbp, niceDate, num, pctText, str, type OpsSchema,
} from './ops'
import { complianceSchema, hrSchemas } from './ops-hr'
import { logisticsSchemas, talentSchemas } from './ops-talent-logistics'

// ── Health ────────────────────────────────────────────────────────────────
export const appointmentSchema: OpsSchema = {
  title: 'Appointment',
  intro: 'Run the diary like a practice manager: utilisation, missed appointments and reminders.',
  fields: [
    { key: 'practitioner', label: 'Practitioner', type: 'text', fallback: 'owner' },
    { key: 'date', label: 'Date', type: 'date', fallback: 'dueDate', demo: [-14, 14] },
    { key: 'time', label: 'Time', type: 'time', demo: [8, 17] },
    { key: 'length', label: 'Length', type: 'number', unit: 'mins', demo: [15, 60] },
    { key: 'type', label: 'Type', type: 'select', options: ['New patient', 'Follow-up', 'Review', 'Procedure', 'Telephone', 'Video'] },
    { key: 'attendance', label: 'Attendance', type: 'select', options: ['Booked', 'Attended', 'DNA (did not attend)', 'Cancelled < 24h', 'Cancelled'] },
    { key: 'reminder', label: 'Reminder sent', type: 'select', options: ['Not sent', 'SMS', 'WhatsApp', 'Email'] },
    { key: 'fee', label: 'Fee', type: 'money', fallback: 'value', demo: [45, 180] },
  ],
  insights: (rows) => {
    const out = emptyInsight()
    const past = rows.filter((row) => daysUntil(str(row.v.date)) < 0)
    const dna = past.filter((row) => str(row.v.attendance).startsWith('DNA'))
    const late = past.filter((row) => str(row.v.attendance) === 'Cancelled < 24h')
    const upcoming = rows.filter((row) => { const days = daysUntil(str(row.v.date)); return days >= 0 && days <= 2 })
    const noReminder = upcoming.filter((row) => str(row.v.reminder) === 'Not sent' || !str(row.v.reminder))
    const lostFees = [...dna, ...late].reduce((total, row) => total + num(row.v.fee), 0)
    out.kpis.push({ label: 'Appointments', value: String(rows.length), tone: 'info' }, { label: 'DNA rate', value: pctText(dna.length, past.length), tone: past.length && dna.length / past.length > 0.05 ? 'watch' : 'good' }, { label: 'Lost fees (DNA + late cancel)', value: gbp(lostFees), tone: lostFees ? 'watch' : 'good' }, { label: 'Clinical hours booked', value: (rows.reduce((total, row) => total + num(row.v.length), 0) / 60).toFixed(1), tone: 'info' })
    if (noReminder.length) out.alerts.push({ text: `${noReminder.length} appointment${noReminder.length === 1 ? '' : 's'} in the next 48 hours without a reminder — reminders cut DNAs by up to a third.`, tone: 'watch', recordId: noReminder[0].record.id })
    out.bars.push(countBy(rows, 'type', 'Appointments by type'), countBy(rows, 'practitioner', 'Load by practitioner'))
    return out
  },
}

export const patientSchema: OpsSchema = {
  title: 'Patient',
  intro: 'Consent, contact preferences and recalls so nobody falls through the gaps.',
  fields: [
    { key: 'dob', label: 'Date of birth', type: 'date', demo: [-30000, -6000] },
    { key: 'consent', label: 'Consent to treatment', type: 'select', options: ['Recorded', 'Not recorded'] },
    { key: 'contactPreference', label: 'Contact preference', type: 'select', options: ['WhatsApp', 'SMS', 'Email', 'Phone'] },
    { key: 'lastVisit', label: 'Last visit', type: 'date', demo: [-400, -1] },
    { key: 'recall', label: 'Recall due', type: 'date', fallback: 'dueDate', demo: [-30, 180] },
    { key: 'alerts', label: 'Clinical alerts (allergies, conditions)', type: 'textarea' },
  ],
  insights: (rows) => {
    const out = expiryInsight(rows, [['recall', 'Recall']], 30)
    out.kpis[0].label = 'Recalls overdue'
    const noConsent = rows.filter((row) => str(row.v.consent) !== 'Recorded')
    const lapsed = rows.filter((row) => daysUntil(str(row.v.lastVisit)) < -365)
    out.kpis.unshift({ label: 'Patients', value: String(rows.length), tone: 'info' })
    out.kpis.push({ label: 'Consent missing', value: String(noConsent.length), tone: noConsent.length ? 'risk' : 'good' }, { label: 'Not seen in 12 months', value: String(lapsed.length), tone: 'info' })
    if (noConsent.length) out.alerts.push({ text: `${noConsent.length} patient${noConsent.length === 1 ? '' : 's'} with no consent recorded.`, tone: 'risk', recordId: noConsent[0].record.id })
    out.bars.push(countBy(rows, 'contactPreference', 'Contact preference'))
    return out
  },
}

export const carePlanSchema: OpsSchema = {
  title: 'Care plan',
  intro: 'Goals, interventions and a review date for every plan — reviewed on time.',
  fields: [
    { key: 'clinician', label: 'Lead clinician', type: 'text', fallback: 'owner' },
    { key: 'goals', label: 'Goals', type: 'textarea' },
    { key: 'interventions', label: 'Interventions', type: 'textarea' },
    { key: 'review', label: 'Next review', type: 'date', fallback: 'dueDate', demo: [-20, 90] },
    { key: 'risk', label: 'Risk level', type: 'select', options: ['Low', 'Medium', 'High'] },
  ],
  insights: (rows) => {
    const out = expiryInsight(rows, [['review', 'Plan review']], 30)
    out.kpis[0].label = 'Reviews overdue'
    const high = rows.filter((row) => str(row.v.risk) === 'High')
    out.kpis.push({ label: 'High risk', value: String(high.length), tone: high.length ? 'watch' : 'good' })
    out.bars.push(countBy(rows, 'risk', 'Plans by risk'))
    return out
  },
}

export const triageSchema: OpsSchema = {
  title: 'Triage',
  intro: 'Prioritise by clinical urgency (Manchester-style categories) and see the right patient first.',
  fields: [
    { key: 'category', label: 'Priority', type: 'select', options: ['1 · Immediate', '2 · Very urgent (10 min)', '3 · Urgent (60 min)', '4 · Standard (2 hrs)', '5 · Non-urgent (4 hrs)'] },
    { key: 'presenting', label: 'Presenting complaint', type: 'textarea', fallback: 'secondary' },
    { key: 'redFlags', label: 'Red flags', type: 'checklist', items: ['Chest pain', 'Breathing difficulty', 'Severe bleeding', 'Reduced consciousness', 'Suspected sepsis', 'Safeguarding concern'] },
    { key: 'arrived', label: 'Arrived', type: 'time', demo: [8, 17] },
  ],
  insights: (rows, ctx) => {
    const out = emptyInsight()
    const open = rows.filter((row) => row.record.status !== ctx.statuses.at(-1))
    const urgent = open.filter((row) => /^[12]/.test(str(row.v.category)))
    const flagged = open.filter((row) => Array.isArray(row.v.redFlags) && (row.v.redFlags as unknown[]).length)
    out.kpis.push({ label: 'Waiting', value: String(open.length), tone: 'info' }, { label: 'Priority 1–2', value: String(urgent.length), tone: urgent.length ? 'risk' : 'good' }, { label: 'Red flags', value: String(flagged.length), tone: flagged.length ? 'risk' : 'good' })
    for (const row of [...urgent, ...flagged].slice(0, 4)) out.alerts.push({ text: `${row.record.name}: ${str(row.v.category) || 'red flag'} — see now.`, tone: 'risk', recordId: row.record.id })
    out.bars.push(countBy(open, 'category', 'Queue by priority'))
    return out
  },
}

export const practitionerSchema: OpsSchema = {
  title: 'Practitioner',
  intro: 'Registration, indemnity and DBS for every clinician — never let one lapse.',
  fields: [
    { key: 'body', label: 'Regulator', type: 'select', options: ['GMC', 'NMC', 'HCPC', 'GDC', 'GPhC', 'GOC', 'None'] },
    { key: 'pin', label: 'Registration number', type: 'text' },
    { key: 'registration', label: 'Registration renewal', type: 'date', fallback: 'dueDate', demo: [-5, 360] },
    { key: 'indemnity', label: 'Indemnity renewal', type: 'date', demo: [10, 360] },
    { key: 'dbs', label: 'DBS check date', type: 'date', demo: [-1200, -30] },
    { key: 'sessions', label: 'Sessions per week', type: 'number', demo: [2, 10] },
  ],
  insights: (rows) => {
    const out = expiryInsight(rows, [['registration', 'Professional registration'], ['indemnity', 'Indemnity']], 60)
    const oldDbs = rows.filter((row) => str(row.v.dbs) && daysUntil(str(row.v.dbs)) < -1095)
    out.kpis.push({ label: 'DBS over 3 years', value: String(oldDbs.length), tone: oldDbs.length ? 'watch' : 'good' })
    if (oldDbs.length) out.alerts.push({ text: `${oldDbs.length} DBS check${oldDbs.length === 1 ? ' is' : 's are'} over 3 years old — renew or use the Update Service.`, tone: 'watch', recordId: oldDbs[0].record.id })
    return out
  },
}

export const claimSchema: OpsSchema = {
  title: 'Claim',
  intro: 'Track every insurer claim from submission to payment and chase anything ageing.',
  fields: [
    { key: 'insurer', label: 'Insurer', type: 'select', options: ['Bupa', 'AXA Health', 'Aviva', 'Vitality', 'WPA', 'Cigna', 'Self-pay', 'Other'] },
    { key: 'authCode', label: 'Pre-authorisation code', type: 'text' },
    { key: 'submitted', label: 'Submitted on', type: 'date', fallback: 'dueDate', demo: [-70, -1] },
    { key: 'amount', label: 'Claimed', type: 'money', fallback: 'value', demo: [80, 1200] },
    { key: 'paid', label: 'Paid', type: 'money' },
  ],
  insights: (rows, ctx) => {
    const out = emptyInsight()
    const open = rows.filter((row) => row.record.status !== ctx.statuses.at(-1) && num(row.v.paid) < num(row.v.amount))
    const bucket = (row: (typeof rows)[number]) => { const age = -daysUntil(str(row.v.submitted)); return age > 60 ? '60+ days' : age > 30 ? '31–60 days' : '0–30 days' }
    out.kpis.push({ label: 'Open claims', value: String(open.length), tone: 'info' }, { label: 'Outstanding', value: gbp(open.reduce((total, row) => total + num(row.v.amount) - num(row.v.paid), 0)), tone: open.length ? 'watch' : 'good' }, { label: 'Over 60 days', value: String(open.filter((row) => bucket(row) === '60+ days').length), tone: open.some((row) => bucket(row) === '60+ days') ? 'risk' : 'good' })
    out.bars.push({ title: 'Claim ageing', items: ['0–30 days', '31–60 days', '60+ days'].map((label) => { const items = open.filter((row) => bucket(row) === label); const value = items.reduce((total, row) => total + num(row.v.amount) - num(row.v.paid), 0); return { label, value, display: gbp(value) } }) })
    const noAuth = open.filter((row) => !str(row.v.authCode) && str(row.v.insurer) !== 'Self-pay')
    if (noAuth.length) out.alerts.push({ text: `${noAuth.length} insured claim${noAuth.length === 1 ? ' has' : 's have'} no pre-authorisation code — the most common reason for rejection.`, tone: 'risk', recordId: noAuth[0].record.id })
    return out
  },
}

export const followUpSchema: OpsSchema = {
  title: 'Follow-up',
  intro: 'Every result and referral closed-loop: actioned and communicated to the patient.',
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: ['Test result', 'Referral', 'Post-treatment check', 'Prescription review'] },
    { key: 'due', label: 'Due', type: 'date', fallback: 'dueDate', demo: [-10, 20] },
    { key: 'patientInformed', label: 'Patient informed', type: 'select', options: ['No', 'Yes'] },
  ],
  insights: (rows) => {
    const out = expiryInsight(rows, [['due', 'Follow-up']], 14)
    const uninformed = rows.filter((row) => str(row.v.patientInformed) !== 'Yes')
    out.kpis.push({ label: 'Patient not informed', value: String(uninformed.length), tone: uninformed.length ? 'watch' : 'good' })
    out.bars.push(countBy(rows, 'type', 'Follow-ups by type'))
    return out
  },
}

export const healthSchemas: Record<string, OpsSchema> = {
  appointments: appointmentSchema,
  patients: patientSchema,
  'care-plans': carePlanSchema,
  triage: triageSchema,
  practitioners: practitionerSchema,
  claims: claimSchema,
  'follow-ups': followUpSchema,
  compliance: complianceSchema,
}

// ── Retail operations ─────────────────────────────────────────────────────
export const inventorySchema: OpsSchema = {
  title: 'Stock item',
  intro: 'Stock value, reorder points and cover — so you never run out of best-sellers or sit on dead stock.',
  fields: [
    { key: 'sku', label: 'SKU', type: 'text', fallback: 'secondary' },
    { key: 'onHand', label: 'On hand', type: 'number', unit: 'units', demo: [0, 240] },
    { key: 'reorderPoint', label: 'Reorder point', type: 'number', unit: 'units', demo: [10, 40] },
    { key: 'weeklySales', label: 'Sells per week', type: 'number', unit: 'units', demo: [2, 30] },
    { key: 'unitCost', label: 'Unit cost', type: 'money', demo: [2, 40] },
    { key: 'leadTimeDays', label: 'Supplier lead time', type: 'number', unit: 'days', demo: [3, 21] },
  ],
  summary: (v) => [{ label: 'Weeks of cover', value: num(v.weeklySales) ? (num(v.onHand) / num(v.weeklySales)).toFixed(1) : '—' }, { label: 'Stock value', value: gbp(num(v.onHand) * num(v.unitCost)) }],
  insights: (rows) => {
    const out = emptyInsight()
    const value = rows.reduce((total, row) => total + num(row.v.onHand) * num(row.v.unitCost), 0)
    const reorder = rows.filter((row) => num(row.v.onHand) <= num(row.v.reorderPoint))
    const out0 = rows.filter((row) => num(row.v.onHand) === 0)
    const overstock = rows.filter((row) => num(row.v.weeklySales) && num(row.v.onHand) / num(row.v.weeklySales) > 12)
    out.kpis.push({ label: 'Stock value', value: gbp(value), tone: 'info' }, { label: 'At or below reorder', value: String(reorder.length), tone: reorder.length ? 'watch' : 'good' }, { label: 'Out of stock', value: String(out0.length), tone: out0.length ? 'risk' : 'good' }, { label: 'Over 12 weeks cover', value: String(overstock.length), tone: overstock.length ? 'watch' : 'good' })
    if (reorder.length) out.tables.push({ title: 'Suggested reorder', columns: ['Item', 'On hand', 'Sells/wk', 'Order qty', 'Cost'], rows: reorder.map((row) => { const qty = Math.max(0, Math.ceil(num(row.v.weeklySales) * (4 + num(row.v.leadTimeDays) / 7)) - num(row.v.onHand)); return [row.record.name, String(num(row.v.onHand)), String(num(row.v.weeklySales)), String(qty), gbp(qty * num(row.v.unitCost))] }), numeric: [1, 2, 3, 4] })
    for (const row of out0.slice(0, 3)) out.alerts.push({ text: `${row.record.name} is out of stock — every day costs about ${Math.round(num(row.v.weeklySales) / 7)} sales.`, tone: 'risk', recordId: row.record.id })
    if (overstock.length) out.alerts.push({ text: `${overstock.length} line${overstock.length === 1 ? ' has' : 's have'} over 12 weeks of stock — consider a promotion to free up cash.`, tone: 'watch', recordId: overstock[0].record.id })
    return out
  },
}

export const productSchema: OpsSchema = {
  title: 'Product',
  intro: 'Price with confidence: cost, VAT and the margin you actually keep.',
  fields: [
    { key: 'sku', label: 'SKU', type: 'text', fallback: 'secondary' },
    { key: 'price', label: 'Selling price (inc VAT)', type: 'money', fallback: 'value', demo: [8, 120] },
    { key: 'cost', label: 'Unit cost (ex VAT)', type: 'money', demo: [3, 50] },
    { key: 'vat', label: 'VAT rate', type: 'select', options: ['20%', '5%', '0%'] },
    { key: 'category', label: 'Category', type: 'text' },
  ],
  summary: (v) => { const net = num(v.price) / (1 + (Number.parseInt(str(v.vat) || '20', 10) / 100)); const margin = net ? (net - num(v.cost)) / net : 0; return [{ label: 'Gross margin', value: net ? `${Math.round(margin * 100)}%` : '—', tone: margin < 0.3 ? 'watch' : 'good' }, { label: 'Profit per unit', value: gbp(net - num(v.cost)) }] },
  insights: (rows) => {
    const out = emptyInsight()
    const margin = (row: (typeof rows)[number]) => { const net = num(row.v.price) / (1 + (Number.parseInt(str(row.v.vat) || '20', 10) / 100)); return net ? (net - num(row.v.cost)) / net : 0 }
    const priced = rows.filter((row) => num(row.v.price) && num(row.v.cost))
    const low = priced.filter((row) => margin(row) < 0.3)
    out.kpis.push({ label: 'Products', value: String(rows.length), tone: 'info' }, { label: 'Average margin', value: priced.length ? `${Math.round((priced.reduce((total, row) => total + margin(row), 0) / priced.length) * 100)}%` : '—', tone: 'info' }, { label: 'Under 30% margin', value: String(low.length), tone: low.length ? 'watch' : 'good' }, { label: 'Missing cost', value: String(rows.length - priced.length), tone: rows.length - priced.length ? 'watch' : 'good' })
    out.tables.push({ title: 'Lowest margins', columns: ['Product', 'Price', 'Cost', 'Margin'], rows: priced.sort((a, b) => margin(a) - margin(b)).slice(0, 8).map((row) => [row.record.name, gbp(num(row.v.price)), gbp(num(row.v.cost)), `${Math.round(margin(row) * 100)}%`]), numeric: [1, 2, 3] })
    return out
  },
}

export const purchaseSchema: OpsSchema = {
  title: 'Purchase order',
  intro: 'Three-way match: what you ordered, what arrived and what you were invoiced.',
  fields: [
    { key: 'supplier', label: 'Supplier', type: 'text', fallback: 'secondary' },
    { key: 'ordered', label: 'Order value', type: 'money', fallback: 'value', demo: [200, 4000] },
    { key: 'expected', label: 'Expected delivery', type: 'date', fallback: 'dueDate', demo: [-10, 14] },
    { key: 'received', label: 'Goods received value', type: 'money' },
    { key: 'invoiced', label: 'Invoice value', type: 'money' },
  ],
  summary: (v) => { const mismatch = num(v.invoiced) && (num(v.invoiced) !== num(v.ordered) || (num(v.received) && num(v.received) !== num(v.invoiced))); return [{ label: '3-way match', value: !num(v.invoiced) ? 'Awaiting invoice' : mismatch ? 'Mismatch — hold payment' : 'Matched', tone: mismatch ? 'risk' : 'good' }] },
  insights: (rows) => {
    const out = emptyInsight()
    const mismatched = rows.filter((row) => num(row.v.invoiced) && (num(row.v.invoiced) !== num(row.v.ordered) || (num(row.v.received) && num(row.v.received) !== num(row.v.invoiced))))
    const late = rows.filter((row) => !num(row.v.received) && daysUntil(str(row.v.expected)) < 0)
    out.kpis.push({ label: 'On order', value: gbp(rows.filter((row) => !num(row.v.received)).reduce((total, row) => total + num(row.v.ordered), 0)), tone: 'info' }, { label: 'Late deliveries', value: String(late.length), tone: late.length ? 'watch' : 'good' }, { label: 'Invoice mismatches', value: String(mismatched.length), tone: mismatched.length ? 'risk' : 'good' })
    for (const row of mismatched.slice(0, 3)) out.alerts.push({ text: `${row.record.name}: invoice ${gbp(num(row.v.invoiced))} vs ordered ${gbp(num(row.v.ordered))} — query before paying.`, tone: 'risk', recordId: row.record.id })
    for (const row of late.slice(0, 3)) out.alerts.push({ text: `${row.record.name} was due ${niceDate(str(row.v.expected))} — chase ${str(row.v.supplier) || 'the supplier'}.`, tone: 'watch', recordId: row.record.id })
    return out
  },
}

const supplierCriteria = ['Quality', 'On-time delivery', 'Price', 'Communication']
export const supplierSchema: OpsSchema = {
  title: 'Supplier',
  intro: 'Score suppliers on the same criteria and renegotiate with evidence.',
  fields: [
    { key: 'terms', label: 'Payment terms', type: 'select', options: ['Pro-forma', '7 days', '14 days', '30 days', '60 days'] },
    { key: 'annualSpend', label: 'Annual spend', type: 'money', fallback: 'value', demo: [1000, 40000] },
    { key: 'scores', label: 'Rating (1–5)', type: 'score', criteria: supplierCriteria },
    { key: 'contractEnd', label: 'Contract renewal', type: 'date', fallback: 'dueDate', demo: [10, 300] },
  ],
  insights: (rows) => {
    const out = expiryInsight(rows, [['contractEnd', 'Contract renewal']], 60)
    const avg = (row: (typeof rows)[number]) => { const values = Object.values((row.v.scores as Record<string, number>) ?? {}).map(Number).filter(Boolean); return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0 }
    out.kpis.unshift({ label: 'Annual spend', value: gbp(rows.reduce((total, row) => total + num(row.v.annualSpend), 0)), tone: 'info' })
    out.tables.push({ title: 'Supplier scorecard', columns: ['Supplier', 'Spend', 'Rating', 'Terms'], rows: rows.sort((a, b) => num(b.v.annualSpend) - num(a.v.annualSpend)).map((row) => [row.record.name, gbp(num(row.v.annualSpend)), avg(row) ? avg(row).toFixed(1) : '—', str(row.v.terms) || '—']), numeric: [1, 2] })
    for (const row of rows.filter((entry) => avg(entry) && avg(entry) < 3)) out.alerts.push({ text: `${row.record.name} rates ${avg(row).toFixed(1)}/5 — review or source an alternative.`, tone: 'watch', recordId: row.record.id })
    return out
  },
}

export const returnSchema: OpsSchema = {
  title: 'Return',
  intro: 'Log the reason and outcome for every return so you fix the cause, not just the refund.',
  fields: [
    { key: 'reason', label: 'Reason', type: 'select', options: ['Faulty', 'Wrong item sent', 'Not as described', 'Changed mind', 'Damaged in transit', 'Wrong size'] },
    { key: 'received', label: 'Received on', type: 'date', fallback: 'dueDate', demo: [-20, 0] },
    { key: 'refund', label: 'Refund value', type: 'money', fallback: 'value', demo: [8, 120] },
    { key: 'condition', label: 'Condition', type: 'select', options: ['Resaleable', 'Refurbish', 'Write off'] },
  ],
  insights: (rows, ctx) => {
    const out = emptyInsight()
    const open = rows.filter((row) => row.record.status !== ctx.statuses.at(-1))
    const late = open.filter((row) => daysUntil(str(row.v.received)) < -14)
    out.kpis.push({ label: 'Returns', value: String(rows.length), tone: 'info' }, { label: 'Refund value', value: gbp(rows.reduce((total, row) => total + num(row.v.refund), 0)), tone: 'info' }, { label: 'Written off', value: gbp(rows.filter((row) => str(row.v.condition) === 'Write off').reduce((total, row) => total + num(row.v.refund), 0)), tone: 'watch' })
    if (late.length) out.alerts.push({ text: `${late.length} return${late.length === 1 ? '' : 's'} received over 14 days ago still open — refunds are due within 14 days under the Consumer Contracts Regulations.`, tone: 'risk', recordId: late[0].record.id })
    out.bars.push(countBy(rows, 'reason', 'Returns by reason'))
    return out
  },
}

export const serviceSchema: OpsSchema = {
  title: 'Service ticket',
  intro: 'Prioritise, categorise and resolve inside the SLA.',
  fields: [
    { key: 'priority', label: 'Priority', type: 'select', options: ['Urgent', 'High', 'Normal', 'Low'] },
    { key: 'category', label: 'Category', type: 'select', options: ['Order issue', 'Delivery', 'Product question', 'Complaint', 'Refund', 'Account'] },
    { key: 'channel', label: 'Channel', type: 'select', options: ['WhatsApp', 'Email', 'Phone', 'In store', 'Social'] },
    { key: 'slaDue', label: 'Respond by', type: 'date', fallback: 'dueDate', demo: [-2, 3] },
  ],
  insights: (rows, ctx) => {
    const out = emptyInsight()
    const open = rows.filter((row) => row.record.status !== ctx.statuses.at(-1))
    const breached = open.filter((row) => daysUntil(str(row.v.slaDue)) < 0)
    out.kpis.push({ label: 'Open tickets', value: String(open.length), tone: 'info' }, { label: 'SLA breached', value: String(breached.length), tone: breached.length ? 'risk' : 'good' }, { label: 'Urgent', value: String(open.filter((row) => str(row.v.priority) === 'Urgent').length), tone: 'watch' })
    out.bars.push(countBy(rows, 'category', 'Tickets by category'), countBy(rows, 'channel', 'Tickets by channel'))
    if (breached.length) out.alerts.push({ text: `${breached.length} ticket${breached.length === 1 ? '' : 's'} past the response time.`, tone: 'risk', recordId: breached[0].record.id })
    return out
  },
}

export const promotionSchema: OpsSchema = {
  title: 'Promotion',
  intro: 'Set a target, measure uplift against a normal week and know if it paid for itself.',
  fields: [
    { key: 'mechanic', label: 'Mechanic', type: 'select', options: ['% off', '£ off', 'BOGOF', '3 for 2', 'Free delivery', 'Bundle'] },
    { key: 'start', label: 'Starts', type: 'date', demo: [-20, 10] },
    { key: 'end', label: 'Ends', type: 'date', fallback: 'dueDate', demo: [0, 30] },
    { key: 'baseline', label: 'Normal weekly sales', type: 'money', demo: [800, 4000] },
    { key: 'actual', label: 'Sales during promotion (weekly)', type: 'money', demo: [900, 6000] },
    { key: 'discountCost', label: 'Discount cost', type: 'money', demo: [100, 900] },
  ],
  summary: (v) => [{ label: 'Uplift', value: num(v.baseline) ? `${Math.round(((num(v.actual) - num(v.baseline)) / num(v.baseline)) * 100)}%` : '—' }, { label: 'Net gain', value: gbp(num(v.actual) - num(v.baseline) - num(v.discountCost)), tone: num(v.actual) - num(v.baseline) - num(v.discountCost) < 0 ? 'risk' : 'good' }],
  insights: (rows) => {
    const out = emptyInsight()
    const net = (row: (typeof rows)[number]) => num(row.v.actual) - num(row.v.baseline) - num(row.v.discountCost)
    const losing = rows.filter((row) => num(row.v.actual) && net(row) < 0)
    out.kpis.push({ label: 'Promotions', value: String(rows.length), tone: 'info' }, { label: 'Net gain', value: gbp(rows.reduce((total, row) => total + net(row), 0)), tone: 'info' }, { label: 'Losing money', value: String(losing.length), tone: losing.length ? 'risk' : 'good' })
    out.tables.push({ title: 'Promotion results', columns: ['Promotion', 'Mechanic', 'Uplift', 'Net'], rows: rows.map((row) => [row.record.name, str(row.v.mechanic) || '—', num(row.v.baseline) ? `${Math.round(((num(row.v.actual) - num(row.v.baseline)) / num(row.v.baseline)) * 100)}%` : '—', gbp(net(row))]), numeric: [2, 3] })
    for (const row of losing.slice(0, 3)) out.alerts.push({ text: `${row.record.name} cost more in discount than it added — don’t repeat it as-is.`, tone: 'risk', recordId: row.record.id })
    return out
  },
}

export const retailSchemas: Record<string, OpsSchema> = {
  inventory: inventorySchema,
  products: productSchema,
  purchasing: purchaseSchema,
  suppliers: supplierSchema,
  returns: returnSchema,
  service: serviceSchema,
  promotions: promotionSchema,
}

// ── Intelligence ──────────────────────────────────────────────────────────
export const riskSchema: OpsSchema = {
  title: 'Risk',
  intro: 'Score likelihood × impact, give every risk an owner and a mitigation, and review the top of the register.',
  fields: [
    { key: 'owner', label: 'Risk owner', type: 'text', fallback: 'owner' },
    { key: 'likelihood', label: 'Likelihood (1–5)', type: 'number', demo: [1, 5] },
    { key: 'impact', label: 'Impact (1–5)', type: 'number', demo: [1, 5] },
    { key: 'mitigation', label: 'Mitigation', type: 'textarea' },
    { key: 'review', label: 'Next review', type: 'date', fallback: 'dueDate', demo: [-10, 60] },
  ],
  summary: (v) => { const score = num(v.likelihood) * num(v.impact); return [{ label: 'Risk score', value: `${score} / 25`, tone: score >= 15 ? 'risk' : score >= 8 ? 'watch' : 'good' }] },
  insights: (rows) => {
    const out = emptyInsight()
    const score = (row: (typeof rows)[number]) => num(row.v.likelihood) * num(row.v.impact)
    const high = rows.filter((row) => score(row) >= 15)
    const unmitigated = rows.filter((row) => score(row) >= 8 && !str(row.v.mitigation))
    out.kpis.push({ label: 'Risks', value: String(rows.length), tone: 'info' }, { label: 'High (15+)', value: String(high.length), tone: high.length ? 'risk' : 'good' }, { label: 'No mitigation', value: String(unmitigated.length), tone: unmitigated.length ? 'watch' : 'good' })
    out.tables.push({ title: 'Heat map (likelihood ↓ × impact →)', columns: ['L \\ I', '1', '2', '3', '4', '5'], rows: [5, 4, 3, 2, 1].map((likelihood) => [String(likelihood), ...[1, 2, 3, 4, 5].map((impact) => String(rows.filter((row) => num(row.v.likelihood) === likelihood && num(row.v.impact) === impact).length || '·'))]), numeric: [1, 2, 3, 4, 5] })
    out.tables.push({ title: 'Top risks', columns: ['Risk', 'Owner', 'Score'], rows: rows.sort((a, b) => score(b) - score(a)).slice(0, 6).map((row) => [row.record.name, str(row.v.owner) || '—', String(score(row))]), numeric: [2] })
    for (const row of unmitigated.slice(0, 3)) out.alerts.push({ text: `${row.record.name} scores ${score(row)} with no mitigation recorded.`, tone: 'watch', recordId: row.record.id })
    return out
  },
}

export const scenarioSchema: OpsSchema = {
  title: 'Scenario',
  intro: 'Model best, base and worst cases with explicit assumptions.',
  fields: [
    { key: 'revenueChange', label: 'Revenue change', type: 'number', unit: '%', demo: [-20, 25] },
    { key: 'costChange', label: 'Cost change', type: 'number', unit: '%', demo: [-10, 15] },
    { key: 'baseRevenue', label: 'Current monthly revenue', type: 'money', demo: [20000, 90000] },
    { key: 'baseCost', label: 'Current monthly costs', type: 'money', demo: [15000, 70000] },
    { key: 'assumptions', label: 'Assumptions', type: 'textarea' },
  ],
  summary: (v) => { const profit = num(v.baseRevenue) * (1 + num(v.revenueChange) / 100) - num(v.baseCost) * (1 + num(v.costChange) / 100); return [{ label: 'Monthly profit', value: gbp(profit), tone: profit < 0 ? 'risk' : 'good' }, { label: 'vs today', value: gbp(profit - (num(v.baseRevenue) - num(v.baseCost))) }] },
  insights: (rows) => {
    const out = emptyInsight()
    const profit = (row: (typeof rows)[number]) => num(row.v.baseRevenue) * (1 + num(row.v.revenueChange) / 100) - num(row.v.baseCost) * (1 + num(row.v.costChange) / 100)
    out.bars.push({ title: 'Monthly profit by scenario', items: rows.map((row) => ({ label: row.record.name, value: Math.max(0, profit(row)), display: gbp(profit(row)) })) })
    const losses = rows.filter((row) => profit(row) < 0)
    out.kpis.push({ label: 'Scenarios', value: String(rows.length), tone: 'info' }, { label: 'Loss-making', value: String(losses.length), tone: losses.length ? 'risk' : 'good' })
    for (const row of losses) out.alerts.push({ text: `In “${row.record.name}” you lose ${gbp(-profit(row))} a month — plan the trigger and response now.`, tone: 'watch', recordId: row.record.id })
    return out
  },
}

export const intelligenceSchemas: Record<string, OpsSchema> = { risks: riskSchema, scenarios: scenarioSchema }

const registry: Record<string, Record<string, OpsSchema>> = {
  hr: hrSchemas,
  talent: talentSchemas,
  logistics: logisticsSchemas,
  health: healthSchemas,
  retail: retailSchemas,
  intelligence: intelligenceSchemas,
}

// Modules that already have a bespoke editor (finance documents, sales, campaigns) are left alone.
export function opsSchemaFor(workspace: string, moduleId: string): OpsSchema | null {
  const bySlug = registry[workspace]?.[moduleId]
  if (bySlug) return bySlug
  if (moduleId === 'inventory') return inventorySchema
  if (moduleId === 'compliance') return complianceSchema
  return null
}

export * from './ops'
