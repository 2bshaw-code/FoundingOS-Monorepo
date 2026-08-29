/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { storePendingApplication } from '@founder-os/auth/client'
import { ImageBlock } from '@founder-os/ui'
import { foundcryptoPlans } from './FoundCryptoSite'

const planFor = (planId?: string) => foundcryptoPlans.find((plan) => plan.id === planId)

export function FoundCryptoPackageDetails() {
  const plan = planFor(useParams().planId)
  if (!plan) return <Navigate to="/foundcrypto#pricing" replace />
  return <main className="min-h-screen bg-[#050816] px-5 py-16 text-[#e5eefc]"><article className="mx-auto max-w-4xl border border-[#a78bfa]/20 bg-[linear-gradient(180deg,rgba(11,18,32,.9),rgba(8,12,22,.96))] p-8 shadow-[0_28px_72px_rgba(2,6,23,.45)]"><ImageBlock variant="foundcrypto-dashboard" alt="FoundCrypto dashboard preview" caption="FoundCrypto console preview" glow="#a78bfa" /><p className="mt-6 text-sm font-bold uppercase tracking-[.18em] text-[#c4b5fd]">FoundCrypto package</p><h1 className="mt-3 text-4xl font-bold text-white">{plan.name}</h1><p className="mt-4 text-3xl font-bold text-white">{plan.price}<span className="text-base font-normal text-slate-300">/month</span></p><p className="mt-5 text-slate-300">{plan.description}</p><div className="mt-8 grid gap-6 md:grid-cols-2"><section><h2 className="text-xl font-bold text-white">Capabilities</h2><ul className="mt-4 space-y-3 text-slate-200">{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul></section><section><h2 className="text-xl font-bold text-white">Modules included</h2><ul className="mt-4 space-y-3 text-slate-200">{plan.modules.map((module) => <li key={module}>✓ {module}</li>)}</ul></section></div><section className="mt-8 border-t border-white/10 pt-6"><h2 className="text-xl font-bold text-white">Plan difference</h2><p className="mt-3 text-slate-300">{plan.id === 'trader' ? 'Built for a single crypto operator who wants charts, alerts, and safe execution.' : plan.id === 'operator' ? 'Adds multi-wallet oversight, team controls, and shared risk policy.' : 'Adds the highest monitoring capacity, advanced automation, and priority support.'}</p></section><div className="mt-9 flex gap-3"><Link to={`/foundcrypto/packages/${plan.id}/apply`} className="rounded-md bg-[#a78bfa] px-6 py-3 font-bold text-slate-950">Apply Now</Link><Link to="/foundcrypto#pricing" className="rounded-md border border-[#a78bfa]/60 px-6 py-3 font-bold text-[#a78bfa]">Back to packages</Link></div></article></main>
}

export function FoundCryptoPackageApplication() {
  const plan = planFor(useParams().planId)
  const navigate = useNavigate()
  if (!plan) return <Navigate to="/foundcrypto#pricing" replace />
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const value = new FormData(event.currentTarget); storePendingApplication('foundcrypto', { app: 'foundcrypto', plan: plan.id, businessName: String(value.get('businessName')), contactName: String(value.get('contactName')), email: String(value.get('email')), phone: String(value.get('phone')), requirements: String(value.get('requirements')) }); navigate(`/crypto/auth/login?next=${encodeURIComponent(`/foundcrypto/packages/${plan.id}/apply`)}&plan=${plan.id}`) }
  return <main className="min-h-screen bg-[#050816] px-5 py-16 text-[#e5eefc]"><article className="mx-auto max-w-3xl border border-[#a78bfa]/20 bg-[linear-gradient(180deg,rgba(11,18,32,.9),rgba(8,12,22,.96))] p-8 shadow-[0_28px_72px_rgba(2,6,23,.45)]"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#c4b5fd]">FoundCrypto application</p><h1 className="mt-3 text-4xl font-bold text-white">Apply for {plan.name}</h1><p className="mt-4 text-slate-300">Complete the application below. Sign-in is required only when you submit it.</p><form onSubmit={submit} className="mt-8 grid gap-4 md:grid-cols-2"><input required name="businessName" placeholder="Business name" className="border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"/><input required name="contactName" placeholder="Contact name" className="border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"/><input required name="email" type="email" placeholder="Email" className="border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"/><input required name="phone" placeholder="Phone" className="border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"/><textarea required name="requirements" placeholder="Tell us about your markets, risk policy, and execution goals" className="min-h-32 border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 md:col-span-2"/><button className="rounded-md bg-[#a78bfa] px-6 py-3 font-bold text-slate-950 md:col-span-2">Submit application</button></form></article></main>
}
