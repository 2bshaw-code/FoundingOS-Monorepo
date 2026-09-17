'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || 'https://core-operations-api.foundingos.com/api/v1/ops'

type Campaign = {
  id: string
  name: string
  objective: string
  audience: string
  status: string
  impressions: number
  engagements: number
  conversions: number
  revenuePence: number
  caption?: string | null
}

type SocialPost = {
  id: string
  content: string
  status: string
  scheduledAt?: string | null
  platforms: unknown
}

type GeneratedMedia = {
  id: string
  format: string
  brief: string
  output: string
}

type MarketingWorkspace = {
  campaigns: Campaign[]
  socialPosts: SocialPost[]
  media: GeneratedMedia[]
  metrics: {
    campaigns: number
    scheduledPosts: number
    impressions: number
    conversions: number
    revenuePence: number
  }
}

const emptyWorkspace: MarketingWorkspace = {
  campaigns: [],
  socialPosts: [],
  media: [],
  metrics: { campaigns: 0, scheduledPosts: 0, impressions: 0, conversions: 0, revenuePence: 0 },
}

const demoWorkspace: MarketingWorkspace = {
  campaigns: [
    { id: 'CAM-104', name: 'September repeat purchase', objective: 'Bring recent buyers back', audience: 'Customers inactive for 30 days', status: 'Live', impressions: 12480, engagements: 1420, conversions: 186, revenuePence: 684200, caption: 'Your favourites are back — order in WhatsApp today.' },
    { id: 'CAM-103', name: 'Manchester launch', objective: 'Build local demand', audience: 'Customers within 15 miles', status: 'Scheduled', impressions: 8400, engagements: 910, conversions: 74, revenuePence: 291000, caption: 'FoundingOS is now operating in Manchester.' },
    { id: 'CAM-102', name: 'Delivery recovery', objective: 'Restore customer confidence', audience: 'Customers affected by delays', status: 'Completed', impressions: 2180, engagements: 624, conversions: 91, revenuePence: 148500, caption: 'Thank you for your patience — here is a personal update.' },
  ],
  socialPosts: [
    { id: 'POST-88', content: 'Three ways WhatsApp can remove admin from your working day.', status: 'Scheduled · Today 18:00', scheduledAt: '2026-09-17T18:00', platforms: ['LinkedIn', 'Instagram'] },
    { id: 'POST-87', content: 'Behind the scenes: an order moving from message to paid delivery.', status: 'Ready for approval', scheduledAt: null, platforms: ['TikTok', 'Instagram'] },
  ],
  media: [
    { id: 'MEDIA-31', format: 'WhatsApp promotion', brief: 'Repeat purchase campaign', output: 'Hi {{first_name}}, your most-loved products are ready to reorder. Reply YES and we will prepare the basket.' },
    { id: 'MEDIA-30', format: 'Social media content', brief: 'Explain the connected order journey', output: 'One message. One order. One delivery. One clear view of cash.' },
  ],
  metrics: { campaigns: 3, scheduledPosts: 2, impressions: 23060, conversions: 351, revenuePence: 1123700 },
}

const DEMO_STORAGE_KEY = 'foundingos-demo-marketing-v1'

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'content-type': 'application/json', ...init?.headers },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.message || `Marketing request failed (${response.status})`)
  return body.data as T
}

export default function MarketingPage() {
  const [workspace, setWorkspace] = useState<MarketingWorkspace>(emptyWorkspace)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const updateDemoWorkspace = useCallback((update: (current: MarketingWorkspace) => MarketingWorkspace) => {
    setWorkspace((current) => {
      const next = update(current.campaigns.length ? current : demoWorkspace)
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next))
      return next
    })
    setDemoMode(true)
    setError('')
  }, [])

  const loadWorkspace = useCallback(async () => {
    try {
      setWorkspace(await apiRequest<MarketingWorkspace>('/marketing/workspace'))
      setError('')
    } catch (loadError) {
      const stored = window.localStorage.getItem(DEMO_STORAGE_KEY)
      setWorkspace(stored ? JSON.parse(stored) as MarketingWorkspace : demoWorkspace)
      setDemoMode(true)
      setError(loadError instanceof Error ? loadError.message : 'Marketing service could not be reached.')
    }
  }, [])

  useEffect(() => {
    void loadWorkspace()
  }, [loadWorkspace])

  const submitCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setBusy(true)
    setNotice('')
    try {
      await apiRequest('/marketing/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          objective: form.get('objective'),
          audience: form.get('audience'),
          platforms: form.getAll('platforms'),
        }),
      })
      formElement.reset()
      setNotice('Campaign created with generated campaign copy.')
      await loadWorkspace()
    } catch (submitError) {
      const name = String(form.get('name'))
      updateDemoWorkspace((current) => {
        const campaign: Campaign = { id: `CAM-${105 + current.campaigns.length}`, name, objective: String(form.get('objective')), audience: String(form.get('audience')), status: 'Draft', impressions: 0, engagements: 0, conversions: 0, revenuePence: 0, caption: `${name} is ready for review.` }
        return { ...current, campaigns: [campaign, ...current.campaigns], metrics: { ...current.metrics, campaigns: current.metrics.campaigns + 1 } }
      })
      formElement.reset()
      setNotice('Campaign saved safely in demo mode with generated draft copy.')
    } finally {
      setBusy(false)
    }
  }

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setBusy(true)
    setNotice('')
    try {
      await apiRequest('/social/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: form.get('content'),
          platforms: form.getAll('platforms'),
          scheduledAt: form.get('scheduledAt') || undefined,
          autoPost: form.get('autoPost') === 'on',
        }),
      })
      formElement.reset()
      setNotice('Social post saved to the publishing queue.')
      await loadWorkspace()
    } catch (submitError) {
      updateDemoWorkspace((current) => {
        const post: SocialPost = { id: `POST-${89 + current.socialPosts.length}`, content: String(form.get('content')), status: 'Scheduled', scheduledAt: String(form.get('scheduledAt') || ''), platforms: form.getAll('platforms') }
        return { ...current, socialPosts: [post, ...current.socialPosts], metrics: { ...current.metrics, scheduledPosts: current.metrics.scheduledPosts + 1 } }
      })
      formElement.reset()
      setNotice('Social post added to the demo publishing queue.')
    } finally {
      setBusy(false)
    }
  }

  const submitMedia = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setBusy(true)
    setNotice('')
    try {
      await apiRequest('/media/generate', {
        method: 'POST',
        body: JSON.stringify({ format: form.get('format'), brief: form.get('brief') }),
      })
      formElement.reset()
      setNotice('Marketing content generated from current operational context.')
      await loadWorkspace()
    } catch (submitError) {
      const format = String(form.get('format'))
      const brief = String(form.get('brief'))
      updateDemoWorkspace((current) => ({ ...current, media: [{ id: `MEDIA-${32 + current.media.length}`, format, brief, output: `${brief} — drafted in the approved FoundingOS voice and ready for human review.` }, ...current.media] }))
      formElement.reset()
      setNotice('Content generated in demo mode and saved for review.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="page-grid">
      <header className="page-header">
        <div><p className="eyebrow">Core Operations</p><h1>Marketing Suite</h1><p>Plan campaigns, create channel content, schedule publishing, and connect results to customers, orders, and revenue.</p></div>
      </header>

      {demoMode ? <div className="panel marketing-demo-notice" role="status"><strong>Interactive demo mode</strong><p>Safe sample data is active because the production marketing service is not connected in this browser. Everything you create persists locally.</p>{error ? <small>{error}</small> : null}<button type="button" onClick={() => void loadWorkspace()}>Try live service</button></div> : null}
      {notice ? <div className="panel" role="status">{notice}</div> : null}

      <div className="kpi-grid">
        <article><p>Campaigns</p><strong>{workspace.metrics.campaigns}</strong><span>All statuses</span></article>
        <article><p>Scheduled posts</p><strong>{workspace.metrics.scheduledPosts}</strong><span>Publishing queue</span></article>
        <article><p>Impressions</p><strong>{workspace.metrics.impressions.toLocaleString()}</strong><span>Reported reach</span></article>
        <article><p>Conversions</p><strong>{workspace.metrics.conversions.toLocaleString()}</strong><span>Attributed actions</span></article>
        <article><p>Attributed revenue</p><strong>£{(workspace.metrics.revenuePence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}</strong><span>Connected to orders</span></article>
      </div>

      <div className="module-grid">
        <form className="panel" onSubmit={submitCampaign}>
          <p className="eyebrow">Campaign builder</p><h2>Launch a campaign</h2>
          <label>Name<input className="input" name="name" required /></label>
          <label>Objective<input className="input" name="objective" placeholder="Increase repeat purchases" required /></label>
          <label>Audience<input className="input" name="audience" placeholder="Customers inactive for 30 days" required /></label>
          <fieldset><legend>Channels</legend>{['WhatsApp', 'Email', 'Facebook', 'Instagram'].map((platform) => <label className={`marketing-channel channel-${platform.toLowerCase()}`} key={platform}><input type="checkbox" name="platforms" value={platform} /> {platform}</label>)}</fieldset>
          <button className="btn btn-primary" disabled={busy} type="submit">Create campaign</button>
        </form>

        <form className="panel" onSubmit={submitPost}>
          <p className="eyebrow">Publishing</p><h2>Schedule a social post</h2>
          <label>Post<textarea className="input" name="content" rows={4} required /></label>
          <label>Publish at<input className="input" name="scheduledAt" type="datetime-local" /></label>
          <fieldset><legend>Channels</legend>{['Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => <label className={`marketing-channel channel-${platform.toLowerCase()}`} key={platform}><input type="checkbox" name="platforms" value={platform} /> {platform}</label>)}</fieldset>
          <label><input type="checkbox" name="autoPost" /> Publish automatically when due</label>
          <button className="btn btn-primary" disabled={busy} type="submit">Add to publishing queue</button>
        </form>

        <form className="panel" onSubmit={submitMedia}>
          <p className="eyebrow">AI content studio</p><h2>Generate campaign content</h2>
          <label>Format<select className="input" name="format"><option>Social media content</option><option>WhatsApp promotion</option><option>Email campaign</option><option>Product launch</option></select></label>
          <label>Brief<textarea className="input" name="brief" rows={5} required /></label>
          <button className="btn btn-primary" disabled={busy} type="submit">Generate with business context</button>
        </form>
      </div>

      <div className="module-grid">
        <article className="panel"><p className="eyebrow">Campaigns</p><h2>Current activity</h2>{workspace.campaigns.length ? workspace.campaigns.slice(0, 6).map((campaign) => <div key={campaign.id}><strong>{campaign.name}</strong><p>{campaign.objective} · {campaign.audience} · {campaign.status}</p></div>) : <p>No campaigns yet.</p>}</article>
        <article className="panel"><p className="eyebrow">Publishing queue</p><h2>Scheduled content</h2>{workspace.socialPosts.length ? workspace.socialPosts.slice(0, 6).map((post) => <div key={post.id}><strong>{post.status}</strong><p>{post.content}</p></div>) : <p>No social posts yet.</p>}</article>
        <article className="panel"><p className="eyebrow">Generated content</p><h2>Recent outputs</h2>{workspace.media.length ? workspace.media.slice(0, 4).map((item) => <div key={item.id}><strong>{item.format}</strong><p>{item.output}</p></div>) : <p>No generated content yet.</p>}</article>
      </div>
    </section>
  )
}
