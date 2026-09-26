'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Homepage "movie": a looping, self-playing scene of FoundAI running a business morning —
// doing routine work itself and stopping for the one decision that needs the owner.
import { useEffect, useState } from 'react'

type Scene = { time: string; area: string; text: string; detail: string; tone?: 'ask' | 'approved' | 'write' }

const scenes: Scene[] = [
  { time: '08:02', area: 'Finance', text: 'Sent invoice INV-1042 to Hart & Co', detail: '£1,240 · due 14 Oct · emailed' },
  { time: '08:04', area: 'Retail', text: 'Oat milk running low — reordered 24', detail: 'Supplier emailed · £86, inside your £250 limit' },
  { time: '08:07', area: 'Logistics', text: 'Missed delivery — customer rebooked', detail: 'WhatsApp sent · new slot tomorrow 10–12' },
  { time: '08:11', area: 'Marketing', text: 'Wrote 5 posts for the autumn menu', detail: 'Instagram · Facebook · scheduled Mon–Fri', tone: 'write' },
  { time: '08:15', area: 'Finance', text: 'Chased 2 overdue invoices', detail: 'Friendly reminders · £3,180 outstanding' },
  { time: '08:19', area: 'Retail', text: 'Refund of £420 for order #8812', detail: 'Over your £250 limit — needs you', tone: 'ask' },
]
const STEP_MS = 1500

export function FoundAiMovie() {
  const [step, setStep] = useState(0)
  const [approved, setApproved] = useState(false)
  const total = scenes.length + 3
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setStep(scenes.length + 2); setApproved(true); return }
    const timer = window.setInterval(() => setStep((current) => (current + 1) % total), STEP_MS)
    return () => window.clearInterval(timer)
  }, [total])
  useEffect(() => { setApproved(step >= scenes.length + 1) }, [step])
  const shown = scenes.slice(0, Math.min(step + 1, scenes.length))
  const done = shown.filter((scene) => scene.tone !== 'ask').length + (approved ? 1 : 0)
  const typing = step < scenes.length - 1
  return <div aria-label="FoundAI running a business, animated" className="fai-movie" role="img">
    <div className="fai-movie-bar"><i /><i /><i /><span>FoundAI · Autopilot</span><b className={typing ? 'is-live' : ''}>{typing ? 'Working…' : 'Live'}</b></div>
    <div className="fai-movie-head">
      <div><strong>Good morning. I&apos;ve got this.</strong><small>Your business, running itself since 08:00</small></div>
      <div className="fai-movie-count"><b key={done}>{done}</b><span>done</span></div>
    </div>
    <ol className="fai-movie-feed">
      {shown.map((scene) => {
        const isAsk = scene.tone === 'ask'
        return <li className={`fai-movie-item ${isAsk ? (approved ? 'is-approved' : 'is-ask') : ''} ${scene.tone === 'write' ? 'is-write' : ''}`} key={scene.time}>
          <span className="fai-movie-dot">{isAsk ? (approved ? '✓' : '!') : '✓'}</span>
          <div>
            <p><em>{scene.area}</em>{scene.text}</p>
            <small>{isAsk && approved ? 'You approved · refund issued · customer told' : scene.detail}</small>
            {isAsk && !approved ? <div className="fai-movie-ask"><span className="fai-movie-btn">Approve</span><span className="fai-movie-btn ghost">Decline</span><i className="fai-movie-cursor" /></div> : null}
          </div>
          <time>{scene.time}</time>
        </li>
      })}
    </ol>
    <div className={`fai-movie-foot ${step >= scenes.length + 1 ? 'is-shown' : ''}`}><b>{scenes.length} jobs handled.</b> 1 needed you — and it took one tap.</div>
  </div>
}
