/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { authClient } from '../auth'

type MarketplaceItem = { id: string; title: string; description?: string | null; imageUrl?: string | null; sourceHost: string; url: string; status: string; priority: boolean; merchantName?: string | null; deliveryFeePence: number }
const apiUrl = `${import.meta.env.VITE_FOUNDIT_API_URL.replace(/\/+$/, '')}/api/v1`
const money = (pence = 0) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)

export function MarketplaceShowcase() {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [message, setMessage] = useState('')
  const load = async () => { try { const response = await fetch(`${apiUrl}/marketplace/items`); const body = await response.json(); if (!response.ok) throw new Error(body.message || 'Marketplace unavailable'); setItems(body.data || []) } catch (error) { setMessage(error instanceof Error ? error.message : 'Marketplace unavailable') } }
  useEffect(() => { void load(); const timer = window.setInterval(() => void load(), 30_000); return () => window.clearInterval(timer) }, [])
  const claim = async (item: MarketplaceItem) => {
    try { await authClient.request(`/marketplace/items/${item.id}/claim`, { method: 'POST', body: JSON.stringify({ deliveryFeePence: item.deliveryFeePence }) }); setMessage(`${item.title} has been reserved for rehoming.`); await load() }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to claim item') }
  }
  return <section id="marketplace" className="border-y border-[#E6D26A] bg-white py-20"><div className="mx-auto max-w-6xl px-5"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#806B00]">Rehome with FoundThis</p><div className="mt-3 flex flex-wrap items-end justify-between gap-5"><div><h2 className="text-4xl font-bold">Useful items deserve another life.</h2><p className="mt-4 max-w-2xl text-[#6F6751]">Browse free items, reserve collection or delivery, and keep reusable goods moving through local communities.</p></div><a href="#revenue" className="border border-[#FFD600] px-5 py-3 font-semibold">How FoundThis earns</a></div>{message && <p role="status" className="mt-6 border border-[#E6D26A] bg-[#FFFBE6] p-3 text-sm">{message}</p>}<div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.id} className={`overflow-hidden border bg-white ${item.priority ? 'border-[#FFD600] shadow-lg' : 'border-[#E6D26A]'}`}>{item.imageUrl && <img src={item.imageUrl} alt="" className="aspect-[16/9] w-full object-cover"/>}<div className="p-5">{item.priority && <span className="bg-[#FFD600] px-2 py-1 text-xs font-bold">PRIORITY</span>}<p className="mt-3 text-xs font-bold uppercase text-[#806B00]">{item.sourceHost}</p><h3 className="mt-2 text-lg font-bold">{item.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6F6751]">{item.description || 'Available for local rehoming.'}</p><p className="mt-4 text-sm font-semibold">{item.deliveryFeePence ? `${money(item.deliveryFeePence)} delivery / collection` : 'Free collection'}</p>  <div className="mt-5 flex gap-2">{authClient.getAccessToken() ? <button type="button" disabled={item.status === 'claimed'} onClick={() => void claim(item)} className="bg-[#2E2E2E] px-4 py-2 text-sm font-bold text-white">{item.status === 'claimed' ? 'Reserved' : 'Claim item'}</button> : <Link to="/it/auth/login" className="bg-[#2E2E2E] px-4 py-2 text-sm font-bold text-white">Sign in to claim</Link>}<a href={item.url} target="_blank" rel="noreferrer" className="border border-[#E6D26A] px-4 py-2 text-sm font-semibold">Source ↗</a></div></div></article>)}{items.length === 0 && <p className="text-[#6F6751]">No items are currently available. Check back after the next source refresh.</p>}</div><div id="revenue" className="mt-14 grid gap-4 md:grid-cols-4">{[['Listing fees','Merchant publishing and rehoming support'],['Priority placement','Enhanced marketplace visibility'],['Delivery fees','Collection and delivery coordination'],['Premium tools','Merchant intelligence and workflow tools']].map(([title,copy]) => <article key={title} className="border-l-4 border-[#FFD600] bg-[#FFFBE6] p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6F6751]">{copy}</p></article>)}</div></div></section>
}
