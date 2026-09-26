/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Talent (recruitment) and Logistics (transport operations) specialist tools.
import {
  avgScore, countBy, daysUntil, emptyInsight, expiryInsight, gbp, list, niceDate, num, pctText, str, type OpsSchema,
} from './ops'

// ── Talent ────────────────────────────────────────────────────────────────
export const jobSchema: OpsSchema = {
  title: 'Job',
  intro: 'A well-specified role fills faster: clear salary, location and a target date.',
  fields: [
    { key: 'client', label: 'Client / department', type: 'text', fallback: 'secondary' },
    { key: 'opened', label: 'Opened on', type: 'date', demo: [-60, -2] },
    { key: 'target', label: 'Target fill date', type: 'date', fallback: 'dueDate', demo: [-5, 45] },
    { key: 'salaryMin', label: 'Salary from', type: 'money', demo: [24000, 38000] },
    { key: 'salaryMax', label: 'Salary to', type: 'money', demo: [38000, 60000] },
    { key: 'workType', label: 'Work pattern', type: 'select', options: ['On-site', 'Hybrid', 'Remote'] },
    { key: 'contract', label: 'Contract', type: 'select', options: ['Permanent', 'Contract', 'Temporary'] },
    { key: 'openings', label: 'Openings', type: 'number', demo: [1, 3] },
  ],
  summary: (v) => [{ label: 'Days open', value: str(v.opened) ? String(-daysUntil(str(v.opened))) : '—' }],
  insights: (rows, ctx) => {
    const out = emptyInsight()
    const open = rows.filter((row) => row.record.status !== ctx.statuses.at(-1))
    const ages = open.map((row) => -daysUntil(str(row.v.opened))).filter(Number.isFinite)
    const late = open.filter((row) => daysUntil(str(row.v.target)) < 0)
    const noSalary = open.filter((row) => !num(row.v.salaryMin))
    out.kpis.push({ label: 'Open roles', value: String(open.length), tone: 'info' }, { label: 'Average days open', value: ages.length ? String(Math.round(ages.reduce((a, b) => a + b, 0) / ages.length)) : '—', tone: 'info' }, { label: 'Past target date', value: String(late.length), tone: late.length ? 'risk' : 'good' })
    if (noSalary.length) out.alerts.push({ text: `${noSalary.length} advert${noSalary.length === 1 ? ' has' : 's have'} no salary — ads with a salary get far more applicants.`, tone: 'watch', recordId: noSalary[0].record.id })
    for (const row of late.slice(0, 3)) out.alerts.push({ text: `${row.record.name} missed its target fill date — widen sourcing or revisit the salary.`, tone: 'risk', recordId: row.record.id })
    out.tables.push({ title: 'Open roles by age', columns: ['Role', 'Days open', 'Salary', 'Pattern'], rows: open.sort((a, b) => str(a.v.opened).localeCompare(str(b.v.opened))).map((row) => [row.record.name, str(row.v.opened) ? String(-daysUntil(str(row.v.opened))) : '—', num(row.v.salaryMin) ? `${gbp(num(row.v.salaryMin))}–${gbp(num(row.v.salaryMax))}` : '—', str(row.v.workType) || '—']), numeric: [1] })
    return out
  },
}

export const candidateSchema: OpsSchema = {
  title: 'Candidate',
  intro: 'Capture where candidates come from and move them on within 48 hours so good people don’t go elsewhere.',
  fields: [
    { key: 'role', label: 'Applied for', type: 'text', fallback: 'secondary' },
    { key: 'source', label: 'Source', type: 'select', options: ['Job board', 'LinkedIn', 'Referral', 'Careers page', 'Agency', 'Talent pool', 'Social'] },
    { key: 'applied', label: 'Applied on', type: 'date', demo: [-30, 0] },
    { key: 'lastContact', label: 'Last contact', type: 'date', fallback: 'dueDate', demo: [-10, 0] },
    { key: 'expectedSalary', label: 'Expected salary', type: 'money', demo: [25000, 55000] },
    { key: 'noticePeriod', label: 'Notice period', type: 'select', options: ['Immediate', '1 week', '1 month', '3 months'] },
    { key: 'rightToWork', label: 'Right to work', type: 'select', options: ['Confirmed', 'Needs sponsorship', 'Not checked'] },
  ],
  insights: (rows, ctx) => {
    const out = emptyInsight()
    out.bars.push({ title: 'Pipeline funnel', items: ctx.statuses.map((status) => { const count = rows.filter((row) => row.record.status === status).length; return { label: status, value: count, display: `${count} (${pctText(count, rows.length)})` } }) })
    const hired = ctx.statuses.at(-1)
    const bySource = new Map<string, { total: number; hired: number }>()
    for (const row of rows) { const source = str(row.v.source) || 'Unknown'; const current = bySource.get(source) ?? { total: 0, hired: 0 }; bySource.set(source, { total: current.total + 1, hired: current.hired + (row.record.status === hired ? 1 : 0) }) }
    out.tables.push({ title: 'Source effectiveness', columns: ['Source', 'Candidates', 'Hired', 'Conversion'], rows: [...bySource.entries()].sort((a, b) => b[1].total - a[1].total).map(([source, item]) => [source, String(item.total), String(item.hired), pctText(item.hired, item.total)]), numeric: [1, 2, 3] })
    const stale = rows.filter((row) => row.record.status !== hired && daysUntil(str(row.v.lastContact)) < -2)
    out.kpis.push({ label: 'Candidates', value: String(rows.length), tone: 'info' }, { label: 'No contact 48h+', value: String(stale.length), tone: stale.length ? 'risk' : 'good' }, { label: 'Hire rate', value: pctText(rows.filter((row) => row.record.status === hired).length, rows.length), tone: 'info' })
    if (stale.length) out.alerts.push({ text: `${stale.length} candidate${stale.length === 1 ? ' hasn’t' : 's haven’t'} heard from you in over 48 hours.`, tone: 'risk', recordId: stale[0].record.id })
    const sponsor = rows.filter((row) => str(row.v.rightToWork) === 'Not checked' && row.record.status !== ctx.statuses[0])
    if (sponsor.length) out.alerts.push({ text: `${sponsor.length} progressing candidate${sponsor.length === 1 ? ' has' : 's have'} no right-to-work status.`, tone: 'watch', recordId: sponsor[0].record.id })
    return out
  },
}

const interviewCriteria = ['Skills & experience', 'Problem solving', 'Communication', 'Motivation', 'Culture add']
export const interviewSchema: OpsSchema = {
  title: 'Interview scorecard',
  intro: 'Structured interviews: same criteria for everyone, scored straight after, with a clear recommendation.',
  fields: [
    { key: 'candidate', label: 'Candidate', type: 'text', fallback: 'name' },
    { key: 'interviewer', label: 'Interviewer', type: 'text', fallback: 'owner' },
    { key: 'date', label: 'Interview date', type: 'date', fallback: 'dueDate', demo: [-7, 7] },
    { key: 'format', label: 'Format', type: 'select', options: ['Phone screen', 'Video', 'In person', 'Technical task', 'Panel'] },
    { key: 'scores', label: 'Scores (1–5)', type: 'score', criteria: interviewCriteria },
    { key: 'recommendation', label: 'Recommendation', type: 'select', options: ['Strong yes', 'Yes', 'No', 'Strong no'] },
    { key: 'notes', label: 'Evidence and notes', type: 'textarea' },
  ],
  summary: (v) => { const score = avgScore(v.scores); return [{ label: 'Score', value: score ? `${score.toFixed(1)} / 5` : '—', tone: score >= 4 ? 'good' : score && score < 3 ? 'risk' : 'info' }] },
  insights: (rows) => {
    const out = emptyInsight()
    const pendingFeedback = rows.filter((row) => daysUntil(str(row.v.date)) < -2 && !str(row.v.recommendation))
    const upcoming = rows.filter((row) => { const days = daysUntil(str(row.v.date)); return days >= 0 && days <= 7 })
    const scored = rows.filter((row) => avgScore(row.v.scores))
    out.kpis.push({ label: 'Interviews this week', value: String(upcoming.length), tone: 'info' }, { label: 'Feedback overdue', value: String(pendingFeedback.length), tone: pendingFeedback.length ? 'risk' : 'good' }, { label: 'Average score', value: scored.length ? (scored.reduce((total, row) => total + avgScore(row.v.scores), 0) / scored.length).toFixed(1) : '—', tone: 'info' })
    if (pendingFeedback.length) out.alerts.push({ text: `${pendingFeedback.length} interview${pendingFeedback.length === 1 ? ' needs' : 's need'} feedback — send it within 48 hours.`, tone: 'risk', recordId: pendingFeedback[0].record.id })
    out.tables.push({ title: 'Ranked candidates', columns: ['Candidate', 'Format', 'Score', 'Recommendation'], rows: scored.sort((a, b) => avgScore(b.v.scores) - avgScore(a.v.scores)).map((row) => [str(row.v.candidate) || row.record.name, str(row.v.format) || '—', avgScore(row.v.scores).toFixed(1), str(row.v.recommendation) || '—']), numeric: [2] })
    return out
  },
}

const offerConditions = ['Right to work verified', 'Two references received', 'DBS check (if required)', 'Qualifications verified', 'Medical questionnaire (if required)']
export const offerSchema: OpsSchema = {
  title: 'Offer',
  intro: 'Make the offer, track the conditions and generate the offer letter in one place.',
  fields: [
    { key: 'candidate', label: 'Candidate', type: 'text', fallback: 'name' },
    { key: 'role', label: 'Role', type: 'text', fallback: 'secondary' },
    { key: 'salary', label: 'Salary offered', type: 'money', fallback: 'value', demo: [26000, 60000] },
    { key: 'startDate', label: 'Proposed start', type: 'date', demo: [10, 60] },
    { key: 'expires', label: 'Offer expires', type: 'date', fallback: 'dueDate', demo: [-2, 10] },
    { key: 'benefits', label: 'Benefits', type: 'textarea', placeholder: 'Pension, holiday, bonus, hybrid working…' },
    { key: 'conditions', label: 'Conditions met', type: 'checklist', items: offerConditions },
  ],
  letter: {
    label: 'Offer letter',
    build: (v, record) => `Dear ${str(v.candidate) || record.name},\n\nWe are delighted to offer you the position of ${str(v.role) || 'the role'} at a salary of ${gbp(num(v.salary))} per year, starting on ${niceDate(str(v.startDate))}.\n\n${str(v.benefits) ? `Benefits: ${str(v.benefits)}\n\n` : ''}This offer is conditional on:\n${offerConditions.map((condition) => `• ${condition}${list(v.conditions).includes(condition) ? ' ✓' : ''}`).join('\n')}\n\nPlease confirm your acceptance by ${niceDate(str(v.expires))}. Your written statement of employment will follow before your first day.\n\nWe look forward to welcoming you.\n\nKind regards`,
  },
  insights: (rows, ctx) => {
    const out = emptyInsight()
    const accepted = rows.filter((row) => row.record.status === ctx.statuses.at(-1))
    const expiring = rows.filter((row) => row.record.status !== ctx.statuses.at(-1) && daysUntil(str(row.v.expires)) <= 2)
    const conditionsOpen = accepted.filter((row) => list(row.v.conditions).length < offerConditions.length)
    out.kpis.push({ label: 'Offers', value: String(rows.length), tone: 'info' }, { label: 'Acceptance rate', value: pctText(accepted.length, rows.length), tone: 'info' }, { label: 'Expiring soon', value: String(expiring.length), tone: expiring.length ? 'watch' : 'good' }, { label: 'Offer value', value: gbp(rows.reduce((total, row) => total + num(row.v.salary), 0)), tone: 'info' })
    for (const row of expiring.slice(0, 3)) out.alerts.push({ text: `Offer to ${str(row.v.candidate) || row.record.name} expires ${niceDate(str(row.v.expires))} — call them today.`, tone: 'watch', recordId: row.record.id })
    if (conditionsOpen.length) out.alerts.push({ text: `${conditionsOpen.length} accepted offer${conditionsOpen.length === 1 ? ' has' : 's have'} conditions still open.`, tone: 'risk', recordId: conditionsOpen[0].record.id })
    return out
  },
}

export const placementSchema: OpsSchema = {
  title: 'Placement',
  intro: 'Calculate the fee and protect it through the rebate period.',
  fields: [
    { key: 'candidate', label: 'Candidate', type: 'text', fallback: 'name' },
    { key: 'client', label: 'Client', type: 'text', fallback: 'secondary' },
    { key: 'salary', label: 'Starting salary', type: 'money', demo: [25000, 65000] },
    { key: 'feePercent', label: 'Fee', type: 'number', unit: '%', demo: [15, 22] },
    { key: 'startDate', label: 'Start date', type: 'date', fallback: 'dueDate', demo: [-80, 20] },
    { key: 'rebateWeeks', label: 'Rebate period', type: 'number', unit: 'weeks', demo: [8, 12] },
    { key: 'invoiced', label: 'Fee invoiced', type: 'select', options: ['Not yet', 'Invoiced', 'Paid'] },
  ],
  summary: (v) => [{ label: 'Fee', value: gbp((num(v.salary) * num(v.feePercent)) / 100) }],
  insights: (rows) => {
    const out = emptyInsight()
    const fee = (row: (typeof rows)[number]) => (num(row.v.salary) * num(row.v.feePercent)) / 100
    const inRebate = rows.filter((row) => { const since = -daysUntil(str(row.v.startDate)); return since >= 0 && since < num(row.v.rebateWeeks) * 7 })
    const uninvoiced = rows.filter((row) => str(row.v.invoiced) === 'Not yet' && daysUntil(str(row.v.startDate)) <= 0)
    out.kpis.push({ label: 'Placements', value: String(rows.length), tone: 'info' }, { label: 'Total fees', value: gbp(rows.reduce((total, row) => total + fee(row), 0)), tone: 'good' }, { label: 'Average fee', value: pctText(rows.reduce((total, row) => total + num(row.v.feePercent), 0), rows.length * 100), tone: 'info' }, { label: 'Fees at rebate risk', value: gbp(inRebate.reduce((total, row) => total + fee(row), 0)), tone: inRebate.length ? 'watch' : 'good' })
    if (uninvoiced.length) out.alerts.push({ text: `${uninvoiced.length} candidate${uninvoiced.length === 1 ? ' has' : 's have'} started but the fee isn’t invoiced.`, tone: 'risk', recordId: uninvoiced[0].record.id })
    for (const row of inRebate.slice(0, 3)) out.alerts.push({ text: `Check in with ${str(row.v.candidate) || row.record.name} — still inside the rebate period.`, tone: 'info', recordId: row.record.id })
    return out
  },
}

export const referenceSchema: OpsSchema = {
  title: 'Reference',
  intro: 'Chase references early — they are the most common reason start dates slip.',
  fields: [
    { key: 'candidate', label: 'Candidate', type: 'text', fallback: 'secondary' },
    { key: 'referee', label: 'Referee', type: 'text', fallback: 'name' },
    { key: 'relationship', label: 'Relationship', type: 'select', options: ['Line manager', 'Colleague', 'Client', 'Academic', 'Character'] },
    { key: 'requested', label: 'Requested on', type: 'date', fallback: 'dueDate', demo: [-14, 0] },
    { key: 'outcome', label: 'Outcome', type: 'select', options: ['Awaiting', 'Satisfactory', 'Concerns raised'] },
  ],
  insights: (rows) => {
    const out = emptyInsight()
    const waiting = rows.filter((row) => str(row.v.outcome) !== 'Satisfactory' && str(row.v.outcome) !== 'Concerns raised')
    const slow = waiting.filter((row) => daysUntil(str(row.v.requested)) < -5)
    out.kpis.push({ label: 'Awaiting', value: String(waiting.length), tone: waiting.length ? 'watch' : 'good' }, { label: 'Over 5 days', value: String(slow.length), tone: slow.length ? 'risk' : 'good' }, { label: 'Concerns', value: String(rows.filter((row) => str(row.v.outcome) === 'Concerns raised').length), tone: 'info' })
    if (slow.length) out.alerts.push({ text: `${slow.length} reference${slow.length === 1 ? '' : 's'} requested over 5 days ago — chase by phone.`, tone: 'risk', recordId: slow[0].record.id })
    return out
  },
}

export const talentPoolSchema: OpsSchema = {
  title: 'Talent pool profile',
  intro: 'Keep great people warm so the next hire starts with a shortlist.',
  fields: [
    { key: 'skills', label: 'Key skills', type: 'text', fallback: 'secondary' },
    { key: 'availability', label: 'Availability', type: 'select', options: ['Actively looking', 'Open to offers', 'Not now'] },
    { key: 'lastContact', label: 'Last contact', type: 'date', fallback: 'dueDate', demo: [-150, -1] },
    { key: 'salary', label: 'Salary expectation', type: 'money', demo: [24000, 70000] },
  ],
  insights: (rows) => {
    const out = emptyInsight()
    const cold = rows.filter((row) => daysUntil(str(row.v.lastContact)) < -90)
    out.kpis.push({ label: 'In pool', value: String(rows.length), tone: 'info' }, { label: 'Actively looking', value: String(rows.filter((row) => str(row.v.availability) === 'Actively looking').length), tone: 'good' }, { label: 'Not contacted 90d+', value: String(cold.length), tone: cold.length ? 'watch' : 'good' })
    if (cold.length) out.alerts.push({ text: `${cold.length} people haven’t heard from you in 3 months — send a quick check-in.`, tone: 'watch', recordId: cold[0].record.id })
    out.bars.push(countBy(rows, 'availability', 'Availability'))
    return out
  },
}

export const clientSchema: OpsSchema = {
  title: 'Client account',
  intro: 'Agreed terms and account health for every hiring client.',
  fields: [
    { key: 'feePercent', label: 'Agreed fee', type: 'number', unit: '%', demo: [15, 22] },
    { key: 'terms', label: 'Terms signed', type: 'select', options: ['Signed', 'Sent', 'Not sent'] },
    { key: 'openRoles', label: 'Open roles', type: 'number', demo: [0, 5] },
    { key: 'lastReview', label: 'Last account review', type: 'date', fallback: 'dueDate', demo: [-120, -5] },
  ],
  insights: (rows) => {
    const out = emptyInsight()
    const unsigned = rows.filter((row) => str(row.v.terms) !== 'Signed')
    out.kpis.push({ label: 'Clients', value: String(rows.length), tone: 'info' }, { label: 'Open roles', value: String(rows.reduce((total, row) => total + num(row.v.openRoles), 0)), tone: 'info' }, { label: 'Terms not signed', value: String(unsigned.length), tone: unsigned.length ? 'risk' : 'good' })
    if (unsigned.length) out.alerts.push({ text: `${unsigned.length} client${unsigned.length === 1 ? '' : 's'} without signed terms — don’t send CVs until they sign.`, tone: 'risk', recordId: unsigned[0].record.id })
    return out
  },
}

export const talentSchemas: Record<string, OpsSchema> = {
  jobs: jobSchema,
  candidates: candidateSchema,
  interviews: interviewSchema,
  offers: offerSchema,
  placements: placementSchema,
  references: referenceSchema,
  'talent-pool': talentPoolSchema,
  clients: clientSchema,
}

// ── Logistics ─────────────────────────────────────────────────────────────
export const dispatchSchema: OpsSchema = {
  title: 'Job',
  intro: 'Plan each job against vehicle capacity and the customer’s time window.',
  fields: [
    { key: 'driver', label: 'Driver', type: 'text', fallback: 'owner' },
    { key: 'vehicle', label: 'Vehicle', type: 'text', placeholder: 'Registration' },
    { key: 'date', label: 'Collection date', type: 'date', fallback: 'dueDate', demo: [0, 3] },
    { key: 'windowStart', label: 'Window from', type: 'time', demo: [7, 12] },
    { key: 'windowEnd', label: 'Window to', type: 'time', demo: [12, 18] },
    { key: 'pallets', label: 'Pallets', type: 'number', demo: [1, 12] },
    { key: 'weightKg', label: 'Weight', type: 'number', unit: 'kg', demo: [200, 6000] },
    { key: 'capacity', label: 'Vehicle capacity', type: 'number', unit: 'pallets', demo: [12, 26] },
  ],
  summary: (v) => [{ label: 'Load', value: pctText(num(v.pallets), num(v.capacity)), tone: num(v.pallets) > num(v.capacity) && num(v.capacity) ? 'risk' : 'good' }],
  insights: (rows) => {
    const out = emptyInsight()
    const unassigned = rows.filter((row) => !str(row.v.driver))
    const byDriver = new Map<string, { jobs: number; pallets: number; capacity: number }>()
    for (const row of rows.filter((entry) => str(entry.v.driver))) { const driver = str(row.v.driver); const current = byDriver.get(driver) ?? { jobs: 0, pallets: 0, capacity: 0 }; byDriver.set(driver, { jobs: current.jobs + 1, pallets: current.pallets + num(row.v.pallets), capacity: Math.max(current.capacity, num(row.v.capacity)) }) }
    out.kpis.push({ label: 'Jobs', value: String(rows.length), tone: 'info' }, { label: 'Unassigned', value: String(unassigned.length), tone: unassigned.length ? 'risk' : 'good' }, { label: 'Pallets', value: String(rows.reduce((total, row) => total + num(row.v.pallets), 0)), tone: 'info' })
    out.tables.push({ title: 'Load by driver', columns: ['Driver', 'Jobs', 'Pallets', 'Capacity used'], rows: [...byDriver.entries()].map(([driver, item]) => [driver, String(item.jobs), String(item.pallets), pctText(item.pallets, item.capacity)]), numeric: [1, 2, 3] })
    for (const row of rows.filter((entry) => num(entry.v.capacity) && num(entry.v.pallets) > num(entry.v.capacity)).slice(0, 3)) out.alerts.push({ text: `${row.record.name} is over the vehicle’s capacity — split the load.`, tone: 'risk', recordId: row.record.id })
    if (unassigned.length) out.alerts.push({ text: `${unassigned.length} job${unassigned.length === 1 ? '' : 's'} need a driver.`, tone: 'watch', recordId: unassigned[0].record.id })
    return out
  },
}

export const routeSchema: OpsSchema = {
  title: 'Route',
  intro: 'Measure every route on stops, miles, cost per mile and on-time performance.',
  fields: [
    { key: 'driver', label: 'Driver', type: 'text', fallback: 'owner' },
    { key: 'date', label: 'Date', type: 'date', fallback: 'dueDate', demo: [-7, 2] },
    { key: 'stops', label: 'Stops', type: 'number', demo: [6, 28] },
    { key: 'miles', label: 'Planned miles', type: 'number', demo: [40, 240] },
    { key: 'onTimeStops', label: 'Stops on time', type: 'number', demo: [5, 26] },
    { key: 'fuelCost', label: 'Fuel cost', type: 'money', demo: [40, 180] },
    { key: 'driverCost', label: 'Driver cost', type: 'money', demo: [110, 190] },
  ],
  summary: (v) => [{ label: 'Cost per mile', value: num(v.miles) ? `£${((num(v.fuelCost) + num(v.driverCost)) / 100 / num(v.miles)).toFixed(2)}` : '—' }, { label: 'On time', value: pctText(Math.min(num(v.onTimeStops), num(v.stops)), num(v.stops)) }],
  insights: (rows) => {
    const out = emptyInsight()
    const stops = rows.reduce((total, row) => total + num(row.v.stops), 0)
    const onTime = rows.reduce((total, row) => total + Math.min(num(row.v.onTimeStops), num(row.v.stops)), 0)
    const miles = rows.reduce((total, row) => total + num(row.v.miles), 0)
    const cost = rows.reduce((total, row) => total + num(row.v.fuelCost) + num(row.v.driverCost), 0)
    out.kpis.push({ label: 'Routes', value: String(rows.length), tone: 'info' }, { label: 'On-time', value: pctText(onTime, stops), tone: stops && onTime / stops < 0.95 ? 'watch' : 'good' }, { label: 'Cost per mile', value: miles ? `£${(cost / 100 / miles).toFixed(2)}` : '—', tone: 'info' }, { label: 'Cost per stop', value: stops ? `£${(cost / 100 / stops).toFixed(2)}` : '—', tone: 'info' })
    out.tables.push({ title: 'Route performance', columns: ['Route', 'Stops', 'Miles', 'On time', '£/mile'], rows: rows.map((row) => [row.record.name, String(num(row.v.stops)), String(num(row.v.miles)), pctText(Math.min(num(row.v.onTimeStops), num(row.v.stops)), num(row.v.stops)), num(row.v.miles) ? ((num(row.v.fuelCost) + num(row.v.driverCost)) / 100 / num(row.v.miles)).toFixed(2) : '—']), numeric: [1, 2, 3, 4] })
    for (const row of rows.filter((entry) => num(entry.v.stops) && num(entry.v.onTimeStops) / num(entry.v.stops) < 0.85).slice(0, 3)) out.alerts.push({ text: `${row.record.name} delivered under 85% on time — re-sequence stops or add time.`, tone: 'watch', recordId: row.record.id })
    return out
  },
}

export const deliverySchema: OpsSchema = {
  title: 'Delivery',
  intro: 'OTIF (on time, in full) with proof of delivery on every drop.',
  fields: [
    { key: 'promised', label: 'Promised date', type: 'date', fallback: 'dueDate', demo: [-5, 3] },
    { key: 'delivered', label: 'Delivered date', type: 'date', demo: [-5, 3] },
    { key: 'inFull', label: 'Delivered in full', type: 'select', options: ['Yes', 'Short', 'Damaged'] },
    { key: 'pod', label: 'Proof of delivery', type: 'select', options: ['Signature', 'Photo', 'Signature + photo', 'None'] },
    { key: 'failure', label: 'Failure reason', type: 'select', options: ['—', 'Not in', 'Wrong address', 'Refused', 'Access problem', 'Vehicle issue', 'Late loading'] },
  ],
  insights: (rows) => {
    const out = emptyInsight()
    const done = rows.filter((row) => str(row.v.delivered))
    const onTime = done.filter((row) => str(row.v.delivered) <= str(row.v.promised))
    const otif = onTime.filter((row) => str(row.v.inFull) === 'Yes')
    const noPod = done.filter((row) => str(row.v.pod) === 'None' || !str(row.v.pod))
    out.kpis.push({ label: 'Delivered', value: String(done.length), tone: 'info' }, { label: 'OTIF', value: pctText(otif.length, done.length), tone: done.length && otif.length / done.length < 0.95 ? 'watch' : 'good' }, { label: 'On time', value: pctText(onTime.length, done.length), tone: 'info' }, { label: 'Missing POD', value: String(noPod.length), tone: noPod.length ? 'risk' : 'good' })
    if (noPod.length) out.alerts.push({ text: `${noPod.length} deliver${noPod.length === 1 ? 'y has' : 'ies have'} no proof of delivery — you can’t defend a claim without it.`, tone: 'risk', recordId: noPod[0].record.id })
    const failures = rows.filter((row) => str(row.v.failure) && str(row.v.failure) !== '—')
    out.bars.push({ ...countBy(failures, 'failure', 'Failed delivery reasons') })
    const late = rows.filter((row) => !str(row.v.delivered) && daysUntil(str(row.v.promised)) < 0)
    if (late.length) out.alerts.push({ text: `${late.length} deliver${late.length === 1 ? 'y is' : 'ies are'} past the promised date — update the customer.`, tone: 'watch', recordId: late[0].record.id })
    return out
  },
}

const walkaround = ['Tyres and wheel nuts', 'Lights and indicators', 'Mirrors and glass', 'Brakes', 'Fluid levels', 'Load security', 'Bodywork damage', 'Tachograph working']
export const fleetSchema: OpsSchema = {
  title: 'Vehicle',
  intro: 'Keep every vehicle legal and roadworthy: MOT, service, insurance, tax and daily walkaround checks.',
  fields: [
    { key: 'registration', label: 'Registration', type: 'text', fallback: 'name' },
    { key: 'type', label: 'Type', type: 'select', options: ['Van (<3.5t)', '7.5t', '18t', 'HGV artic', 'Car'] },
    { key: 'mileage', label: 'Odometer', type: 'number', unit: 'miles', demo: [12000, 180000] },
    { key: 'mot', label: 'MOT due', type: 'date', fallback: 'dueDate', demo: [-10, 300] },
    { key: 'service', label: 'Service due', type: 'date', demo: [-20, 120] },
    { key: 'insurance', label: 'Insurance renewal', type: 'date', demo: [10, 360] },
    { key: 'tax', label: 'Road tax due', type: 'date', demo: [5, 360] },
    { key: 'check', label: 'Today’s walkaround check', type: 'checklist', items: walkaround },
  ],
  insights: (rows) => {
    const out = expiryInsight(rows, [['mot', 'MOT'], ['service', 'Service'], ['insurance', 'Insurance'], ['tax', 'Road tax']], 45)
    const unchecked = rows.filter((row) => list(row.v.check).length < walkaround.length)
    out.kpis.unshift({ label: 'Vehicles', value: String(rows.length), tone: 'info' })
    out.kpis.push({ label: 'Walkaround incomplete', value: String(unchecked.length), tone: unchecked.length ? 'watch' : 'good' })
    if (unchecked.length) out.alerts.push({ text: `${unchecked.length} vehicle${unchecked.length === 1 ? '' : 's'} without a complete daily walkaround check.`, tone: 'watch', recordId: unchecked[0].record.id })
    return out
  },
}

export const driverSchema: OpsSchema = {
  title: 'Driver',
  intro: 'Licence, Driver CPC and tacho card validity for every driver — checked before they drive.',
  fields: [
    { key: 'licenceCategories', label: 'Licence categories', type: 'text', placeholder: 'B, C1, C, CE' },
    { key: 'licenceCheck', label: 'Last DVLA licence check', type: 'date', demo: [-200, -5] },
    { key: 'points', label: 'Penalty points', type: 'number', demo: [0, 6] },
    { key: 'cpc', label: 'Driver CPC expires', type: 'date', fallback: 'dueDate', demo: [-10, 700] },
    { key: 'tacho', label: 'Tacho card expires', type: 'date', demo: [20, 1500] },
    { key: 'medical', label: 'Medical (D4) due', type: 'date', demo: [30, 1500] },
  ],
  insights: (rows) => {
    const out = expiryInsight(rows, [['cpc', 'Driver CPC'], ['tacho', 'Tacho card'], ['medical', 'D4 medical']], 60)
    const staleChecks = rows.filter((row) => daysUntil(str(row.v.licenceCheck)) < -180)
    const points = rows.filter((row) => num(row.v.points) >= 6)
    out.kpis.push({ label: 'Licence check >6 months', value: String(staleChecks.length), tone: staleChecks.length ? 'watch' : 'good' })
    if (staleChecks.length) out.alerts.push({ text: `${staleChecks.length} driver${staleChecks.length === 1 ? '' : 's'} due a DVLA licence check (every 6 months recommended).`, tone: 'watch', recordId: staleChecks[0].record.id })
    for (const row of points) out.alerts.push({ text: `${row.record.name} has ${num(row.v.points)} penalty points — review with your insurer.`, tone: 'watch', recordId: row.record.id })
    return out
  },
}

export const exceptionSchema: OpsSchema = {
  title: 'Exception',
  intro: 'Log the root cause and the cost so recurring problems get fixed, not just handled.',
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: ['Delay', 'Damage', 'Shortage', 'Failed delivery', 'Breakdown', 'Accident', 'Customer complaint'] },
    { key: 'severity', label: 'Severity', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
    { key: 'raised', label: 'Raised on', type: 'date', demo: [-10, 0] },
    { key: 'cost', label: 'Cost', type: 'money', fallback: 'value', demo: [0, 900] },
    { key: 'rootCause', label: 'Root cause', type: 'textarea' },
  ],
  insights: (rows, ctx) => {
    const out = emptyInsight()
    const open = rows.filter((row) => row.record.status !== ctx.statuses.at(-1))
    const critical = open.filter((row) => ['High', 'Critical'].includes(str(row.v.severity)))
    out.kpis.push({ label: 'Open', value: String(open.length), tone: open.length ? 'watch' : 'good' }, { label: 'High / critical', value: String(critical.length), tone: critical.length ? 'risk' : 'good' }, { label: 'Cost of exceptions', value: gbp(rows.reduce((total, row) => total + num(row.v.cost), 0)), tone: 'info' })
    out.bars.push(countBy(rows, 'type', 'Exceptions by type'))
    const noCause = rows.filter((row) => row.record.status === ctx.statuses.at(-1) && !str(row.v.rootCause))
    if (noCause.length) out.alerts.push({ text: `${noCause.length} closed exception${noCause.length === 1 ? ' has' : 's have'} no root cause recorded.`, tone: 'watch', recordId: noCause[0].record.id })
    return out
  },
}

export const warehouseSchema: OpsSchema = {
  title: 'Warehouse',
  intro: 'Space, throughput and accuracy for every site.',
  fields: [
    { key: 'capacity', label: 'Pallet spaces', type: 'number', demo: [200, 1200] },
    { key: 'used', label: 'Spaces used', type: 'number', demo: [120, 1100] },
    { key: 'pickAccuracy', label: 'Pick accuracy', type: 'number', unit: '%', demo: [96, 100] },
    { key: 'lastStockCount', label: 'Last stock count', type: 'date', fallback: 'dueDate', demo: [-100, -3] },
  ],
  summary: (v) => [{ label: 'Utilisation', value: pctText(num(v.used), num(v.capacity)), tone: num(v.capacity) && num(v.used) / num(v.capacity) > 0.9 ? 'risk' : 'good' }],
  insights: (rows) => {
    const out = emptyInsight()
    const capacity = rows.reduce((total, row) => total + num(row.v.capacity), 0)
    const used = rows.reduce((total, row) => total + num(row.v.used), 0)
    out.kpis.push({ label: 'Sites', value: String(rows.length), tone: 'info' }, { label: 'Utilisation', value: pctText(used, capacity), tone: capacity && used / capacity > 0.9 ? 'risk' : 'good' }, { label: 'Free spaces', value: String(Math.max(0, capacity - used)), tone: 'info' })
    out.bars.push({ title: 'Utilisation by site', items: rows.map((row) => ({ label: row.record.name, value: num(row.v.capacity) ? Math.round((num(row.v.used) / num(row.v.capacity)) * 100) : 0, display: pctText(num(row.v.used), num(row.v.capacity)) })) })
    for (const row of rows.filter((entry) => daysUntil(str(entry.v.lastStockCount)) < -90)) out.alerts.push({ text: `${row.record.name} hasn’t had a stock count in over 90 days.`, tone: 'watch', recordId: row.record.id })
    for (const row of rows.filter((entry) => num(entry.v.pickAccuracy) && num(entry.v.pickAccuracy) < 99)) out.alerts.push({ text: `${row.record.name} pick accuracy is ${num(row.v.pickAccuracy)}% — best practice is 99.5%+.`, tone: 'watch', recordId: row.record.id })
    return out
  },
}

export const logisticsSchemas: Record<string, OpsSchema> = {
  dispatch: dispatchSchema,
  routes: routeSchema,
  deliveries: deliverySchema,
  tracking: deliverySchema,
  fleet: fleetSchema,
  drivers: driverSchema,
  exceptions: exceptionSchema,
  warehouses: warehouseSchema,
}
