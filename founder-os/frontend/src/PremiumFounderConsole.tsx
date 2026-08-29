/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { AnalyticsMetricCard, BobMediaStudio, Card, DeliverySuite, EntityAnalytics, ExternalLinkCard, FunnelChart, FounderOsLogo, HeatMap, ImageBlock, InsightPanel, InventoryModule, InvoicesModule, MarketingSuite, OperationsAnalytics, OrdersModule, PasskeySettings, PipelineAnalytics, PremiumConsole, ScrapingControl, SocialScheduler, Table, WaterfallChart, WeatherLocationSuite, WeatherLocationWidget, type OperationsClient, type ScrapingClient } from '@founder-os/ui'
import { MessagingAdapter, type MessagingPlatform } from '@founder-os/ui/messaging'
import { authClient } from './auth'
import { CompanyManagement } from './CompanyManagement'

type Lead = { id: string; companyName: string; itemTitle?: string; source: string; stage: string; valuePence: number; createdAt: string }
type Customer = { id: string; companyName: string; contactName?: string; email?: string; source?: string }
type Order = { id: string; reference: string; status: string; totalPence: number; createdAt: string }
type Message = { id: string; channel: string; direction: string; body: string; createdAt: string }
type ScrapedLink = { id: string; url: string; sourceHost: string; title: string; description?: string | null; imageUrl?: string | null }
type Pipeline = { leads: Lead[]; customers: Customer[]; orders: Order[]; messages: Message[]; metrics: { leads: number; customers: number; openOrders: number; messages: number; pipelineValuePence: number } }
type Company = { id: string; name: string; active: boolean }

const tabs = [
  { id: 'overview', label: 'Overview' }, { id: 'sales', label: 'Sales' }, { id: 'customers', label: 'Customers' },
  { id: 'pipeline', label: 'Sales Pipeline' }, { id: 'intelligence', label: 'Intelligence' }, { id: 'operations', label: 'Operations' },
  { id: 'inventory', label: 'Inventory' }, { id: 'orders', label: 'Orders' }, { id: 'invoices', label: 'Invoices' }, { id: 'delivery', label: 'Delivery Suite' },
  { id: 'marketing', label: 'Marketing Suite' }, { id: 'social', label: 'Social Scheduler' }, { id: 'media', label: 'FoundAI Media Studio' }, { id: 'location', label: 'Weather & Location' },
  { id: 'companies', label: 'Company Overview' }, { id: 'settings', label: 'Settings' },
]
const money = (pence = 0) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)
const multiPlatformMessaging = [
  { platform: 'WhatsApp', status: 'Live', detail: 'Ecosystem alerts and customer prompts are live across all brand channels.' },
  { platform: 'Instagram DM', status: 'Queued', detail: 'Brand inquiries are queued for validation and response automation.' },
  { platform: 'Messenger', status: 'Live', detail: 'Customer journeys are coordinated across retail and talent funnels.' },
  { platform: 'Telegram', status: 'Queued', detail: 'Operational and delivery updates are staged before release windows.' },
  { platform: 'SMS', status: 'Live', detail: 'Short-form campaigns are active for conversions and reminders.' },
  { platform: 'iMessage', status: 'Queued', detail: 'Premium VIP outreach is prepared for executive follow-up.' },
  { platform: 'Email', status: 'Live', detail: 'Transactional and lifecycle messaging remains active across the platform.' },
  { platform: 'Web Chat', status: 'Live', detail: 'Website visitors are routed into tailored brand conversations.' },
]

export function PremiumFounderConsole() {
  const [tab, setTab] = useState('overview')
  const [pipeline, setPipeline] = useState<Pipeline>({ leads: [], customers: [], orders: [], messages: [], metrics: { leads: 0, customers: 0, openOrders: 0, messages: 0, pipelineValuePence: 0 } })
  const [links, setLinks] = useState<ScrapedLink[]>([])
  const [services, setServices] = useState({ foundretail: false, foundcrypto: false, foundmeat: false, foundtalent: false })
  const [notice, setNotice] = useState('')
  const [companies, setCompanies] = useState<Company[]>([])
  const [companyId, setCompanyId] = useState('all')

  const load = async () => {
    try {
      const [ecosystem, foundthis, companyResponse] = await Promise.all([
        authClient.request<{ success: true; data: { foundretail: { available: boolean; data?: Pipeline }; foundcrypto: { available: boolean }; foundmeat: { available: boolean }; foundtalent: { available: boolean } } }>('/insights/ecosystem'),
       authClient.request<{ success: true; data: ScrapedLink[] }>('/insights/foundthis'),
        authClient.request<{ success: true; data: Company[] }>('/companies'),
      ])
      if (ecosystem.data.foundretail.data) setPipeline(ecosystem.data.foundretail.data)
      setServices({ foundretail: ecosystem.data.foundretail.available, foundcrypto: ecosystem.data.foundcrypto.available, foundmeat: ecosystem.data.foundmeat.available, foundtalent: ecosystem.data.foundtalent.available })
      setLinks(foundthis.data)
      setCompanies(companyResponse.data.filter((company) => company.active))
      setNotice('')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Control Centre data unavailable') }
  }
  const operationsClient: OperationsClient = { request: async <T,>(path: string, init: RequestInit = {}) => {
    const method = String(init.method || 'GET').toUpperCase()
    const fanOut = companyId === 'all' && method === 'POST' && ['/marketing/campaigns', '/social/posts', '/media/generate'].includes(path)
    const targets = fanOut ? companies.map((company) => company.id) : [companyId === 'all' ? companies[0]?.id : companyId]
    if (method === 'POST' && !targets[0]) throw new Error('Create an active company before adding operational data')
    const requests = targets.map((tenantId) => {
      const payload = init.body ? JSON.parse(String(init.body)) : {}
      const headers = new Headers(init.headers)
      if (companyId !== 'all') headers.set('X-Tenant-Id', tenantId)
      return authClient.request<T>(`/operations${path}`, { ...init, headers, body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify({ ...payload, tenantId }) })
    })
    const responses = await Promise.all(requests)
    return responses[0]
  } }
  const scrapingClient: ScrapingClient = { request: (path, init) => authClient.request(`/scraping${path}`, init) }
  useEffect(() => { void load(); const timer = window.setInterval(() => void load(), 30_000); return () => window.clearInterval(timer) }, [])
  const updateLead = async (leadId: string, action: 'convert' | 'qualify') => {
    try {
      await authClient.request(action === 'convert' ? `/pipeline/leads/${leadId}/convert` : `/pipeline/leads/${leadId}`, { method: action === 'convert' ? 'POST' : 'PATCH', body: action === 'convert' ? undefined : JSON.stringify({ stage: 'qualified' }) })
      await load()
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Pipeline update failed') }
  }
  const triggerMessaging = async (platform: MessagingPlatform) => {
    try {
      const result = await MessagingAdapter.sendMessage(platform, {
        recipient: 'founder@founder-os.local',
        message: `FoundingOS automation pulse for ${platform}.`,
        template: 'daily-summary',
        metadata: { tenantId: companyId, source: 'FoundingOS console' },
      })
      setNotice(`${platform.toUpperCase()}: ${result.status} (${result.messageId})`)
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Messaging automation failed') }
  }

  return <PremiumConsole brand="FoundingOS" eyebrow="Master control centre" title="FoundingOS" description="Commercial intelligence, company control, and ecosystem operations." tabs={tabs} activeTab={tab} onTabChange={setTab} accent="#006CFF" logo={<FounderOsLogo className="h-11 w-11"/>}>
    {notice && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{notice}</p>}
    {['intelligence','inventory','orders','invoices','delivery','marketing','social','media','location'].includes(tab) && <label className="flex max-w-sm items-center gap-3 text-sm font-semibold">Company scope<select value={companyId} onChange={(event) => setCompanyId(event.target.value)} className="flex-1 border border-[#DCE3EC] bg-white px-3 py-2"><option value="all">All companies</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>}
    {tab === 'overview' && <><Card title="FoundingOS dashboard preview"><ImageBlock variant="founder-dashboard" alt="FoundingOS console preview" caption="FoundingOS control centre" glow="#006CFF" /></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"><InsightPanel title="Pipeline value" value={money(pipeline.metrics.pipelineValuePence)} detail={`${pipeline.metrics.leads} active leads`} tone="positive"/><InsightPanel title="Customers" value={String(pipeline.metrics.customers)} detail="Converted across company modules"/><InsightPanel title="Open orders" value={String(pipeline.metrics.openOrders)} detail="FoundingOS operational source"/><InsightPanel title="FoundCrypto status" value={services.foundcrypto ? 'Online' : 'Offline'} detail="Crypto analysis and execution"/><InsightPanel title="FoundThis intelligence" value={String(links.length)} detail="Source-linked items"/></div><div className="grid gap-5 lg:grid-cols-2"><Card title="Multi-platform messaging"><div className="grid gap-3 md:grid-cols-2">{multiPlatformMessaging.map((item) => <div key={item.platform} className="rounded-xl border border-[var(--line)] bg-[#F2F7FF] p-3"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-[var(--ink)]">{item.platform}</span><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{item.status}</span></div><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p></div>)}</div></Card><Card title="Messaging automation"><div className="space-y-4"><p className="text-sm leading-6 text-[#68778A]">Trigger the same outbound workflow across WhatsApp, SMS, Telegram, Messenger, Instagram DM, Email, Slack, and RCS.</p><div className="flex flex-wrap gap-2">{(['whatsapp','sms','telegram','messenger','instagram','email','slack','rcs'] as const).map((platform) => <button key={platform} type="button" onClick={() => void triggerMessaging(platform)} className="rounded-full border border-[#DCE3EC] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1E1F22] transition hover:border-[#006CFF] hover:text-[#006CFF]">{platform}</button>)}</div></div></Card></div><div className="grid gap-5 lg:grid-cols-2"><Card title="Ecosystem routing"><ul className="space-y-3 text-sm text-[var(--muted)]"><li><strong className="text-[var(--ink)]">FoundRetail</strong> · Merchant and customer messaging pipelines.</li><li><strong className="text-[var(--ink)]">FoundCrypto</strong> · Trader notifications and execution triggers.</li><li><strong className="text-[var(--ink)]">FoundThis</strong> · Intelligence and sourcing alerts.</li><li><strong className="text-[var(--ink)]">FoundMeat</strong> · Supplier and logistics messaging.</li><li><strong className="text-[var(--ink)]">FoundTalent</strong> · Recruiting, screeners, and interview updates.</li></ul></Card><WeatherLocationWidget client={operationsClient}/></div></>}
    {tab === 'sales' && <><div className="grid gap-4 md:grid-cols-4"><AnalyticsMetricCard title="Pipeline" value={money(pipeline.metrics.pipelineValuePence)} trend={pipeline.leads.length}/><AnalyticsMetricCard title="Orders" value={String(pipeline.orders.length)}/><AnalyticsMetricCard title="Converted leads" value={String(pipeline.leads.filter((lead) => lead.stage === 'converted').length)}/><AnalyticsMetricCard title="Order revenue" value={money(pipeline.orders.reduce((sum,order)=>sum+order.totalPence,0))}/></div><Card title="Revenue flow"><WaterfallChart data={[{label:'Pipeline',value:pipeline.metrics.pipelineValuePence/100},{label:'Converted',value:pipeline.leads.filter(lead=>lead.stage==='converted').reduce((sum,lead)=>sum+lead.valuePence,0)/100},{label:'Orders',value:pipeline.orders.reduce((sum,order)=>sum+order.totalPence,0)/100}]}/></Card><Card title="Recent orders"><Table headers={['Reference','Status','Value','Created']}><>{pipeline.orders.map((order) => <tr key={order.id}><td className="px-4 py-3 font-semibold">{order.reference}</td><td className="px-4 py-3">{order.status}</td><td className="px-4 py-3">{money(order.totalPence)}</td><td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</></Table></Card></>}
    {tab === 'customers' && <><EntityAnalytics title="Customers by source" items={pipeline.customers} labelKey="source"/><Card title="Customer portfolio"><Table headers={['Company','Contact','Email','Source']}><>{pipeline.customers.map((customer) => <tr key={customer.id}><td className="px-4 py-3 font-semibold">{customer.companyName}</td><td className="px-4 py-3">{customer.contactName || '—'}</td><td className="px-4 py-3">{customer.email || '—'}</td><td className="px-4 py-3">{customer.source || 'Direct'}</td></tr>)}</></Table></Card></>}
    {tab === 'pipeline' && <><PipelineAnalytics leads={pipeline.leads} customers={pipeline.customers.length}/><Card title="Sales pipeline"><Table headers={['Lead','Source','Stage','Value','Actions']}><>{pipeline.leads.map((lead) => <tr key={lead.id}><td className="px-4 py-3"><strong>{lead.companyName}</strong><span className="block text-xs text-[var(--muted)]">{lead.itemTitle || 'Commercial opportunity'}</span></td><td className="px-4 py-3">{lead.source}</td><td className="px-4 py-3">{lead.stage}</td><td className="px-4 py-3">{money(lead.valuePence)}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => void updateLead(lead.id, 'qualify')} className="border border-[var(--line)] px-3 py-1 text-xs font-semibold">Qualify</button><button onClick={() => void updateLead(lead.id, 'convert')} disabled={lead.stage === 'converted'} className="bg-[#006CFF] px-3 py-1 text-xs font-semibold text-white">Convert</button></div></td></tr>)}</></Table></Card></>}
    {tab === 'intelligence' && <div className="foundthis-brand-scope space-y-5"><ScrapingControl client={scrapingClient} tenantId={companyId === 'all' ? undefined : companyId} founder/><div className="grid gap-5 lg:grid-cols-2"><Card title="Intelligence conversion funnel"><FunnelChart data={[{label:'Scraped items',value:links.length},{label:'Merchant sources',value:new Set(links.map(link=>link.sourceHost)).size},{label:'FoundThis leads',value:pipeline.leads.filter(lead=>lead.source==='foundthis').length},{label:'Customers',value:pipeline.customers.filter(customer=>customer.source==='foundthis').length}]}/></Card><Card title="Merchant source hotspots"><HeatMap data={Object.entries(links.reduce<Record<string,number>>((items,link)=>({...items,[link.sourceHost]:(items[link.sourceHost]||0)+1}),{})).map(([label,value])=>({label,value}))}/></Card></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{links.map((link) => <ExternalLinkCard key={link.id} title={link.title} description={link.description} source={link.sourceHost} href={link.url} imageUrl={link.imageUrl}/>)}{links.length === 0 && <Card>No FoundThis intelligence is available yet.</Card>}</div></div>}
    {tab === 'operations' && <><div className="grid gap-4 md:grid-cols-4"><InsightPanel title="FoundRetail" value={services.foundretail ? 'Connected' : 'Unavailable'} tone={services.foundretail ? 'positive' : 'warning'}/><InsightPanel title="FoundThis" value="Connected" tone="positive"/><InsightPanel title="FoundMeat" value={services.foundmeat ? 'Connected' : 'Unavailable'} tone={services.foundmeat ? 'positive' : 'warning'}/><InsightPanel title="Messages" value={String(pipeline.metrics.messages)} detail="FoundingOS communication events"/></div><Card title="Multi-platform operation routing"><div className="grid gap-3 md:grid-cols-2">{multiPlatformMessaging.map((item) => <div key={`${item.platform}-ops`} className="rounded-xl border border-[var(--line)] bg-[#F2F7FF] p-3"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-[var(--ink)]">{item.platform}</span><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{item.status}</span></div><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p></div>)}</div></Card></>}
    {tab === 'inventory' && <><OperationsAnalytics client={operationsClient} domain="inventory"/><InventoryModule client={operationsClient}/></>} 
    {tab === 'orders' && <><OperationsAnalytics client={operationsClient} domain="orders"/><OrdersModule client={operationsClient}/></>} 
    {tab === 'invoices' && <><OperationsAnalytics client={operationsClient} domain="invoices"/><InvoicesModule client={operationsClient}/></>} 
    {tab === 'delivery' && <><OperationsAnalytics client={operationsClient} domain="delivery"/><DeliverySuite client={operationsClient}/></>} 
    {tab === 'marketing' && <><OperationsAnalytics client={operationsClient} domain="marketing"/><MarketingSuite client={operationsClient}/></>} 
    {tab === 'social' && <><OperationsAnalytics client={operationsClient} domain="social"/><SocialScheduler client={operationsClient}/></>} 
    {tab === 'media' && <><OperationsAnalytics client={operationsClient} domain="media"/><BobMediaStudio client={operationsClient}/></>} 
    {tab === 'location' && <><OperationsAnalytics client={operationsClient} domain="location"/><WeatherLocationSuite client={operationsClient}/></>} 
    {tab === 'companies' && <CompanyManagement/>}
    {tab === 'settings' && <div className="grid gap-5 lg:grid-cols-2"><Card title="Control Centre refresh"><p className="text-sm text-[var(--muted)]">Operational and intelligence feeds refresh every 30 seconds.</p></Card><Card title="Security"><p className="text-sm text-[var(--muted)]">All commands use unified bearer authentication and Founder-only APIs.</p></Card><PasskeySettings client={authClient}/></div>}
  </PremiumConsole>
}
