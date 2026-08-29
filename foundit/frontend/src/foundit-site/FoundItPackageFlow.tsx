/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { storePendingApplication } from '@founder-os/auth/client'
import { FoundThisBrandMark } from '@founder-os/brand-assets'
import { ImageBlock } from '@founder-os/ui'
import { foundItPlans } from './FoundThisSite'

const planFor = (planId?: string) => foundItPlans.find((plan) => plan.id === planId)

export function FoundThisPackageDetails() {
  const plan = planFor(useParams().planId)
  if (!plan) return <Navigate to="/foundit-site#pricing" replace />
  return <main className="min-h-screen bg-[#050816] px-5 py-16 text-[#e5eefc]"><article className="mx-auto max-w-4xl border border-[#facc15]/20 bg-[linear-gradient(180deg,rgba(11,18,32,.9),rgba(8,12,22,.96))] p-8 shadow-[0_28px_72px_rgba(2,6,23,.45)]"><ImageBlock variant="foundit-dashboard" alt="FoundThis dashboard preview" caption="FoundThis console preview" glow="#facc15" /><FoundThisBrandMark className="mt-6 h-12 w-12"/><p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#fef08a]">FoundThis package</p><h1 className="mt-3 text-4xl font-bold text-white">{plan.name}</h1><p className="mt-4 text-3xl font-bold text-white">{plan.price}<span className="text-base font-normal text-slate-300">/month</span></p><p className="mt-5 text-slate-300">{plan.description}</p><div className="mt-8 grid gap-6 md:grid-cols-2"><section><h2 className="text-xl font-bold text-white">Features</h2><ul className="mt-4 space-y-3 text-slate-200">{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul></section><section><h2 className="text-xl font-bold text-white">Modules included</h2><ul className="mt-4 space-y-3 text-slate-200">{plan.modules.map((module) => <li key={module}>✓ {module}</li>)}</ul></section></div><section className="mt-8 border-t border-white/10 pt-6"><h2 className="text-xl font-bold text-white">Plan difference</h2><p className="mt-3 text-slate-300">{plan.id === 'business' ? 'Built for one local business presence.' : plan.id === 'premium' ? 'Adds multi-business oversight, staff, analytics, and intelligence.' : 'Adds maximum network capacity, automation, and priority support.'}</p></section><div className="mt-9 flex gap-3"><Link to={`/foundit-site/packages/${plan.id}/apply`} className="bg-[#facc15] px-6 py-3 font-bold text-slate-950">Apply Now</Link><Link to="/foundit-site#pricing" className="border border-[#facc15]/60 px-6 py-3 font-bold text-[#facc15]">Back to packages</Link></div></article></main>
}

export function FoundThisPackageApplication() {
  const plan = planFor(useParams().planId)
  const navigate = useNavigate()
  if (!plan) return <Navigate to="/foundit-site#pricing" replace />
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const value = new FormData(event.currentTarget); storePendingApplication('foundit', { app: 'foundit', plan: plan.id, businessName: String(value.get('businessName')), contactName: String(value.get('contactName')), email: String(value.get('email')), location: String(value.get('location')), requirements: String(value.get('requirements')) }); navigate(`/it/auth/login?next=${encodeURIComponent(`/foundit-site/packages/${plan.id}/apply`)}&plan=${plan.id}`) }
  return <main className="min-h-screen bg-[#050816] px-5 py-16 text-[#e5eefc]"><article className="mx-auto max-w-3xl border border-[#facc15]/20 bg-[linear-gradient(180deg,rgba(11,18,32,.9),rgba(8,12,22,.96))] p-8 shadow-[0_28px_72px_rgba(2,6,23,.45)]"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#fef08a]">FoundThis application</p><h1 className="mt-3 text-4xl font-bold text-white">Apply for {plan.name}</h1><p className="mt-4 text-slate-300">Complete the application below. Sign-in is required only when you submit it.</p><form onSubmit={submit} className="mt-8 grid gap-4 md:grid-cols-2"><input required name="businessName" placeholder="Business name" className="border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"/><input required name="contactName" placeholder="Contact name" className="border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"/><input required name="email" type="email" placeholder="Email" className="border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"/><input required name="location" placeholder="Primary location" className="border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400"/><textarea required name="requirements" placeholder="Tell us about your marketplace needs" className="min-h-32 border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 md:col-span-2"/><button className="bg-[#facc15] px-6 py-3 font-bold text-slate-950 md:col-span-2">Submit application</button></form></article></main>
}