import assert from 'node:assert/strict'
import test from 'node:test'
import { candidateSources, talentModules } from './talent-workspace'
import { candidateSchema } from './pro/ops-talent-logistics'
import { outreachSchema, recruiterActivitySchema, submissionSchema } from './pro/ops-talent-recruiter'
import { opsSchemaFor } from './pro/ops-registry'
import { opsToday, readOps, shiftDate, type OpsRow } from './pro/ops'
import { findWorkspace } from '../../../apps/foundingos-mobile/lib/workspace-modules'

const row = (id: string, status: string, v: OpsRow['v'] = {}): OpsRow => ({ record: { id, name: id, status }, v })
const ctx = { statuses: talentModules.find((module) => module.id === 'candidates')!.statuses! }

test('native Talent uses shared modules and all recruiter modules have specialist forms', () => {
  assert.deepEqual(findWorkspace('talent')?.modules, talentModules)
  assert.equal(new Set(talentModules.map((module) => module.id)).size, talentModules.length)
  for (const id of ['submissions', 'outreach', 'activities']) {
    assert.ok(talentModules.some((module) => module.id === id))
    assert.ok(opsSchemaFor('talent', id))
  }
  assert.equal(ctx.statuses.at(-1), 'Hired')
  for (const source of ['CV-Library', 'Totaljobs', 'Indeed', 'LinkedIn', 'Job board']) assert.ok(candidateSources.includes(source))
})

test('candidate offers are not counted as hires, even with the old status catalogue', () => {
  const insight = candidateSchema.insights([row('offer', 'Offer', { source: 'Indeed' }), row('hire', 'Hired', { source: 'Indeed' })], { statuses: ['Applied', 'Screening', 'Interview', 'Offer'] })
  assert.equal(insight.kpis.find((kpi) => kpi.label === 'Hire rate')?.value, '50%')
  assert.deepEqual(insight.tables[0].rows, [['Indeed', '2', '1', '50%']])
})

test('candidate contact alerts exclude terminal records and do-not-contact preferences', () => {
  const old = shiftDate(opsToday(), -3)
  const insight = candidateSchema.insights([
    row('active', 'Screening', { lastContact: old }),
    row('recent', 'Applied', { lastContact: shiftDate(opsToday(), -2) }),
    row('blocked', 'Applied', { lastContact: old, contactPreference: 'Do not contact' }),
    ...['Hired', 'Rejected', 'Withdrawn'].map((status) => row(status, status, { lastContact: old })),
    row('missing', 'Applied'),
  ], ctx)
  assert.equal(insight.kpis.find((kpi) => kpi.label === 'No contact 3+ calendar days')?.value, '1')
  assert.ok(insight.alerts.some((alert) => alert.recordId === 'missing' && alert.text.includes('no valid last-contact date')))
})

test('activity reporting counts only completed records within the exact seven-date window', () => {
  const today = opsToday()
  const insight = recruiterActivitySchema.insights([
    row('today', 'Completed', { date: today, activity: 'Call', recruiter: 'Amina' }),
    row('boundary', 'Completed', { date: shiftDate(today, -6), activity: 'Email', recruiter: 'Amina' }),
    row('outside', 'Completed', { date: shiftDate(today, -7), activity: 'Call', recruiter: 'Amina' }),
    row('future', 'Completed', { date: shiftDate(today, 1), activity: 'Call' }),
    row('planned', 'Planned', { date: today, activity: 'Call' }),
    row('cancelled', 'Cancelled', { date: today, activity: 'Call' }),
    row('undated', 'Completed'),
  ], ctx)
  assert.equal(insight.kpis[0].value, '2')
  assert.deepEqual(insight.bars[1].items, [{ label: 'Amina', value: 2, display: '2' }])
  assert.ok(insight.alerts.some((alert) => alert.recordId === 'undated'))
})

test('submissions expose missing permission evidence and only open feedback is overdue', () => {
  const past = shiftDate(opsToday(), -1)
  const insight = submissionSchema.insights([
    row('open', 'Submitted', { followUp: past, sharingPermission: 'Recorded' }),
    row('placed', 'Placed', { followUp: past, sharingPermission: 'Recorded', permissionEvidence: 'record-12' }),
  ], ctx)
  assert.equal(insight.kpis.find((kpi) => kpi.label === 'Feedback overdue')?.value, '1')
  assert.equal(insight.kpis.find((kpi) => kpi.label === 'Recorded placement rate')?.value, '50%')
  assert.ok(insight.alerts.some((alert) => alert.recordId === 'open' && alert.text.includes('permission')))
})

test('manual outreach excludes restrictions and closed/replied records from due queues', () => {
  const today = opsToday()
  const insight = outreachSchema.insights([
    row('due', 'Contacted', { nextContact: today, contactRestriction: 'Permitted for this purpose', basisEvidence: 'record-1' }),
    row('blocked', 'Planned', { nextContact: today, contactRestriction: 'Do not contact' }),
    row('closed', 'Closed', { nextContact: today }),
    row('replied', 'Replied', { nextContact: today }),
    row('missing', 'Planned'),
  ], ctx)
  assert.deepEqual(insight.kpis.map((kpi) => kpi.value), ['2', '1', '1'])
  assert.ok(insight.alerts.some((alert) => alert.recordId === 'missing' && alert.text.includes('no valid')))
})

test('new forms read persisted ops values without inventing live evidence', () => {
  assert.deepEqual(readOps({ id: 'live', name: 'Candidate ref', status: 'Draft' }, submissionSchema, false), { candidate: 'Candidate ref' })
  const v = { candidate: 'ref-1', client: 'client-1', job: 'job-1', sharingPermission: 'Recorded', permissionEvidence: 'evidence-1' }
  assert.deepEqual(readOps({ id: 'saved', name: 'Submission', status: 'Submitted', data: { ops: v } }, submissionSchema, false), v)
})
