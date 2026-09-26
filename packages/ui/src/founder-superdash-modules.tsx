'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// SuperDash Finance and Marketing: FoundingOS's own books and growth marketing, scoped to the
// founder's company (not a customer workspace). Backed by /founder/finance, /founder/ledger,
// /founder/marketing and FoundAI's real marketing endpoints.
import { useCallback, useEffect, useState } from 'react'
import { productionRequest } from './workspace-production-client'
import { MonthCalendar, type CalendarEvent } from './month-calendar'

type LedgerEntry = { id: string; label: string; kind: string; category: string; recurring: boolean; date: string; amountGbp: number; note: string }
type PnlRow = { month: string; subscriptions: number; otherIncome: number; revenue: number; costs: number; net: number }
export type FounderFinance = {
  mrrGbp: number; arrGbp: number; arpuGbp: number; payingCustomers: number; billingLive: boolean; recurringCostsGbp: number
  thisMonth: PnlRow; cashGbp: number | null; cashAsOf: string | null; monthlyBurnGbp: number; runwayMonths: number | null
  pnl: PnlRow[]; byCategory: Array<{ category: string; monthlyGbp: number }>; topCustomers: Array<{ business: string; plan: string; monthlyGbp: number }>
  entries: LedgerEntry[]; categories: string[]; note: string
}
type Post = { id: string; title: string; status: string; channel: string; text: string; hashtags: string; dueDate: string | null; campaign: string; publishedUrl: string | null; publishedAt: string | null; updatedAt: string }
export type FounderMarketing = {
  funnel: { signups30d: number; signups7d: number; customers: number; paying: number; conversionPct: number; upgradeRequests90d: number; active7d: number; signupsByWeek: Array<{ weekOf: string; signups: number }> }
  channels: { facebookInstagram: boolean; linkedin: boolean }
  posts: Post[]
  campaigns: Array<{ id: string; name: string; status: string; summary: string; updatedAt: string }>
}
type Draft = { headline: string; body: string; hashtags: string[]; cta: string; imageIdea?: string }
type CampaignPlan = { name: string; summary: string; kpis: string[]; posts: Array<{ day: number; channel: string; type: string; headline: string; body: string; hashtags: string[]; cta: string }> }

const gbp = (value: number) => `${value < 0 ? '−' : ''}£${Math.abs(value).toLocaleString('en-GB', { maximumFractionDigits: 2 })}`
const monthLabel = (month: string) => new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
const errorText = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback)
const localInput = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

export function FounderFinancePanel() {
  const [data, setData] = useState<FounderFinance | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ kind: 'expense', label: '', category: 'Hosting & infrastructure', amountGbp: '', recurring: true, date: new Date().toISOString().slice(0, 10) })
  const load = useCallback(async () => {
    try { setData(await productionRequest<FounderFinance>('/founder/finance')); setError('') } catch (err) { setError(errorText(err, 'Could not load finance')) }
  }, [])
  useEffect(() => { void load() }, [load])

  const add = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true); setError('')
    try {
      await productionRequest('/founder/ledger', { method: 'POST', body: JSON.stringify({ ...form, amountGbp: Number(form.amountGbp) }) })
      setForm({ ...form, label: '', amountGbp: '' })
      await load()
    } catch (err) { setError(errorText(err, 'Could not save')) } finally { setBusy(false) }
  }
  const remove = async (id: string) => {
    try { await productionRequest(`/founder/ledger/${id}`, { method: 'DELETE' }); await load() } catch (err) { setError(errorText(err, 'Could not delete')) }
  }
  const maxBar = Math.max(1, ...(data?.pnl.flatMap((row) => [row.revenue, row.costs]) ?? [1]))

  return <div className="sd-module">
    {error ? <p className="sd-error">{error}</p> : null}
    <section className="sd-kpis">
      <article><span>MRR</span><b>{gbp(data?.mrrGbp ?? 0)}</b><small>ARR {gbp(data?.arrGbp ?? 0)} · {data?.payingCustomers ?? 0} paying</small></article>
      <article><span>Monthly costs</span><b>{gbp(data?.recurringCostsGbp ?? 0)}</b><small>recurring</small></article>
      <article className={(data?.thisMonth.net ?? 0) < 0 ? 'is-alert' : ''}><span>Profit this month</span><b>{gbp(data?.thisMonth.net ?? 0)}</b><small>{gbp(data?.thisMonth.revenue ?? 0)} in · {gbp(data?.thisMonth.costs ?? 0)} out</small></article>
      <article><span>Cash</span><b>{data?.cashGbp == null ? '—' : gbp(data.cashGbp)}</b><small>{data?.cashAsOf ? `as of ${data.cashAsOf}` : 'add a cash balance below'}</small></article>
      <article className={data?.runwayMonths != null && data.runwayMonths < 6 ? 'is-alert' : ''}><span>Runway</span><b>{data?.runwayMonths == null ? (data && data.monthlyBurnGbp === 0 ? 'Profitable' : '—') : `${data.runwayMonths} mo`}</b><small>burn {gbp(data?.monthlyBurnGbp ?? 0)}/mo</small></article>
    </section>
    <div className="sd-grid">
      <section className="sd-panel sd-wide">
        <h2>Profit &amp; loss — last 6 months</h2>
        <div className="sd-pnl">
          {data?.pnl.map((row) => <div className="sd-pnl-col" key={row.month}>
            <div className="sd-pnl-bars"><i className="in" style={{ height: `${(row.revenue / maxBar) * 100}%` }} title={`Revenue ${gbp(row.revenue)}`} /><i className="out" style={{ height: `${(row.costs / maxBar) * 100}%` }} title={`Costs ${gbp(row.costs)}`} /></div>
            <b className={row.net < 0 ? 'neg' : ''}>{gbp(row.net)}</b><small>{monthLabel(row.month)}</small>
          </div>)}
        </div>
        <table className="sd-table"><thead><tr><th>Month</th><th>Subscriptions</th><th>Other income</th><th>Costs</th><th>Net</th></tr></thead><tbody>
          {data?.pnl.slice().reverse().map((row) => <tr key={row.month}><td>{monthLabel(row.month)}</td><td>{gbp(row.subscriptions)}</td><td>{gbp(row.otherIncome)}</td><td>{gbp(row.costs)}</td><td className={row.net < 0 ? 'neg' : ''}>{gbp(row.net)}</td></tr>)}
        </tbody></table>
        <p className="sd-muted">{data?.note}</p>
      </section>
      <section className="sd-panel">
        <h2>Add to the books</h2>
        <form className="sd-form" onSubmit={add}>
          <div className="sd-seg">{['expense', 'income', 'cash'].map((kind) => <button className={form.kind === kind ? 'on' : ''} key={kind} onClick={() => setForm({ ...form, kind })} type="button">{kind === 'expense' ? 'Cost' : kind === 'income' ? 'Income' : 'Cash balance'}</button>)}</div>
          <input onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder={form.kind === 'cash' ? 'e.g. Business bank account' : form.kind === 'income' ? 'e.g. Consulting setup fee' : 'e.g. Vercel Pro'} required value={form.label} />
          {form.kind === 'expense' ? <select onChange={(event) => setForm({ ...form, category: event.target.value })} value={form.category}>{(data?.categories ?? ['Other']).map((category) => <option key={category}>{category}</option>)}</select> : null}
          <div className="sd-form-row"><input inputMode="decimal" min="0" onChange={(event) => setForm({ ...form, amountGbp: event.target.value })} placeholder="£ amount" required step="0.01" type="number" value={form.amountGbp} /><input onChange={(event) => setForm({ ...form, date: event.target.value })} type="date" value={form.date} /></div>
          {form.kind !== 'cash' ? <label className="sd-check"><input checked={form.recurring} onChange={(event) => setForm({ ...form, recurring: event.target.checked })} type="checkbox" /> Repeats every month</label> : null}
          <button disabled={busy} type="submit">{busy ? 'Saving…' : 'Save'}</button>
        </form>
        <h2>Costs by category</h2>
        {data?.byCategory.length ? data.byCategory.map((row) => <div className="sd-row" key={row.category}><span>{row.category}</span><b>{gbp(row.monthlyGbp)}</b></div>) : <p className="sd-muted">No costs recorded yet.</p>}
      </section>
      <section className="sd-panel">
        <h2>Top customers</h2>
        {data?.topCustomers.length ? data.topCustomers.map((row) => <div className="sd-row" key={row.business}><div><strong>{row.business}</strong><small>{row.plan}</small></div><b>{gbp(row.monthlyGbp)}/mo</b></div>) : <p className="sd-muted">No paying customers yet.</p>}
      </section>
      <section className="sd-panel sd-wide">
        <h2>Ledger</h2>
        <table className="sd-table"><thead><tr><th>Date</th><th>Entry</th><th>Type</th><th>Category</th><th>Amount</th><th /></tr></thead><tbody>
          {data?.entries.map((entry) => <tr key={entry.id}><td>{entry.date}</td><td><strong>{entry.label}</strong></td><td>{entry.kind === 'cash' ? 'Cash balance' : `${entry.kind === 'income' ? 'Income' : 'Cost'}${entry.recurring ? ' · monthly' : ''}`}</td><td>{entry.category}</td><td>{gbp(entry.amountGbp)}</td><td><button className="ghost" onClick={() => void remove(entry.id)} type="button">Delete</button></td></tr>)}
          {!data?.entries.length ? <tr><td className="sd-muted" colSpan={6}>Add your running costs (hosting, AI, App Store, tools) and a cash balance to see real profit and runway.</td></tr> : null}
        </tbody></table>
      </section>
    </div>
  </div>
}

export function FounderMarketingPanel() {
  const [data, setData] = useState<FounderMarketing | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const [topic, setTopic] = useState('')
  const [post, setPost] = useState({ title: '', text: '', hashtags: '', channel: 'LinkedIn', dueDate: localInput(new Date(Date.now() + 24 * 3600_000)) })
  const [brief, setBrief] = useState({ goal: 'Get UK small business owners to start a free FoundingOS Lite account', durationDays: '14', channels: 'LinkedIn, Instagram, Facebook' })
  const [plan, setPlan] = useState<CampaignPlan | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const load = useCallback(async () => {
    try { setData(await productionRequest<FounderMarketing>('/founder/marketing')); setError('') } catch (err) { setError(errorText(err, 'Could not load marketing')) }
  }, [])
  useEffect(() => { void load() }, [load])

  const run = async (key: string, task: () => Promise<void>) => {
    setBusy(key); setError(''); setNotice('')
    try { await task() } catch (err) { setError(errorText(err, 'Something went wrong')) } finally { setBusy('') }
  }
  const draft = () => run('draft', async () => {
    const result = await productionRequest<Draft>('/ai/marketing/post', { method: 'POST', body: JSON.stringify({ topic: topic || 'Why small businesses let FoundingOS run their operations', platform: post.channel, type: 'Social post', previous: post.text || undefined }) })
    setPost({ ...post, title: result.headline, text: `${result.body}${result.cta ? `\n\n${result.cta}` : ''}`, hashtags: result.hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ') })
  })
  const save = (status: 'Approved' | 'Draft') => run(status, async () => {
    await productionRequest('/founder/marketing/posts', { method: 'POST', body: JSON.stringify({ ...post, status, dueDate: post.dueDate ? new Date(post.dueDate).toISOString() : null }) })
    setNotice(status === 'Approved' ? 'Scheduled — FoundAI publishes it when it is due.' : 'Saved as a draft.')
    setPost({ ...post, title: '', text: '', hashtags: '' })
    await load()
  })
  const planCampaign = () => run('plan', async () => {
    setPlan(await productionRequest<CampaignPlan>('/ai/marketing/campaign', { method: 'POST', body: JSON.stringify({ goal: brief.goal, durationDays: Number(brief.durationDays), channels: brief.channels.split(',').map((item) => item.trim()).filter(Boolean) }) }))
  })
  const scheduleCampaign = () => run('schedule', async () => {
    if (!plan) return
    const start = new Date(); start.setHours(10, 0, 0, 0)
    for (const item of plan.posts) {
      const due = new Date(start.getTime() + item.day * 24 * 3600_000)
      await productionRequest('/founder/marketing/posts', { method: 'POST', body: JSON.stringify({ title: item.headline, text: `${item.body}\n\n${item.cta}`, hashtags: item.hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' '), channel: item.channel, dueDate: due.toISOString(), campaign: plan.name, status: 'Approved' }) })
    }
    setNotice(`${plan.posts.length} posts scheduled on the calendar for “${plan.name}”.`)
    setPlan(null)
    await load()
  })
  const update = (id: string, body: Record<string, unknown>) => run(id, async () => { await productionRequest(`/founder/marketing/posts/${id}`, { method: 'PATCH', body: JSON.stringify(body) }); await load() })
  const remove = (id: string) => run(id, async () => { await productionRequest(`/founder/marketing/posts/${id}`, { method: 'DELETE' }); await load() })
  const publishNow = (id: string) => run(id, async () => {
    await productionRequest('/social/publish', { method: 'POST', body: JSON.stringify({ recordId: id }) })
    setNotice('Published ✓')
    await load()
  })

  const f = data?.funnel
  const maxWeek = Math.max(1, ...(f?.signupsByWeek.map((week) => week.signups) ?? [1]))
  const events: CalendarEvent[] = (data?.posts ?? []).filter((item) => item.dueDate || item.publishedAt).map((item) => ({ id: item.id, date: (item.publishedAt || item.dueDate)!, title: `${item.channel ? `${item.channel}: ` : ''}${item.title}`, detail: item.text, tone: item.status === 'Published' ? 'good' : item.status === 'Approved' ? 'info' : 'muted' }))
  const dayPosts = selectedDay ? (data?.posts ?? []).filter((item) => { const at = item.publishedAt || item.dueDate; if (!at) return false; const d = new Date(at); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === selectedDay }) : []
  const upcoming = (data?.posts ?? []).filter((item) => item.status !== 'Published').sort((a, b) => (a.dueDate || '9').localeCompare(b.dueDate || '9'))

  return <div className="sd-module">
    {error ? <p className="sd-error">{error}</p> : null}
    {notice ? <p className="sd-notice">{notice}</p> : null}
    <section className="sd-kpis">
      <article><span>Sign-ups</span><b>{f?.signups30d ?? 0}</b><small>30 days · {f?.signups7d ?? 0} this week</small></article>
      <article><span>Free → paid</span><b>{f?.conversionPct ?? 0}%</b><small>{f?.paying ?? 0} of {f?.customers ?? 0} companies</small></article>
      <article><span>Upgrade requests</span><b>{f?.upgradeRequests90d ?? 0}</b><small>90 days</small></article>
      <article><span>Scheduled posts</span><b>{upcoming.filter((item) => item.status === 'Approved').length}</b><small>{upcoming.filter((item) => item.status === 'Draft').length} drafts</small></article>
      <article className={data && !data.channels.facebookInstagram && !data.channels.linkedin ? 'is-alert' : ''}><span>Channels</span><b>{[data?.channels.linkedin ? 'LinkedIn' : '', data?.channels.facebookInstagram ? 'Meta' : ''].filter(Boolean).join(' + ') || 'None'}</b><small>{data?.channels.linkedin && data?.channels.facebookInstagram ? 'auto-publishing on' : <a href="/app/integrations">Connect in Integrations</a>}</small></article>
    </section>
    <div className="sd-grid">
      <section className="sd-panel sd-wide">
        <h2>Content calendar</h2>
        <MonthCalendar emptyHint="Nothing scheduled yet — write a post or plan a campaign below." events={events} onSelectDay={(day) => { setSelectedDay(day); setPost({ ...post, dueDate: `${day}T10:00` }) }} onSelectEvent={(event) => setSelectedDay(localInput(new Date(event.date)).slice(0, 10))} selectedDay={selectedDay} />
        {selectedDay ? <div className="sd-day">
          <h3>{new Date(`${selectedDay}T12:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
          {dayPosts.length ? dayPosts.map((item) => <PostRow busy={busy === item.id} item={item} key={item.id} onDelete={remove} onPublish={publishNow} onUpdate={update} />) : <p className="sd-muted">Nothing on this day. The composer is set to post at 10:00 on this date.</p>}
        </div> : null}
      </section>
      <section className="sd-panel">
        <h2>Write a post with FoundAI</h2>
        <div className="sd-form">
          <div className="sd-form-row"><input onChange={(event) => setTopic(event.target.value)} placeholder="What should it be about?" value={topic} /><button disabled={busy === 'draft'} onClick={() => void draft()} type="button">{busy === 'draft' ? 'Writing…' : post.text ? 'Another version' : 'Draft it'}</button></div>
          <input onChange={(event) => setPost({ ...post, title: event.target.value })} placeholder="Headline" value={post.title} />
          <textarea onChange={(event) => setPost({ ...post, text: event.target.value })} placeholder="Post text" rows={6} value={post.text} />
          <input onChange={(event) => setPost({ ...post, hashtags: event.target.value })} placeholder="#hashtags" value={post.hashtags} />
          <div className="sd-form-row">
            <select onChange={(event) => setPost({ ...post, channel: event.target.value })} value={post.channel}>{['LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'Email', 'Blog'].map((channel) => <option key={channel}>{channel}</option>)}</select>
            <input onChange={(event) => setPost({ ...post, dueDate: event.target.value })} type="datetime-local" value={post.dueDate} />
          </div>
          <div className="sd-form-row"><button disabled={!post.title || !post.text || Boolean(busy)} onClick={() => void save('Approved')} type="button">{busy === 'Approved' ? 'Scheduling…' : 'Schedule'}</button><button className="ghost" disabled={!post.title || !post.text || Boolean(busy)} onClick={() => void save('Draft')} type="button">Save draft</button></div>
          {['TikTok', 'Email', 'Blog'].includes(post.channel) ? <p className="sd-muted">{post.channel} posts are scheduled as reminders — post them yourself, then mark them Published.</p> : null}
        </div>
      </section>
      <section className="sd-panel">
        <h2>Plan a campaign</h2>
        <div className="sd-form">
          <textarea onChange={(event) => setBrief({ ...brief, goal: event.target.value })} rows={3} value={brief.goal} />
          <div className="sd-form-row"><input onChange={(event) => setBrief({ ...brief, channels: event.target.value })} placeholder="Channels" value={brief.channels} /><input max="60" min="3" onChange={(event) => setBrief({ ...brief, durationDays: event.target.value })} title="Days" type="number" value={brief.durationDays} /></div>
          <button disabled={busy === 'plan'} onClick={() => void planCampaign()} type="button">{busy === 'plan' ? 'FoundAI is planning…' : 'Plan it with FoundAI'}</button>
        </div>
        {plan ? <div className="sd-plan">
          <h3>{plan.name}</h3><p>{plan.summary}</p>
          {plan.kpis.length ? <ul>{plan.kpis.map((kpi) => <li key={kpi}>{kpi}</li>)}</ul> : null}
          {plan.posts.map((item, index) => <div className="sd-row" key={index}><div><strong>Day {item.day} · {item.channel}</strong><small>{item.headline}</small></div></div>)}
          <div className="sd-form-row"><button disabled={busy === 'schedule'} onClick={() => void scheduleCampaign()} type="button">{busy === 'schedule' ? 'Scheduling…' : `Schedule all ${plan.posts.length} posts`}</button><button className="ghost" onClick={() => setPlan(null)} type="button">Discard</button></div>
        </div> : null}
      </section>
      <section className="sd-panel sd-wide">
        <h2>Sign-ups by week</h2>
        <div className="sd-bars">{f?.signupsByWeek.map((week) => <div className="sd-bar" key={week.weekOf} title={`${week.signups} sign-ups · week of ${week.weekOf}`}><i style={{ height: `${(week.signups / maxWeek) * 100}%` }} /><small>{week.weekOf.slice(5)}</small></div>)}</div>
      </section>
      <section className="sd-panel sd-wide">
        <h2>Queue</h2>
        {upcoming.length ? upcoming.map((item) => <PostRow busy={busy === item.id} item={item} key={item.id} onDelete={remove} onPublish={publishNow} onUpdate={update} />) : <p className="sd-muted">No posts waiting.</p>}
        {(data?.posts ?? []).some((item) => item.status === 'Published') ? <><h2>Published</h2>{data!.posts.filter((item) => item.status === 'Published').slice(0, 10).map((item) => <PostRow busy={false} item={item} key={item.id} onDelete={remove} onPublish={publishNow} onUpdate={update} />)}</> : null}
      </section>
    </div>
  </div>
}

function PostRow({ item, busy, onPublish, onUpdate, onDelete }: { item: Post; busy: boolean; onPublish: (id: string) => void; onUpdate: (id: string, body: Record<string, unknown>) => void; onDelete: (id: string) => void }) {
  const social = ['LinkedIn', 'Instagram', 'Facebook'].includes(item.channel)
  return <div className="sd-row sd-post">
    <div>
      <strong>{item.title}</strong>
      <small>{item.channel || 'No channel'} · {item.status}{item.dueDate ? ` · ${new Date(item.dueDate).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}` : ''}{item.campaign ? ` · ${item.campaign}` : ''}</small>
      <p>{item.text.slice(0, 220)}{item.text.length > 220 ? '…' : ''}</p>
      {item.publishedUrl ? <a href={item.publishedUrl} rel="noreferrer" target="_blank">View post ↗</a> : null}
    </div>
    <div className="sd-actions">
      {item.status === 'Draft' ? <button disabled={busy} onClick={() => onUpdate(item.id, { status: 'Approved' })} type="button">Approve</button> : null}
      {item.status !== 'Published' && social ? <button disabled={busy} onClick={() => onPublish(item.id)} type="button">Publish now</button> : null}
      {item.status !== 'Published' && !social ? <button disabled={busy} onClick={() => onUpdate(item.id, { status: 'Published' })} type="button">Mark published</button> : null}
      <button className="ghost" disabled={busy} onClick={() => void navigator.clipboard?.writeText(item.text)} type="button">Copy</button>
      <button className="ghost" disabled={busy} onClick={() => onDelete(item.id)} type="button">Delete</button>
    </div>
  </div>
}
