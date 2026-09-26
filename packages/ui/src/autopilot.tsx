'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// FoundAI Autopilot for the workspaces. Live accounts run on the backend (hourly scheduler plus
// a run on sign-in); demo workspaces run the same rulebook in the browser.
import { useCallback, useEffect, useRef, useState } from 'react'
import { autopilotCategories, defaultAutopilotPolicy, normaliseAutopilotPolicy, planAutopilot, type AutopilotDecision, type AutopilotMode, type AutopilotPolicy, type AutopilotRecord } from '@foundingos/config/autopilot'
import { productionRequest } from './workspace-production-client'

export type AutopilotApproval = { id: string; status: string; createdAt: string; decision: AutopilotDecision }
export type AutopilotActivity = { id: string; createdAt: string; decision: AutopilotDecision & { approvedBy?: string | null } }
export type AutopilotController = {
  policy: AutopilotPolicy
  approvals: AutopilotApproval[]
  activity: AutopilotActivity[]
  busy: boolean
  error: string
  lastRun: string | null
  production: boolean
  run: () => Promise<void>
  decide: (id: string, approve: boolean) => Promise<void>
  savePolicy: (policy: AutopilotPolicy) => Promise<void>
}
type Snapshot = { policy: AutopilotPolicy; approvals: AutopilotApproval[]; activity: AutopilotActivity[] }

const DEMO_KEY = 'foundingos-autopilot-v1'
const readDemo = (): Snapshot => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DEMO_KEY) || '{}') as Partial<Snapshot>
    return { policy: normaliseAutopilotPolicy(parsed.policy), approvals: parsed.approvals ?? [], activity: parsed.activity ?? [] }
  } catch { return { policy: defaultAutopilotPolicy, approvals: [], activity: [] } }
}
const writeDemo = (snapshot: Snapshot) => { try { window.localStorage.setItem(DEMO_KEY, JSON.stringify({ ...snapshot, activity: snapshot.activity.slice(0, 80), approvals: snapshot.approvals.slice(0, 80) })) } catch { /* ignore */ } }
const money = (pence: number) => `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
const when = (iso: string) => { const date = new Date(iso); return Number.isNaN(date.getTime()) ? iso : date.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }
const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString()

export function useAutopilot({ workspace, production, ready, collect, apply }: {
  workspace: string
  production: boolean
  ready: boolean
  collect: () => AutopilotRecord[]
  apply: (decision: AutopilotDecision) => Promise<void>
}): AutopilotController {
  const [snapshot, setSnapshot] = useState<Snapshot>({ policy: defaultAutopilotPolicy, approvals: [], activity: [] })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [lastRun, setLastRun] = useState<string | null>(null)
  const latest = useRef({ collect, apply })
  latest.current = { collect, apply }

  const refresh = useCallback(async () => {
    if (!production) { setSnapshot(readDemo()); return }
    setSnapshot(await productionRequest<Snapshot>('/autopilot'))
  }, [production])

  const run = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      if (production) {
        const result = await productionRequest<{ executed: AutopilotDecision[] }>('/autopilot/run', { method: 'POST' })
        for (const decision of result.executed ?? []) if (decision.workspace === workspace) await latest.current.apply(decision)
        await refresh()
      } else {
        const current = readDemo()
        const decisions = planAutopilot(latest.current.collect(), current.policy)
        const now = new Date().toISOString()
        const known = new Set(current.approvals.map((item) => item.decision.key))
        const activity: AutopilotActivity[] = []
        const approvals: AutopilotApproval[] = []
        for (const decision of decisions) {
          if (decision.mode === 'auto') {
            await latest.current.apply(decision)
            activity.push({ id: `${decision.key}:${now}`, createdAt: now, decision })
          } else if (!known.has(decision.key)) {
            approvals.push({ id: decision.key, status: 'Pending', createdAt: now, decision })
          }
        }
        const next = { ...current, activity: [...activity, ...current.activity], approvals: [...approvals, ...current.approvals] }
        writeDemo(next)
        setSnapshot(next)
      }
      setLastRun(new Date().toISOString())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Autopilot could not run')
    } finally { setBusy(false) }
  }, [production, refresh, workspace])

  const decide = useCallback(async (id: string, approve: boolean) => {
    setError('')
    try {
      if (production) {
        const approval = snapshot.approvals.find((item) => item.id === id)
        await productionRequest(`/autopilot/approvals/${encodeURIComponent(id)}/decision`, { method: 'POST', body: JSON.stringify({ approve }) })
        if (approve && approval && approval.decision.workspace === workspace) await latest.current.apply(approval.decision)
        await refresh()
        return
      }
      const current = readDemo()
      const approval = current.approvals.find((item) => item.id === id)
      if (!approval) return
      const now = new Date().toISOString()
      if (approve) await latest.current.apply(approval.decision)
      const next = {
        ...current,
        approvals: current.approvals.map((item) => item.id === id ? { ...item, status: approve ? 'Approved' : 'Rejected' } : item),
        activity: approve ? [{ id: `${id}:${now}`, createdAt: now, decision: { ...approval.decision, approvedBy: 'you' } }, ...current.activity] : current.activity,
      }
      writeDemo(next)
      setSnapshot(next)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Decision could not be saved') }
  }, [production, refresh, snapshot.approvals, workspace])

  const savePolicy = useCallback(async (policy: AutopilotPolicy) => {
    setError('')
    try {
      if (production) {
        const saved = await productionRequest<AutopilotPolicy>('/autopilot/policy', { method: 'PUT', body: JSON.stringify(policy) })
        setSnapshot((current) => ({ ...current, policy: saved }))
      } else {
        const next = { ...readDemo(), policy: normaliseAutopilotPolicy(policy) }
        writeDemo(next)
        setSnapshot(next)
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Rules could not be saved') }
  }, [production])

  // Run once per browser session per workspace as soon as the workspace data is loaded.
  useEffect(() => {
    if (!ready) return
    const key = `foundingos-autopilot-ran:${workspace}`
    void refresh().catch(() => undefined).then(() => {
      if (window.sessionStorage.getItem(key)) return
      window.sessionStorage.setItem(key, '1')
      return run()
    })
  }, [ready, workspace]) // eslint-disable-line react-hooks/exhaustive-deps

  return { ...snapshot, busy, error, lastRun, production, run, decide, savePolicy }
}

function ApprovalRow({ approval, onDecide }: { approval: AutopilotApproval; onDecide: (approve: boolean) => void }) {
  const { decision } = approval
  return <li className="ap-approval">
    <div><strong>{decision.action}</strong><span>{decision.recordName} · {decision.module.replaceAll('-', ' ')}{decision.valuePence !== null ? ` · ${money(decision.valuePence)}` : ''}</span><small>{decision.reason}</small></div>
    <div className="ap-approval-actions"><button className="ap-approve" onClick={() => onDecide(true)} type="button">Approve</button><button onClick={() => onDecide(false)} type="button">Reject</button></div>
  </li>
}

export function AutopilotRules({ controller, onClose }: { controller: AutopilotController; onClose: () => void }) {
  const [draft, setDraft] = useState<AutopilotPolicy>(controller.policy)
  useEffect(() => setDraft(controller.policy), [controller.policy])
  const setMode = (id: keyof AutopilotPolicy['categories'], mode: AutopilotMode) => setDraft((current) => ({ ...current, categories: { ...current.categories, [id]: mode } }))
  return <div className="ap-rules">
    <header><strong>What FoundAI may do on its own</strong><small>Auto = FoundAI just does it · Ask me = it waits for your approval · Off = FoundAI leaves it alone</small></header>
    <label className="ap-toggle"><input checked={draft.enabled} onChange={(event) => setDraft({ ...draft, enabled: event.target.checked })} type="checkbox" /> Autopilot on</label>
    {autopilotCategories.map((category) => <div className="ap-rule" key={category.id}>
      <div><strong>{category.label}</strong><small>{category.detail}</small></div>
      <div className="ap-seg" role="group" aria-label={category.label}>{(['auto', 'ask', 'off'] as AutopilotMode[]).map((mode) => <button aria-pressed={draft.categories[category.id] === mode} key={mode} onClick={() => setMode(category.id, mode)} type="button">{mode === 'auto' ? 'Auto' : mode === 'ask' ? 'Ask me' : 'Off'}</button>)}</div>
    </div>)}
    <label className="ap-limit">Ask me before spending or refunding more than <span>£<input min={0} onChange={(event) => setDraft({ ...draft, spendLimitPence: Math.max(0, Math.round(Number(event.target.value) * 100)) })} type="number" value={draft.spendLimitPence / 100} /></span></label>
    <footer><button className="ap-approve" onClick={() => { void controller.savePolicy(draft).then(onClose) }} type="button">Save rules</button><button onClick={onClose} type="button">Cancel</button></footer>
  </div>
}

export function AutopilotPanel({ controller, label, workspace }: { controller: AutopilotController; label: string; workspace: string }) {
  const [rulesOpen, setRulesOpen] = useState(false)
  // Intelligence is the cross-business home, so it shows every workspace; the others show their own.
  const mine = (decision: AutopilotDecision) => workspace === 'intelligence' || decision.workspace === workspace
  const pending = controller.approvals.filter((item) => item.status === 'Pending' && mine(item.decision))
  const activity = controller.activity.filter((item) => mine(item.decision))
  const doneToday = activity.filter((item) => isToday(item.createdAt)).length
  const on = controller.policy.enabled
  return <section className="ap-panel" aria-label="FoundAI Autopilot">
    <header>
      <div><span className={`ap-dot${on ? ' on' : ''}`} /><div><strong>{on ? `FoundAI is running ${label}` : 'FoundAI Autopilot is paused'}</strong><p>Routine work happens automatically. Anything you've marked as a human decision waits here for you.</p></div></div>
      <div className="ap-head-actions"><button disabled={controller.busy || !on} onClick={() => { void controller.run() }} type="button">{controller.busy ? 'Working…' : 'Run now'}</button><button onClick={() => setRulesOpen((open) => !open)} type="button">Rules</button></div>
    </header>
    <div className="ap-stats">
      <article><span>Done by FoundAI today</span><strong>{doneToday}</strong></article>
      <article data-tone={pending.length ? 'warn' : 'good'}><span>Waiting for you</span><strong>{pending.length}</strong></article>
      <article><span>Spend limit</span><strong>{money(controller.policy.spendLimitPence)}</strong></article>
      <article><span>Last run</span><strong>{controller.lastRun ? when(controller.lastRun) : controller.production ? 'Hourly' : '—'}</strong></article>
    </div>
    {controller.error ? <p className="ap-error">{controller.error}</p> : null}
    {rulesOpen ? <AutopilotRules controller={controller} onClose={() => setRulesOpen(false)} /> : null}
    <div className="ap-cols">
      <div><h3>Needs your approval</h3>{pending.length ? <ul>{pending.slice(0, 8).map((approval) => <ApprovalRow approval={approval} key={approval.id} onDecide={(approve) => { void controller.decide(approval.id, approve) }} />)}</ul> : <p className="ap-empty">Nothing needs you right now.</p>}</div>
      <div><h3>What FoundAI did</h3>{activity.length ? <ul>{activity.slice(0, 8).map((item) => <li className="ap-done" key={item.id}><span>✓</span><div><strong>{item.decision.action}</strong><small>{item.decision.recordName} · {item.decision.module.replaceAll('-', ' ')} · {when(item.createdAt)}{item.decision.approvedBy ? ' · approved' : ''}</small></div></li>)}</ul> : <p className="ap-empty">FoundAI hasn't needed to act yet.</p>}</div>
    </div>
  </section>
}

export function AutopilotStrip({ controller, moduleId, workspace }: { controller: AutopilotController; moduleId: string; workspace: string }) {
  const pending = controller.approvals.filter((item) => item.status === 'Pending' && item.decision.workspace === workspace && item.decision.module === moduleId)
  const done = controller.activity.filter((item) => item.decision.workspace === workspace && item.decision.module === moduleId && isToday(item.createdAt)).length
  if (!controller.policy.enabled) return <div className="ap-strip"><span className="ap-dot" /> FoundAI Autopilot is paused</div>
  return <div className="ap-strip">
    <span className="ap-dot on" /><span><strong>Autopilot on</strong> · {done} handled here today · {pending.length} waiting for you</span>
    {pending.length ? <ul>{pending.slice(0, 3).map((approval) => <ApprovalRow approval={approval} key={approval.id} onDecide={(approve) => { void controller.decide(approval.id, approve) }} />)}</ul> : null}
  </div>
}
