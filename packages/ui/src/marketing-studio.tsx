'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// FoundAI campaign planner: turns a goal into a full campaign (audience, channels, budget
// split, KPIs) plus every post written and dated, then files them into Campaigns and Content.
import { useState } from 'react'
import { productionRequest } from './workspace-production-client'

export type CampaignPost = { day: number; channel: string; type: string; headline: string; body: string; hashtags: string[]; cta: string }
export type CampaignPlan = { name: string; summary: string; audience: string; channels: string[]; durationDays: number; budgetSplit: Array<{ channel: string; percent: number }>; kpis: string[]; posts: CampaignPost[] }
export type CampaignBrief = { goal: string; audience: string; offer: string; budget: string; durationDays: number; channels: string[] }

const CHANNELS = ['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'Email', 'WhatsApp']

// Demo-only plan so the flow is explorable without an account; live accounts get Claude.
function samplePlan(brief: CampaignBrief): CampaignPlan {
  const goal = brief.goal.trim() || 'bring in more customers'
  const offer = brief.offer.trim()
  const days = brief.durationDays
  const beats = [
    { title: 'Announce', body: `We're kicking off something new: ${goal.toLowerCase()}.${offer ? ` ${offer}.` : ''} Here's what it means for you.`, cta: 'Find out more' },
    { title: 'Show it', body: `A closer look behind the scenes — the people and the work that go into every order.`, cta: 'See how' },
    { title: 'Social proof', body: `Ask our regulars why they keep coming back. Share yours and tag us.`, cta: 'Share yours' },
    { title: 'Reminder', body: `${offer ? `${offer} — ` : ''}there's still time. Pop in or order online.`, cta: 'Order now' },
    { title: 'Last call', body: `Final days. Thank you to everyone who's joined in so far.`, cta: 'Don\'t miss out' },
  ]
  const channels = brief.channels.length ? brief.channels : ['Instagram', 'Email']
  const posts = beats.map((beat, index) => {
    const channel = channels[index % channels.length]
    const isEmail = channel === 'Email'
    return { day: Math.max(1, Math.round((index * (days - 1)) / (beats.length - 1)) + 1), channel, type: isEmail ? 'Email' : 'Social post', headline: `${beat.title}: ${goal}`.slice(0, 80), body: beat.body, hashtags: isEmail ? [] : ['#ShopLocal', '#SmallBusiness'], cta: beat.cta }
  })
  const share = Math.floor(100 / channels.length)
  return {
    name: `${goal.charAt(0).toUpperCase()}${goal.slice(1)}`.slice(0, 60),
    summary: `A ${days}-day push across ${channels.join(', ')} to ${goal.toLowerCase()}. Demo plan — signed-in accounts get a plan written by FoundAI from your real products and brand voice.`,
    audience: brief.audience || 'Existing customers and people nearby',
    channels,
    durationDays: days,
    budgetSplit: brief.budget ? channels.map((channel, index) => ({ channel, percent: index === 0 ? 100 - share * (channels.length - 1) : share })) : [],
    kpis: ['Track new customers from this campaign', 'Track repeat orders during the campaign', 'Track replies and link clicks per channel'],
    posts,
  }
}

const dateFor = (day: number) => { const date = new Date(); date.setDate(date.getDate() + day - 1); return date.toISOString().slice(0, 10) }
const niceDate = (day: number) => new Date(dateFor(day)).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

export function CampaignPlanner({ live, onCreate }: { live: boolean; onCreate: (plan: CampaignPlan, brief: CampaignBrief, dateFor: (day: number) => string) => Promise<void> }) {
  const [brief, setBrief] = useState<CampaignBrief>({ goal: '', audience: '', offer: '', budget: '', durationDays: 14, channels: ['Instagram', 'Facebook', 'Email'] })
  const [plan, setPlan] = useState<CampaignPlan | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(false)
  const [open, setOpen] = useState(true)
  const set = <K extends keyof CampaignBrief>(key: K, value: CampaignBrief[K]) => setBrief((current) => ({ ...current, [key]: value }))
  const toggle = (channel: string) => set('channels', brief.channels.includes(channel) ? brief.channels.filter((item) => item !== channel) : [...brief.channels, channel])
  const generate = async () => {
    setBusy(true); setError(''); setCreated(false)
    try {
      setPlan(live ? await productionRequest<CampaignPlan>('/ai/marketing/campaign', { method: 'POST', body: JSON.stringify(brief) }) : await new Promise<CampaignPlan>((resolve) => window.setTimeout(() => resolve(samplePlan(brief)), 600)))
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'FoundAI could not plan that campaign') } finally { setBusy(false) }
  }
  const create = async () => {
    if (!plan) return
    setBusy(true); setError('')
    try { await onCreate(plan, brief, dateFor); setCreated(true) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Campaign could not be saved') } finally { setBusy(false) }
  }
  return <section className="mk-planner">
    <header><div><span className="mw-ai-badge">FoundAI</span><strong>Plan a campaign</strong><small>Tell FoundAI what you want to achieve. It plans the campaign and writes every post, in your brand voice.</small></div><button className="mk-link" onClick={() => setOpen((value) => !value)} type="button">{open ? 'Hide' : 'Show'}</button></header>
    {open ? <>
      <div className="mk-form">
        <label className="mk-wide">Goal<input onChange={(event) => set('goal', event.target.value)} placeholder="e.g. Fill weekday lunch tables in October" value={brief.goal} /></label>
        <label>Who is it for?<input onChange={(event) => set('audience', event.target.value)} placeholder="e.g. Office workers within 1 mile" value={brief.audience} /></label>
        <label>Offer (optional)<input onChange={(event) => set('offer', event.target.value)} placeholder="e.g. Free coffee with any lunch" value={brief.offer} /></label>
        <label>Budget (optional)<input onChange={(event) => set('budget', event.target.value)} placeholder="e.g. £300" value={brief.budget} /></label>
        <label>Length<select onChange={(event) => set('durationDays', Number(event.target.value))} value={brief.durationDays}>{[7, 14, 21, 30].map((days) => <option key={days} value={days}>{days} days</option>)}</select></label>
      </div>
      <div className="mk-channels" role="group" aria-label="Channels">{CHANNELS.map((channel) => <button aria-pressed={brief.channels.includes(channel)} key={channel} onClick={() => toggle(channel)} type="button">{channel}</button>)}</div>
      <div className="mk-actions"><button className="mk-primary" disabled={busy || !brief.goal.trim() || !brief.channels.length} onClick={() => { void generate() }} type="button">{busy && !plan ? 'FoundAI is planning…' : plan ? '↻ Plan another version' : '✨ Plan campaign'}</button>{!live ? <small>Demo: sample plan. Signed-in accounts get a plan written by FoundAI.</small> : null}</div>
      {error ? <p className="ap-error">{error}</p> : null}
      {plan ? <div className="mk-plan">
        <div className="mk-plan-head"><div><h3>{plan.name}</h3><p>{plan.summary}</p><small><b>Audience:</b> {plan.audience} · <b>Channels:</b> {plan.channels.join(', ')} · <b>{plan.durationDays} days</b></small></div></div>
        <div className="mk-plan-meta">
          {plan.kpis.length ? <div><h4>Targets</h4><ul>{plan.kpis.map((kpi) => <li key={kpi}>{kpi}</li>)}</ul></div> : null}
          {plan.budgetSplit.length ? <div><h4>Budget split{brief.budget ? ` · ${brief.budget}` : ''}</h4><ul>{plan.budgetSplit.map((item) => <li key={item.channel}><span>{item.channel}</span><i style={{ width: `${item.percent}%` }} /><b>{item.percent}%</b></li>)}</ul></div> : null}
        </div>
        <h4>Posts ({plan.posts.length})</h4>
        <ol className="mk-posts">{plan.posts.map((post, index) => <li key={`${post.day}-${index}`}>
          <div className="mk-post-when"><b>{niceDate(post.day)}</b><span>{post.channel}</span></div>
          <div><strong>{post.headline}</strong><p>{post.body}</p>{post.hashtags.length ? <small>{post.hashtags.join(' ')}</small> : null}<em>{post.cta}</em></div>
          <button className="mk-link" onClick={() => { void navigator.clipboard?.writeText(`${post.headline}\n\n${post.body}\n\n${post.hashtags.join(' ')}`) }} type="button">Copy</button>
        </li>)}</ol>
        <div className="mk-actions"><button className="mk-primary" disabled={busy || created} onClick={() => { void create() }} type="button">{created ? 'Added ✓' : busy ? 'Saving…' : `Add campaign + ${plan.posts.length} posts`}</button><small>{created ? 'Saved to Campaigns and Content studio as drafts, dated on the calendar. FoundAI Autopilot takes it from here under your rules.' : 'Saved as dated drafts. FoundAI doesn’t post to your social accounts yet — use Copy to publish each one.'}</small></div>
      </div> : null}
    </> : null}
  </section>
}
