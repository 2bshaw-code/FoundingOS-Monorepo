/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuantumButtonGhost, QuantumButtonPrimary, QuantumCard, QuantumSelect, QuantumTextField, qText } from '@foundingos/ui/quantum'
import { brands } from '@foundingos/config'
import { WORKSPACE_OPTIONS } from './workspace-options'

export type WorkspaceRecordDTO = {
  id: string
  reference: string
  name: string
  status: string
  valuePence: number | null
  version: number
  updatedAt: string
  data?: Record<string, unknown> | null
}

const STATUS_PRESETS = ['New', 'In progress', 'Review', 'Complete']

function formatTimestamp(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

// Modules whose id contains "inbox" (Omnichannel inbox, Clinical inbox, Campaign inbox, …)
// store each conversation as a record with a message body in `data.body` — same generic
// WorkspaceRecord the mobile app's inbox screens already read. Records outside those modules
// don't have a message body, so the preview/expand UI below only appears when one exists.
function messagePreview(record: WorkspaceRecordDTO): string | null {
  const body = record.data?.body
  return typeof body === 'string' && body.trim() ? body.trim() : null
}

// Client half of the console's real, generic Records module. The server component
// (page.tsx) picks the initial workspace/module from the URL and fetches the first page of
// records; switching workspace/module here just reloads the page with new search params so
// the server component re-fetches — same pattern as switching a filter, not a separate
// client-side data layer to keep in sync.
export function RecordsBoard({
  workspace,
  moduleId,
  initialRecords,
}: {
  workspace: string
  moduleId: string
  initialRecords: WorkspaceRecordDTO[]
}) {
  const router = useRouter()
  const [records, setRecords] = useState(initialRecords)
  const [moduleInput, setModuleInput] = useState(moduleId)
  const [reference, setReference] = useState('')
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const visibleRecords = useMemo(() => {
    const byStatus = statusFilter === 'all' ? records : records.filter((record) => record.status === statusFilter)
    const query = searchQuery.trim().toLowerCase()
    if (!query) return byStatus
    // Client-side only — records are already fully loaded for this workspace/module, so
    // filtering by reference/name (and message preview, when present) is instant with no
    // extra request, matching the same pattern already used for Pipeline's lead search.
    return byStatus.filter((record) => {
      const preview = messagePreview(record)
      return (
        record.reference.toLowerCase().includes(query) ||
        record.name.toLowerCase().includes(query) ||
        (preview ? preview.toLowerCase().includes(query) : false)
      )
    })
  }, [records, statusFilter, searchQuery])

  const statusOptions = useMemo(() => {
    const seen = new Set<string>(STATUS_PRESETS)
    for (const record of records) seen.add(record.status)
    return [...seen]
  }, [records])

  function switchTo(nextWorkspace: string, nextModule: string) {
    router.push(`/workspace/records?workspace=${encodeURIComponent(nextWorkspace)}&module=${encodeURIComponent(nextModule || 'tasks')}`)
  }

  async function createRecord() {
    if (!reference.trim() || !name.trim()) {
      setError('Reference and name are required.')
      return
    }
    setCreating(true)
    setError(null)
    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ workspace, module: moduleId, reference: reference.trim(), name: name.trim(), status: 'New' }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Could not create that record.')
      setRecords((current) => [data as WorkspaceRecordDTO, ...current])
      setReference('')
      setName('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create that record.')
    } finally {
      setCreating(false)
    }
  }

  async function changeStatus(record: WorkspaceRecordDTO, status: string) {
    const previous = records
    setRecords((current) => current.map((item) => (item.id === record.id ? { ...item, status } : item)))
    try {
      const response = await fetch(`/api/records/${record.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ version: record.version, status }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Could not update that record.')
      setRecords((current) => current.map((item) => (item.id === record.id ? (data as WorkspaceRecordDTO) : item)))
    } catch {
      setRecords(previous)
      setError('Could not update that record — someone else may have changed it. Refresh and try again.')
    }
  }

  return (
    <div className="q-form-stack">
      <QuantumCard brand={brands.foundingos}>
        <p className={qText.overline}>Workspace &amp; module</p>
        <div className="q-form-stack">
          <QuantumSelect label="Workspace" value={workspace} onChange={(event) => {
            const nextWorkspace = (event.target as HTMLSelectElement).value
            const match = WORKSPACE_OPTIONS.find((option) => option.slug === nextWorkspace)
            switchTo(nextWorkspace, match?.defaultModule || 'tasks')
          }}>
            {WORKSPACE_OPTIONS.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.suite} · {option.label}
              </option>
            ))}
          </QuantumSelect>
          <QuantumTextField
            label="Module"
            value={moduleInput}
            onChange={(event) => setModuleInput((event.target as HTMLInputElement).value)}
            hint="Lowercase letters, numbers, and hyphens — e.g. inventory, invoices, candidates."
          />
          <QuantumButtonGhost type="button" onClick={() => switchTo(workspace, moduleInput)}>
            Switch module
          </QuantumButtonGhost>
        </div>
      </QuantumCard>

      <QuantumCard brand={brands.foundingos}>
        <p className={qText.overline}>Add a record</p>
        <div className="q-form-stack">
          <QuantumTextField label="Reference" value={reference} onChange={(event) => setReference((event.target as HTMLInputElement).value)} hint="A short unique code, e.g. INV-1042." />
          <QuantumTextField label="Name" value={name} onChange={(event) => setName((event.target as HTMLInputElement).value)} />
          {error ? <p className={qText.caption}>{error}</p> : null}
          <QuantumButtonPrimary type="button" disabled={creating} onClick={() => void createRecord()}>
            {creating ? 'Adding…' : 'Add record'}
          </QuantumButtonPrimary>
        </div>
      </QuantumCard>

      {records.length === 0 ? (
        <QuantumCard brand={brands.foundingos}>
          <p className={qText.body}>No records yet in {workspace}/{moduleId}. Add one above — it's saved to your real FoundingOS account.</p>
        </QuantumCard>
      ) : (
        <>
          <QuantumCard brand={brands.foundingos}>
            <p className={qText.overline}>Search &amp; filter</p>
            <div className="q-form-stack">
              <QuantumTextField
                label="Search records"
                placeholder="Search by reference, name, or message…"
                value={searchQuery}
                onChange={(event) => setSearchQuery((event.target as HTMLInputElement).value)}
              />
              <div className="q-pill-row">
                <button type="button" className={`q-pill${statusFilter === 'all' ? ' q-pill-active' : ''}`} onClick={() => setStatusFilter('all')}>
                  All ({records.length})
                </button>
                {statusOptions.map((status) => (
                  <button key={status} type="button" className={`q-pill${statusFilter === status ? ' q-pill-active' : ''}`} onClick={() => setStatusFilter(status)}>
                    {status} ({records.filter((record) => record.status === status).length})
                  </button>
                ))}
              </div>
            </div>
          </QuantumCard>
          {visibleRecords.length === 0 ? (
            <QuantumCard brand={brands.foundingos}>
              <p className={qText.body}>No records match{searchQuery ? ` "${searchQuery}"` : ' this filter'}.</p>
            </QuantumCard>
          ) : null}
          {visibleRecords.map((record) => {
          const preview = messagePreview(record)
          const expanded = expandedId === record.id
          return (
            <QuantumCard key={record.id} brand={brands.foundingos}>
              <p className={qText.overline}>{record.reference}</p>
              <p className={qText.body}>{record.name}</p>
              <p className={qText.caption}>Last contact: {formatTimestamp(record.updatedAt)}</p>
              {preview ? (
                <p className={qText.caption}>{expanded ? preview : preview.length > 140 ? `${preview.slice(0, 140)}…` : preview}</p>
              ) : null}
              <QuantumSelect label="Status" value={record.status} onChange={(event) => void changeStatus(record, (event.target as HTMLSelectElement).value)}>
                {(STATUS_PRESETS.includes(record.status) ? STATUS_PRESETS : [record.status, ...STATUS_PRESETS]).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </QuantumSelect>
              {preview ? (
                <QuantumButtonGhost type="button" onClick={() => setExpandedId(expanded ? null : record.id)}>
                  {expanded ? 'Hide conversation' : 'Open conversation'}
                </QuantumButtonGhost>
              ) : null}
              {expanded && preview ? (
                <div className="q-form-stack">
                  {typeof record.data?.recipient === 'string' ? (
                    <p className={qText.caption}>
                      {record.data?.direction === 'outbound' ? 'To' : 'From'} {record.data.recipient}
                    </p>
                  ) : null}
                  <div className="q-message-bubble q-message-bubble--inbound">
                    <span className="q-message-body">{preview}</span>
                  </div>
                </div>
              ) : null}
            </QuantumCard>
          )
          })}
        </>
      )}
    </div>
  )
}
