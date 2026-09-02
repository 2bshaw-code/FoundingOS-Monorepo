/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import type { BrandConsoleConfig } from './console'
import { ModuleHeader } from './console'

type CRMKind = 'customer' | 'lead' | 'supplier' | 'client' | 'investor' | 'ticket' | 'project'
type PipelineStage = 'New' | 'Contacted' | 'Qualified' | 'In Progress' | 'Closed Won' | 'Closed Lost'
type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
type TaskStatus = 'Open' | 'Working' | 'Waiting' | 'Done'
type NoteTarget = 'customer' | 'lead' | 'task' | 'supplier' | 'client' | 'investor' | 'ticket' | 'project'

type CRMBlueprint = {
  entityLabel: string
  formLabel: string
  kind: CRMKind
  extraLabel: string
  extraPlaceholder: string
  forms: Array<{ kind: CRMKind; label: string }>
  modules: Array<{ title: string; description: string; metric: string }>
}

type CRMRecord = {
  id: string
  kind: CRMKind
  name: string
  email: string
  phone: string
  company: string
  status: PipelineStage
  notes: string
  tags: string[]
  assignedUser: string
  extraLabel: string
  extraValue: string
  brandField: string
  updatedAt: string
}

type CRMTask = {
  id: string
  title: string
  assignee: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  relatedTo: string
}

type CRMNote = {
  id: string
  targetType: NoteTarget
  targetId: string
  title: string
  body: string
  editedAt: string
}

type CRMActivity = {
  id: string
  title: string
  detail: string
  timestamp: string
}

type CRMFormState = {
  name: string
  email: string
  phone: string
  company: string
  status: PipelineStage
  notes: string
  tags: string
  assignedUser: string
  extraValue: string
}

const pipelineStages: PipelineStage[] = ['New', 'Contacted', 'Qualified', 'In Progress', 'Closed Won', 'Closed Lost']
const pipelineOptions = ['New', 'Contacted', 'Qualified', 'In Progress', 'Closed Won', 'Closed Lost'] as const
const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent']
const taskStatusOptions: TaskStatus[] = ['Open', 'Working', 'Waiting', 'Done']

const brandBlueprints: Record<string, CRMBlueprint> = {
  FoundRetail: {
    entityLabel: 'Customer',
    formLabel: 'Add Customer',
    kind: 'customer',
    extraLabel: 'Store account / order profile',
    extraPlaceholder: 'Store account, preferred channel, order volume',
    forms: [
      { kind: 'customer', label: 'Add Customer' },
      { kind: 'lead', label: 'Add Lead' },
      { kind: 'supplier', label: 'Add Supplier' },
    ],
    modules: [
      { title: 'Orders', description: 'Track store orders, reorder requests, and fulfilment links.', metric: 'Live order flow' },
      { title: 'POS customers', description: 'Keep in-store and online shoppers in one shared CRM.', metric: 'POS synced' },
      { title: 'Store accounts', description: 'Manage branch-level contacts and local account owners.', metric: 'Branch aware' },
    ],
  },
  FoundMeat: {
    entityLabel: 'Supplier',
    formLabel: 'Add Supplier',
    kind: 'supplier',
    extraLabel: 'Compliance / supply chain field',
    extraPlaceholder: 'Compliance ID, cold-chain status, cut group',
    forms: [
      { kind: 'supplier', label: 'Add Supplier' },
      { kind: 'lead', label: 'Add Lead' },
      { kind: 'customer', label: 'Add Customer' },
    ],
    modules: [
      { title: 'Compliance contacts', description: 'Store audit contacts, certification dates, and sign-off trails.', metric: 'Audit ready' },
      { title: 'Supplier chain', description: 'Coordinate suppliers, processors, and delivery partners.', metric: 'Chain synced' },
      { title: 'Batch follow-up', description: 'Tie supplier records to batch QA and delivery events.', metric: 'Batch linked' },
    ],
  },
  FoundCrypto: {
    entityLabel: 'Investor',
    formLabel: 'Add Investor',
    kind: 'investor',
    extraLabel: 'Wallet / portfolio field',
    extraPlaceholder: 'Wallet address, risk band, portfolio size',
    forms: [
      { kind: 'investor', label: 'Add Investor' },
      { kind: 'lead', label: 'Add Lead' },
      { kind: 'customer', label: 'Add Customer' },
    ],
    modules: [
      { title: 'Wallet clients', description: 'Maintain wallet owners, treasury contacts, and access history.', metric: 'Wallet ready' },
      { title: 'Investor profiles', description: 'Track portfolio context, risk band, and onboarding state.', metric: 'Profile rich' },
      { title: 'Execution links', description: 'Connect investor contact records to trading triggers.', metric: 'Signal linked' },
    ],
  },
  FoundThat: {
    entityLabel: 'Ticket',
    formLabel: 'Add Ticket',
    kind: 'ticket',
    extraLabel: 'Device / service field',
    extraPlaceholder: 'Ticket number, device asset tag, severity',
    forms: [
      { kind: 'ticket', label: 'Add Ticket' },
      { kind: 'lead', label: 'Add Lead' },
      { kind: 'customer', label: 'Add Customer' },
    ],
    modules: [
      { title: 'Ticket contacts', description: 'Store service contacts, owners, and escalation chains.', metric: 'Service ready' },
      { title: 'Device owners', description: 'Map incidents to the correct asset owner and workspace.', metric: 'Asset linked' },
      { title: 'Incident routing', description: 'Route issues into the right queues and response windows.', metric: 'Routed live' },
    ],
  },
  FoundTalent: {
    entityLabel: 'Client',
    formLabel: 'Add Client',
    kind: 'client',
    extraLabel: 'Hiring / candidate field',
    extraPlaceholder: 'Open role, candidate stage, hiring manager',
    forms: [
      { kind: 'client', label: 'Add Client' },
      { kind: 'customer', label: 'Add Customer' },
      { kind: 'lead', label: 'Add Lead' },
    ],
    modules: [
      { title: 'Candidate profiles', description: 'Manage candidates, interview context, and recruiter ownership.', metric: 'Candidate rich' },
      { title: 'Employer clients', description: 'Track company relationships and recruiter-side deal flow.', metric: 'Employer ready' },
      { title: 'Hiring pipelines', description: 'Keep client records connected to candidate stages.', metric: 'Pipeline linked' },
    ],
  },
  FoundingOS: {
    entityLabel: 'Project',
    formLabel: 'Add Project',
    kind: 'project',
    extraLabel: 'Stakeholder / system field',
    extraPlaceholder: 'Project code, stakeholder group, system owner',
    forms: [
      { kind: 'project', label: 'Add Project' },
      { kind: 'lead', label: 'Add Lead' },
      { kind: 'customer', label: 'Add Customer' },
    ],
    modules: [
      { title: 'Project stakeholders', description: 'Track project sponsors, owners, and delivery checkpoints.', metric: 'Project linked' },
      { title: 'System contacts', description: 'Store technical contacts and platform owners across the group.', metric: 'System ready' },
      { title: 'Portfolio rollouts', description: 'Coordinate launch plans across every brand workspace.', metric: 'Rollout active' },
    ],
  },
}

function nowLabel() {
  return new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function seedRecords(brand: string, blueprint: CRMBlueprint): CRMRecord[] {
  const base = [
    ['Northside Group', 'new@northside.example', '+44 7000 111111', 'Northside Group', 'New', 'Initial conversation logged', ['priority', 'warm'], 'Ava'],
    ['Harbour Team', 'hello@harbour.example', '+44 7000 222222', 'Harbour Team', 'Qualified', 'Ready for follow-up', ['key-account'], 'Noah'],
    ['Summit Co', 'ops@summit.example', '+44 7000 333333', 'Summit Co', 'In Progress', 'Working through requirements', ['review', 'vip'], 'Mia'],
    ['Bluebird Ltd', 'contact@bluebird.example', '+44 7000 444444', 'Bluebird Ltd', 'Contacted', 'Waiting on response', ['follow-up'], 'Zoe'],
  ] as const

  return base.map((row, index) => ({
    id: `${brand.toLowerCase()}-${index + 1}`,
    kind: blueprint.kind,
    name: row[0],
    email: row[1],
    phone: row[2],
    company: row[3],
    status: row[4] as PipelineStage,
    notes: row[5],
    tags: [...row[6]],
    assignedUser: row[7],
    extraLabel: blueprint.extraLabel,
    extraValue: `${blueprint.entityLabel} detail ${index + 1}`,
    brandField: row[3],
    // Fixed, deterministic label — not nowLabel() — because this seed data is built via a
    // useState lazy initializer, which React runs once during SSR and once again during client
    // hydration, at genuinely different wall-clock moments; calling new Date() in either path
    // makes the two renders produce different text (a real, confirmed-live hydration mismatch,
    // React error #425). Also more honest: these are illustrative seed records created when the
    // demo mounted, not real events that happened at a precise historical moment.
    updatedAt: 'Just now',
  }))
}

function seedTasks(brand: string): CRMTask[] {
  return [
    { id: `${brand}-task-1`, title: 'Review new enquiries', assignee: 'Ava', dueDate: '2026-08-25', priority: 'High', status: 'Open', relatedTo: 'Northside Group' },
    { id: `${brand}-task-2`, title: 'Send follow-up', assignee: 'Noah', dueDate: '2026-08-26', priority: 'Medium', status: 'Working', relatedTo: 'Harbour Team' },
    { id: `${brand}-task-3`, title: 'Close open loop', assignee: 'Mia', dueDate: '2026-08-27', priority: 'Urgent', status: 'Waiting', relatedTo: 'Summit Co' },
  ]
}

function seedNotes(brand: string): CRMNote[] {
  // Fixed, deterministic labels here too — see seedRecords' updatedAt comment for why
  // (useState lazy initializer runs once on the server, once again on the client, at different
  // real-world moments; new Date() there is a confirmed-live hydration-mismatch trigger).
  return [
    { id: `${brand}-note-1`, targetType: 'customer', targetId: `${brand.toLowerCase()}-1`, title: 'Call summary', body: 'Confirmed next steps and shared package details.', editedAt: 'Just now' },
    { id: `${brand}-note-2`, targetType: 'lead', targetId: `${brand.toLowerCase()}-2`, title: 'Qualification note', body: 'Lead meets the main criteria and needs a proposal.', editedAt: 'Just now' },
  ]
}

function seedActivity(brand: string): CRMActivity[] {
  // Same fix, same reason as seedRecords/seedNotes above.
  return [
    { id: `${brand}-activity-1`, title: 'Dashboard opened', detail: 'CRM workspace loaded with brand-specific modules.', timestamp: 'Just now' },
    { id: `${brand}-activity-2`, title: 'Lead pipeline reviewed', detail: 'Current records and stages synced into the console.', timestamp: 'Just now' },
  ]
}

function toText(value: string) {
  return value.trim().toLowerCase()
}

function crmStyle(config: BrandConsoleConfig): CSSProperties {
  return {
    '--accent': config.colors.accent,
    '--panel': config.colors.panel,
    '--bg': config.colors.background,
  } as CSSProperties
}

function brandTabs() {
  return [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'records', label: 'Records' },
    { key: 'pipeline', label: 'Pipeline' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'notes', label: 'Notes' },
    { key: 'automation', label: 'Automation' },
  ] as const
}

function fieldLabel(kind: CRMKind) {
  switch (kind) {
    case 'supplier':
      return 'Supplier'
    case 'client':
      return 'Client'
    case 'investor':
      return 'Investor'
    case 'ticket':
      return 'Ticket'
    case 'project':
      return 'Project'
    case 'lead':
      return 'Lead'
    default:
      return 'Customer'
  }
}

function CRMBadge({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="crm-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  )
}

function CRMPanel({ title, children, className = '' }: { title: string; children: JSX.Element | JSX.Element[] | string | number | null | undefined; className?: string }) {
  return (
    <article className={`crm-panel ${className}`.trim()}>
      <h2>{title}</h2>
      {children}
    </article>
  )
}

export function CRMBoard({ config }: { config: BrandConsoleConfig }) {
  const blueprint = brandBlueprints[config.name] ?? brandBlueprints.FoundingOS
  const tabs = brandTabs()
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['key']>('dashboard')
  const [activeKind, setActiveKind] = useState<CRMKind>(blueprint.forms[0]?.kind ?? blueprint.kind)
  const [records, setRecords] = useState<CRMRecord[]>(() => seedRecords(config.name, blueprint))
  const [tasks, setTasks] = useState<CRMTask[]>(() => seedTasks(config.name))
  const [notes, setNotes] = useState<CRMNote[]>(() => seedNotes(config.name))
  const [activity, setActivity] = useState<CRMActivity[]>(() => seedActivity(config.name))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [recordDraft, setRecordDraft] = useState<CRMFormState>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    notes: '',
    tags: '',
    assignedUser: 'Ava',
    extraValue: '',
  })
  const [taskDraft, setTaskDraft] = useState({
    title: '',
    assignee: 'Ava',
    dueDate: '',
    priority: 'Medium' as TaskPriority,
    status: 'Open' as TaskStatus,
    relatedTo: '',
  })
  const [noteDraft, setNoteDraft] = useState({
    targetType: 'customer' as NoteTarget,
    targetId: '',
    title: '',
    body: '',
  })

  const filteredRecords = useMemo(() => {
    const q = toText(search)
    return records.filter((record) => {
      const values = [record.name, record.email, record.phone, record.company, record.notes, record.assignedUser, record.extraValue, record.brandField, record.tags.join(' ')]
      const matchesSearch = q.length === 0 || values.some((value) => toText(value).includes(q))
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter
      const matchesTag = tagFilter === 'all' || record.tags.includes(tagFilter)
      const matchesOwner = ownerFilter === 'all' || record.assignedUser === ownerFilter
      return matchesSearch && matchesStatus && matchesTag && matchesOwner
    })
  }, [records, search, statusFilter, tagFilter, ownerFilter])

  const filteredNotes = useMemo(() => {
    const q = toText(search)
    return notes.filter((note) => {
      const matchesSearch = q.length === 0 || [note.title, note.body, note.targetId, note.targetType].some((value) => toText(value).includes(q))
      return matchesSearch
    })
  }, [notes, search])

  const stageCounts = useMemo(() => {
    return pipelineStages.map((stage) => ({ stage, count: records.filter((record) => record.status === stage).length }))
  }, [records])

  const metrics = useMemo(() => {
    const openTasks = tasks.filter((task) => task.status !== 'Done').length
    const openNotes = notes.length
    const activeLeads = records.filter((record) => record.kind === 'lead').length
    const activeCustomers = records.filter((record) => record.kind === 'customer').length
    return [
      { label: blueprint.entityLabel, value: String(records.filter((record) => record.kind === blueprint.kind).length || records.length), hint: `${config.name} entity focus` },
      { label: 'Pipeline', value: String(activeLeads), hint: 'Lead records in flight' },
      { label: 'Tasks', value: String(openTasks), hint: 'Open and active work' },
      { label: 'Notes', value: String(openNotes), hint: 'Timeline entries ready' },
      { label: 'Customers', value: String(activeCustomers), hint: 'Relationship records' },
    ]
  }, [blueprint.entityLabel, blueprint.kind, config.name, notes, records, tasks])

  const automationRules = useMemo(() => {
    switch (config.name) {
      case 'FoundRetail':
        return ['Auto-create reorder task when a store account is marked In Progress.', 'Flag VIP customers when tags include priority or wholesale.', 'Route supplier notes to the operations owner.']
      case 'FoundMeat':
        return ['Create a compliance task for every supplier marked Qualified.', 'Link cold-chain notes to batch follow-up tasks.', 'Escalate audit-risk records automatically.']
      case 'FoundCrypto':
        return ['Create a risk review task when investor exposure exceeds threshold.', 'Push wallet updates into the activity timeline.', 'Tag high-priority portfolio records for analyst follow-up.']
      case 'FoundThat':
        return ['Open an incident task when a ticket moves to In Progress.', 'Link device-owner notes to each resolved ticket.', 'Escalate urgent alerts to the top of the queue.']
      case 'FoundTalent':
        return ['Create interview tasks for candidates marked Qualified.', 'Attach employer client notes to the active job pipeline.', 'Promote hot candidates into the priority filter.']
      default:
        return ['Create project tasks when a stakeholder is added.', 'Attach system notes to the active rollout timeline.', 'Escalate dependencies marked In Progress.']
    }
  }, [config.name])

  const selectedNote = selectedNoteId ? notes.find((note) => note.id === selectedNoteId) : undefined

  const pushActivity = (title: string, detail: string) => {
    setActivity((current) => [{ id: `${Date.now()}`, title, detail, timestamp: nowLabel() }, ...current].slice(0, 10))
  }

  const resetRecordDraft = () => {
    setRecordDraft({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'New',
      notes: '',
      tags: '',
      assignedUser: 'Ava',
      extraValue: '',
    })
  }

  const submitRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = recordDraft.name.trim()
    if (!trimmedName) return

    const nextRecord: CRMRecord = {
      id: `${config.name.toLowerCase()}-${activeKind}-${Date.now()}`,
      kind: activeKind,
      name: trimmedName,
      email: recordDraft.email.trim(),
      phone: recordDraft.phone.trim(),
      company: recordDraft.company.trim(),
      status: recordDraft.status,
      notes: recordDraft.notes.trim(),
      tags: recordDraft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      assignedUser: recordDraft.assignedUser.trim() || 'Ava',
      extraLabel: blueprint.extraLabel,
      extraValue: recordDraft.extraValue.trim(),
      brandField: recordDraft.extraValue.trim(),
      updatedAt: nowLabel(),
    }

    setRecords((current) => [nextRecord, ...current])
    pushActivity(`Added ${fieldLabel(activeKind)}`, `${nextRecord.name} was created in the ${config.name} CRM.`)
    resetRecordDraft()
    setStatusFilter('all')
    setTagFilter('all')
    setOwnerFilter('all')
  }

  const submitTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!taskDraft.title.trim()) return

    const nextTask: CRMTask = {
      id: `${config.name.toLowerCase()}-task-${Date.now()}`,
      title: taskDraft.title.trim(),
      assignee: taskDraft.assignee,
      dueDate: taskDraft.dueDate,
      priority: taskDraft.priority,
      status: taskDraft.status,
      relatedTo: taskDraft.relatedTo.trim(),
    }

    setTasks((current) => [nextTask, ...current])
    pushActivity('Created task', `${nextTask.title} assigned to ${nextTask.assignee}.`)
    setTaskDraft({ title: '', assignee: 'Ava', dueDate: '', priority: 'Medium', status: 'Open', relatedTo: '' })
  }

  const saveNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!noteDraft.title.trim() || !noteDraft.body.trim()) return

    if (selectedNote) {
      const editedNote: CRMNote = {
        ...selectedNote,
        targetType: noteDraft.targetType,
        targetId: noteDraft.targetId.trim() || selectedNote.targetId,
        title: noteDraft.title.trim(),
        body: noteDraft.body.trim(),
        editedAt: nowLabel(),
      }
      setNotes((current) => current.map((note) => (note.id === editedNote.id ? editedNote : note)))
      setSelectedNoteId(editedNote.id)
      pushActivity('Updated note', `${editedNote.title} was edited and re-attached to ${editedNote.targetId}.`)
      return
    }

    const nextNote: CRMNote = {
      id: `${config.name.toLowerCase()}-note-${Date.now()}`,
      targetType: noteDraft.targetType,
      targetId: noteDraft.targetId.trim(),
      title: noteDraft.title.trim(),
      body: noteDraft.body.trim(),
      editedAt: nowLabel(),
    }
    setNotes((current) => [nextNote, ...current])
    setSelectedNoteId(nextNote.id)
    pushActivity('Added note', `${nextNote.title} was attached to ${nextNote.targetType}.`)
  }

  const stageCountFor = (stage: PipelineStage) => records.filter((record) => record.status === stage).length

  const dashboard = (
    <div className="crm-dashboard">
      <div className="kpi-grid crm-kpis">
        {metrics.map((metric) => <CRMBadge key={metric.label} label={metric.label} value={metric.value} hint={metric.hint} />)}
      </div>

      <div className="crm-stage-grid">
        {stageCounts.map(({ stage, count }) => (
          <article key={stage} className="crm-stage-card">
            <span>{stage}</span>
            <strong>{count}</strong>
            <small>{count === 1 ? 'record' : 'records'}</small>
          </article>
        ))}
      </div>

      <div className="crm-dashboard-grid">
        <CRMPanel title={`Customer list`} className="crm-panel-wide">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.slice(0, 5).map((record) => (
                <tr key={record.id}>
                  <td>{record.name}</td>
                  <td>{record.email}</td>
                  <td>{record.company}</td>
                  <td>{record.status}</td>
                  <td>{record.assignedUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CRMPanel>

        <CRMPanel title="Lead pipeline">
          <div className="crm-column-list">
            {pipelineStages.map((stage) => {
              const items = records.filter((record) => record.status === stage)
              return (
                <section key={stage} className="crm-mini-column">
                  <div className="crm-column-heading">
                    <strong>{stage}</strong>
                    <span>{items.length}</span>
                  </div>
                  {items.slice(0, 3).map((item) => <p key={item.id}>{item.name}</p>)}
                </section>
              )
            })}
          </div>
        </CRMPanel>

        <CRMPanel title="Activity timeline">
          <div className="crm-timeline">
            {activity.map((item) => (
              <article key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
                <small>{item.timestamp}</small>
              </article>
            ))}
          </div>
        </CRMPanel>

        <CRMPanel title="Tasks overview">
          <div className="crm-task-list">
            {tasks.map((task) => (
              <article key={task.id} className="crm-task-card">
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.relatedTo || 'No related record'}</p>
                </div>
                <div className="crm-task-meta">
                  <span>{task.assignee}</span>
                  <span>{task.priority}</span>
                  <span>{task.status}</span>
                </div>
              </article>
            ))}
          </div>
        </CRMPanel>

        <CRMPanel title="Notes panel">
          <div className="crm-note-list">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                className={`crm-note-chip ${selectedNote?.id === note.id ? 'active' : ''}`}
                onClick={() => setSelectedNoteId(note.id)}
              >
                <strong>{note.title}</strong>
                <span>{note.targetType} · {note.editedAt}</span>
              </button>
            ))}
          </div>
        </CRMPanel>
      </div>
    </div>
  )

  const formTab = (
    <CRMPanel title={`${blueprint.formLabel} · ${fieldLabel(activeKind)}`} className="crm-form-panel">
      <div className="crm-kind-tabs">
        {blueprint.forms.map(({ kind, label }) => {
          const formLabel = label
          return (
            <button
              key={kind}
              type="button"
              className={activeKind === kind ? 'active' : ''}
              onClick={() => setActiveKind(kind as CRMKind)}
            >
              {formLabel}
            </button>
          )
        })}
      </div>
      <form className="crm-form" onSubmit={submitRecord}>
        <label>
          <span>Name</span>
          <input value={recordDraft.name} onChange={(event) => setRecordDraft((current) => ({ ...current, name: event.target.value }))} />
        </label>
        <label>
          <span>Email</span>
          <input type="email" value={recordDraft.email} onChange={(event) => setRecordDraft((current) => ({ ...current, email: event.target.value }))} />
        </label>
        <label>
          <span>Phone</span>
          <input value={recordDraft.phone} onChange={(event) => setRecordDraft((current) => ({ ...current, phone: event.target.value }))} />
        </label>
        <label>
          <span>Company</span>
          <input value={recordDraft.company} onChange={(event) => setRecordDraft((current) => ({ ...current, company: event.target.value }))} />
        </label>
        <label>
          <span>Status</span>
          <select value={recordDraft.status} onChange={(event) => setRecordDraft((current) => ({ ...current, status: event.target.value as PipelineStage }))}>
            {pipelineOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Tags</span>
          <input placeholder="vip, priority" value={recordDraft.tags} onChange={(event) => setRecordDraft((current) => ({ ...current, tags: event.target.value }))} />
        </label>
        <label>
          <span>Assigned user</span>
          <input value={recordDraft.assignedUser} onChange={(event) => setRecordDraft((current) => ({ ...current, assignedUser: event.target.value }))} />
        </label>
        <label className="crm-form-wide">
          <span>Notes</span>
          <textarea rows={4} value={recordDraft.notes} onChange={(event) => setRecordDraft((current) => ({ ...current, notes: event.target.value }))} />
        </label>
        <label className="crm-form-wide">
          <span>{blueprint.extraLabel}</span>
          <textarea
            rows={3}
            placeholder={blueprint.extraPlaceholder}
            value={recordDraft.extraValue}
            onChange={(event) => setRecordDraft((current) => ({ ...current, extraValue: event.target.value }))}
          />
        </label>
        <div className="crm-form-actions">
          <button type="submit">Save {fieldLabel(activeKind)}</button>
          <button type="button" onClick={resetRecordDraft}>Clear</button>
        </div>
      </form>
    </CRMPanel>
  )

  const filtersTab = (
    <CRMPanel title="Search and filters" className="crm-form-panel">
      <div className="crm-filter-grid">
        <label>
          <span>Search by name, email, company</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records" />
        </label>
        <label>
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {pipelineStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
          </select>
        </label>
        <label>
          <span>Tags</span>
          <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
            <option value="all">All tags</option>
            {Array.from(new Set(records.flatMap((record) => record.tags))).map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </label>
        <label>
          <span>Assigned user</span>
          <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
            <option value="all">All users</option>
            {Array.from(new Set(records.map((record) => record.assignedUser))).map((owner) => <option key={owner} value={owner}>{owner}</option>)}
          </select>
        </label>
      </div>
      <table className="crm-table crm-table-compact">
        <thead>
          <tr>
            <th>Name</th>
            <th>Kind</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.id}>
              <td>
                <strong>{record.name}</strong>
                <div className="crm-muted">{record.email}</div>
              </td>
              <td>{fieldLabel(record.kind)}</td>
              <td>{record.status}</td>
              <td>{record.tags.join(', ') || '—'}</td>
              <td>{record.assignedUser}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CRMPanel>
  )

  const tasksTab = (
    <CRMPanel title="Create task" className="crm-form-panel">
      <form className="crm-form" onSubmit={submitTask}>
        <label className="crm-form-wide">
          <span>Task</span>
          <input value={taskDraft.title} onChange={(event) => setTaskDraft((current) => ({ ...current, title: event.target.value }))} />
        </label>
        <label>
          <span>Assign task</span>
          <input value={taskDraft.assignee} onChange={(event) => setTaskDraft((current) => ({ ...current, assignee: event.target.value }))} />
        </label>
        <label>
          <span>Due date</span>
          <input type="date" value={taskDraft.dueDate} onChange={(event) => setTaskDraft((current) => ({ ...current, dueDate: event.target.value }))} />
        </label>
        <label>
          <span>Priority</span>
          <select value={taskDraft.priority} onChange={(event) => setTaskDraft((current) => ({ ...current, priority: event.target.value as TaskPriority }))}>
            {priorityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select value={taskDraft.status} onChange={(event) => setTaskDraft((current) => ({ ...current, status: event.target.value as TaskStatus }))}>
            {taskStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="crm-form-wide">
          <span>Related to</span>
          <input value={taskDraft.relatedTo} onChange={(event) => setTaskDraft((current) => ({ ...current, relatedTo: event.target.value }))} />
        </label>
        <div className="crm-form-actions">
          <button type="submit">Create task</button>
          <button type="button" onClick={() => setTaskDraft({ title: '', assignee: 'Ava', dueDate: '', priority: 'Medium', status: 'Open', relatedTo: '' })}>Clear</button>
        </div>
      </form>
      <div className="crm-task-list stacked">
        {tasks.map((task) => (
          <article key={task.id} className="crm-task-card">
            <div>
              <strong>{task.title}</strong>
              <p>{task.relatedTo || 'No related record'}</p>
            </div>
            <div className="crm-task-meta">
              <span>{task.assignee}</span>
              <span>{task.dueDate || 'No date'}</span>
              <span>{task.priority}</span>
              <span>{task.status}</span>
            </div>
          </article>
        ))}
      </div>
    </CRMPanel>
  )

  const notesTab = (
    <div className="crm-notes-grid">
      <CRMPanel title="Add note" className="crm-form-panel">
        <form className="crm-form" onSubmit={saveNote}>
          <label>
            <span>Attach to</span>
            <select value={noteDraft.targetType} onChange={(event) => setNoteDraft((current) => ({ ...current, targetType: event.target.value as NoteTarget }))}>
              <option value="customer">Customer</option>
              <option value="lead">Lead</option>
              <option value="task">Task</option>
              <option value={blueprint.kind}>{fieldLabel(blueprint.kind)}</option>
            </select>
          </label>
          <label>
            <span>Target ID</span>
            <input value={noteDraft.targetId} onChange={(event) => setNoteDraft((current) => ({ ...current, targetId: event.target.value }))} />
          </label>
          <label className="crm-form-wide">
            <span>Note title</span>
            <input value={noteDraft.title} onChange={(event) => setNoteDraft((current) => ({ ...current, title: event.target.value }))} />
          </label>
          <label className="crm-form-wide">
            <span>Body</span>
            <textarea rows={5} value={noteDraft.body} onChange={(event) => setNoteDraft((current) => ({ ...current, body: event.target.value }))} />
          </label>
          <div className="crm-form-actions">
            <button type="submit">{selectedNote ? 'Save note' : 'Add note'}</button>
            <button type="button" onClick={() => setNoteDraft({ targetType: 'customer', targetId: '', title: '', body: '' })}>Clear</button>
          </div>
        </form>
      </CRMPanel>

      <CRMPanel title="Timeline view" className="crm-form-panel">
        <div className="crm-note-list full">
          {notes.map((note) => (
            <button
              key={note.id}
              type="button"
              className={`crm-note-chip ${selectedNote?.id === note.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedNoteId(note.id)
                setNoteDraft({
                  targetType: note.targetType,
                  targetId: note.targetId,
                  title: note.title,
                  body: note.body,
                })
              }}
            >
              <strong>{note.title}</strong>
              <span>{note.targetType} · {note.targetId}</span>
              <small>{note.editedAt}</small>
            </button>
          ))}
        </div>
      </CRMPanel>
    </div>
  )

  const automationTab = (
    <div className="crm-automation-grid">
      <CRMPanel title="Brand-specific modules" className="crm-form-panel">
        <div className="crm-module-grid">
          {blueprint.modules.map((module) => (
            <article key={module.title} className="crm-module-card">
              <p>{module.metric}</p>
              <strong>{module.title}</strong>
              <span>{module.description}</span>
            </article>
          ))}
        </div>
      </CRMPanel>
      <CRMPanel title="Automation templates" className="crm-form-panel">
        <div className="crm-automation-list">
          {automationRules.map((rule) => (
            <article key={rule} className="crm-automation-card">
              <strong>{rule}</strong>
              <button
                type="button"
                onClick={() => pushActivity('Automation run', rule)}
              >
                Run
              </button>
            </article>
          ))}
        </div>
      </CRMPanel>
      <CRMPanel title="Brand metrics" className="crm-form-panel">
        <div className="crm-column-list">
          <section className="crm-mini-column">
            <div className="crm-column-heading">
              <strong>{config.name} focus</strong>
              <span>{records.length}</span>
            </div>
            <p>{config.dashboard.title}</p>
            <p>{config.dashboard.subtitle}</p>
          </section>
          <section className="crm-mini-column">
            <div className="crm-column-heading">
              <strong>Pipeline health</strong>
              <span>{stageCountFor('Qualified') + stageCountFor('In Progress')}</span>
            </div>
            <p>{stageCountFor('New')} new records</p>
            <p>{stageCountFor('Contacted')} contacted records</p>
          </section>
        </div>
      </CRMPanel>
    </div>
  )

  return (
    <section className="console-page crm-shell" style={crmStyle(config)}>
      <ModuleHeader
        config={config}
        title={`${config.name} CRM`}
        description={`${config.name} relationship pipeline across forms, records, notes, tasks, and automation.`}
      />

      <div className="crm-tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && dashboard}
      {activeTab === 'records' && (
        <div className="crm-records-grid">
          {formTab}
          {filtersTab}
        </div>
      )}
      {activeTab === 'pipeline' && (
        <div className="crm-records-grid">
          {filtersTab}
          <CRMPanel title="Pipeline stages" className="crm-form-panel">
            <div className="crm-stage-grid compact">
              {pipelineStages.map((stage) => (
                <article key={stage} className="crm-stage-card">
                  <span>{stage}</span>
                  <strong>{stageCountFor(stage)}</strong>
                  <small>{stage === 'Closed Won' ? 'Converted' : stage === 'Closed Lost' ? 'Rejected' : 'Open'}</small>
                </article>
              ))}
            </div>
            <div className="crm-column-list">
              {pipelineStages.map((stage) => (
                <section key={stage} className="crm-mini-column">
                  <div className="crm-column-heading">
                    <strong>{stage}</strong>
                    <span>{stageCountFor(stage)}</span>
                  </div>
                  {records.filter((record) => record.status === stage).slice(0, 4).map((record) => (
                    <p key={record.id}>{record.name} · {record.company}</p>
                  ))}
                </section>
              ))}
            </div>
          </CRMPanel>
        </div>
      )}
      {activeTab === 'tasks' && tasksTab}
      {activeTab === 'notes' && notesTab}
      {activeTab === 'automation' && automationTab}
    </section>
  )
}

export default CRMBoard
