'use client'

import { useEffect, useState } from 'react'
import { PasswordField } from '../access/password-field'
import { boltOnKeys, commercialBoltOns, commercialPlans, extraSeat, monthlyTotalGbp, type BoltOnKey } from '@foundingos/config/commercial'
import type { PlanTier } from '@foundingos/config/suites'

type Plan = 'lite' | 'core' | 'complete'

const PLANS: Record<Plan, { tier: PlanTier; summary: string }> = {
  lite: { tier: 'lite', summary: 'One user, Core.Operations basics.' },
  core: { tier: 'starter', summary: 'Three users on the Core.Operations base. Add bolt-ons below.' },
  complete: { tier: 'growth', summary: 'Fifteen users with every suite and bolt-on included.' },
}

const formatGbp = (amount: number) => amount === 0 ? 'Free' : `£${amount}/month`
const planLabel = (plan: Plan) => `${commercialPlans[PLANS[plan].tier].name} · ${formatGbp(commercialPlans[PLANS[plan].tier].monthlyPriceGbp ?? 0)}`
const isPlan = (value: string | null): value is Plan => value === 'lite' || value === 'core' || value === 'complete'
const legacyPlan: Record<string, Plan> = { starter: 'core', growth: 'complete' }

export default function SignupPage() {
  const [plan, setPlan] = useState<Plan>('lite')
  const [boltOns, setBoltOns] = useState<BoltOnKey[]>([])
  const [extraSeats, setExtraSeats] = useState(0)
  const [ownerName, setOwnerName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'form' | 'submitting' | 'done' | 'cancelled'>('form')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('plan')
    const resolved = isPlan(requested) ? requested : requested ? legacyPlan[requested] : undefined
    if (resolved) setPlan(resolved)
    const add = params.get('add')
    if (add && (boltOnKeys as string[]).includes(add)) setBoltOns([add as BoltOnKey])
    if (params.get('checkout') === 'success') setStatus('done')
    if (params.get('checkout') === 'cancelled') setStatus('cancelled')
  }, [])

  const total = monthlyTotalGbp(PLANS[plan].tier, plan === 'core' ? boltOns : [], plan === 'lite' ? 0 : extraSeats) ?? 0
  const toggleBoltOn = (key: BoltOnKey) => setBoltOns((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    if (password.length < 12) return setMessage('Choose a password with at least 12 characters.')
    if (password !== confirmation) return setMessage('Passwords do not match.')
    setStatus('submitting')
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, boltOns: plan === 'core' ? boltOns : [], extraSeats: plan === 'lite' ? 0 : extraSeats, ownerName, businessName, email, password, website }),
      })
      const body = await response.json() as { ok?: boolean; nextStep?: string; checkoutUrl?: string; message?: string }
      if (!response.ok || !body.ok) throw new Error(body.message || 'Your account could not be created.')
      if (body.nextStep === 'checkout' && body.checkoutUrl) {
        window.location.assign(body.checkoutUrl)
        return
      }
      setStatus('done')
      if (body.message) setMessage(body.message)
    } catch (error) {
      setStatus('form')
      setMessage(error instanceof Error ? error.message : 'Your account could not be created.')
    }
  }

  return <main className="complete-workspace-access signup-page">
    <section>
      <div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>Core.Operations · Core.Workforce · Core.Intelligence</small></div></div>
      {status === 'done' ? <>
        <p className="eyebrow">Welcome to FoundingOS</p>
        <h1>Your account is ready</h1>
        <p>Sign in with the email and password you just chose.</p>
        {message ? <div className="complete-workspace-error" role="status">{message}</div> : null}
        <a className="retail-app-primary invitation-link" href="/app/retail">Sign in to FoundingOS</a>
      </> : <>
        <p className="eyebrow">Create your account</p>
        <h1>Start with FoundingOS</h1>
        <p>{status === 'cancelled' ? 'Payment was cancelled, but your account was created. You can sign in now, or email hello@foundingos.com to complete payment.' : 'No sales call needed. Pick a plan, create your account, and start working in minutes.'}</p>
        <form onSubmit={(event) => void submit(event)}>
          <label>Plan
            <select value={plan} onChange={(event) => setPlan(event.target.value as Plan)}>
              {(Object.keys(PLANS) as Plan[]).map((key) => <option key={key} value={key}>{planLabel(key)}</option>)}
            </select>
          </label>
          <small className="site-access-note">{PLANS[plan].summary} Need SSO or a custom rollout? <a className="text-link" href="/contact">Talk to us about Enterprise</a>.</small>
          {plan === 'core' ? <fieldset className="signup-bolt-ons">
            <legend>Bolt-ons (optional)</legend>
            {boltOnKeys.map((key) => <label className="signup-check" key={key}>
              <input checked={boltOns.includes(key)} onChange={() => toggleBoltOn(key)} type="checkbox" />
              <span>{commercialBoltOns[key].name} · +£{commercialBoltOns[key].monthlyPriceGbp}/month<small>{commercialBoltOns[key].description}</small></span>
            </label>)}
          </fieldset> : null}
          {plan !== 'lite' ? <label>Extra team members (£{extraSeat.monthlyPriceGbp}/month each, {commercialPlans[PLANS[plan].tier].includedSeats} included)
            <input inputMode="numeric" max={extraSeat.maxPerSignup} min={0} onChange={(event) => setExtraSeats(Math.min(extraSeat.maxPerSignup, Math.max(0, Math.floor(Number(event.target.value) || 0))))} type="number" value={extraSeats} />
          </label> : null}
          <p className="signup-total"><strong>Monthly total: {formatGbp(total)}</strong></p>
          <label>Your name<input autoComplete="name" onChange={(event) => setOwnerName(event.target.value)} required value={ownerName} /></label>
          <label>Business name<input autoComplete="organization" onChange={(event) => setBusinessName(event.target.value)} required value={businessName} /></label>
          <label>Work email<input autoComplete="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <PasswordField autoComplete="new-password" label="Password (12+ characters)" minLength={12} onChange={setPassword} value={password} />
          <PasswordField autoComplete="new-password" label="Confirm password" minLength={12} onChange={setConfirmation} value={confirmation} />
          <input aria-hidden="true" autoComplete="off" name="website" onChange={(event) => setWebsite(event.target.value)} style={{ display: 'none' }} tabIndex={-1} value={website} />
          {message ? <div className="complete-workspace-error" role="alert">{message}</div> : null}
          <button className="retail-app-primary" disabled={status === 'submitting'} type="submit">
            {status === 'submitting' ? 'Creating your account…' : plan === 'lite' ? 'Create free account' : `Continue to payment · ${formatGbp(total)}`}
          </button>
        </form>
        <small className="site-access-note">Already have an account? <a className="text-link" href="/app/retail">Sign in</a>.</small>
      </>}
    </section>
  </main>
}
