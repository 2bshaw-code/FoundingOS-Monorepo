/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { BobMediaStudio, Card, DeliverySuite, EntityAnalytics, ImageBlock, InsightPanel, InventoryModule, InvoicesModule, MarketingSuite, MerchantPerformanceOverview, OperationsAnalytics, OrdersModule, OwnerMerchantManagement, PasskeySettings, PipelineAnalytics, PremiumConsole, SocialScheduler, useCompanyBrand, WeatherLocationSuite, WeatherLocationWidget, type OperationsClient } from '@founder-os/ui'
import { FoundMeatBrandMark } from '@founder-os/brand-assets'
import { authClient } from '../auth'

const tabs = [{ id: 'overview', label: 'Company Overview' }, { id: 'orders', label: 'Orders' }, { id: 'customers', label: 'Customers' }, { id: 'pipeline', label: 'Sales Pipeline' }, { id: 'intelligence', label: 'Intelligence' }, { id: 'inventory', label: 'Inventory' }, { id: 'invoices', label: 'Invoices' }, { id: 'delivery', label: 'Delivery Suite' }, { id: 'marketing', label: 'Marketing Suite' }, { id: 'social', label: 'Social Scheduler' }, { id: 'media', label: 'Bob AI Media Studio' }, { id: 'location', label: 'Weather & Location' }, { id: 'businesses', label: 'Business Management' }, { id: 'settings', label: 'Settings' }]
const multiPlatformMessaging = [
  { platform: 'WhatsApp', status: 'Live', detail: 'Live order and stock alerts are pushed to buyer groups.' },
  { platform: 'Instagram DM', status: 'Queued', detail: 'Buyer inquiries are queued for the next response cycle.' },
  { platform: 'Messenger', status: 'Live', detail: 'Supplier updates are routed to the procurement desk.' },
  { platform: 'Telegram', status: 'Queued', detail: 'Delivery windows and quality checks are coordinated in real time.' },
  { platform: 'SMS', status: 'Live', detail: 'Cold-chain updates are sent to fleet and supplier contacts.' },
  { platform: 'iMessage', status: 'Queued', detail: 'Premium supplier conversations are staged for follow-up.' },
  { platform: 'Email', status: 'Live', detail: 'Invoices, forecast warnings, and pricing updates are active.' },
  { platform: 'Web Chat', status: 'Live', detail: 'Buyers can escalate availability questions directly from the site.' },
]
type OwnerData = { consoles: unknown[]; metrics: Record<string, number>; staff: unknown[] }
type Pipeline = { leads: Array<{ stage: string; valuePence?: number; createdAt?: string }>; customers: Array<{ id: string; companyName: string; source?: string }>; metrics: Record<string, number> }

export function FoundMeatOwnerConsole() {
	const [tab, setTab] = useState('overview')
	const [data, setData] = useState<OwnerData>({ consoles: [], metrics: {}, staff: [] })
	const [connected, setConnected] = useState(false)
	const [pipeline, setPipeline] = useState<Pipeline>({ leads: [], customers: [], metrics: {} })
	const foundRetailClient: OperationsClient = { request: (path, init) => authClient.request(`/foundretail-operations${path}`, init) }
	const brandColor = useCompanyBrand(import.meta.env.VITE_FOUNDER_API_URL, authClient.getUser()?.tenantId, '#B00020')
	useEffect(() => { const load=()=>Promise.all([authClient.request<OwnerData>('/owner'),authClient.request<{ success: true; data: Pipeline }>('/foundretail-operations/owner/pipeline')]).then(([owner,pipelineResponse]) => { setData(owner);setPipeline(pipelineResponse.data);setConnected(true) }).catch(() => setConnected(false));void load();const timer=window.setInterval(()=>void load(),30_000);return()=>window.clearInterval(timer) }, [])
	return <div className="space-y-3"><button type="button" onClick={() => { window.location.href = 'http://localhost:4000/console' }} className="inline-flex items-center gap-2 rounded-full border border-[#B00020]/30 bg-white px-4 py-2 text-sm font-semibold text-[#351A3C] shadow-sm">↩ Back to FoundingOS</button><PremiumConsole brand="FoundMeat" eyebrow="Company-scoped artisan operations" title="Supplier Console" description="Inventory, orders, customers, intelligence, and company settings." tabs={tabs} activeTab={tab} onTabChange={setTab} accent={brandColor} logo={<FoundMeatBrandMark className="h-11 w-11"/>}>
		{tab === 'overview' && <><Card title="FoundMeat dashboard preview"><ImageBlock variant="foundmeat-dashboard" alt="FoundMeat console preview" caption="Supplier console preview" glow="#fb7185" /></Card><div className="grid gap-4 md:grid-cols-4"><InsightPanel title="Service" value={connected ? 'Connected' : 'Unavailable'} tone={connected ? 'positive' : 'warning'}/><InsightPanel title="Trader consoles" value={String(data.consoles.length)}/><InsightPanel title="Staff" value={String(data.staff.length)}/><InsightPanel title="Stock alerts" value={String(data.metrics.stockAlerts || 0)}/></div><Card title="Multi-platform supplier messaging"><div className="grid gap-3 md:grid-cols-2">{multiPlatformMessaging.map((item) => <div key={item.platform} className="rounded-xl border border-[var(--line)] bg-[#FFF5F7] p-3"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-[var(--ink)]">{item.platform}</span><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{item.status}</span></div><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p></div>)}</div></Card><WeatherLocationWidget client={foundRetailClient}/></>}
		{tab === 'orders' && <><OperationsAnalytics client={foundRetailClient} domain="orders"/><OrdersModule client={foundRetailClient}/></>} 
		{tab === 'customers' && <><EntityAnalytics title="Trade customer activity" items={pipeline.customers}/><Card title="Trade customers"><p className="text-sm text-[var(--muted)]">{pipeline.customers.length} buyer and trade relationships remain tenant-scoped.</p></Card></>}
		{tab === 'pipeline' && <><PipelineAnalytics leads={pipeline.leads} customers={pipeline.customers.length} title="Wholesale opportunity funnel"/><div className="grid gap-4 md:grid-cols-2"><InsightPanel title="Wholesale opportunities" value={String(pipeline.leads.length)}/><InsightPanel title="Demand signals" value={String(data.metrics.demandSignals || pipeline.customers.length)}/></div></>}
		{tab === 'intelligence' && <><MerchantPerformanceOverview client={foundRetailClient}/><EntityAnalytics title="FoundMeat intelligence signals" items={Object.entries(data.metrics).map(([name,value])=>({name,value}))}/><Card title="FoundMeat intelligence"><p className="text-sm text-[var(--muted)]">Inventory, price, and demand signals are isolated to this company.</p></Card></>}
		{tab === 'inventory' && <><OperationsAnalytics client={foundRetailClient} domain="inventory"/><InventoryModule client={foundRetailClient}/></>} 
		{tab === 'invoices' && <><OperationsAnalytics client={foundRetailClient} domain="invoices"/><InvoicesModule client={foundRetailClient}/></>} 
		{tab === 'delivery' && <><OperationsAnalytics client={foundRetailClient} domain="delivery"/><DeliverySuite client={foundRetailClient}/></>} 
		{tab === 'marketing' && <><OperationsAnalytics client={foundRetailClient} domain="marketing"/><MarketingSuite client={foundRetailClient}/></>} 
		{tab === 'social' && <><OperationsAnalytics client={foundRetailClient} domain="social"/><SocialScheduler client={foundRetailClient}/></>} 
		{tab === 'media' && <><OperationsAnalytics client={foundRetailClient} domain="media"/><BobMediaStudio client={foundRetailClient}/></>} 
		{tab === 'location' && <><OperationsAnalytics client={foundRetailClient} domain="location"/><WeatherLocationSuite client={foundRetailClient}/></>} 
		{tab === 'businesses' && <OwnerMerchantManagement client={foundRetailClient}/>} 
		{tab === 'settings' && <div className="grid gap-4 md:grid-cols-2"><Card title="Branding"><p className="text-sm text-[var(--muted)]">Purple and red FoundMeat branding is applied.</p></Card><Card title="Module access"><p className="text-sm text-[var(--muted)]">The platform controls company access and permissions.</p></Card><PasskeySettings client={authClient}/></div>}
	</PremiumConsole></div>
}
