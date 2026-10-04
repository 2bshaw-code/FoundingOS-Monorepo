/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { SpeakButton } from './speech'
import { FoundAIMascot } from './foundai-mascot'
import { AI_DISCLAIMER } from './ai-disclaimer'
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { coachQuestion, moduleHealth, playbookFor, workspaceExperts, type ExperienceMode, type HealthCheck, type HealthRecord } from '@foundingos/config/pro-playbooks'

const MODE_KEY = 'foundingos-experience-mode'
const MODE_EVENT = 'foundingos-experience-mode'
const ExperienceOverride = createContext<ExperienceMode | null>(null)

export function ProExperience({ children }: { children: ReactNode }) {
  return <ExperienceOverride.Provider value="pro">{children}</ExperienceOverride.Provider>
}

export function readExperienceMode(): ExperienceMode {
  try { return window.localStorage.getItem(MODE_KEY) === 'pro' ? 'pro' : 'guided' } catch { return 'guided' }
}

const DEMO_KEY = 'foundingos-demo-data'

// Demo data swaps a signed-in workspace onto made-up example records held only in this browser,
// so people can see what a busy business looks like without touching their real account data.
export function useDemoData(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const sync = () => { try { setOn(window.localStorage.getItem(DEMO_KEY) === 'on') } catch { setOn(false) } }
    sync()
    window.addEventListener(DEMO_KEY, sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener(DEMO_KEY, sync); window.removeEventListener('storage', sync) }
  }, [])
  const set = (next: boolean) => {
    try { if (next) window.localStorage.setItem(DEMO_KEY, 'on'); else window.localStorage.removeItem(DEMO_KEY) } catch { /* private mode */ }
    setOn(next)
    window.dispatchEvent(new Event(DEMO_KEY))
  }
  return [on, set]
}

// Guided (default) coaches people who are new to the job; Pro strips the coaching back for
// people who already know it and adds keyboard shortcuts and a denser layout.
export function useExperienceMode(): [ExperienceMode, (mode: ExperienceMode) => void] {
  const override = useContext(ExperienceOverride)
  const [mode, setModeState] = useState<ExperienceMode>('guided')
  useEffect(() => {
    setModeState(readExperienceMode())
    const sync = () => setModeState(readExperienceMode())
    window.addEventListener(MODE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener(MODE_EVENT, sync); window.removeEventListener('storage', sync) }
  }, [])
  const setMode = (next: ExperienceMode) => {
    try { window.localStorage.setItem(MODE_KEY, next) } catch { /* private mode */ }
    setModeState(next)
    window.dispatchEvent(new Event(MODE_EVENT))
  }
  return [override ?? mode, setMode]
}

export function ExperienceToggle() {
  const [mode, setMode] = useExperienceMode()
  return (
    <div aria-label="Experience mode" className="experience-toggle" role="group">
      <button aria-pressed={mode === 'guided'} onClick={() => setMode('guided')} title="FoundAI coaches you through each module like a professional would" type="button">Guided</button>
      <button aria-pressed={mode === 'pro'} onClick={() => setMode('pro')} title="Dense layout and keyboard shortcuts (/ search, N new) for experienced users" type="button">Pro</button>
    </div>
  )
}

type CoachProps = {
  workspace: string
  moduleId: string
  moduleLabel: string
  noun: string
  statuses: string[]
  records: HealthRecord[]
  valued?: boolean
  onOpen: (id: string) => void
  onShowStatus: (status: string) => void
  onAdvanceWaiting?: () => void
  askLive?: (question: string) => Promise<{ answer: string } | null | undefined>
}

// "What a professional would do here", plus live checks on the actual records, with
// one-click fixes. Guided mode shows it open; Pro mode collapses it to the score.
export function ProCoach({ workspace, moduleId, moduleLabel, noun, statuses, records, valued = true, onOpen, onShowStatus, onAdvanceWaiting, askLive }: CoachProps) {
  const [mode] = useExperienceMode()
  const [open, setOpen] = useState<boolean | null>(null)
  const [answer, setAnswer] = useState<string>('')
  const [asking, setAsking] = useState(false)
  const [standard, ...steps] = playbookFor(moduleId, moduleLabel, statuses)
  const { score, checks } = moduleHealth(records, statuses, noun, valued)
  const expanded = open ?? mode === 'guided'
  const expert = workspaceExperts[workspace] ?? 'senior operator'
  const tone = !records.length ? 'info' : score >= 75 ? 'good' : score >= 50 ? 'watch' : 'risk'

  const ask = async () => {
    setAsking(true)
    try {
      const result = askLive ? await askLive(coachQuestion(workspace, moduleLabel, standard)) : null
      setAnswer(result?.answer || `A ${expert} would focus on:\n1. ${steps[0]}\n2. ${steps[1]}\n3. ${steps[2]}`)
    } catch {
      setAnswer(`FoundAI couldn’t be reached just now. A ${expert} would focus on:\n1. ${steps[0]}\n2. ${steps[1]}\n3. ${steps[2]}`)
    } finally { setAsking(false) }
  }

  const fix = (check: HealthCheck) => {
    if (check.id === 'waiting' && statuses[0]) return <><button onClick={() => onShowStatus(statuses[0])} type="button">Show them</button>{onAdvanceWaiting && statuses[1] ? <button onClick={onAdvanceWaiting} type="button">Move all to “{statuses[1]}”</button> : null}</>
    return check.firstId ? <button onClick={() => onOpen(check.firstId!)} type="button">Open the first one</button> : null
  }

  return (
    <section className={`pro-coach pro-coach-${tone}${expanded ? ' is-open' : ''}`}>
      <button aria-expanded={expanded} className="pro-coach-bar" onClick={() => setOpen(!expanded)} type="button">
        <FoundAIMascot active thinking={asking} />
        <span className="pro-coach-score">{records.length ? `${score}%` : '—'}</span>
        <span className="pro-coach-title"><strong>Pro standard</strong> · FoundAI as your {expert}</span>
        <span className="pro-coach-summary">{records.length ? `${checks.filter((check) => check.ok).length} of ${checks.length} checks met` : `Add your first ${noun} to get scored`}</span>
        <span aria-hidden className="pro-coach-chevron">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded ? <div className="pro-coach-body">
        <div className="pro-coach-standard">
          <p className="pro-coach-label">What “professional” looks like</p>
          <p>{standard}</p>
          <p className="pro-coach-label">What a {expert} does every week</p>
          <ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </div>
        <div className="pro-coach-checks">
          <p className="pro-coach-label">Your {moduleLabel.toLowerCase()} right now</p>
          <ul>{checks.map((check) => <li className={check.ok ? 'ok' : 'todo'} key={check.id}><span aria-hidden>{check.ok ? '✓' : '!'}</span><span>{check.label}</span>{check.ok ? null : <span className="pro-coach-fix">{fix(check)}</span>}</li>)}</ul>
          <button className="pro-coach-ask" disabled={asking} onClick={() => void ask()} type="button">{asking ? 'FoundAI is looking…' : '✦ What should I do today?'}</button>
          {answer ? <p className="pro-coach-answer">{answer} <SpeakButton text={answer} /></p> : null}
          {answer ? <p className="ai-disclaimer">{AI_DISCLAIMER}</p> : null}
        </div>
      </div> : null}
    </section>
  )
}
