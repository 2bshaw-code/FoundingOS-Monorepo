'use client'

import { useEffect, useState, type ReactNode, type SetStateAction } from 'react'
import { CoreOperationsModulePage } from './core-operations-live-console'

export function usePersistentRecords<T>(key: string, seed: T[]) {
  const [records, setRecords] = useState<T[]>(seed)

  useEffect(() => {
    const stored = window.localStorage.getItem(key)
    if (stored) setRecords(JSON.parse(stored) as T[])
  }, [key])

  const updateRecords = (update: SetStateAction<T[]>) => {
    setRecords((current) => {
      const next = typeof update === 'function' ? update(current) : update
      window.localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }

  return [records, updateRecords] as const
}

export function WorkspaceHeader({ title, description, onCreate, eyebrow = 'Workspace' }: { title: string; description: string; onCreate: () => void; eyebrow?: string }) {
  return (
    <header className="retail-workspace-header">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </div>
      <button type="button" className="retail-primary-action" onClick={onCreate}>+ Create new</button>
    </header>
  )
}

export function ActivityToast({ activity }: { activity: { label: string; detail: string; time: string } | null }) {
  if (!activity) return null
  return (
    <div className="retail-activity-toast" role="status">
      <i />
      <div><strong>{activity.label}</strong><span>{activity.detail} · {activity.time}</span></div>
    </div>
  )
}

export function CEOBriefing({
  headline,
  summary,
  standing,
  risks,
  actions,
}: {
  headline: string
  summary: string
  standing: Array<{ label: string; value: string; meaning: string; tone?: 'good' | 'watch' | 'risk' }>
  risks: string[]
  actions: string[]
}) {
  return (
    <section className="ceo-briefing" aria-labelledby="ceo-briefing-title">
      <div className="ceo-briefing-heading">
        <div>
          <p>CEO briefing</p>
          <h2 id="ceo-briefing-title">{headline}</h2>
          <span>{summary}</span>
        </div>
        <span className="ceo-confidence">Context shown as-is from the active workspace</span>
      </div>
      <div className="ceo-standing-grid">
        {standing.map((item) => (
          <article key={item.label} data-tone={item.tone ?? 'good'}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.meaning}</p>
          </article>
        ))}
      </div>
      <div className="ceo-decision-grid">
        <article>
          <p>What needs attention</p>
          <ul>{risks.map((risk) => <li key={risk}>{risk}</li>)}</ul>
        </article>
        <article>
          <p>What to do next</p>
          <ol>{actions.map((action) => <li key={action}>{action}</li>)}</ol>
        </article>
      </div>
    </section>
  )
}

export function RetailOperationsWorkspace({ moduleId }: { moduleId: string }) {
  return <CoreOperationsModulePage moduleId={moduleId} />
}
