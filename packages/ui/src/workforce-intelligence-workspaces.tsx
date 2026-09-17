'use client'

import { useMemo, useState } from 'react'
import { ActivityToast, CEOBriefing, WorkspaceHeader, usePersistentRecords } from './retail-operations-workspace'

type CandidateStage = 'Applied' | 'Qualified' | 'Interview' | 'Offer' | 'Hired'
type Candidate = { id: string; name: string; role: string; source: string; owner: string; score: number; stage: CandidateStage; nextStep: string }
type RiskStatus = 'Open' | 'Reviewing' | 'Resolved'
type BusinessRisk = { id: string; area: string; signal: string; impact: string; confidence: number; owner: string; status: RiskStatus; recommendation: string }
type CareStatus = 'Scheduled' | 'Checked in' | 'Follow-up' | 'Completed'
type CareRecord = { id: string; patient: string; appointment: string; clinician: string; reason: string; balance: number; status: CareStatus; nextStep: string }

const candidateFlow: CandidateStage[] = ['Applied', 'Qualified', 'Interview', 'Offer', 'Hired']
const seedCandidates: Candidate[] = [
  { id: 'CAN-1284', name: 'Maya Chen', role: 'Store Manager', source: 'Referral', owner: 'Ava', score: 92, stage: 'Interview', nextStep: 'Panel interview · tomorrow 10:30' },
  { id: 'CAN-1283', name: 'Daniel Mensah', role: 'Data Analyst', source: 'LinkedIn', owner: 'Noah', score: 88, stage: 'Qualified', nextStep: 'Book technical interview' },
  { id: 'CAN-1282', name: 'Sofia Martins', role: 'Customer Lead', source: 'Careers site', owner: 'Mia', score: 84, stage: 'Offer', nextStep: 'Offer expires in 2 days' },
  { id: 'CAN-1281', name: 'Jordan Blake', role: 'Delivery Driver', source: 'WhatsApp', owner: 'Ava', score: 79, stage: 'Applied', nextStep: 'Complete right-to-work check' },
]

const seedRisks: BusinessRisk[] = [
  { id: 'RSK-042', area: 'Finance', signal: 'Three invoices are overdue', impact: '£4,820 cash delayed', confidence: 94, owner: 'Finance', status: 'Open', recommendation: 'Send payment links and assign direct follow-up today.' },
  { id: 'RSK-041', area: 'Retail', signal: 'Manchester stock cover below four days', impact: '£2,100 revenue at risk', confidence: 89, owner: 'Operations', status: 'Reviewing', recommendation: 'Move 18 units from Leeds and raise the supplier order.' },
  { id: 'RSK-040', area: 'Workforce', signal: 'Interview capacity is below pipeline demand', impact: 'Six hires may slip by one week', confidence: 82, owner: 'People', status: 'Open', recommendation: 'Add two panel slots and delegate first-stage screening.' },
  { id: 'RSK-039', area: 'Messaging', signal: 'WhatsApp delivery rate recovered', impact: 'Customer updates operating normally', confidence: 98, owner: 'Messaging Core', status: 'Resolved', recommendation: 'Continue monitoring template quality and opt-out rate.' },
]

const seedCareRecords: CareRecord[] = [
  { id: 'APT-248', patient: 'Amara Okafor', appointment: 'Today · 14:30', clinician: 'Dr Shah', reason: 'Follow-up consultation', balance: 0, status: 'Checked in', nextStep: 'Record consultation outcome' },
  { id: 'APT-247', patient: 'George Wilson', appointment: 'Today · 15:15', clinician: 'Dr Patel', reason: 'Initial assessment', balance: 85, status: 'Scheduled', nextStep: 'Send arrival reminder' },
  { id: 'APT-246', patient: 'Lucia Ramos', appointment: 'Tomorrow · 09:00', clinician: 'Dr Shah', reason: 'Treatment review', balance: 40, status: 'Follow-up', nextStep: 'Confirm treatment plan' },
  { id: 'APT-245', patient: 'Ibrahim Diallo', appointment: 'Today · 11:00', clinician: 'Dr Patel', reason: 'Routine consultation', balance: 0, status: 'Completed', nextStep: 'No further action' },
]

function now() {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date())
}

function MetricStrip({ items }: { items: Array<{ label: string; value: string; detail: string }> }) {
  return <div className="retail-metric-strip">{items.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></article>)}</div>
}

function WorkforceWorkspace({ moduleId }: { moduleId: string }) {
  const [candidates, setCandidates] = usePersistentRecords('foundingos-demo-workforce-candidates-v1', seedCandidates)
  const [selectedId, setSelectedId] = useState(seedCandidates[0].id)
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<'All' | CandidateStage>('All')
  const [activity, setActivity] = useState<{ id: string; label: string; detail: string; time: string } | null>(null)
  const selected = candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0]
  const filtered = useMemo(() => candidates.filter((candidate) => {
    const matchesQuery = `${candidate.name} ${candidate.role} ${candidate.owner}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (stage === 'All' || candidate.stage === stage)
  }), [candidates, query, stage])
  const interviewing = candidates.filter((candidate) => candidate.stage === 'Interview').length
  const offers = candidates.filter((candidate) => candidate.stage === 'Offer').length
  const ready = candidates.filter((candidate) => candidate.score >= 85 && ['Applied', 'Qualified'].includes(candidate.stage)).length

  const advance = () => {
    const currentIndex = candidateFlow.indexOf(selected.stage)
    const nextStage = candidateFlow[Math.min(currentIndex + 1, candidateFlow.length - 1)]
    setCandidates((current) => current.map((candidate) => candidate.id === selected.id ? { ...candidate, stage: nextStage, nextStep: nextStage === 'Hired' ? 'Start onboarding checklist' : `Complete ${nextStage.toLowerCase()} step` } : candidate))
    setActivity({ id: `candidate-${Date.now()}`, label: `${selected.name} moved to ${nextStage}`, detail: 'The hiring pipeline and CEO metrics were updated', time: now() })
  }

  const createCandidate = () => {
    const next: Candidate = { id: `CAN-${1285 + candidates.length}`, name: 'New candidate', role: 'Role to confirm', source: 'WhatsApp', owner: 'Unassigned', score: 70, stage: 'Applied', nextStep: 'Review profile and assign owner' }
    setCandidates((current) => [next, ...current])
    setSelectedId(next.id)
    setActivity({ id: `candidate-${Date.now()}`, label: `${next.id} created`, detail: 'Candidate captured from the shared workspace', time: now() })
  }

  return <section className="retail-workspace">
    <WorkspaceHeader eyebrow="Core.Workforce" title={moduleId === 'onboarding' ? 'People and onboarding' : 'Hiring pipeline'} description="See who is moving, where hiring is blocked, and what action keeps the team plan on track." onCreate={createCandidate} />
    <ActivityToast activity={activity} />
    <CEOBriefing
      headline={ready ? `${ready} strong candidate${ready === 1 ? '' : 's'} ready to progress` : 'The hiring pipeline is moving'}
      summary={`${candidates.length} visible candidates are being coordinated across active roles. Interview capacity and expiring offers are the decisions most likely to affect hiring speed.`}
      standing={[
        { label: 'Candidates', value: String(candidates.length), meaning: 'People currently visible in this demo pipeline.' },
        { label: 'Interviews', value: String(interviewing), meaning: 'Candidates requiring interviewer time.', tone: interviewing > 2 ? 'watch' : 'good' },
        { label: 'Offers', value: String(offers), meaning: 'Hiring decisions closest to completion.', tone: offers ? 'good' : 'watch' },
        { label: 'Strong matches', value: String(candidates.filter((candidate) => candidate.score >= 85).length), meaning: 'Candidates scoring 85 or above.' },
      ]}
      risks={['One offer expires within two days.', `${ready} high-scoring candidate${ready === 1 ? '' : 's'} can be progressed now.`, 'Unowned candidates increase time-to-hire and drop-off risk.']}
      actions={['Progress high-scoring candidates before opening more sourcing.', 'Protect interviewer capacity for roles tied to revenue or service.', 'Start onboarding immediately after offer acceptance.']}
    />
    <MetricStrip items={[
      { label: 'Pipeline', value: String(candidates.length), detail: 'Visible people' },
      { label: 'Average score', value: `${Math.round(candidates.reduce((total, candidate) => total + candidate.score, 0) / candidates.length)}%`, detail: 'Role match' },
      { label: 'Interviews', value: String(interviewing), detail: 'Needs time' },
      { label: 'Offers', value: String(offers), detail: 'Near completion' },
    ]} />
    <div className="retail-toolbar">
      <label><span>Search people</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, role, or owner…" /></label>
      <label><span>Stage</span><select value={stage} onChange={(event) => setStage(event.target.value as 'All' | CandidateStage)}>{['All', ...candidateFlow].map((value) => <option key={value}>{value}</option>)}</select></label>
      <button type="button" onClick={() => setCandidates(seedCandidates)}>Reset demo data</button>
    </div>
    <div className="retail-data-layout">
      <div className="retail-table-panel"><div className="retail-table-heading"><div><strong>Candidate control</strong><span>{filtered.length} matching people</span></div><span>Browser-persisted demo data</span></div>
        <div className="retail-table-scroll"><table><thead><tr><th>Candidate</th><th>Role</th><th>Score</th><th>Owner</th><th>Next step</th><th>Stage</th></tr></thead><tbody>{filtered.map((candidate) => <tr key={candidate.id} onClick={() => setSelectedId(candidate.id)}><td><strong>{candidate.name}</strong><small>{candidate.id} · {candidate.source}</small></td><td>{candidate.role}</td><td>{candidate.score}%</td><td>{candidate.owner}</td><td>{candidate.nextStep}</td><td><span className={`retail-status status-${candidate.stage.toLowerCase()}`}>{candidate.stage}</span></td></tr>)}</tbody></table></div>
      </div>
      {selected && <aside className="retail-detail-panel"><p>Selected candidate</p><h2>{selected.name}</h2><strong>{selected.role}</strong><dl><div><dt>Match</dt><dd>{selected.score}%</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Stage</dt><dd>{selected.stage}</dd></div><div><dt>Next</dt><dd>{selected.nextStep}</dd></div></dl>{selected.stage !== 'Hired' && <button className="retail-primary-action" type="button" onClick={advance}>Move to {candidateFlow[Math.min(candidateFlow.indexOf(selected.stage) + 1, candidateFlow.length - 1)]}</button>}<button type="button" onClick={() => setActivity({ id: `candidate-${Date.now()}`, label: 'WhatsApp message prepared', detail: `Candidate update prepared for ${selected.name}`, time: now() })}>Send WhatsApp update</button></aside>}
    </div>
  </section>
}

function IntelligenceWorkspace({ moduleId }: { moduleId: string }) {
  const [risks, setRisks] = usePersistentRecords('foundingos-demo-intelligence-risks-v1', seedRisks)
  const [selectedId, setSelectedId] = useState(seedRisks[0].id)
  const [filter, setFilter] = useState<'All' | RiskStatus>('All')
  const [activity, setActivity] = useState<{ id: string; label: string; detail: string; time: string } | null>(null)
  const selected = risks.find((risk) => risk.id === selectedId) ?? risks[0]
  const filtered = filter === 'All' ? risks : risks.filter((risk) => risk.status === filter)
  const open = risks.filter((risk) => risk.status === 'Open').length
  const reviewing = risks.filter((risk) => risk.status === 'Reviewing').length
  const resolved = risks.filter((risk) => risk.status === 'Resolved').length

  const updateStatus = (status: RiskStatus) => {
    setRisks((current) => current.map((risk) => risk.id === selected.id ? { ...risk, status } : risk))
    setActivity({ id: `risk-${Date.now()}`, label: `${selected.id} moved to ${status}`, detail: status === 'Resolved' ? 'The recommendation was recorded in the Event Feed' : `${selected.owner} remains accountable`, time: now() })
  }

  return <section className="retail-workspace">
    <WorkspaceHeader eyebrow="Core.Intelligence" title={moduleId === 'monitoring' ? 'Business health' : 'Risks and recommendations'} description="Turn activity from every workspace into a clear view of what changed, what matters, and what to do next." onCreate={() => {
      const next: BusinessRisk = { id: `RSK-${43 + risks.length}`, area: 'Operations', signal: 'New signal awaiting review', impact: 'Impact not yet quantified', confidence: 72, owner: 'Unassigned', status: 'Open', recommendation: 'Review the connected events and assign an owner.' }
      setRisks((current) => [next, ...current]); setSelectedId(next.id); setActivity({ id: `risk-${Date.now()}`, label: `${next.id} created`, detail: 'New signal entered the decision queue', time: now() })
    }} />
    <ActivityToast activity={activity} />
    <CEOBriefing
      headline={open ? `${open} decision${open === 1 ? '' : 's'} need an owner` : 'No unowned business risks'}
      summary={`FoundingOS has turned the current shared events into ${risks.length} decision-ready signals. Resolve the highest-confidence cash and customer risks first.`}
      standing={[
        { label: 'Open decisions', value: String(open), meaning: 'Signals that still need an accountable response.', tone: open ? 'risk' : 'good' },
        { label: 'Under review', value: String(reviewing), meaning: 'Decisions actively being investigated.', tone: reviewing ? 'watch' : 'good' },
        { label: 'Resolved', value: String(resolved), meaning: 'Recommendations completed and recorded.' },
        { label: 'Avg confidence', value: `${Math.round(risks.reduce((total, risk) => total + risk.confidence, 0) / risks.length)}%`, meaning: 'Strength of evidence behind the visible signals.' },
      ]}
      risks={[`${open} open decision${open === 1 ? '' : 's'} can still affect cash, stock, or staffing.`, 'High-confidence risks become more expensive when ownership is unclear.', 'Resolved actions should be checked against subsequent Event Feed outcomes.']}
      actions={['Assign the highest-cash-impact signal first.', 'Move each accepted recommendation into its owning workspace.', 'Review outcomes weekly so Intelligence learns what worked.']}
    />
    <MetricStrip items={[
      { label: 'Signals', value: '420', detail: 'Seven days' },
      { label: 'Open', value: String(open), detail: 'Needs decision' },
      { label: 'Resolved', value: String(resolved), detail: 'Action recorded' },
      { label: 'Coverage', value: '6', detail: 'Workspaces connected' },
    ]} />
    <div className="retail-toolbar"><label><span>Status</span><select value={filter} onChange={(event) => setFilter(event.target.value as 'All' | RiskStatus)}>{['All', 'Open', 'Reviewing', 'Resolved'].map((value) => <option key={value}>{value}</option>)}</select></label><button type="button" onClick={() => setRisks(seedRisks)}>Reset demo data</button></div>
    <div className="retail-data-layout">
      <div className="retail-table-panel"><div className="retail-table-heading"><div><strong>Decision queue</strong><span>{filtered.length} visible signals</span></div><span>Shared Event Feed evidence</span></div>
        <div className="retail-table-scroll"><table><thead><tr><th>Signal</th><th>Area</th><th>Impact</th><th>Confidence</th><th>Owner</th><th>Status</th></tr></thead><tbody>{filtered.map((risk) => <tr key={risk.id} onClick={() => setSelectedId(risk.id)}><td><strong>{risk.signal}</strong><small>{risk.id}</small></td><td>{risk.area}</td><td>{risk.impact}</td><td>{risk.confidence}%</td><td>{risk.owner}</td><td><span className={`retail-status status-${risk.status.toLowerCase()}`}>{risk.status}</span></td></tr>)}</tbody></table></div>
      </div>
      {selected && <aside className="retail-detail-panel"><p>Selected decision</p><h2>{selected.id}</h2><strong>{selected.signal}</strong><dl><div><dt>Area</dt><dd>{selected.area}</dd></div><div><dt>Impact</dt><dd>{selected.impact}</dd></div><div><dt>Confidence</dt><dd>{selected.confidence}%</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div></dl><p className="retail-detail-note">{selected.recommendation}</p>{selected.status === 'Open' && <button className="retail-primary-action" type="button" onClick={() => updateStatus('Reviewing')}>Accept and review</button>}{selected.status !== 'Resolved' && <button type="button" onClick={() => updateStatus('Resolved')}>Mark resolved</button>}</aside>}
    </div>
  </section>
}

export function WorkforceIntelligenceWorkspace({ suite, moduleId }: { suite: 'workforce' | 'intelligence'; moduleId: string }) {
  return suite === 'workforce' ? <WorkforceWorkspace moduleId={moduleId} /> : <IntelligenceWorkspace moduleId={moduleId} />
}
