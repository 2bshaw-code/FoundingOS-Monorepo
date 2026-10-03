import { countBy, daysUntil, emptyInsight, pctText, str, type OpsSchema } from './ops'

export const submissionSchema: OpsSchema = {
  title: 'Client submission',
  intro: 'Track a candidate against a client and role. Recording a submission does not send a CV or contact the client.',
  fields: [
    { key: 'candidate', label: 'Candidate reference', type: 'text', fallback: 'name' },
    { key: 'client', label: 'Client', type: 'text', fallback: 'secondary' },
    { key: 'job', label: 'Job reference', type: 'text' },
    { key: 'source', label: 'Original candidate source', type: 'text' },
    { key: 'submittedOn', label: 'Submitted on', type: 'date' },
    { key: 'followUp', label: 'Feedback due', type: 'date', fallback: 'dueDate' },
    { key: 'sharingPermission', label: 'Candidate sharing permission', type: 'select', options: ['Not recorded', 'Recorded', 'Declined'], hint: 'Record evidence for this specific client and role. This field is not a legal approval or an automated send guard.' },
    { key: 'permissionEvidence', label: 'Permission evidence reference', type: 'text' },
    { key: 'feedback', label: 'Client feedback', type: 'textarea' },
  ],
  insights: (rows) => {
    const out = emptyInsight()
    const open = rows.filter((row) => !['Placed', 'Rejected', 'Withdrawn'].includes(row.record.status))
    const overdue = open.filter((row) => daysUntil(str(row.v.followUp)) < 0)
    const missingPermission = rows.filter((row) => !['Rejected', 'Withdrawn'].includes(row.record.status) && (str(row.v.sharingPermission) !== 'Recorded' || !str(row.v.permissionEvidence).trim()))
    const placed = rows.filter((row) => row.record.status === 'Placed')
    out.kpis.push({ label: 'Submissions', value: String(rows.length), tone: 'info' }, { label: 'Feedback overdue', value: String(overdue.length), tone: overdue.length ? 'risk' : 'good' }, { label: 'Recorded placement rate', value: pctText(placed.length, rows.length), tone: 'info' })
    if (missingPermission.length) out.alerts.push({ text: `${missingPermission.length} submission(s) lack recorded sharing permission or evidence. Verify before sharing any CV.`, tone: 'risk', recordId: missingPermission[0].record.id })
    if (overdue.length) out.alerts.push({ text: `${overdue.length} open submission(s) have overdue client feedback.`, tone: 'watch', recordId: overdue[0].record.id })
    out.bars.push(countBy(rows, 'client', 'Submissions by client'))
    return out
  },
}

export const outreachSchema: OpsSchema = {
  title: 'Outreach follow-up',
  intro: 'A manual follow-up queue, not an automated sequence. Nothing here sends email, messages or calls.',
  fields: [
    { key: 'person', label: 'Candidate / client reference', type: 'text', fallback: 'name' },
    { key: 'channel', label: 'Contact channel', type: 'select', options: ['Email', 'Phone', 'SMS', 'WhatsApp', 'LinkedIn', 'In person'] },
    { key: 'purpose', label: 'Purpose', type: 'text', fallback: 'secondary' },
    { key: 'lastContact', label: 'Last contact', type: 'date' },
    { key: 'nextContact', label: 'Next follow-up', type: 'date', fallback: 'dueDate' },
    { key: 'contactRestriction', label: 'Contact restriction', type: 'select', options: ['Not reviewed', 'Permitted for this purpose', 'Do not contact'], hint: 'Review lawful basis, channel rules and preferences before manual contact.' },
    { key: 'basisEvidence', label: 'Contact basis / evidence', type: 'textarea' },
    { key: 'draft', label: 'Draft message', type: 'textarea' },
    { key: 'outcome', label: 'Response / outcome', type: 'textarea' },
  ],
  insights: (rows) => {
    const out = emptyInsight()
    const blocked = rows.filter((row) => row.record.status === 'Do not contact' || str(row.v.contactRestriction) === 'Do not contact')
    const open = rows.filter((row) => !['Replied', 'Closed', 'Do not contact'].includes(row.record.status) && str(row.v.contactRestriction) !== 'Do not contact')
    const due = open.filter((row) => daysUntil(str(row.v.nextContact)) <= 0)
    const unreviewed = open.filter((row) => str(row.v.contactRestriction) !== 'Permitted for this purpose' || !str(row.v.basisEvidence).trim())
    const unscheduled = open.filter((row) => !Number.isFinite(daysUntil(str(row.v.nextContact))))
    out.kpis.push({ label: 'Open follow-ups', value: String(open.length), tone: 'info' }, { label: 'Due / overdue', value: String(due.length), tone: due.length ? 'watch' : 'good' }, { label: 'Do not contact', value: String(blocked.length), tone: 'info' })
    if (due.length) out.alerts.push({ text: `${due.length} manual follow-up(s) are due. Check contact restrictions before acting.`, tone: 'watch', recordId: due[0].record.id })
    if (unreviewed.length) out.alerts.push({ text: `${unreviewed.length} open follow-up(s) need a recorded contact-basis review.`, tone: 'risk', recordId: unreviewed[0].record.id })
    if (unscheduled.length) out.alerts.push({ text: `${unscheduled.length} open follow-up(s) have no valid next-contact date.`, tone: 'watch', recordId: unscheduled[0].record.id })
    return out
  },
}

export const recruiterActivitySchema: OpsSchema = {
  title: 'Recruiter activity',
  intro: 'Report manually recorded completed activity over the last seven calendar dates, including today. Counts are not verified phone or email events.',
  fields: [
    { key: 'recruiter', label: 'Recruiter', type: 'text', fallback: 'owner' },
    { key: 'activity', label: 'Activity', type: 'select', options: ['Call', 'Email', 'Candidate screen', 'Client meeting', 'CV submission', 'Interview', 'Placement'] },
    { key: 'date', label: 'Activity date', type: 'date', fallback: 'dueDate' },
    { key: 'candidate', label: 'Candidate reference', type: 'text' },
    { key: 'client', label: 'Client', type: 'text', fallback: 'secondary' },
    { key: 'job', label: 'Job reference', type: 'text' },
    { key: 'outcome', label: 'Outcome / evidence', type: 'textarea' },
  ],
  insights: (rows) => {
    const out = emptyInsight()
    const completed = rows.filter((row) => { const days = daysUntil(str(row.v.date)); return row.record.status === 'Completed' && days >= -6 && days <= 0 })
    const invalid = rows.filter((row) => row.record.status === 'Completed' && !Number.isFinite(daysUntil(str(row.v.date))))
    out.kpis.push({ label: 'Recorded completed activity (7 dates)', value: String(completed.length), tone: 'info' })
    out.bars.push(countBy(completed, 'activity', 'Activity mix (7 dates)'), countBy(completed, 'recruiter', 'Recorded activity by recruiter (7 dates)'))
    if (invalid.length) out.alerts.push({ text: `${invalid.length} completed activity record(s) have no valid date and are excluded from period reporting.`, tone: 'watch', recordId: invalid[0].record.id })
    return out
  },
}
