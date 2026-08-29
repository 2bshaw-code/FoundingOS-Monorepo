/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { type FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandCard, ImageBlock } from '@founder-os/ui'
import { FoundTalentBrandMark } from '@founder-os/brand-assets'
import { authClient } from '../auth'
import { foundTalentPlans } from './FoundTalentPackageFlow'

const capabilities = [
  ['Job scraping engine', 'Scrape job boards and career pages, then normalise roles, skills, and salary ranges.'],
  ['Applicant scoring engine', 'Parse CVs, score candidates with AI, and match them to live requirements.'],
  ['Hiring analytics', 'Track application flow, interview conversion, and role performance.'],
  ['Labour market intelligence', 'Benchmark salaries, skills shortages, and regional hiring signals.'],
]

const steps = [
  ['1', 'Discover', 'Collect roles from career pages and approved job boards.'],
  ['2', 'Score', 'Parse CVs, rate fit, and produce structured reports.'],
  ['3', 'Schedule', 'Coordinate interviews, follow-ups, and employer notifications.'],
  ['4', 'Learn', 'Feed market signals back into hiring analytics and intelligence.'],
]

const explainers = [
  ['Job scraping', 'Career pages and job boards are normalised into a single structured pipeline for hiring teams.'],
  ['Applicant scoring', 'CVs and applications are scored against requirements so recruiters can move faster.'],
  ['Hiring analytics', 'Conversion, time-to-fill, and role performance are tracked in one operating view.'],
  ['Labour market intelligence', 'FoundThis intelligence is reused to benchmark salary ranges and skill demand.'],
]

type Globalisation = {
  hosting: string[]
  locales: string[]
  partnerDashboards: string[]
  onboardingScripts: string[]
  operatorPrompts: string[]
}

type Compliance = {
  privacyByDesign: boolean
  encryptedPipelines: boolean
  subprocessors: string[]
  retentionPolicies: string[]
  brandCompliance: string[]
  publicationControl: string[]
  regulations: string[]
}

function FoundTalentFoundAI({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([{ role: 'foundai', text: 'Hi, I’m FoundAI. Ask me about hiring, scoring candidates, or labour market signals.' }])
  if (!open) return null
  const submit = (event: FormEvent) => { event.preventDefault(); const text = question.trim(); if (!text) return; setMessages((items) => [...items, { role: 'visitor', text }, { role: 'foundai', text: 'FoundTalent can scrape jobs, score candidates, schedule interviews, and turn market intelligence into hiring action with FoundAI as the onboarding layer.' }]); setQuestion('') }
  return <section className="fixed inset-x-4 bottom-4 z-50 ml-auto max-w-sm overflow-hidden border border-[#F5C7A4] bg-white shadow-2xl sm:right-6"><header className="flex items-center justify-between bg-[#F97316] px-4 py-3 text-white"><strong>FoundAI</strong><button type="button" onClick={onClose} aria-label="Close FoundAI">×</button></header><div className="max-h-72 space-y-3 overflow-y-auto bg-[#FFF7ED] p-4">{messages.map((message, index) => <p key={`${message.role}-${index}`} className={`w-fit max-w-[88%] px-3 py-2 text-sm ${message.role === 'foundai' ? 'bg-white' : 'ml-auto bg-[#FED7AA]'}`}>{message.text}</p>)}</div><form onSubmit={submit} className="flex gap-2 border-t border-[#F5C7A4] p-3"><input className="min-w-0 flex-1 border border-[#F5C7A4] px-3 py-2 text-sm" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask FoundAI about FoundTalent" aria-label="Ask FoundAI"/><button className="bg-[#F97316] px-4 text-white" type="submit">Send</button></form></section>
}

export function FoundTalentSite() {
  const [bobOpen, setBobOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState<string | null>(null)
  const [globalisation, setGlobalisation] = useState<Globalisation | null>(null)
  const [compliance, setCompliance] = useState<Compliance | null>(null)
  const legal = [
    ['Terms', 'FoundTalent is available to approved hiring teams for lawful workforce intelligence, applicant processing, and role management.'],
    ['Privacy', 'FoundTalent processes account, hiring, candidate, and market intelligence data to provide tenant-scoped services, security, support, and analytics.'],
    ['Cookies', 'Essential cookies and browser storage maintain secure sessions, preferences, and protected console access.'],
    ['Refunds', 'Refund requests are reviewed against the active subscription period, enabled features, and completed onboarding work.'],
    ['Employer Agreement', 'Employers remain responsible for role accuracy, candidate handling, staff access, and lawful hiring operations.'],
    ['Talent Manager Agreement', 'Talent managers may oversee approved workspaces within package, privacy, and hiring governance limits without bypassing tenant controls.'],
  ]
  const activeLegal = legal.find(([title]) => title === legalOpen)
  const consoleLinks = [
    { label: 'Manager', href: 'http://localhost:4004/console' },
    { label: 'Recruiter', href: 'http://localhost:4004/console' },
  ]
  useEffect(() => {
    const root = import.meta.env.VITE_FOUNDTALENT_API_URL.replace(/\/+$/, '')
    fetch(`${root}/api/v1/globalisation`).then((response) => response.ok ? response.json() : Promise.reject(new Error('Globalisation data unavailable'))).then((response: { success: true; data: Globalisation }) => setGlobalisation(response.data)).catch(() => setGlobalisation(null))
    fetch(`${root}/api/v1/compliance`).then((response) => response.ok ? response.json() : Promise.reject(new Error('Compliance data unavailable'))).then((response: { success: true; data: Compliance }) => setCompliance(response.data)).catch(() => setCompliance(null))
  }, [])
  return <main className="min-h-screen bg-[#050816] text-[#e5eefc]">
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1220]/85 backdrop-blur"><div className="mx-auto flex min-h-[72px] max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3"><a href="#top" className="flex items-center gap-3"><FoundTalentBrandMark className="h-11 w-11"/><span><strong className="block text-xl text-white">FoundTalent</strong><small className="text-slate-300">Workforce Intelligence OS</small></span></a><nav className="order-3 flex w-full items-center gap-4 overflow-x-auto text-sm font-semibold text-slate-200 md:order-none md:w-auto"><button type="button" onClick={() => { window.location.href = 'http://localhost:4000/console' }} className="nav-chip"><span aria-hidden="true" className="nav-chip-icon">↩</span><span>Back to FoundingOS</span></button><a href="#why" className="nav-chip"><span aria-hidden="true" className="nav-chip-icon">◉</span><span>Why FoundTalent</span></a><a href="#how" className="nav-chip"><span aria-hidden="true" className="nav-chip-icon">⌁</span><span>How it works</span></a><a href="#pricing" className="nav-chip"><span aria-hidden="true" className="nav-chip-icon">◆</span><span>Pricing</span></a><a href="#bob" className="nav-chip"><span aria-hidden="true" className="nav-chip-icon">✦</span><span>FoundAI</span></a></nav></div></header>
    <section id="top" className="relative overflow-hidden bg-[#1b120d] text-white"><div className="absolute inset-0 bg-gradient-to-r from-[#1b120d] via-[#111827]/80 to-[#fb923c]/20"/><div className="relative mx-auto flex min-h-[76vh] max-w-6xl items-center px-5 py-16"><div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#fdba74]">Workforce Intelligence OS</p><h1 className="mt-5 text-5xl font-bold leading-tight md:text-6xl">Hire faster. Read the market sooner.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Scrape roles, score candidates, schedule interviews, and convert labour market intelligence into hiring action with FoundAI as the onboarding layer.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#pricing" className="bg-[#fb923c] px-6 py-3 font-semibold text-slate-950">Choose your package</a><button type="button" onClick={() => setBobOpen(true)} className="border border-white/60 bg-white/5 px-6 py-3 font-semibold text-[#fb923c] backdrop-blur">Chat with FoundAI</button></div><div className="mt-8 grid gap-4 sm:grid-cols-2">{consoleLinks.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-[0_12px_32px_rgba(0,0,0,.18)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#fb923c]/50"><span className="block text-xs font-bold uppercase tracking-[.18em] text-[#fdba74]">Open workspace</span><span className="mt-2 block text-lg font-bold text-white">{label}</span><span className="mt-2 block text-sm text-slate-300">{label === 'Manager' ? 'Hiring management workspace' : 'Recruiter workspace'}</span></a>)}</div><p className="mt-3 text-sm text-slate-300">Pick the workspace that fits your team.</p><ImageBlock variant="foundtalent-dashboard" alt="FoundTalent dashboard preview" caption="Hiring workspace preview" glow="#fb923c" className="mt-8" /></div></div></section>    <section id="why" className="bg-white py-20"><div className="mx-auto max-w-6xl px-5"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#F97316]">Why FoundTalent</p><h2 className="mt-3 max-w-3xl text-4xl font-bold">Hiring teams need one operating system for the market, the candidate, and the conversation.</h2><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{capabilities.map(([title, copy], index) => <BrandCard key={title} brand="foundtalent" title={title} description={copy} accent="#F97316" className="h-full"><div className="h-1 w-12 bg-[#F97316]"/><span className="mt-5 block text-3xl font-black text-[#F97316]">0{index + 1}</span></BrandCard>)}</div></div></section>
    <section id="how" className="border-y border-[#F5C7A4] py-20"><div className="mx-auto max-w-6xl px-5"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#F97316]">How it works</p><h2 className="mt-3 text-4xl font-bold">Run your hiring workflow in four steps.</h2><div className="mt-10 grid md:grid-cols-4">{steps.map(([step, title, copy]) => <article key={step} className="border-l-2 border-[#F97316] px-5 py-3"><span className="text-sm font-bold text-[#F97316]">STEP {step}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#7C6A5C]">{copy}</p></article>)}</div></div></section>
    <section className="bg-white py-20"><div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[1.1fr_.9fr]"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-[#F97316]">Core workflows</p><h2 className="mt-3 text-4xl font-bold">Built for job scraping, scoring, analytics, and market intelligence.</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{explainers.map(([title, copy]) => <article key={title} className="border border-[#F5C7A4] bg-[#FFF7ED] p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#7C6A5C]">{copy}</p></article>)}</div></div><aside className="rounded-xl border border-[#F5C7A4] bg-[#FFF7ED] p-6"><ImageBlock variant="foundtalent-dashboard" alt="FoundTalent workflow preview" caption="Workflow preview" glow="#fb923c" /><p className="mt-6 text-sm font-bold uppercase tracking-[.18em] text-[#F97316]">FoundAI demo</p><h3 className="mt-3 text-2xl font-bold">Screen candidates without leaving chat.</h3><ul className="mt-6 space-y-3 text-sm leading-6 text-[#7C6A5C]">{['Candidate screening', 'Interview scheduling', 'Automated follow-ups', 'AI-driven candidate Q&A', 'Employer notifications'].map((item) => <li key={item}>✓ {item}</li>)}</ul><div className="mt-6 grid gap-3 rounded-lg bg-white p-4"><p className="text-xs font-bold uppercase text-[#F97316]">Workflow preview</p><p className="text-sm text-[#7C6A5C]">Use FoundAI in chat, score a CV, and return a structured hiring summary in one flow.</p><button type="button" onClick={() => setBobOpen(true)} className="mt-2 bg-[#F97316] px-4 py-2 text-sm font-semibold text-white">Open demo</button></div></aside></div></section>
    <section className="border-t border-[#F5C7A4] bg-[#FFF7ED] py-20"><div className="mx-auto max-w-6xl px-5"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#F97316]">Globalisation</p><h2 className="mt-3 text-4xl font-bold">Multi-region rollout, localisation, and regional onboarding.</h2>{globalisation && <div className="mt-8 grid gap-5 lg:grid-cols-2"><article className="rounded-xl border border-[#F5C7A4] bg-white p-6"><h3 className="font-bold">Hosting and localisation</h3><ul className="mt-4 space-y-2 text-sm leading-6 text-[#7C6A5C]">{globalisation.hosting.map((item) => <li key={item}>✓ {item}</li>)}{globalisation.locales.map((item) => <li key={item}>✓ Locale {item}</li>)}</ul></article><article className="rounded-xl border border-[#F5C7A4] bg-white p-6"><h3 className="font-bold">Partner dashboards and prompts</h3><ul className="mt-4 space-y-2 text-sm leading-6 text-[#7C6A5C]">{globalisation.partnerDashboards.map((item) => <li key={item}>✓ {item}</li>)}{globalisation.onboardingScripts.map((item) => <li key={item}>✓ {item}</li>)}{globalisation.operatorPrompts.map((item) => <li key={item}>✓ Prompt language: {item}</li>)}</ul></article></div>}</div></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-6xl px-5"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#F97316]">Compliance</p><h2 className="mt-3 text-4xl font-bold">Privacy-by-design, encrypted pipelines, and publication control.</h2>{compliance && <div className="mt-8 grid gap-5 lg:grid-cols-2"><article className="rounded-xl border border-[#F5C7A4] bg-[#FFF7ED] p-6"><h3 className="font-bold">Regulatory posture</h3><ul className="mt-4 space-y-2 text-sm leading-6 text-[#7C6A5C]"><li>✓ Privacy by design: {compliance.privacyByDesign ? 'Enabled' : 'Disabled'}</li><li>✓ Encrypted data pipelines: {compliance.encryptedPipelines ? 'Enabled' : 'Disabled'}</li>{compliance.regulations.map((item) => <li key={item}>✓ {item}</li>)}</ul></article><article className="rounded-xl border border-[#F5C7A4] bg-[#FFF7ED] p-6"><h3 className="font-bold">Operational controls</h3><ul className="mt-4 space-y-2 text-sm leading-6 text-[#7C6A5C]">{compliance.subprocessors.map((item) => <li key={item}>✓ Subprocessor: {item}</li>)}{compliance.retentionPolicies.map((item) => <li key={item}>✓ {item}</li>)}{compliance.brandCompliance.map((item) => <li key={item}>✓ {item}</li>)}{compliance.publicationControl.map((item) => <li key={item}>✓ {item}</li>)}</ul></article></div>}</div></section>
    <section id="pricing" className="bg-[#FFF7ED] py-20"><div className="mx-auto max-w-6xl px-5"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#F97316]">Pricing</p><h2 className="mt-3 text-4xl font-bold">Choose the FoundTalent package that fits your team.</h2><div className="mt-10 grid gap-5 lg:grid-cols-3">{foundTalentPlans.map((plan) => <article key={plan.id} className={`border p-6 ${plan.featured ? 'border-[#F97316] bg-white shadow-xl' : 'border-[#F5C7A4] bg-white'}`}><p className="text-sm font-bold uppercase tracking-[.18em] text-[#F97316]">{plan.name}</p><h3 className="mt-4 text-2xl font-bold">{plan.price}</h3><p className="mt-3 text-sm leading-6 text-[#7C6A5C]">{plan.description}</p><ul className="mt-5 space-y-2 text-sm">{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><div className="mt-6 flex gap-3"><Link to={`/foundtalent-site/packages/${plan.id}`} className="bg-[#F97316] px-4 py-2 font-semibold text-white">View package</Link><Link to={`/foundtalent-site/packages/${plan.id}/apply`} className="border border-[#F97316] px-4 py-2 font-semibold text-[#F97316]">Apply now</Link></div></article>)}</div></div></section>
    <section id="bob" className="bg-[#F97316] py-20 text-white"><div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[.75fr_1.25fr]"><button type="button" onClick={() => setBobOpen(true)} className="rounded-xl border border-white/40 bg-white/10 px-8 py-14 text-left"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#FED7AA]">FoundAI</p><p className="mt-4 text-3xl font-bold">Ask FoundAI to screen a role, benchmark a salary, or schedule an interview.</p></button><div><p className="text-sm font-bold uppercase tracking-[.18em] text-[#FED7AA]">Fingerprint login</p><h2 className="mt-3 text-4xl font-bold">Fast, secure access for hiring teams.</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">FoundTalent uses the same passkey and fingerprint login pattern as the rest of the platform ecosystem so recruiters, managers, and staff can sign in quickly.</p>    <div className="mt-8 flex flex-wrap gap-3"><Link to="/talent/auth/login" className="bg-white px-6 py-3 font-bold text-[#F97316]">Sign in</Link><button type="button" onClick={() => setBobOpen(true)} className="border border-white/70 px-6 py-3 font-bold">Ask FoundAI about hiring</button></div><div className="mt-5 flex flex-wrap gap-2">{['WhatsApp', 'Telegram', 'Messenger', 'iMessage', 'SMS'].map((service) => <a key={service} href="/company/contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold"><span aria-hidden="true" className="text-base">✦</span>{service}</a>)}</div></div></div></section>
    <section className="border-t border-[#F5C7A4] bg-white py-16"><div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2 lg:grid-cols-3">{legal.map(([title, copy]) => <button key={title} type="button" onClick={() => setLegalOpen(title)} className="rounded-lg border border-[#F5C7A4] p-5 text-left"><p className="text-sm font-bold uppercase tracking-[.16em] text-[#F97316]">{title}</p><p className="mt-3 text-sm leading-6 text-[#7C6A5C]">{copy}</p></button>)}</div></section>
    <footer className="border-t border-[#F5C7A4] py-8 text-center text-sm text-[#7C6A5C]">FoundTalent — Workforce intelligence for approved hiring teams.</footer>
    {activeLegal && <section className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"><div className="max-w-2xl rounded-xl border border-[#F5C7A4] bg-white p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-[#F97316]">{activeLegal[0]}</p><p className="mt-3 text-sm leading-6 text-[#7C6A5C]">{activeLegal[1]}</p></div><button type="button" onClick={() => setLegalOpen(null)} className="text-2xl leading-none text-[#F97316]" aria-label="Close legal notice">×</button></div></div></section>}
    <FoundTalentFoundAI open={bobOpen} onClose={() => setBobOpen(false)} />
  </main>
}
