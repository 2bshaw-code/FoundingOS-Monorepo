/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { BobMediaStudio, Card, DeliverySuite, EntityAnalytics, ImageBlock, InsightPanel, InventoryModule, InvoicesModule, MarketingSuite, MerchantPerformanceOverview, OperationsAnalytics, OrdersModule, OwnerMerchantManagement, PasskeySettings, PipelineAnalytics, PremiumConsole, ScrapingControl, SocialScheduler, useCompanyBrand, WeatherLocationSuite, WeatherLocationWidget, type OperationsClient } from '@founder-os/ui'
import { FoundThisBrandMark } from '@founder-os/brand-assets'
import { authClient } from '../auth'
import { ScrapedLinksPanel } from './ScrapedLinksPanel'

type Revenue = { listingFeesPence: number; placementFeesPence: number; deliveryFeesPence: number; premiumFeesPence: number }
type Pipeline = { leads: Array<{ stage: string; valuePence?: number; createdAt?: string }>; customers: Array<{ id: string; companyName: string; source?: string }>; metrics: Record<string, number> }
const tabs = [{ id: 'overview', label: 'Company Overview' }, { id: 'orders', label: 'Orders' }, { id: 'customers', label: 'Customers' }, { id: 'pipeline', label: 'Sales Pipeline' }, { id: 'intelligence', label: 'Intelligence' }, { id: 'inventory', label: 'Inventory' }, { id: 'invoices', label: 'Invoices' }, { id: 'delivery', label: 'Delivery Suite' }, { id: 'marketing', label: 'Marketing Suite' }, { id: 'social', label: 'Social Scheduler' }, { id: 'media', label: 'Bob AI Media Studio' }, { id: 'location', label: 'Weather & Location' }, { id: 'businesses', label: 'Business Management' }, { id: 'settings', label: 'Settings' }]
const money = (pence = 0) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)
const multiPlatformMessaging = [
  { platform: 'WhatsApp', status: 'Live', detail: 'Marketplace alerts are sent to dealers with the latest placement status.' },
  { platform: 'Instagram DM', status: 'Queued', detail: 'Buyer inquiries are queued through the business response flow.' },
  { platform: 'Messenger', status: 'Live', detail: 'Priority placement follow-ups are delivered to active businesses.' },
  { platform: 'Telegram', status: 'Queued', detail: 'Marketplace updates are staged for the next dispatch cycle.' },
  { platform: 'SMS', status: 'Live', detail: 'Listing and conversion reminders are sent to high-intent buyers.' },
  { platform: 'iMessage', status: 'Queued', detail: 'Premium outreach is being prepared for launch weeks.' },
  { platform: 'Email', status: 'Live', detail: 'Listings, renewal notices, and delivery updates remain active.' },
  { platform: 'Web Chat', status: 'Live', detail: 'Web visitors are guided into marketplace conversion flows.' },
]

export function FoundThisOwnerConsole() {
	const [tab, setTab] = useState('overview')
	const [revenue, setRevenue] = useState<Revenue>({ listingFeesPence: 0, placementFeesPence: 0, deliveryFeesPence: 0, premiumFeesPence: 0 })
	const [pipeline, setPipeline] = useState<Pipeline>({ leads: [], customers: [], metrics: {} })
	useEffect(() => { const load=()=>Promise.all([authClient.request<{ success: true; data: Revenue }>('/marketplace/revenue'),authClient.request<{ success: true; data: Pipeline }>('/foundretail-operations/owner/pipeline')]).then(([revenueResponse,pipelineResponse]) => { setRevenue(revenueResponse.data);setPipeline(pipelineResponse.data) }).catch(() => undefined);void load();const timer=window.setInterval(()=>void load(),30_000);return()=>window.clearInterval(timer) }, [])
	const total = Object.values(revenue).reduce((sum, value) => sum + value, 0)
	const foundRetailClient: OperationsClient = { request: (path, init) => authClient.request(`/foundretail-operations${path}`, init) }
	const brandColor = useCompanyBrand(import.meta.env.VITE_FOUNDER_API_URL, authClient.getUser()?.tenantId, '#FFD600')
	const scrapingClient = { request: <T,>(path: string, init?: RequestInit) => authClient.request<T>(`/scraping${path}`, init) }
	return <div className="space-y-3"><button type="button" onClick={() => { window.location.href = 'http://localhost:4000/console' }} className="inline-flex items-center gap-2 rounded-full border border-[#FFD600]/30 bg-white px-4 py-2 text-sm font-semibold text-[#2E2E2E] shadow-sm">↩ Back to FoundingOS</button><PremiumConsole brand="FoundThis" eyebrow="Company-scoped marketplace" title="Intelligence Console" description="Rehoming, marketplace revenue, intelligence, and company operations." tabs={tabs} activeTab={tab} onTabChange={setTab} accent={brandColor} logo={<FoundThisBrandMark className="h-11 w-11"/>}>
		{tab === 'overview' && <><Card title="FoundThis dashboard preview"><ImageBlock variant="foundit-dashboard" alt="FoundThis console preview" caption="Marketplace console preview" glow="#FFD600" /></Card><div className="grid gap-4 md:grid-cols-4"><InsightPanel title="Marketplace revenue" value={money(total)} tone="positive"/><InsightPanel title="Listing fees" value={money(revenue.listingFeesPence)}/><InsightPanel title="Priority placement" value={money(revenue.placementFeesPence)}/><InsightPanel title="Delivery / collection" value={money(revenue.deliveryFeesPence)}/></div><div className="grid gap-5 lg:grid-cols-2"><Card title="Multi-platform marketplace messaging"><div className="grid gap-3 md:grid-cols-2">{multiPlatformMessaging.map((item) => <div key={item.platform} className="rounded-xl border border-[var(--line)] bg-[#FFFBEA] p-3"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-[var(--ink)]">{item.platform}</span><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{item.status}</span></div><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p></div>)}</div></Card><Card title="Marketplace routing"><ul className="space-y-3 text-sm text-[var(--muted)]"><li><strong className="text-[var(--ink)]">Listings</strong> · Active merchant inventory updates and placement reminders.</li><li><strong className="text-[var(--ink)]">Priority</strong> · Premium placement flows and responsive merchant follow-up.</li><li><strong className="text-[var(--ink)]">Delivery</strong> · Dispatch coordination between marketplace and logistics flows.</li></ul></Card></div><WeatherLocationWidget client={foundRetailClient}/></>}
		{tab === 'orders' && <><OperationsAnalytics client={foundRetailClient} domain="orders"/><OrdersModule client={foundRetailClient}/></>} 
		{tab === 'customers' && <><EntityAnalytics title="Marketplace customer activity" items={pipeline.customers}/><Card title="Marketplace customers"><p className="text-sm text-[var(--muted)]">{pipeline.customers.length} tenant-scoped customers synchronized through FoundRetail.</p></Card></>}
		{tab === 'pipeline' && <><PipelineAnalytics leads={pipeline.leads} customers={pipeline.customers.length} title="Business lead conversion"/><div className="grid gap-4 md:grid-cols-2"><InsightPanel title="Business leads" value={String(pipeline.leads.length)} detail="Business-backed scraped items are pushed to FoundRetail." tone="positive"/><InsightPanel title="Customer conversion" value={String(pipeline.customers.length)} detail="Deduplicated customers remain FoundRetail-owned."/></div></>}
		{tab === 'intelligence' && <div className="space-y-5"><MerchantPerformanceOverview client={foundRetailClient}/><ScrapingControl client={scrapingClient}/><ScrapedLinksPanel canManage/></div>}
		{tab === 'inventory' && <><OperationsAnalytics client={foundRetailClient} domain="inventory"/><InventoryModule client={foundRetailClient}/></>} 
		{tab === 'invoices' && <><OperationsAnalytics client={foundRetailClient} domain="invoices"/><InvoicesModule client={foundRetailClient}/></>} 
		{tab === 'delivery' && <><OperationsAnalytics client={foundRetailClient} domain="delivery"/><DeliverySuite client={foundRetailClient}/></>} 
		{tab === 'marketing' && <><OperationsAnalytics client={foundRetailClient} domain="marketing"/><MarketingSuite client={foundRetailClient}/></>} 
		{tab === 'social' && <><OperationsAnalytics client={foundRetailClient} domain="social"/><SocialScheduler client={foundRetailClient}/></>} 
		{tab === 'media' && <><OperationsAnalytics client={foundRetailClient} domain="media"/><BobMediaStudio client={foundRetailClient}/></>} 
		{tab === 'location' && <><OperationsAnalytics client={foundRetailClient} domain="location"/><WeatherLocationSuite client={foundRetailClient}/></>} 
		{tab === 'businesses' && <OwnerMerchantManagement client={foundRetailClient}/>}
		{tab === 'settings' && <div className="grid gap-4 md:grid-cols-2"><Card title="Marketplace branding"><p className="text-sm text-[var(--muted)]">Official FoundThis yellow is applied to this company console.</p></Card><Card title="Revenue controls"><p className="text-sm text-[var(--muted)]">Listing, placement, delivery, and premium-tool fees are stored per item.</p></Card><PasskeySettings client={authClient}/></div>}
	</PremiumConsole></div>
}
