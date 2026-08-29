/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState, type ChangeEvent } from 'react'
import { BobMediaStudio, Card, DeliverySuite, EntityAnalytics, ImageBlock, InsightPanel, InventoryModule, InvoicesModule, MarketingSuite, MerchantPerformanceOverview, OperationsAnalytics, OrdersModule, OwnerMerchantManagement, PasskeySettings, PipelineAnalytics, PremiumConsole, SocialScheduler, Table, useCompanyBrand, WeatherLocationSuite, WeatherLocationWidget, FoundRetailLogo } from '@founder-os/ui'
import { authClient } from '../auth'

type Lead = { id: string; companyName: string; itemTitle?: string; source: string; stage: string; valuePence: number }
type Customer = { id: string; companyName: string; contactName?: string; email?: string; source?: string }
type Order = { id: string; reference: string; status: string; totalPence: number }
type Pipeline = { leads: Lead[]; customers: Customer[]; orders: Order[]; messages: unknown[]; metrics: { leads: number; customers: number; openOrders: number; messages: number; pipelineValuePence: number } }
type UploadItem = { name: string; kind: string; size: string }

type InboxThread = {
 id: string
 channel: string
 customer: string
 preview: string
 status: string
 sentiment: string
 time: string
 unread: number
}

type MediaItem = {
 id: string
 title: string
 kind: 'Image' | 'Video' | 'Voice Note' | 'Document'
 source: string
 summary: string
 accent: string
}

const tabs = [
 { id: 'overview', label: 'Overview' },
 { id: 'messaging', label: 'Messaging' },
 { id: 'upload', label: 'Upload' },
 { id: 'media', label: 'Media Viewer' },
 { id: 'orders', label: 'Orders' },
 { id: 'inventory', label: 'Inventory' },
 { id: 'staff', label: 'Staff' },
 { id: 'intelligence', label: 'Retail Intelligence' },
 { id: 'businesses', label: 'Business Management' },
 { id: 'settings', label: 'Settings' },
]

const money = (pence = 0) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)

const inboxThreads: InboxThread[] = [
 { id: 'whatsapp-1', channel: 'WhatsApp', customer: 'Alicia W.', preview: 'Hi, my order was delivered but the salad box was missing the dressing pack.', status: 'New', sentiment: 'Needs response', time: '2m ago', unread: 3 },
 { id: 'ig-2', channel: 'Instagram DM', customer: 'M. Baker', preview: 'Can you send a photo of the new product bundle and pricing?', status: 'Awaiting reply', sentiment: 'Warm lead', time: '12m ago', unread: 1 },
 { id: 'messenger-3', channel: 'Facebook Messenger', customer: 'Harper & Co.', preview: 'I need a delivery update before 6pm for the bakery restock.', status: 'Escalated', sentiment: 'Urgent', time: '28m ago', unread: 2 },
 { id: 'sms-4', channel: 'SMS', customer: 'J. Silva', preview: 'Please confirm if the replacement order is on the same truck.', status: 'Resolved', sentiment: 'Positive', time: '44m ago', unread: 0 },
 { id: 'telegram-5', channel: 'Telegram', customer: 'Northside Foods', preview: 'Can the order send the invoice and product photo set to the buyer?', status: 'Pending', sentiment: 'Business', time: '1h ago', unread: 1 },
 { id: 'email-6', channel: 'Email', customer: 'R. Adams', preview: 'Attached receipt and issue with the refill delivery from this morning.', status: 'Review', sentiment: 'Action item', time: '2h ago', unread: 0 },
]

const mediaItems: MediaItem[] = [
 { id: 'media-1', title: 'Damaged doorstep delivery', kind: 'Image', source: 'Customer sent via WhatsApp', summary: 'Customer submitted photos showing a broken box and delayed item seal.', accent: '#25D366' },
 { id: 'media-2', title: 'Product photo request', kind: 'Image', source: 'Instagram DM', summary: 'Customer asks for a close-up of the artisan soup set with pricing markers.', accent: '#F77737' },
 { id: 'media-3', title: 'Voice note order update', kind: 'Voice Note', source: 'In-App Chat', summary: 'Customer confirms new delivery slot and asks for same-day confirmation.', accent: '#1D4ED8' },
 { id: 'media-4', title: 'Receipt dispute', kind: 'Document', source: 'Email', summary: 'Customer attached receipt and order number for a refund review workflow.', accent: '#A855F7' },
]

const messageExamples = [
 { type: 'Customer message', example: 'Hi, I received my order but one product arrived damaged. Can you send a replacement and a photo of the new pack?' },
 { type: 'Staff reply', example: 'Thanks for flagging this — I have opened a replacement workflow and an agent will send a fresh pack within the next 2 hours.' },
 { type: 'Media flow', example: 'Customer uploads a countertop photo → retail staff reviews item condition → replacement is queued to dispatch.' },
]

const uploadTypes = ['Images', 'Videos', 'PDFs', 'Receipts', 'Product photos']

export function FoundRetailOwnerConsole() {
	const [tab, setTab] = useState('overview')
	const [data, setData] = useState<Pipeline>({ leads: [], customers: [], orders: [], messages: [], metrics: { leads: 0, customers: 0, openOrders: 0, messages: 0, pipelineValuePence: 0 } })
	const [message, setMessage] = useState('')
	const [uploads, setUploads] = useState<UploadItem[]>([
   { name: 'delivery-photo-1824.jpg', kind: 'Image', size: '2.4 MB' },
   { name: 'receipt-rcv-2209.pdf', kind: 'PDF', size: '860 KB' },
   { name: 'product-closeup.mp4', kind: 'Video', size: '5.1 MB' },
 ])
	const [selectedMediaId, setSelectedMediaId] = useState(mediaItems[0].id)
	const brandColor = useCompanyBrand(import.meta.env.VITE_FOUNDER_API_URL, authClient.getUser()?.tenantId, '#25D366')
	const activeMedia = mediaItems.find((item) => item.id === selectedMediaId) ?? mediaItems[0]

	const load = async () => { try { setData((await authClient.request<{ success: true; data: Pipeline }>('/owner/pipeline')).data); setMessage('') } catch (error) { setMessage(error instanceof Error ? error.message : 'FoundRetail data unavailable') } }
	useEffect(() => { void load(); const timer = window.setInterval(() => void load(), 30_000); return () => window.clearInterval(timer) }, [])
	const act = async (leadId: string, convert: boolean) => { try { await authClient.request(convert ? `/leads/${leadId}/convert` : `/leads/${leadId}`, { method: convert ? 'POST' : 'PATCH', body: convert ? undefined : JSON.stringify({ stage: 'qualified' }) }); await load() } catch (error) { setMessage(error instanceof Error ? error.message : 'Lead update failed') } }
	const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
   const files = Array.from(event.target.files ?? [])
   if (files.length === 0) return
   const nextUploads = files.map((file) => ({
     name: file.name,
     kind: file.type.startsWith('image/') ? 'Image' : file.type.startsWith('video/') ? 'Video' : file.type.includes('pdf') ? 'PDF' : 'Document',
     size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
   }))
   setUploads((previous) => [...nextUploads, ...previous].slice(0, 12))
   event.target.value = ''
 }

  return <div className="space-y-3"><button type="button" onClick={() => { window.location.href = 'http://localhost:4000/console' }} className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-white px-4 py-2 text-sm font-semibold text-[#172126] shadow-sm">↩ Back to FoundingOS</button><PremiumConsole brand="FoundRetail" eyebrow="Company-scoped operations" title="Retail Manager Console" description="Messaging, upload flows, media review, orders, inventory, staff, and intelligent retail operations." tabs={tabs} activeTab={tab} onTabChange={setTab} accent={brandColor} logo={<FoundRetailLogo className="h-11 w-11"/>}>
		{message && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</p>}
		{tab === 'overview' && <>
     <Card title="FoundRetail dashboard preview"><ImageBlock variant="foundretail-dashboard" alt="FoundRetail console preview" caption="Retail manager control centre" glow="#25D366" /></Card>
     <div className="grid gap-4 md:grid-cols-4">
       <InsightPanel title="Pipeline" value={money(data.metrics.pipelineValuePence)} tone="positive"/>
       <InsightPanel title="Leads" value={String(data.metrics.leads)}/>
       <InsightPanel title="Customers" value={String(data.metrics.customers)}/>
       <InsightPanel title="Open orders" value={String(data.metrics.openOrders)}/>
     </div>
     <div className="grid gap-5 lg:grid-cols-2">
       <Card title="Unified Messaging Inbox">
         <div className="space-y-3">
           {inboxThreads.map((thread) => <div key={thread.id} className="rounded-xl border border-[var(--line)] bg-[#F6FAF8] p-3">
             <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--ink)]">{thread.channel}</p><p className="text-xs text-[var(--muted)]">{thread.customer}</p></div><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{thread.status}</span></div>
             <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{thread.preview}</p>
             <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--muted)]"><span>{thread.time}</span><span>{thread.unread ? `${thread.unread} unread` : 'No unread'}</span></div>
           </div>)}
         </div>
       </Card>
       <Card title="Message examples">
         <div className="space-y-3">
           {messageExamples.map((example) => <div key={example.type} className="rounded-xl border border-[var(--line)] bg-white p-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#25D366]">{example.type}</p><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{example.example}</p></div>)}
         </div>
       </Card>
     </div>
     <div className="grid gap-5 lg:grid-cols-2">
       <Card title="Upload queue">
         <div className="space-y-2">{uploads.map((item) => <div key={`${item.name}-${item.size}`} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[#F7FAFF] px-3 py-2 text-sm"><div><p className="font-medium text-[var(--ink)]">{item.name}</p><p className="text-[var(--muted)]">{item.kind} · {item.size}</p></div><span className="rounded border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Ready</span></div>)} </div>
       </Card>
       <Card title="Incoming media viewer">
         <div className="rounded-xl border border-[var(--line)] bg-[#F9FAFC] p-4">
           <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-[var(--ink)]">{activeMedia.title}</p><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{activeMedia.kind}</span></div>
           <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-[#DCE3EC] bg-white text-xs font-semibold uppercase tracking-[0.16em] text-[#25D366]" style={{ background: `linear-gradient(135deg, ${activeMedia.accent}22, rgba(255,255,255,1))` }}>{activeMedia.kind}</div>
           <p className="mt-3 text-sm text-[var(--muted)]">{activeMedia.summary}</p>
           <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">{activeMedia.source}</p>
         </div>
       </Card>
     </div>
     <WeatherLocationWidget client={authClient}/>
   </>}

   {tab === 'messaging' && <div className="space-y-5">
     <Card title="Unified Messaging Inbox">
       <div className="mb-4 flex flex-wrap gap-2">{['All','WhatsApp','Instagram DM','Facebook Messenger','Telegram','SMS','iMessage','Email','Web Chat','In-App Chat'].map((channel) => <button key={channel} type="button" className="rounded-full border border-[#DCE3EC] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{channel}</button>)}</div>
       <div className="space-y-3">{inboxThreads.map((thread) => <div key={thread.id} className="grid gap-3 rounded-2xl border border-[var(--line)] bg-[#F9FBFF] p-4 md:grid-cols-[1.2fr_0.8fr_0.5fr] md:items-center"><div><p className="text-sm font-semibold text-[var(--ink)]">{thread.channel}</p><p className="mt-1 text-xs text-[var(--muted)]">{thread.customer}</p><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{thread.preview}</p></div><div className="rounded-xl border border-[#DCE3EC] bg-white p-3 text-sm"><p className="font-semibold text-[var(--ink)]">{thread.status}</p><p className="mt-1 text-[var(--muted)]">{thread.sentiment}</p></div><div className="text-right text-xs text-[var(--muted)]"><p>{thread.time}</p><p className="mt-1">{thread.unread ? `${thread.unread} unread` : 'read'}</p></div></div>)}</div>
     </Card>
     <Card title="Message examples">
       <div className="grid gap-4 md:grid-cols-3">{messageExamples.map((example) => <div key={example.type} className="rounded-xl border border-[var(--line)] bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#25D366]">{example.type}</p><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{example.example}</p></div>)}</div>
     </Card>
   </div>}

   {tab === 'upload' && <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
     <Card title="Upload customer media and documents">
       <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-[#DCE3EC] bg-[#F9FBFF] p-6 text-center transition hover:border-[#25D366]">
         <input type="file" className="hidden" multiple accept="image/*,video/*,.pdf,.doc,.docx" onChange={handleUpload} />
         <p className="text-lg font-semibold text-[var(--ink)]">Drag and drop files here</p>
         <p className="mt-2 text-sm text-[var(--muted)]">Images, videos, PDFs, receipts, and product photos</p>
         <span className="mt-4 inline-flex rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">Select files</span>
       </label>
       <div className="mt-5 space-y-2">{uploads.map((item) => <div key={`${item.name}-${item.size}`} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white p-3"><div><p className="font-medium text-[var(--ink)]">{item.name}</p><p className="text-xs text-[var(--muted)]">{item.kind} · {item.size}</p></div><span className="rounded-full border border-[#DCE3EC] bg-[#F6FAF8] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Queued</span></div>)}</div>
     </Card>
     <Card title="Accepted file types">
       <div className="space-y-3">{uploadTypes.map((type) => <div key={type} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[#F6FAF8] px-3 py-2"><span className="text-sm font-medium text-[var(--ink)]">{type}</span><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Ready</span></div>)} </div>
     </Card>
   </div>}

   {tab === 'media' && <div className="space-y-5">
     <Card title="Incoming Media Viewer">
       <div className="grid gap-5 lg:grid-cols-[0.8fr_1.4fr]">
         <div className="space-y-3">{mediaItems.map((item) => <button key={item.id} type="button" onClick={() => setSelectedMediaId(item.id)} className={`w-full rounded-xl border p-3 text-left transition ${selectedMediaId === item.id ? 'border-[#25D366] bg-[#F6FAF8]' : 'border-[var(--line)] bg-white'}`}><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[var(--ink)]">{item.title}</p><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{item.kind}</span></div><p className="mt-2 text-xs text-[var(--muted)]">{item.source}</p></button>)} </div>
         <div className="rounded-2xl border border-[var(--line)] bg-[#F9FBFF] p-4">
           <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-[var(--ink)]">{activeMedia.title}</p><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{activeMedia.kind}</span></div>
           <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-dashed border-[#DCE3EC] bg-white text-sm font-semibold uppercase tracking-[0.18em] text-[#25D366]" style={{ background: `linear-gradient(135deg, ${activeMedia.accent}22, rgba(255,255,255,1))` }}>{activeMedia.kind}</div>
           <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{activeMedia.summary}</p>
           <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">{activeMedia.source}</p>
         </div>
       </div>
     </Card>
   </div>}

		{tab === 'customers' && <><EntityAnalytics title="Customers by company" items={data.customers} labelKey="companyName"/><Card title="Company customers"><Table headers={['Company','Contact','Email']}><>{data.customers.map((customer) => <tr key={customer.id}><td className="px-4 py-3 font-semibold">{customer.companyName}</td><td className="px-4 py-3">{customer.contactName || '—'}</td><td className="px-4 py-3">{customer.email || '—'}</td></tr>)}</></Table></Card></>}
		{tab === 'pipeline' && <><PipelineAnalytics leads={data.leads} customers={data.customers.length}/><Card title="Company sales pipeline"><Table headers={['Lead','Source','Stage','Value','Actions']}><>{data.leads.map((lead) => <tr key={lead.id}><td className="px-4 py-3"><strong>{lead.companyName}</strong><span className="block text-xs text-[var(--muted)]">{lead.itemTitle || 'Opportunity'}</span></td><td className="px-4 py-3">{lead.source}</td><td className="px-4 py-3">{lead.stage}</td><td className="px-4 py-3">{money(lead.valuePence)}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => void act(lead.id, false)} className="border px-2 py-1 text-xs">Qualify</button><button onClick={() => void act(lead.id, true)} disabled={lead.stage === 'converted'} className="bg-[#25D366] px-2 py-1 text-xs text-white">Convert</button></div></td></tr>)}</></Table></Card></>}
		{tab === 'intelligence' && <div className="space-y-5"><MerchantPerformanceOverview client={authClient}/><PipelineAnalytics leads={data.leads.filter(lead=>lead.source==='foundit')} customers={data.customers.filter(customer=>customer.source==='foundit').length} title="Retail intelligence funnel"/><Card title="Retail service health"><div className="grid gap-3 md:grid-cols-3"><InsightPanel title="Orders" value={String(data.orders.length)}/><InsightPanel title="Inventory alerts" value={String(Math.max(0, data.metrics.openOrders))}/><InsightPanel title="Inbox coverage" value="96%" tone="positive"/></div></Card></div>}
   {tab === 'staff' && <div className="grid gap-5 lg:grid-cols-2"><Card title="Store staff roster"><Table headers={['Name','Role','Shift','Status']}><tr><td className="px-4 py-3 font-medium">Nina S.</td><td className="px-4 py-3">Store Lead</td><td className="px-4 py-3">09:00-17:00</td><td className="px-4 py-3">On shift</td></tr><tr><td className="px-4 py-3 font-medium">Ari K.</td><td className="px-4 py-3">Inventory</td><td className="px-4 py-3">10:00-18:00</td><td className="px-4 py-3">Available</td></tr><tr><td className="px-4 py-3 font-medium">Mo J.</td><td className="px-4 py-3">Customer care</td><td className="px-4 py-3">12:00-20:00</td><td className="px-4 py-3">Online</td></tr></Table></Card><Card title="Team routing"><div className="space-y-3 text-sm text-[var(--muted)]"><p><strong className="text-[var(--ink)]">Message routing:</strong> WhatsApp and SMS auto-assign to customer care, while email and web chat route to store lead review.</p><p><strong className="text-[var(--ink)]">Escalations:</strong> Damaged deliveries and refunds move to the operations queue.</p><p><strong className="text-[var(--ink)]">Sentiment:</strong> Priority reviews are triggered if three or more negative replies are logged in a 30-minute window.</p></div></Card></div>}
		{tab === 'inventory' && <><OperationsAnalytics client={authClient} domain="inventory"/><InventoryModule client={authClient}/></>} 
		{tab === 'orders' && <><OperationsAnalytics client={authClient} domain="orders"/><OrdersModule client={authClient}/></>} 
		{tab === 'invoices' && <><OperationsAnalytics client={authClient} domain="invoices"/><InvoicesModule client={authClient}/></>} 
		{tab === 'delivery' && <><OperationsAnalytics client={authClient} domain="delivery"/><DeliverySuite client={authClient}/></>} 
		{tab === 'marketing' && <><OperationsAnalytics client={authClient} domain="marketing"/><MarketingSuite client={authClient}/></>} 
		{tab === 'social' && <><OperationsAnalytics client={authClient} domain="social"/><SocialScheduler client={authClient}/></>} 
		{tab === 'location' && <><OperationsAnalytics client={authClient} domain="location"/><WeatherLocationSuite client={authClient}/></>} 
		{tab === 'businesses' && <OwnerMerchantManagement client={authClient}/>}
		{tab === 'settings' && <div className="grid gap-4 md:grid-cols-2"><Card title="Branding"><p className="text-sm text-[var(--muted)]">FoundRetail green is applied to this company console.</p></Card><Card title="Module access"><p className="text-sm text-[var(--muted)]">Access and feature toggles are controlled by the platform.</p></Card><PasskeySettings client={authClient}/></div>}
	</PremiumConsole></div>
}
