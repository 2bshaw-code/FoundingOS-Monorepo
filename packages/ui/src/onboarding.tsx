'use client'

import { useState } from 'react'

const suites = ['Operations', 'Workforce', 'Intelligence'] as const

export function FoundingOSOnboarding({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(1)
  const [suite, setSuite] = useState<(typeof suites)[number]>('Operations')
  const [details, setDetails] = useState({ businessName: '', businessType: '', location: '', contact: '', links: '' })

  const next = () => setStep((current) => Math.min(5, current + 1))
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Step {step} of 5</p>
      {step === 1 && <><h1 className="mt-2 text-2xl font-semibold">Choose your suite</h1><div className="mt-5 grid gap-3 sm:grid-cols-3">{suites.map((item) => <button key={item} type="button" onClick={() => setSuite(item)} className={`rounded-xl border p-4 text-left ${suite === item ? 'border-[var(--primary)]' : 'border-[var(--line)]'}`}><strong>{item}</strong><p className="mt-1 text-sm text-[var(--muted)]">AI-assisted {item.toLowerCase()} workflows.</p></button>)}</div></>}
      {step === 2 && <><h1 className="mt-2 text-2xl font-semibold">Choose your package</h1><p className="mt-2 text-sm text-[var(--muted)]">Start with {suite} and add another suite whenever your business grows.</p><select className="mt-5 w-full rounded-lg border p-3"><option>Starter</option><option>Growth</option><option>Enterprise</option></select></>}
      {step === 3 && <><h1 className="mt-2 text-2xl font-semibold">Tell us about your business</h1><p className="mt-2 text-sm text-[var(--muted)]">AI will suggest corrections and explain each field as you go.</p><div className="mt-5 grid gap-3">{Object.entries(details).map(([key, value]) => <input key={key} value={value} onChange={(event) => setDetails({ ...details, [key]: event.target.value })} placeholder={key === 'businessName' ? 'Business name' : key === 'businessType' ? 'Business type' : key === 'links' ? 'Website or social links (optional)' : key[0].toUpperCase() + key.slice(1)} className="rounded-lg border p-3" />)}</div></>}
      {step === 4 && <><h1 className="mt-2 text-2xl font-semibold">Verify your account</h1><p className="mt-2 text-sm text-[var(--muted)]">Verification keeps your workspace secure. We can complete it automatically when possible.</p><button type="button" className="mt-5 rounded-lg bg-[var(--primary)] px-4 py-3 text-white">Send verification code</button></>}
      {step === 5 && <><h1 className="mt-2 text-2xl font-semibold">You’re ready to go</h1><p className="mt-2 text-sm text-[var(--muted)]">Your {suite} package is selected and your workspace is ready. AI will guide your first actions.</p><button type="button" onClick={onComplete} className="mt-5 rounded-lg bg-[var(--primary)] px-4 py-3 text-white">Take me to my dashboard</button></>}
      {step < 5 && <button type="button" onClick={next} className="mt-6 rounded-lg bg-[var(--primary)] px-4 py-3 text-white">Continue</button>}
    </section>
  )
}
