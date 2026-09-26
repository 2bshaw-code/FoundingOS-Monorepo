/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// HR: UK-compliant people operations (Working Time Regulations, statutory leave, Bradford factor,
// written statements, right-to-work checks).
import {
  avgScore, checklistProgress, countBy, daysUntil, emptyInsight, expiryInsight, gbp, list, minutesOf, niceDate, num, opsToday, pctText, personOf, shiftDate,
  shiftHours, str, weekdaysBetween, type OpsInsight, type OpsRow, type OpsSchema,
} from './ops'

const STATUTORY_LEAVE_DAYS = 28

export const rotaSchema: OpsSchema = {
  title: 'Shift',
  intro: 'Plan the shift like a rota manager: who, when, where and at what cost — checked against the Working Time Regulations.',
  fields: [
    { key: 'person', label: 'Employee', type: 'text', fallback: 'owner' },
    { key: 'date', label: 'Shift date', type: 'date', fallback: 'dueDate', demo: [0, 6] },
    { key: 'start', label: 'Start', type: 'time', demo: [6, 13] },
    { key: 'end', label: 'Finish', type: 'time', demo: [14, 22] },
    { key: 'breakMins', label: 'Unpaid break', type: 'number', unit: 'mins', demo: [20, 60] },
    { key: 'role', label: 'Role', type: 'select', options: ['Supervisor', 'Sales floor', 'Warehouse', 'Driver', 'Kitchen', 'Front of house', 'Clinical', 'Admin'] },
    { key: 'hourlyRate', label: 'Hourly rate', type: 'money', demo: [12, 18], hint: 'National Living Wage is £12.21/hr from April 2025' },
  ],
  summary: (v) => {
    const hours = shiftHours(str(v.start), str(v.end), num(v.breakMins))
    const needsBreak = hours > 6 && num(v.breakMins) < 20
    return [
      { label: 'Paid hours', value: hours.toFixed(2) },
      { label: 'Shift cost', value: gbp(hours * num(v.hourlyRate)) },
      ...(needsBreak ? [{ label: 'Break', value: 'Needs 20 mins (over 6 hrs)', tone: 'risk' as const }] : []),
    ]
  },
  insights: (rows) => {
    const out = emptyInsight()
    const byPerson = new Map<string, OpsRow[]>()
    for (const row of rows) byPerson.set(personOf(row), [...(byPerson.get(personOf(row)) ?? []), row])
    let totalHours = 0
    let totalCost = 0
    const table: string[][] = []
    for (const [person, shifts] of byPerson) {
      const hours = shifts.reduce((total, row) => total + shiftHours(str(row.v.start), str(row.v.end), num(row.v.breakMins)), 0)
      const cost = shifts.reduce((total, row) => total + shiftHours(str(row.v.start), str(row.v.end), num(row.v.breakMins)) * num(row.v.hourlyRate), 0)
      totalHours += hours
      totalCost += cost
      table.push([person, String(shifts.length), hours.toFixed(1), gbp(cost), hours > 48 ? 'Over 48 hrs' : 'OK'])
      if (hours > 48) out.alerts.push({ text: `${person} is rostered ${hours.toFixed(1)} hrs — over the 48-hour weekly limit unless they’ve opted out in writing.`, tone: 'risk' })
      const ordered = [...shifts].filter((row) => str(row.v.date)).sort((a, b) => `${str(a.v.date)}${str(a.v.start)}`.localeCompare(`${str(b.v.date)}${str(b.v.start)}`))
      for (let index = 1; index < ordered.length; index += 1) {
        const previous = ordered[index - 1]
        const current = ordered[index]
        let endMinutes = minutesOf(str(previous.v.end))
        if (endMinutes <= minutesOf(str(previous.v.start))) endMinutes += 1440
        const gap = daysUntil(str(current.v.date), str(previous.v.date)) * 1440 + minutesOf(str(current.v.start)) - endMinutes
        if (Number.isFinite(gap) && gap < 11 * 60) out.alerts.push({ text: `${person} gets only ${(gap / 60).toFixed(1)} hrs rest before ${niceDate(str(current.v.date))} — 11 hrs is the legal minimum.`, tone: 'risk', recordId: current.record.id })
      }
    }
    const unfilled = rows.filter((row) => !str(row.v.person) && (!row.record.owner || /^unassigned$/i.test(row.record.owner)))
    if (unfilled.length) out.alerts.push({ text: `${unfilled.length} shift${unfilled.length === 1 ? '' : 's'} not yet covered.`, tone: 'watch', recordId: unfilled[0].record.id })
    out.kpis.push({ label: 'Shifts', value: String(rows.length), tone: 'info' }, { label: 'Rostered hours', value: totalHours.toFixed(0), tone: 'info' }, { label: 'Labour cost', value: gbp(totalCost), tone: 'info' }, { label: 'WTR breaches', value: String(out.alerts.filter((alert) => alert.tone === 'risk').length), tone: out.alerts.some((alert) => alert.tone === 'risk') ? 'risk' : 'good' })
    out.tables.push({ title: 'Hours by employee', columns: ['Employee', 'Shifts', 'Hours', 'Cost', 'Working time'], rows: table.sort((a, b) => Number(b[2]) - Number(a[2])), numeric: [1, 2, 3] })
    const days = Array.from({ length: 7 }, (_, index) => shiftDate(opsToday(), index))
    out.bars.push({ title: 'Cover by day (next 7 days)', items: days.map((day) => { const count = rows.filter((row) => str(row.v.date) === day).length; return { label: new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }), value: count, display: `${count} shift${count === 1 ? '' : 's'}` } }) })
    return out
  },
}

export const timesheetSchema: OpsSchema = {
  title: 'Timesheet',
  intro: 'Check actual hours against the rota before they go to payroll.',
  fields: [
    { key: 'person', label: 'Employee', type: 'text', fallback: 'owner' },
    { key: 'weekStart', label: 'Week commencing', type: 'date', fallback: 'dueDate', demo: [-14, 0] },
    { key: 'rotaHours', label: 'Rostered hours', type: 'number', demo: [16, 40] },
    { key: 'hours', label: 'Hours worked', type: 'number', demo: [14, 46] },
    { key: 'overtime', label: 'Overtime hours', type: 'number', demo: [0, 6] },
  ],
  summary: (v) => { const variance = num(v.hours) - num(v.rotaHours); return [{ label: 'Variance vs rota', value: `${variance > 0 ? '+' : ''}${variance.toFixed(1)} hrs`, tone: Math.abs(variance) > 4 ? 'watch' : 'good' }] },
  insights: (rows, ctx) => {
    const out = emptyInsight()
    const hours = rows.reduce((total, row) => total + num(row.v.hours), 0)
    const overtime = rows.reduce((total, row) => total + num(row.v.overtime), 0)
    const pending = rows.filter((row) => row.record.status !== ctx.statuses.at(-1))
    out.kpis.push({ label: 'Hours worked', value: hours.toFixed(0), tone: 'info' }, { label: 'Overtime', value: `${overtime.toFixed(0)} hrs (${pctText(overtime, hours)})`, tone: overtime / (hours || 1) > 0.1 ? 'watch' : 'good' }, { label: 'Awaiting approval', value: String(pending.length), tone: pending.length ? 'watch' : 'good' })
    const variance = rows.map((row) => ({ row, diff: num(row.v.hours) - num(row.v.rotaHours) })).filter((item) => Math.abs(item.diff) > 4)
    if (variance.length) out.tables.push({ title: 'Big differences from the rota', columns: ['Employee', 'Rostered', 'Worked', 'Difference'], rows: variance.map(({ row, diff }) => [personOf(row), String(num(row.v.rotaHours)), String(num(row.v.hours)), `${diff > 0 ? '+' : ''}${diff.toFixed(1)}`]), numeric: [1, 2, 3] })
    return out
  },
}

export const leaveSchema: OpsSchema = {
  title: 'Leave request',
  intro: 'Book leave against each person’s statutory entitlement (5.6 weeks / 28 days for a full-time worker) and spot clashes before approving.',
  fields: [
    { key: 'person', label: 'Employee', type: 'text', fallback: 'owner' },
    { key: 'type', label: 'Leave type', type: 'select', options: ['Annual leave', 'Unpaid', 'Parental', 'Compassionate', 'TOIL'] },
    { key: 'start', label: 'First day', type: 'date', fallback: 'dueDate', demo: [-30, 60] },
    { key: 'end', label: 'Last day', type: 'date', demo: [-25, 70] },
    { key: 'entitlement', label: 'Annual entitlement', type: 'number', unit: 'days', hint: '28 days incl. bank holidays for 5 days a week; pro-rata for part-time' },
  ],
  summary: (v) => [{ label: 'Working days', value: String(weekdaysBetween(str(v.start), str(v.end))) }],
  insights: (rows) => {
    const out = emptyInsight()
    const byPerson = new Map<string, number>()
    const entitlement = new Map<string, number>()
    for (const row of rows) {
      if (str(row.v.type) && str(row.v.type) !== 'Annual leave') continue
      const person = personOf(row)
      byPerson.set(person, (byPerson.get(person) ?? 0) + weekdaysBetween(str(row.v.start), str(row.v.end)))
      if (num(row.v.entitlement)) entitlement.set(person, num(row.v.entitlement))
    }
    out.tables.push({ title: 'Annual leave balance', columns: ['Employee', 'Booked', 'Entitlement', 'Remaining'], rows: [...byPerson.entries()].map(([person, booked]) => { const allowed = entitlement.get(person) ?? STATUTORY_LEAVE_DAYS; return [person, String(booked), String(allowed), String(allowed - booked)] }), numeric: [1, 2, 3] })
    for (const [person, booked] of byPerson) if (booked > (entitlement.get(person) ?? STATUTORY_LEAVE_DAYS)) out.alerts.push({ text: `${person} has booked more than their entitlement.`, tone: 'risk' })
    const dated = rows.filter((row) => str(row.v.start) && str(row.v.end))
    for (let a = 0; a < dated.length; a += 1) for (let b = a + 1; b < dated.length; b += 1) {
      const x = dated[a]
      const y = dated[b]
      if (personOf(x) !== personOf(y) && str(x.v.start) <= str(y.v.end) && str(y.v.start) <= str(x.v.end) && out.alerts.length < 6) out.alerts.push({ text: `${personOf(x)} and ${personOf(y)} are both off around ${niceDate(str(y.v.start) > str(x.v.start) ? str(y.v.start) : str(x.v.start))} — check cover.`, tone: 'watch', recordId: y.record.id })
    }
    const upcoming = dated.filter((row) => daysUntil(str(row.v.start)) >= 0 && daysUntil(str(row.v.start)) <= 30)
    out.kpis.push({ label: 'Requests', value: String(rows.length), tone: 'info' }, { label: 'Off in next 30 days', value: String(upcoming.length), tone: 'info' }, { label: 'Clashes', value: String(out.alerts.filter((alert) => alert.tone === 'watch').length), tone: out.alerts.length ? 'watch' : 'good' })
    out.bars.push(countBy(rows, 'type', 'Leave by type'))
    return out
  },
}

export const absenceSchema: OpsSchema = {
  title: 'Absence',
  intro: 'Record every absence, hold a return-to-work meeting and use the Bradford factor to spot patterns fairly.',
  fields: [
    { key: 'person', label: 'Employee', type: 'text', fallback: 'owner' },
    { key: 'start', label: 'First day off', type: 'date', fallback: 'dueDate', demo: [-120, -1] },
    { key: 'end', label: 'Last day off', type: 'date', demo: [-118, 0] },
    { key: 'reason', label: 'Reason', type: 'select', options: ['Cold / flu', 'Stomach', 'Musculoskeletal', 'Mental health', 'Injury', 'Medical appointment', 'Other'] },
    { key: 'fitNote', label: 'Fit note', type: 'select', options: ['Not needed', 'Requested', 'Received'] },
    { key: 'rtw', label: 'Return-to-work meeting', type: 'select', options: ['Not yet', 'Booked', 'Done'] },
  ],
  summary: (v) => {
    const days = Math.max(1, daysUntil(str(v.end) || str(v.start), str(v.start)) + 1)
    return [{ label: 'Calendar days', value: String(Number.isFinite(days) ? days : 1) }, ...(days > 7 && str(v.fitNote) !== 'Received' ? [{ label: 'Fit note', value: 'Needed after 7 days', tone: 'risk' as const }] : []), ...(days >= 4 ? [{ label: 'SSP', value: 'May be due (4+ days)', tone: 'info' as const }] : [])]
  },
  insights: (rows) => {
    const out = emptyInsight()
    const yearAgo = shiftDate(opsToday(), -364)
    const byPerson = new Map<string, { spells: number; days: number }>()
    for (const row of rows) {
      if (str(row.v.start) && str(row.v.start) < yearAgo) continue
      const person = personOf(row)
      const days = Math.max(1, (daysUntil(str(row.v.end) || str(row.v.start), str(row.v.start)) || 0) + 1)
      const current = byPerson.get(person) ?? { spells: 0, days: 0 }
      byPerson.set(person, { spells: current.spells + 1, days: current.days + days })
    }
    const table = [...byPerson.entries()].map(([person, { spells, days }]) => ({ person, spells, days, bradford: spells * spells * days })).sort((a, b) => b.bradford - a.bradford)
    out.tables.push({ title: 'Bradford factor (last 52 weeks)', columns: ['Employee', 'Spells', 'Days', 'Score', 'Action'], rows: table.map((item) => [item.person, String(item.spells), String(item.days), String(item.bradford), item.bradford >= 450 ? 'Formal review' : item.bradford >= 200 ? 'Informal meeting' : item.bradford >= 51 ? 'Monitor' : '—']), numeric: [1, 2, 3] })
    for (const item of table.filter((entry) => entry.bradford >= 200)) out.alerts.push({ text: `${item.person} has a Bradford score of ${item.bradford} — hold a supportive meeting and check for underlying causes.`, tone: 'watch' })
    const rtw = rows.filter((row) => str(row.v.rtw) !== 'Done')
    const notes = rows.filter((row) => daysUntil(str(row.v.end) || str(row.v.start), str(row.v.start)) + 1 > 7 && str(row.v.fitNote) !== 'Received')
    if (rtw.length) out.alerts.push({ text: `${rtw.length} return-to-work meeting${rtw.length === 1 ? '' : 's'} still to hold.`, tone: 'watch', recordId: rtw[0].record.id })
    if (notes.length) out.alerts.push({ text: `${notes.length} absence${notes.length === 1 ? '' : 's'} over 7 days without a fit note.`, tone: 'risk', recordId: notes[0].record.id })
    const totalDays = table.reduce((total, item) => total + item.days, 0)
    out.kpis.push({ label: 'Absences (12 months)', value: String(table.reduce((total, item) => total + item.spells, 0)), tone: 'info' }, { label: 'Days lost', value: String(totalDays), tone: 'info' }, { label: 'RTW outstanding', value: String(rtw.length), tone: rtw.length ? 'watch' : 'good' })
    out.bars.push(countBy(rows, 'reason', 'Absence by reason'))
    return out
  },
}

const onboardingItems = ['Right to work checked', 'Written statement issued (day 1)', 'Starter checklist / P45 received', 'Bank details and NI number', 'Emergency contact', 'Pension auto-enrolment assessed', 'Equipment and uniform ready', 'System accounts created', 'Health & safety induction', 'Buddy assigned', '30-day check-in booked', '90-day probation review booked']
export const onboardingSchema: OpsSchema = {
  title: 'Onboarding',
  intro: 'A new starter checklist that covers the legal must-haves and the things that make people stay.',
  fields: [
    { key: 'person', label: 'New starter', type: 'text', fallback: 'name' },
    { key: 'startDate', label: 'Start date', type: 'date', fallback: 'dueDate', demo: [-20, 30] },
    { key: 'manager', label: 'Line manager', type: 'text', fallback: 'owner' },
    { key: 'checklist', label: 'Checklist', type: 'checklist', items: onboardingItems },
  ],
  summary: (v) => { const done = list(v.checklist).length; return [{ label: 'Complete', value: `${done}/${onboardingItems.length}`, tone: done === onboardingItems.length ? 'good' : 'watch' }] },
  insights: (rows) => {
    const out = emptyInsight()
    const { done, total } = checklistProgress(rows, 'checklist', onboardingItems)
    const legal = ['Right to work checked', 'Written statement issued (day 1)', 'Pension auto-enrolment assessed']
    const missingLegal = rows.filter((row) => daysUntil(str(row.v.startDate)) <= 0 && legal.some((item) => !list(row.v.checklist).includes(item)))
    out.kpis.push({ label: 'Starters', value: String(rows.length), tone: 'info' }, { label: 'Checklist complete', value: pctText(done, total), tone: done === total ? 'good' : 'watch' }, { label: 'Legal items missing', value: String(missingLegal.length), tone: missingLegal.length ? 'risk' : 'good' })
    for (const row of missingLegal.slice(0, 4)) out.alerts.push({ text: `${personOf(row)} has started without: ${legal.filter((item) => !list(row.v.checklist).includes(item)).join(', ')}.`, tone: 'risk', recordId: row.record.id })
    out.bars.push({ title: 'Least completed steps', items: onboardingItems.map((item) => ({ item, count: rows.filter((row) => !list(row.v.checklist).includes(item)).length })).filter((entry) => entry.count).sort((a, b) => b.count - a.count).slice(0, 6).map((entry) => ({ label: entry.item, value: entry.count, display: `${entry.count} outstanding` })) })
    return out
  },
}

export const contractSchema: OpsSchema = {
  title: 'Contract',
  intro: 'Key terms for the written statement every employee must have from day one.',
  fields: [
    { key: 'person', label: 'Employee', type: 'text', fallback: 'name' },
    { key: 'jobTitle', label: 'Job title', type: 'text', fallback: 'secondary' },
    { key: 'type', label: 'Contract type', type: 'select', options: ['Permanent', 'Fixed-term', 'Part-time', 'Zero hours', 'Casual'] },
    { key: 'startDate', label: 'Start date', type: 'date', demo: [-400, 20] },
    { key: 'endDate', label: 'End date (fixed-term)', type: 'date' },
    { key: 'salary', label: 'Annual salary', type: 'money', fallback: 'value', demo: [22000, 48000] },
    { key: 'hours', label: 'Hours per week', type: 'number', demo: [16, 40] },
    { key: 'probationEnd', label: 'Probation ends', type: 'date', demo: [-60, 90] },
    { key: 'notice', label: 'Notice period', type: 'select', options: ['1 week', '2 weeks', '1 month', '3 months'] },
    { key: 'signed', label: 'Signed', type: 'select', options: ['Not sent', 'Sent', 'Signed'] },
  ],
  summary: (v) => [{ label: 'Hourly equivalent', value: num(v.hours) ? `£${(num(v.salary) / 100 / 52 / num(v.hours)).toFixed(2)}` : '—' }],
  letter: {
    label: 'Written statement summary',
    build: (v, record) => `WRITTEN STATEMENT OF EMPLOYMENT PARTICULARS\n\nEmployee: ${str(v.person) || record.name}\nJob title: ${str(v.jobTitle) || '—'}\nContract type: ${str(v.type) || '—'}\nStart date: ${niceDate(str(v.startDate))}${str(v.endDate) ? `\nEnd date: ${niceDate(str(v.endDate))}` : ''}\nPay: ${gbp(num(v.salary))} per year, paid monthly\nHours: ${num(v.hours) || '—'} per week\nProbation ends: ${niceDate(str(v.probationEnd))}\nNotice: ${str(v.notice) || 'Statutory minimum'}\nHoliday: 5.6 weeks per year (pro-rata), including bank holidays\n\nThis summary must be issued on or before the first day of employment.`,
  },
  insights: (rows) => {
    const out = emptyInsight()
    const unsigned = rows.filter((row) => str(row.v.signed) !== 'Signed')
    const probation = rows.filter((row) => { const days = daysUntil(str(row.v.probationEnd)); return days >= 0 && days <= 30 })
    const ending = rows.filter((row) => { const days = daysUntil(str(row.v.endDate)); return days >= 0 && days <= 60 })
    const payroll = rows.reduce((total, row) => total + num(row.v.salary), 0)
    out.kpis.push({ label: 'Contracts', value: String(rows.length), tone: 'info' }, { label: 'Not signed', value: String(unsigned.length), tone: unsigned.length ? 'risk' : 'good' }, { label: 'Probations ending (30d)', value: String(probation.length), tone: probation.length ? 'watch' : 'good' }, { label: 'Annual salary bill', value: gbp(payroll), tone: 'info' })
    for (const row of probation) out.alerts.push({ text: `${personOf(row)}’s probation ends ${niceDate(str(row.v.probationEnd))} — book the review.`, tone: 'watch', recordId: row.record.id })
    for (const row of ending) out.alerts.push({ text: `${personOf(row)}’s fixed-term contract ends ${niceDate(str(row.v.endDate))} — renew or give notice.`, tone: 'watch', recordId: row.record.id })
    out.bars.push(countBy(rows, 'type', 'Contracts by type'))
    return out
  },
}

const reviewCriteria = ['Delivery against goals', 'Quality of work', 'Teamwork', 'Initiative', 'Values & behaviours']
export const performanceSchema: OpsSchema = {
  title: 'Performance review',
  intro: 'Score everyone against the same criteria so reviews are fair, consistent and easy to defend.',
  fields: [
    { key: 'person', label: 'Employee', type: 'text', fallback: 'name' },
    { key: 'reviewer', label: 'Reviewer', type: 'text', fallback: 'owner' },
    { key: 'reviewDate', label: 'Review date', type: 'date', fallback: 'dueDate', demo: [-60, 45] },
    { key: 'scores', label: 'Scores (1–5)', type: 'score', criteria: reviewCriteria },
    { key: 'goals', label: 'Goals for next period', type: 'textarea' },
  ],
  summary: (v) => { const score = avgScore(v.scores); return [{ label: 'Overall', value: score ? `${score.toFixed(1)} / 5` : '—', tone: score >= 4 ? 'good' : score && score < 2.5 ? 'risk' : 'info' }] },
  insights: (rows) => {
    const out = emptyInsight()
    const overdue = rows.filter((row) => daysUntil(str(row.v.reviewDate)) < 0 && !avgScore(row.v.scores))
    const rated = rows.filter((row) => avgScore(row.v.scores))
    const average = rated.reduce((total, row) => total + avgScore(row.v.scores), 0) / (rated.length || 1)
    out.kpis.push({ label: 'Reviews', value: String(rows.length), tone: 'info' }, { label: 'Average rating', value: rated.length ? average.toFixed(1) : '—', tone: 'info' }, { label: 'Overdue', value: String(overdue.length), tone: overdue.length ? 'risk' : 'good' })
    const bands = [['Exceptional (4.5+)', 4.5, 6], ['Strong (3.5–4.4)', 3.5, 4.5], ['Meeting (2.5–3.4)', 2.5, 3.5], ['Below (<2.5)', 0.01, 2.5]] as const
    out.bars.push({ title: 'Rating distribution', items: bands.map(([label, min, max]) => { const count = rated.filter((row) => avgScore(row.v.scores) >= min && avgScore(row.v.scores) < max).length; return { label, value: count, display: String(count) } }) })
    for (const row of rated.filter((entry) => avgScore(entry.v.scores) < 2.5)) out.alerts.push({ text: `${personOf(row)} is rated below expectations — agree a support plan with clear goals.`, tone: 'watch', recordId: row.record.id })
    out.tables.push({ title: 'Average by criterion', columns: ['Criterion', 'Average'], rows: reviewCriteria.map((criterion) => { const values = rated.map((row) => num((row.v.scores as Record<string, unknown>)?.[criterion])).filter(Boolean); return [criterion, values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '—'] }), numeric: [1] })
    return out
  },
}

export const learningSchema: OpsSchema = {
  title: 'Training record',
  intro: 'Track mandatory training and renew it before it lapses.',
  fields: [
    { key: 'person', label: 'Employee', type: 'text', fallback: 'owner' },
    { key: 'course', label: 'Course', type: 'text', fallback: 'name' },
    { key: 'mandatory', label: 'Mandatory', type: 'select', options: ['Mandatory', 'Optional'] },
    { key: 'completed', label: 'Completed on', type: 'date', demo: [-500, -10] },
    { key: 'expiry', label: 'Expires on', type: 'date', fallback: 'dueDate', demo: [-15, 200] },
  ],
  insights: (rows) => expiryInsight(rows.filter((row) => str(row.v.mandatory) !== 'Optional'), [['expiry', 'Training']]),
}

export const rightToWorkSchema: OpsSchema = {
  title: 'Right to work check',
  intro: 'Home Office-compliant checks: the right method, the right evidence, and repeat checks on time.',
  fields: [
    { key: 'person', label: 'Employee', type: 'text', fallback: 'name' },
    { key: 'method', label: 'Check method', type: 'select', options: ['Online share code', 'IDVT (digital ID)', 'Manual document check'] },
    { key: 'checked', label: 'Checked on', type: 'date', demo: [-300, -5] },
    { key: 'expiry', label: 'Permission expires', type: 'date', fallback: 'dueDate', demo: [-10, 400], hint: 'Leave blank for British/Irish citizens or indefinite leave' },
    { key: 'evidence', label: 'Evidence', type: 'checklist', items: ['Checked before employment started', 'Photo matches the person', 'Dates of birth consistent', 'Copy kept securely', 'Copy dated with check date'] },
  ],
  insights: (rows) => {
    const out = expiryInsight(rows, [['expiry', 'Permission to work']], 90)
    const incomplete = rows.filter((row) => list(row.v.evidence).length < 5)
    out.kpis.push({ label: 'Evidence incomplete', value: String(incomplete.length), tone: incomplete.length ? 'risk' : 'good' })
    if (incomplete.length) out.alerts.push({ text: `${incomplete.length} check${incomplete.length === 1 ? ' is' : 's are'} missing evidence — incomplete checks give no defence against a civil penalty.`, tone: 'risk', recordId: incomplete[0].record.id })
    out.bars.push(countBy(rows, 'method', 'Checks by method'))
    return out
  },
}

export const policySchema: OpsSchema = {
  title: 'Policy',
  intro: 'Keep one current version of each policy and prove everyone has read it.',
  fields: [
    { key: 'version', label: 'Version', type: 'text', placeholder: 'e.g. v3.1' },
    { key: 'reviewDate', label: 'Next review', type: 'date', fallback: 'dueDate', demo: [-30, 300] },
    { key: 'acknowledged', label: 'Acknowledged by', type: 'number', unit: 'people', demo: [4, 18] },
    { key: 'headcount', label: 'Headcount', type: 'number', unit: 'people', demo: [18, 18] },
  ],
  summary: (v) => [{ label: 'Acknowledged', value: pctText(num(v.acknowledged), num(v.headcount)) }],
  insights: (rows) => {
    const out = expiryInsight(rows, [['reviewDate', 'Policy review']], 60)
    const low = rows.filter((row) => num(row.v.headcount) && num(row.v.acknowledged) / num(row.v.headcount) < 0.9)
    out.kpis.push({ label: 'Below 90% acknowledged', value: String(low.length), tone: low.length ? 'watch' : 'good' })
    out.tables.push({ title: 'Acknowledgement', columns: ['Policy', 'Version', 'Acknowledged'], rows: rows.map((row) => [row.record.name, str(row.v.version) || '—', pctText(num(row.v.acknowledged), num(row.v.headcount))]), numeric: [2] })
    return out
  },
}

export const complianceSchema: OpsSchema = {
  title: 'Compliance item',
  intro: 'Every obligation with an owner, evidence and a renewal date.',
  fields: [
    { key: 'owner', label: 'Owner', type: 'text', fallback: 'owner' },
    { key: 'category', label: 'Category', type: 'select', options: ['Health & safety', 'Fire', 'Data protection (GDPR)', 'Insurance', 'Licence', 'Employment law', 'Food hygiene', 'Clinical'] },
    { key: 'renewal', label: 'Renewal date', type: 'date', fallback: 'dueDate', demo: [-20, 300] },
    { key: 'evidence', label: 'Evidence / reference', type: 'text' },
  ],
  insights: (rows) => { const out = expiryInsight(rows, [['renewal', 'Renewal']], 90); out.bars.push(countBy(rows, 'category', 'Items by category')); return out },
}

export const hrSchemas: Record<string, OpsSchema> = {
  rotas: rotaSchema,
  timesheets: timesheetSchema,
  'time-off': leaveSchema,
  sickness: absenceSchema,
  onboarding: onboardingSchema,
  contracts: contractSchema,
  performance: performanceSchema,
  learning: learningSchema,
  'right-to-work': rightToWorkSchema,
  policies: policySchema,
  compliance: complianceSchema,
}

export type { OpsInsight }
