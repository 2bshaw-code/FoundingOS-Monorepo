'use client'

import { useState } from 'react'
import { ActivityToast, CEOBriefing, WorkspaceHeader, usePersistentRecords } from './retail-operations-workspace'

type CareStatus = 'Scheduled' | 'Checked in' | 'Follow-up' | 'Completed'
type CareRecord = { id: string; patient: string; appointment: string; clinician: string; reason: string; balance: number; status: CareStatus; nextStep: string }

const seedCareRecords: CareRecord[] = [
  { id: 'APT-248', patient: 'Amara Okafor', appointment: 'Today · 14:30', clinician: 'Dr Shah', reason: 'Follow-up consultation', balance: 0, status: 'Checked in', nextStep: 'Record consultation outcome' },
  { id: 'APT-247', patient: 'George Wilson', appointment: 'Today · 15:15', clinician: 'Dr Patel', reason: 'Initial assessment', balance: 85, status: 'Scheduled', nextStep: 'Send arrival reminder' },
  { id: 'APT-246', patient: 'Lucia Ramos', appointment: 'Tomorrow · 09:00', clinician: 'Dr Shah', reason: 'Treatment review', balance: 40, status: 'Follow-up', nextStep: 'Confirm treatment plan' },
  { id: 'APT-245', patient: 'Ibrahim Diallo', appointment: 'Today · 11:00', clinician: 'Dr Patel', reason: 'Routine consultation', balance: 0, status: 'Completed', nextStep: 'No further action' },
]

function now() {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date())
}

export function HealthOperationsWorkspace() {
  const [records, setRecords] = usePersistentRecords('foundingos-demo-health-care-v1', seedCareRecords)
  const [selectedId, setSelectedId] = useState(seedCareRecords[0].id)
  const [status, setStatus] = useState<'All' | CareStatus>('All')
  const [activity, setActivity] = useState<{ id: string; label: string; detail: string; time: string } | null>(null)
  const selected = records.find((record) => record.id === selectedId) ?? records[0]
  const visible = status === 'All' ? records : records.filter((record) => record.status === status)
  const waiting = records.filter((record) => ['Scheduled', 'Checked in'].includes(record.status)).length
  const followUps = records.filter((record) => record.status === 'Follow-up').length
  const balance = records.reduce((total, record) => total + record.balance, 0)

  const update = (nextStatus: CareStatus, nextStep: string) => {
    setRecords((current) => current.map((record) => record.id === selected.id ? { ...record, status: nextStatus, nextStep } : record))
    setActivity({ id: `care-${Date.now()}`, label: `${selected.id} moved to ${nextStatus}`, detail: `${selected.patient}'s care timeline was updated`, time: now() })
  }

  return <section className="retail-workspace">
    <WorkspaceHeader eyebrow="Core.Operations · Health" title="Care operations" description="Coordinate appointments, patient follow-up, and billing without presenting demo information as clinical advice." onCreate={() => {
      const next: CareRecord = { id: `APT-${249 + records.length}`, patient: 'New patient', appointment: 'Time to confirm', clinician: 'Unassigned', reason: 'Reason to confirm', balance: 0, status: 'Scheduled', nextStep: 'Confirm details and consent' }
      setRecords((current) => [next, ...current]); setSelectedId(next.id); setActivity({ id: `care-${Date.now()}`, label: `${next.id} created`, detail: 'Safe demo appointment added', time: now() })
    }} />
    <ActivityToast activity={activity} />
    <CEOBriefing headline={followUps ? `${followUps} patient follow-up needs attention` : 'Today’s care flow is on track'} summary={`${waiting} patient${waiting === 1 ? '' : 's'} are waiting or scheduled. £${balance.toFixed(2)} remains to be collected across the visible demo records.`}
      standing={[
        { label: 'Today’s queue', value: String(records.length), meaning: 'Appointments and follow-ups visible to the team.' },
        { label: 'Waiting', value: String(waiting), meaning: 'Patients scheduled or already checked in.', tone: waiting > 2 ? 'watch' : 'good' },
        { label: 'Follow-up', value: String(followUps), meaning: 'Care outcomes requiring another action.', tone: followUps ? 'watch' : 'good' },
        { label: 'Patient balance', value: `£${balance.toFixed(2)}`, meaning: 'Visible amount not yet settled.', tone: balance ? 'watch' : 'good' },
      ]}
      risks={['Follow-up actions should always have a named owner.', `${waiting} patients are currently scheduled or waiting.`, 'Clinical decisions remain with qualified care professionals.']}
      actions={['Complete checked-in visits before starting lower-priority admin.', 'Confirm every follow-up date before the patient leaves.', 'Send payment links only after the service and amount are verified.']} />
    <div className="retail-metric-strip"><article><span>Appointments</span><strong>{records.length}</strong><small>Visible demo queue</small></article><article><span>Waiting</span><strong>{waiting}</strong><small>Needs coordination</small></article><article><span>Follow-up</span><strong>{followUps}</strong><small>Needs an owner</small></article><article><span>Outstanding</span><strong>£{balance}</strong><small>Patient balance</small></article></div>
    <div className="retail-toolbar"><label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as 'All' | CareStatus)}>{['All', 'Scheduled', 'Checked in', 'Follow-up', 'Completed'].map((value) => <option key={value}>{value}</option>)}</select></label><button type="button" onClick={() => setRecords(seedCareRecords)}>Reset demo data</button></div>
    <div className="retail-data-layout">
      <div className="retail-table-panel"><div className="retail-table-heading"><div><strong>Care coordination</strong><span>{visible.length} visible records</span></div><span>Simulated data · not medical advice</span></div><div className="retail-table-scroll"><table><thead><tr><th>Patient</th><th>Appointment</th><th>Clinician</th><th>Reason</th><th>Balance</th><th>Status</th></tr></thead><tbody>{visible.map((record) => <tr key={record.id} onClick={() => setSelectedId(record.id)}><td><strong>{record.patient}</strong><small>{record.id}</small></td><td>{record.appointment}</td><td>{record.clinician}</td><td>{record.reason}</td><td>£{record.balance.toFixed(2)}</td><td><span className={`retail-status status-${record.status.toLowerCase().replace(' ', '-')}`}>{record.status}</span></td></tr>)}</tbody></table></div></div>
      {selected && <aside className="retail-detail-panel"><p>Selected appointment</p><h2>{selected.patient}</h2><strong>{selected.reason}</strong><dl><div><dt>When</dt><dd>{selected.appointment}</dd></div><div><dt>Clinician</dt><dd>{selected.clinician}</dd></div><div><dt>Balance</dt><dd>£{selected.balance.toFixed(2)}</dd></div><div><dt>Next</dt><dd>{selected.nextStep}</dd></div></dl>{selected.status === 'Scheduled' && <button className="retail-primary-action" type="button" onClick={() => update('Checked in', 'Begin appointment')}>Check patient in</button>}{selected.status === 'Checked in' && <button className="retail-primary-action" type="button" onClick={() => update('Follow-up', 'Book follow-up date')}>Complete and follow up</button>}{selected.status === 'Follow-up' && <button className="retail-primary-action" type="button" onClick={() => update('Completed', 'No further action')}>Close follow-up</button>}<button type="button" onClick={() => setActivity({ id: `care-${Date.now()}`, label: 'Patient reminder prepared', detail: `WhatsApp reminder prepared for ${selected.patient}`, time: now() })}>Send WhatsApp reminder</button></aside>}
    </div>
  </section>
}
