/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { type FormEvent, useEffect, useState } from 'react'
import { Card, ExternalLinkCard, Header } from '@founder-os/ui'
import { authClient } from '../auth'

type ScrapedLink = {
  id: string
  url: string
  sourceHost: string
  title: string
  description?: string | null
  imageUrl?: string | null
  scrapedAt: string
  merchantName?: string | null
  companyName?: string | null
  status: string
  foundRetailLeadId?: string | null
}

export function ScrapedLinksPanel({ canManage = false }: { canManage?: boolean }) {
  const [links, setLinks] = useState<ScrapedLink[]>([])
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  const load = async () => {
    try {
      const response = await authClient.request<{ success: true; data: ScrapedLink[] }>('/scraped-links')
      setLinks(response.data)
      setMessage('')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load scraped links') }
  }

  useEffect(() => {
    void load()
    const timer = window.setInterval(() => void load(), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const url = String(formData.get('url') || '').trim()
    if (!url) return
    setPending(true)
    try {
      await authClient.request('/scraped-links', { method: 'POST', body: JSON.stringify({ url, merchantName: formData.get('merchantName'), companyName: formData.get('companyName'), contactEmail: formData.get('contactEmail'), priority: formData.get('priority') === 'on', listingFeePence: Number(formData.get('listingFeePence') || 0), placementFeePence: Number(formData.get('placementFeePence') || 0), premiumFeePence: Number(formData.get('premiumFeePence') || 0) }) })
      form.reset()
      await load()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to scrape link') }
    finally { setPending(false) }
  }

  const rehome = async (id: string) => { try { await authClient.request(`/marketplace/items/${id}/rehome`, { method: 'POST' }); await load() } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to complete rehoming') } }
  return <div className="space-y-7"><Header eyebrow="FoundThis intelligence" title="Scraped link data" description="Source-linked marketplace intelligence collected and owned by FoundThis."/>{canManage && <Card title="Add source and create merchant lead"><form onSubmit={submit} className="grid gap-3 md:grid-cols-2"><label className="grid gap-1 text-sm font-semibold">Source URL<input id="scrape-url" name="url" type="url" required placeholder="https://example.com/listing" className="rounded border border-[var(--line)] px-3 py-2"/></label><label className="grid gap-1 text-sm font-semibold">Merchant name<input name="merchantName" className="rounded border border-[var(--line)] px-3 py-2"/></label><label className="grid gap-1 text-sm font-semibold">Company name<input name="companyName" className="rounded border border-[var(--line)] px-3 py-2"/></label><label className="grid gap-1 text-sm font-semibold">Contact email<input name="contactEmail" type="email" className="rounded border border-[var(--line)] px-3 py-2"/></label><label className="grid gap-1 text-sm font-semibold">Listing fee (pence)<input name="listingFeePence" type="number" min="0" defaultValue="0" className="rounded border border-[var(--line)] px-3 py-2"/></label><label className="grid gap-1 text-sm font-semibold">Priority fee (pence)<input name="placementFeePence" type="number" min="0" defaultValue="0" className="rounded border border-[var(--line)] px-3 py-2"/></label><label className="grid gap-1 text-sm font-semibold">Premium tools fee (pence)<input name="premiumFeePence" type="number" min="0" defaultValue="0" className="rounded border border-[var(--line)] px-3 py-2"/></label><label className="flex items-center gap-2 text-sm font-semibold"><input name="priority" type="checkbox"/>Priority placement</label><button disabled={pending} className="rounded bg-[var(--primary)] px-5 py-2 font-semibold text-white md:col-span-2">{pending ? 'Scraping…' : 'Scrape and publish'}</button></form></Card>}{message && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</p>}<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{links.map((link) => <div key={link.id} className="space-y-2"><ExternalLinkCard title={link.title} description={link.description} source={link.sourceHost} href={link.url} imageUrl={link.imageUrl}/>{canManage && <div className="flex items-center justify-between border border-[var(--line)] bg-white p-3 text-xs"><span>{link.status} {link.foundRetailLeadId ? '· FoundRetail lead synced' : ''}</span>{link.status !== 'rehomed' && <button type="button" onClick={() => void rehome(link.id)} className="bg-[var(--primary)] px-3 py-1 font-semibold text-white">Mark rehomed</button>}</div>}</div>)}{links.length === 0 && <Card>No scraped links are available yet.</Card>}</div></div>
}