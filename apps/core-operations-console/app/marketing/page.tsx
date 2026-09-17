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

  const loadWorkspace = useCallback(async () => {
    try {
      setWorkspace(await apiRequest<MarketingWorkspace>('/marketing/workspace'))
      setError('')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Marketing workspace could not be loaded.')
    }
  }, [])

  useEffect(() => {
    void loadWorkspace()
  }, [loadWorkspace])

  const submitCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
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
      event.currentTarget.reset()
      setNotice('Campaign created with generated campaign copy.')
      await loadWorkspace()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Campaign could not be created.')
    } finally {
      setBusy(false)
    }
  }

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
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
      event.currentTarget.reset()
      setNotice('Social post saved to the publishing queue.')
      await loadWorkspace()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Social post could not be scheduled.')
    } finally {
      setBusy(false)
    }
  }

  const submitMedia = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    setNotice('')
    try {
      await apiRequest('/media/generate', {
        method: 'POST',
        body: JSON.stringify({ format: form.get('format'), brief: form.get('brief') }),
      })
      event.currentTarget.reset()
      setNotice('Marketing content generated from current operational context.')
      await loadWorkspace()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Marketing content could not be generated.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="page-grid">
      <header className="page-header">
        <div><p className="eyebrow">Core Operations</p><h1>Marketing Suite</h1><p>Plan campaigns, create channel content, schedule publishing, and connect results to customers, orders, and revenue.</p></div>
      </header>

      {error ? <div className="panel" role="alert"><strong>Marketing service unavailable</strong><p>{error}</p><button type="button" onClick={() => void loadWorkspace()}>Try again</button></div> : null}
      {notice ? <div className="panel" role="status">{notice}</div> : null}

      <div className="kpi-grid">
        <article><p>Campaigns</p><strong>{workspace.metrics.campaigns}</strong><span>All statuses</span></article>
        <article><p>Scheduled posts</p><strong>{workspace.metrics.scheduledPosts}</strong><span>Publishing queue</span></article>
        <article><p>Impressions</p><strong>{workspace.metrics.impressions.toLocaleString()}</strong><span>Reported reach</span></article>
        <article><p>Conversions</p><strong>{workspace.metrics.conversions.toLocaleString()}</strong><span>Attributed actions</span></article>
      </div>

      <div className="module-grid">
        <form className="panel" onSubmit={submitCampaign}>
          <p className="eyebrow">Campaign builder</p><h2>Launch a campaign</h2>
          <label>Name<input className="input" name="name" required /></label>
          <label>Objective<input className="input" name="objective" placeholder="Increase repeat purchases" required /></label>
          <label>Audience<input className="input" name="audience" placeholder="Customers inactive for 30 days" required /></label>
          <fieldset><legend>Channels</legend>{['WhatsApp', 'Email', 'Facebook', 'Instagram'].map((platform) => <label key={platform}><input type="checkbox" name="platforms" value={platform} /> {platform}</label>)}</fieldset>
          <button className="btn btn-primary" disabled={busy} type="submit">Create campaign</button>
        </form>

        <form className="panel" onSubmit={submitPost}>
          <p className="eyebrow">Publishing</p><h2>Schedule a social post</h2>
          <label>Post<textarea className="input" name="content" rows={4} required /></label>
          <label>Publish at<input className="input" name="scheduledAt" type="datetime-local" /></label>
          <fieldset><legend>Channels</legend>{['Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => <label key={platform}><input type="checkbox" name="platforms" value={platform} /> {platform}</label>)}</fieldset>
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
