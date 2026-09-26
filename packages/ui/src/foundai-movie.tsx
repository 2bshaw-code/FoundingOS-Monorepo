'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Homepage "movie": a looping, self-playing scene of FoundAI running a business morning —
// doing routine work itself and stopping for the one decision that needs the owner.
import { useEffect, useState } from 'react'

type Scene = { time: string; area: string; text: string; detail: string; tone?: 'ask' | 'approved' | 'write' }
type Reel = { greeting: string; since: string; approvedText: string; scenes: Scene[] }

// Each loop plays a different business and time of day so the demo never looks canned.
const reels: Reel[] = [
  {
    greeting: 'Good morning. I\'ve got this.', since: 'Your café, running itself since 08:00', approvedText: 'You approved · refund issued · customer told',
    scenes: [
      { time: '08:02', area: 'Finance', text: 'Sent invoice INV-1042 to Hart & Co', detail: '£1,240 · due 14 Oct · emailed' },
      { time: '08:04', area: 'Retail', text: 'Oat milk running low — reordered 24', detail: 'Supplier emailed · £86, inside your £250 limit' },
      { time: '08:07', area: 'Logistics', text: 'Missed delivery — customer rebooked', detail: 'WhatsApp sent · new slot tomorrow 10–12' },
      { time: '08:11', area: 'Marketing', text: 'Wrote 5 posts for the autumn menu', detail: 'Instagram · Facebook · scheduled Mon–Fri', tone: 'write' },
      { time: '08:15', area: 'Finance', text: 'Chased 2 overdue invoices', detail: 'Friendly reminders · £3,180 outstanding' },
      { time: '08:19', area: 'Retail', text: 'Refund of £420 for order #8812', detail: 'Over your £250 limit — needs you', tone: 'ask' },
    ],
  },
  {
    greeting: 'Busy lunchtime. All handled.', since: 'Your boutique, on autopilot since 12:00', approvedText: 'You approved · offer sent · start date booked',
    scenes: [
      { time: '12:03', area: 'Retail', text: '14 online orders picked and packed', detail: 'Labels printed · courier booked for 3pm' },
      { time: '12:06', area: 'Marketing', text: 'Flash sale post is live', detail: '20% off knitwear · 312 views so far', tone: 'write' },
      { time: '12:10', area: 'Retail', text: 'Replied to 9 WhatsApp questions', detail: 'Sizes, stock and opening hours' },
      { time: '12:14', area: 'Talent', text: 'Screened 23 applicants for Saturday staff', detail: 'Shortlisted 3 · interviews offered Thursday' },
      { time: '12:18', area: 'Finance', text: 'Matched 41 card payments to sales', detail: 'Bank reconciled · £2,960 today' },
      { time: '12:21', area: 'Talent', text: 'Job offer to Priya — £11.80/hr', detail: 'Hiring decisions need you', tone: 'ask' },
    ],
  },
  {
    greeting: 'Evening wrap-up. Tomorrow is ready.', since: 'Your delivery firm, closing out the day', approvedText: 'You approved · PO sent to supplier',
    scenes: [
      { time: '18:02', area: 'Logistics', text: '47 of 48 drops completed', detail: 'Proof of delivery captured · 1 retry tomorrow' },
      { time: '18:05', area: 'Logistics', text: 'Planned tomorrow\'s 6 routes', detail: 'Saves 38 miles vs today' },
      { time: '18:09', area: 'Finance', text: 'Invoiced 12 customers for today', detail: '£6,480 · paid by card link' },
      { time: '18:12', area: 'Intelligence', text: 'Fuel spend up 14% this week', detail: 'Flagged van 3 — tyre pressure check booked' },
      { time: '18:16', area: 'Marketing', text: 'Drafted a review request to 40 customers', detail: 'Sends tomorrow 9am', tone: 'write' },
      { time: '18:20', area: 'Finance', text: 'New tyres order — £1,150', detail: 'Over your £500 purchase limit — needs you', tone: 'ask' },
    ],
  },
  {
    greeting: 'Clinic is running smoothly.', since: 'Your practice, on autopilot since 07:30', approvedText: 'You approved · cover shift confirmed',
    scenes: [
      { time: '07:32', area: 'Health', text: 'Sent 18 appointment reminders', detail: 'WhatsApp · 2 rebooked themselves' },
      { time: '07:36', area: 'Health', text: 'Filled a cancelled 10:40 slot', detail: 'Offered to the waiting list · accepted' },
      { time: '07:41', area: 'Finance', text: 'Submitted 6 insurance claims', detail: '£1,870 · tracking payment' },
      { time: '07:45', area: 'Retail', text: 'Gloves and gauze reordered', detail: 'Below minimum stock · £64' },
      { time: '07:49', area: 'Marketing', text: 'Wrote a flu-jab reminder post', detail: 'Facebook · Instagram · Friday', tone: 'write' },
      { time: '07:53', area: 'Talent', text: 'Locum cover for Dr Shah — £420', detail: 'Staffing costs need you', tone: 'ask' },
    ],
  },
]
const STEP_MS = 1500

export function FoundAiMovie() {
  const [step, setStep] = useState(0)
  const [reelIndex, setReelIndex] = useState(0)
  const [approved, setApproved] = useState(false)
  const reel = reels[reelIndex % reels.length]
  const scenes = reel.scenes
  const total = scenes.length + 3
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setStep(scenes.length + 2); setApproved(true); return }
    const timer = window.setInterval(() => setStep((current) => {
      const next = (current + 1) % total
      if (next === 0) setReelIndex((index) => index + 1)
      return next
    }), STEP_MS)
    return () => window.clearInterval(timer)
  }, [total, scenes.length])
  useEffect(() => { setApproved(step >= scenes.length + 1) }, [step])
  const shown = scenes.slice(0, Math.min(step + 1, scenes.length))
  const done = shown.filter((scene) => scene.tone !== 'ask').length + (approved ? 1 : 0)
  const typing = step < scenes.length - 1
  return <div aria-label="FoundAI running a business, animated" className="fai-movie" role="img">
    <div className="fai-movie-bar"><i /><i /><i /><span>FoundAI · Autopilot</span><b className={typing ? 'is-live' : ''}>{typing ? 'Working…' : 'Live'}</b></div>
    <div className="fai-movie-head">
      <div><strong>{reel.greeting}</strong><small>{reel.since}</small></div>
      <div className="fai-movie-count"><b key={done}>{done}</b><span>done</span></div>
    </div>
    <ol className="fai-movie-feed">
      {shown.map((scene) => {
        const isAsk = scene.tone === 'ask'
        return <li className={`fai-movie-item ${isAsk ? (approved ? 'is-approved' : 'is-ask') : ''} ${scene.tone === 'write' ? 'is-write' : ''}`} key={`${reelIndex}-${scene.time}`}>
          <span className="fai-movie-dot">{isAsk ? (approved ? '✓' : '!') : '✓'}</span>
          <div>
            <p><em>{scene.area}</em>{scene.text}</p>
            <small>{isAsk && approved ? reel.approvedText : scene.detail}</small>
            {isAsk && !approved ? <div className="fai-movie-ask"><span className="fai-movie-btn">Approve</span><span className="fai-movie-btn ghost">Decline</span><i className="fai-movie-cursor" /></div> : null}
          </div>
          <time>{scene.time}</time>
        </li>
      })}
    </ol>
    <div className={`fai-movie-foot ${step >= scenes.length + 1 ? 'is-shown' : ''}`}><b>{scenes.length} jobs handled.</b> 1 needed you — and it took one tap.</div>
  </div>
}
