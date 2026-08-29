/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
export { AuthLayout } from './AuthLayout'
export { ErrorBoundary } from './ErrorBoundary'
export { Fallback } from './Fallback'
export { PageContainer } from './PageContainer'
export { ProtectedLayout } from './ProtectedLayout'
export { FounderOsLogo } from './logo'
export { BrandLogo } from '../components/BrandLogo'
export { BrandCard } from '../components/BrandCard'
export { ImageBlock, type ImageVariant } from './ImageBlock'
export { MessagingAdapter, type MessagingPlatform, type MessagingPayload, type MessagingResult } from './messaging'
export { founderOsTheme } from './theme'
export { BobMediaStudio, DeliverySuite, InventoryModule, InvoicesModule, MarketingSuite, OrdersModule, SocialScheduler, WeatherLocationSuite, WeatherLocationWidget, useOperations, type OperationsClient } from './advanced'
export { ScrapingControl, type ScrapingClient } from './scraping'
export { EntityAnalytics, OperationsAnalytics, PipelineAnalytics, type AnalyticsClient, type AnalyticsDomain } from './analytics'
export { MerchantOperationsConsole, MerchantPerformanceOverview, OwnerMerchantManagement, type MerchantClient } from './merchant'
export { useCompanyBrand } from './companyBrand'

export function FoundThisLogo({ className = 'h-10 w-10' }: { className?: string }) { return <svg className={className} viewBox="0 0 48 48" role="img" aria-label="FoundThis"><rect width="48" height="48" rx="8" fill="#FFD600"/><path d="M14 30c0-9 7-16 20-16 0 12-7 20-18 20h-2v-4Z" fill="#FFEA70"/><path d="M15 35c5-8 11-12 19-16" fill="none" stroke="#2E2E2E" strokeWidth="3" strokeLinecap="round"/><rect x="12" y="34" width="7" height="4" rx="2" fill="#806B00"/></svg> }
export function FoundMeatLogo({ className = 'h-10 w-10' }: { className?: string }) { return <svg className={className} viewBox="0 0 48 48" role="img" aria-label="FoundMeat"><rect width="48" height="48" rx="8" fill="#B00020"/><path d="M14 17h8v14c0 4 2 6 6 6s6-2 6-6V17h-4v13c0 2-1 3-2 3s-2-1-2-3V17h8v-5H14v5Z" fill="#FFF7F5"/><rect x="12" y="37" width="24" height="4" rx="2" fill="#EF9A9A"/></svg> }
export function FoundRetailLogo({ className = 'h-10 w-10' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" role="img" aria-label="FoundRetail"><rect width="48" height="48" rx="12" fill="#25D366"/><rect x="4" y="4" width="40" height="40" rx="10" fill="#0F172A" opacity="0.12"/><text x="13" y="31" fontSize="22" fontWeight="800" fontFamily="Inter, Segoe UI, sans-serif" fill="#FFFFFF" letterSpacing="-1.5">F</text><text x="27" y="28" fontSize="14" fontWeight="800" fontFamily="Inter, Segoe UI, sans-serif" fill="#E9FFF4" letterSpacing="-0.4">r</text></svg>
}
export function FoundCryptoLogo({ className = 'h-10 w-10' }: { className?: string }) { return <svg className={className} viewBox="0 0 48 48" role="img" aria-label="FoundCrypto"><rect width="48" height="48" rx="8" fill="#7C3AED"/><path d="M24 6l13 7.5v15L24 36l-13-7.5v-15L24 6Z" fill="#E9D5FF"/><path d="M24 13l6.5 3.75v7.5L24 28l-6.5-3.75v-7.5L24 13Z" fill="#7C3AED"/><path d="M24 17v14M17 24h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/></svg> }

export function AppShell({ title, navigation, children, logo, className = '' }: { title: string; navigation: ReactNode; children: ReactNode; logo?: ReactNode; className?: string }) {
  return <div className={`app-shell min-h-screen bg-[var(--surface)] text-[var(--ink)] ${className}`}><header className="border-b border-[var(--line)] bg-white shadow-[0_1px_8px_rgba(15,23,42,0.05)]"><div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4"><div className="flex items-center gap-3">{logo}<strong className="text-base">{title}</strong></div><nav className="flex flex-wrap items-center justify-end gap-4 text-sm">{navigation}</nav></div></header><main className="mx-auto max-w-7xl p-6 md:p-8">{children}</main></div>
}

export type ConsoleTab = { id: string; label: string }

export function PremiumConsole({ brand, eyebrow, title, description, tabs, activeTab, onTabChange, children, accent = '#006CFF', logo }: { brand: string; eyebrow: string; title: string; description: string; tabs: ConsoleTab[]; activeTab: string; onTabChange: (id: string) => void; children: ReactNode; accent?: string; logo?: ReactNode }) {
  const style = { '--console-accent': accent } as CSSProperties
  return <div className="min-h-screen bg-[#F5F7FA] text-[#172033]" style={style}><header className="border-b border-black/10 text-white" style={{backgroundColor:accent}}><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5"><div className="flex items-center gap-3">{logo}<div><p className="text-xs font-bold uppercase text-white/80">{brand}</p><h1 className="text-xl font-semibold">{title}</h1></div></div><p className="max-w-xl text-sm text-white/85">{description}</p></div><nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5" aria-label={`${brand} console sections`}>{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => onTabChange(tab.id)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === tab.id ? 'border-white bg-black/10 text-white' : 'border-transparent text-white/75 hover:bg-white/10 hover:text-white'}`}>{tab.label}</button>)}</nav></header><main className="mx-auto max-w-7xl space-y-7 p-5 md:p-8"><p className="text-sm font-semibold text-[var(--console-accent)]">{eyebrow}</p>{children}</main></div>
}

export function InsightPanel({ title, value, detail, tone = 'default' }: { title: string; value: string; detail?: string; tone?: 'default' | 'positive' | 'warning' }) {
  const colour = tone === 'positive' ? '#0F8A4B' : tone === 'warning' ? '#B45309' : 'var(--console-accent, var(--primary))'
  return <article className="border border-[#DCE3EC] bg-white p-5 shadow-[0_8px_24px_rgba(10,31,55,0.06)]"><p className="text-sm text-[#68778A]">{title}</p><p className="mt-2 text-2xl font-semibold" style={{ color: colour }}>{value}</p>{detail && <p className="mt-2 text-sm leading-6 text-[#68778A]">{detail}</p>}</article>
}

export function BarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const maximum = Math.max(1, ...data.map((item) => item.value))
  return <div className="space-y-4" role="img" aria-label="Comparison bar chart">{data.length===0&&<p className="text-sm text-[#68778A]">No analytics data available yet.</p>}{data.map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-sm text-[#1E1F22]"><span>{item.label}</span><strong>{item.value}</strong></div><div className="h-2 bg-[#D9D9D9]"><div className="h-full bg-[#006CFF]" style={{ width: `${Math.max(4, item.value / maximum * 100)}%` }}/></div></div>)}</div>
}

const chartColours = { primary: '#006CFF', secondary: '#1E1F22', grid: '#D9D9D9', positive: '#0F8A4B', negative: '#B42318' }
function AsyncChart({ children, empty }: { children: ReactNode; empty: boolean }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { const task = window.setTimeout(() => setReady(true), 0); return () => window.clearTimeout(task) }, [])
  if (!ready) return <div className="grid min-h-40 animate-pulse place-items-center bg-[#F5F7FA] text-sm text-[#68778A]">Loading analytics…</div>
  if (empty) return <div role="img" aria-label="Chart with no available data" className="grid min-h-40 place-items-center border border-dashed border-[#D9D9D9] text-sm text-[#68778A]">No analytics data available yet.</div>
  return <>{children}</>
}

export function TrendIndicator({ value, label }: { value: number; label?: string }) {
  const positive = value >= 0
  return <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: positive ? chartColours.positive : chartColours.negative }} aria-label={`${label || 'Trend'} ${positive ? 'up' : 'down'} ${Math.abs(value)} percent`}><span aria-hidden="true">{positive ? '↑' : '↓'}</span>{Math.abs(value).toFixed(1)}%{label && <span className="font-normal text-[#68778A]">{label}</span>}</span>
}

export function AnalyticsMetricCard({ title, value, detail, trend }: { title: string; value: string; detail?: string; trend?: number }) {
  return <article className="border border-[#D9D9D9] bg-white p-5 shadow-[0_8px_24px_rgba(30,31,34,0.05)]"><p className="text-sm text-[#68778A]">{title}</p><div className="mt-2 flex items-end justify-between gap-3"><strong className="text-2xl text-[#1E1F22]">{value}</strong>{trend !== undefined && <TrendIndicator value={trend}/>}</div>{detail && <p className="mt-2 text-xs text-[#68778A]">{detail}</p>}</article>
}

export function FunnelChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const maximum = Math.max(1, ...data.map(item => item.value))
  return <AsyncChart empty={!data.some(item => item.value > 0)}><div className="space-y-2" role="img" aria-label="Conversion funnel">{data.map((item,index)=><div key={item.label} className="mx-auto flex min-h-11 items-center justify-between px-4 text-sm font-semibold text-white" style={{ width: `${Math.max(32,item.value/maximum*100)}%`, background: index % 2 ? chartColours.secondary : chartColours.primary }}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></AsyncChart>
}

export function LineChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const maximum=Math.max(1,...data.map(item=>item.value));const points=data.map((item,index)=>`${data.length===1?50:index/(data.length-1)*100},${92-item.value/maximum*78}`).join(' ')
  return <AsyncChart empty={!data.some(item=>item.value>0)}><div role="img" aria-label="Trend line chart"><svg viewBox="0 0 100 100" className="h-48 w-full" preserveAspectRatio="none"><g stroke={chartColours.grid} strokeWidth=".5">{[20,40,60,80].map(value=><line key={value} x1="0" x2="100" y1={value} y2={value}/>)}</g><polyline points={points} fill="none" stroke={chartColours.primary} strokeWidth="3" vectorEffect="non-scaling-stroke"/><polygon points={`0,100 ${points} 100,100`} fill="rgba(0,108,255,.08)"/></svg><div className="flex justify-between gap-2 text-xs text-[#68778A]">{data.map(item=><span key={item.label} className="truncate">{item.label}</span>)}</div></div></AsyncChart>
}

export function HeatMap({ data }: { data: Array<{ label: string; value: number }> }) {
  const maximum=Math.max(1,...data.map(item=>item.value))
  return <AsyncChart empty={!data.some(item=>item.value>0)}><div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="img" aria-label="Activity heat map">{data.map(item=><div key={item.label} className="grid min-h-20 place-items-center p-2 text-center text-xs font-semibold" style={{ background:`rgba(0,108,255,${.12+item.value/maximum*.78})`,color:item.value/maximum>.5?'white':chartColours.secondary }}><span>{item.label}<strong className="mt-1 block text-base">{item.value}</strong></span></div>)}</div></AsyncChart>
}

export function WaterfallChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const totals:number[]=[];data.reduce((sum,item,index)=>{totals[index]=sum+item.value;return totals[index]},0);const extent=Math.max(1,...totals.map(Math.abs),...data.map(item=>Math.abs(item.value)))
  return <AsyncChart empty={!data.some(item=>item.value!==0)}><div className="flex min-h-52 items-end gap-2 border-b border-[#D9D9D9] px-2" role="img" aria-label="Revenue waterfall chart">{data.map((item,index)=>{const previous=index?totals[index-1]:0;const height=Math.max(8,Math.abs(item.value)/extent*150);const offset=Math.max(0,Math.min(previous,totals[index])/extent*120);return <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center"><strong className="text-xs">{item.value>=0?'+':''}{item.value}</strong><div className="w-full" style={{height,marginBottom:offset,background:item.value>=0?chartColours.primary:chartColours.secondary}}/><span className="mt-2 max-w-full truncate text-xs text-[#68778A]">{item.label}</span></div>})}</div></AsyncChart>
}

export function MetricCard({ label, value }: { label: string; value: string }) {
  return <article className="rounded-lg border border-stone-200 bg-white p-5"><p className="text-sm text-stone-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></article>
}

export function ClickableCard({ title, value, path, description, icon }: { title: string; value?: string; path: string; description?: string; icon?: ReactNode }) {
  const navigate = useNavigate()
  const open = () => navigate(path)
  const keyDown = (event: KeyboardEvent<HTMLElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open() } }
  return <article role="link" tabIndex={0} onClick={open} onKeyDown={keyDown} className="group min-h-32 cursor-pointer rounded-lg border border-[var(--line)] bg-white p-5 shadow-[0_5px_18px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)] active:translate-y-0 active:shadow-sm"><div className="flex items-start justify-between gap-4"><div>{icon}<p className="mt-3 text-sm text-[var(--muted)]">{title}</p>{value && <p className="mt-1 text-2xl font-semibold">{value}</p>}</div><span aria-hidden="true" className="text-xl text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--primary)]">→</span></div>{description && <p className="mt-3 text-sm text-[var(--muted)]">{description}</p>}</article>
}

export function ClickableListItem({ title, meta, path }: { title: string; meta?: string; path: string }) {
  const navigate = useNavigate()
  return <button type="button" onClick={() => navigate(path)} className="flex w-full items-center justify-between gap-4 border-b border-[var(--line)] px-4 py-4 text-left transition last:border-b-0 hover:bg-[var(--surface)] active:bg-[var(--line)]"><span><strong className="block text-sm">{title}</strong>{meta && <span className="mt-1 block text-xs text-[var(--muted)]">{meta}</span>}</span><span aria-hidden="true" className="text-[var(--primary)]">→</span></button>
}

export function Card({ title, children }: { title?: string; children: ReactNode }) { return <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-[0_5px_18px_rgba(15,23,42,0.06)]">{title && <h2 className="mb-4 font-semibold">{title}</h2>}{children}</section> }
export function ExternalLinkCard({ title, description, source, href, imageUrl }: { title: string; description?: string | null; source: string; href: string; imageUrl?: string | null }) { return <article className="overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-[0_5px_18px_rgba(15,23,42,0.06)]">{imageUrl && <img src={imageUrl} alt="" className="aspect-[16/7] w-full object-cover"/>}<div className="p-5"><p className="text-xs font-semibold uppercase text-[var(--primary)]">{source}</p><h3 className="mt-2 font-semibold">{title}</h3>{description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{description}</p>}<a href={href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">View original source <span aria-hidden="true">↗</span></a></div></article> }
export function MetricsGrid({ children }: { children: ReactNode }) { return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div> }
export function Header({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) { return <header>{eyebrow && <p className="text-sm font-semibold text-[var(--primary)]">{eyebrow}</p>}<h1 className="mt-1 text-3xl font-semibold">{title}</h1>{description && <p className="mt-2 max-w-3xl text-[var(--muted)]">{description}</p>}</header> }
export function Sidebar({ children }: { children: ReactNode }) { return <aside className="rounded-lg border border-[var(--line)] bg-white p-3 shadow-[0_5px_18px_rgba(15,23,42,0.05)]">{children}</aside> }
export function Table({ headers, children }: { headers: string[]; children: ReactNode }) { return <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-[var(--surface)] text-xs uppercase text-[var(--muted)]"><tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr></thead><tbody className="divide-y divide-[var(--line)]">{children}</tbody></table></div> }
export function DetailPage({ eyebrow, title, description, facts = [] }: { eyebrow: string; title: string; description: string; facts?: Array<[string, string]> }) { return <div className="space-y-6"><Header eyebrow={eyebrow} title={title} description={description}/><Card title="Details"><dl className="grid gap-5 sm:grid-cols-2">{facts.map(([label, value]) => <div key={label}><dt className="text-xs uppercase text-[var(--muted)]">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>)}</dl></Card></div> }

export interface FoundAIClient {
  request<T>(path: string, init?: RequestInit): Promise<T>
}

export type BobClient = FoundAIClient

export function FoundAIAssistant({ client, appName }: { client: FoundAIClient; appName: string }) {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'foundai'; text: string }>>([{ from: 'foundai', text: `FoundAI is ready in ${appName}.` }])
  const [pending, setPending] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const text = prompt.trim()
    if (!text || pending) return
    setPrompt('')
    setMessages((current) => [...current, { from: 'user', text }])
    setPending(true)
    try {
      const response = await client.request<{ success: true; data: { reply: string } }>('/bob/chat', { method: 'POST', body: JSON.stringify({ prompt: text }) })
     setMessages((current) => [...current, { from: 'foundai', text: response.data.reply }])
    } catch (error) {
     setMessages((current) => [...current, { from: 'foundai', text: error instanceof Error ? error.message : 'FoundAI is unavailable' }])
    } finally { setPending(false) }
  }
  return <div className="mx-auto flex min-h-[560px] max-w-3xl flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]"><header className="border-b border-[var(--line)] px-5 py-4"><p className="text-sm font-semibold text-[var(--primary)]">FOUND AI</p><h1 className="text-xl font-semibold">Operations assistant</h1></header><div className="flex-1 space-y-3 overflow-y-auto bg-[var(--surface)] p-5">{messages.map((message, index) => <p key={`${message.from}-${index}`} className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${message.from === 'user' ? 'ml-auto bg-[var(--primary)] text-white' : 'border border-[var(--line)] bg-white'}`}>{message.text}</p>)}</div><form onSubmit={submit} className="flex gap-3 border-t border-[var(--line)] p-4"><label className="sr-only" htmlFor="foundai-prompt">Message FoundAI</label><input id="foundai-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask FoundAI" className="min-w-0 flex-1 rounded border border-[var(--line)] px-3 py-2"/><button disabled={pending} className="rounded bg-[var(--primary)] px-4 py-2 font-semibold text-white">{pending ? 'Sending...' : 'Send'}</button></form></div>
}

export const BobAssistant = FoundAIAssistant

export function FoundAIFloatingButton() {
  const navigate = useNavigate()
  return <button type="button" onClick={() => navigate('/foundai')} aria-label="Open FoundAI" title="Open FoundAI" className="bob-ai-circle fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full border-2 border-white bg-[var(--primary)] text-lg font-bold text-white shadow-[0_6px_18px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 active:translate-y-0">AI</button>
}

export const BobFloatingButton = FoundAIFloatingButton

export function OperationsPage({ eyebrow, title, description, items }: { eyebrow: string; title: string; description: string; items: Array<{ title: string; meta: string; path: string }> }) {
  return <div className="space-y-6"><Header eyebrow={eyebrow} title={title} description={description}/><Sidebar>{items.map((item) => <ClickableListItem key={item.path} {...item}/>)}</Sidebar></div>
}

export function LoginForm({ title, onLogin, onPasskeyLogin }: { title: string; onLogin: (email: string, password: string) => Promise<void>; onPasskeyLogin?: (email: string) => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const brand = title.startsWith('FoundingOS') ? 'founding-os' : title.startsWith('FoundRetail') ? 'foundretail' : title.startsWith('FoundCrypto') ? 'foundcrypto' : title.startsWith('FoundThis') ? 'foundthis' : title.startsWith('FoundTalent') ? 'foundtalent' : 'foundmeat'
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setPending(true)
    setMessage('')
    try { await onLogin(email, password) } catch (error) { setMessage(error instanceof Error ? error.message : 'Sign in failed') } finally { setPending(false) }
  }
  const passkey = async () => { if (!onPasskeyLogin) return; setPending(true); setMessage(''); try { await onPasskeyLogin(email) } catch (error) { setMessage(error instanceof Error ? error.message : 'Passkey sign in failed') } finally { setPending(false) } }
  return <div className={`login-form login-form--${brand} mx-auto max-w-md rounded-lg border border-stone-200 bg-white p-6`}><h1 className="text-2xl font-semibold">{title}</h1><form className="mt-6 space-y-4" onSubmit={submit}><label className="block text-sm">Email<input className="mt-1 w-full rounded border border-stone-300 px-3 py-2" type="email" autoComplete="username webauthn" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label className="block text-sm">Password<span className="login-password-field"><input className="mt-1 w-full rounded border border-stone-300 px-3 py-2" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required /><button className="login-password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}><span className="login-eye-icon" aria-hidden="true"><span /></span></button></span></label>{message && <p className="text-sm text-red-700">{message}</p>}<button className="login-submit w-full rounded bg-stone-900 px-4 py-2 text-white" disabled={pending}>{pending ? 'Signing in...' : 'Sign in with password'}</button>{onPasskeyLogin && <button type="button" onClick={() => void passkey()} disabled={pending || !email} className="w-full rounded border border-[var(--primary)] px-4 py-2 font-semibold text-[var(--primary)]">Use fingerprint or passkey</button>}</form></div>
}

export function PasskeySettings({ client }: { client: { registerPasskey(): Promise<void> } }) {
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const register = async () => { setPending(true); setMessage(''); try { await client.registerPasskey(); setMessage('Passkey registered. You can now use fingerprint, Face ID, Windows Hello, or a security key at sign-in.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to register passkey') } finally { setPending(false) } }
  return <Card title="Biometric and passkey login"><p className="text-sm leading-6 text-[var(--muted)]">Register this device for standards-based WebAuthn login. Password sign-in remains available as a fallback.</p><button type="button" onClick={() => void register()} disabled={pending} className="mt-4 bg-[var(--console-accent,var(--primary))] px-4 py-2 font-semibold text-white">{pending ? 'Waiting for device…' : 'Register fingerprint / passkey'}</button>{message && <p className="mt-3 text-sm">{message}</p>}</Card>
}
