/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useMemo, useState } from 'react'
import { brands, LOCKED_BRAND_COLORS, type BrandSlug } from '@foundingos/config'
import { BASE_TIERS, INDUSTRY_PACKS, HARDWARE_PACKS, type BaseTierName, type PricingModel } from '@foundingos/config/package-model-d'
import { calculateAddOnPrice, DEFAULT_USAGE, type UsageInputs } from '@foundingos/config/pricing-engine'
import { recommendQuantumOS, type BusinessProfile, type BusinessSize, type DataVolume, type IntelligenceNeeds, type RiskLevel, type GrowthTrajectory } from '@foundingos/config/quantum-recommendation'
import { RecommendationBadge } from './RecommendationBadge'
import { writeActivationState } from './activation-state'

type Step = 'business' | 'package' | 'addons' | 'payment' | 'review' | 'complete'
const STEPS: Step[] = ['business', 'package', 'addons', 'payment', 'review', 'complete']
const STEP_LABELS: Record<Step, string> = {
  business: 'Business',
  package: 'Package',
  addons: 'Add-ons',
  payment: 'Payment',
  review: 'Review',
  complete: 'Done',
}

const INDUSTRY_BRANDS = INDUSTRY_PACKS.map((pack) => pack.brand)

export function OnboardingForm({ commercialMode = 'demo' }: { commercialMode?: 'demo' | 'commercial' }) {
  const [step, setStep] = useState<Step>('business')
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [industry, setIndustry] = useState<BrandSlug>('retail')
  const [businessSize, setBusinessSize] = useState<BusinessSize>('small')
  const [dataVolume, setDataVolume] = useState<DataVolume>('medium')
  const [intelligenceNeeds, setIntelligenceNeeds] = useState<IntelligenceNeeds>('moderate')
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medium')
  const [growthTrajectory, setGrowthTrajectory] = useState<GrowthTrajectory>('steady')
  const [consoleCount, setConsoleCount] = useState(1)
  const [expectedMonthlyUsage, setExpectedMonthlyUsage] = useState(200)

  const [baseTier, setBaseTier] = useState<BaseTierName>('Standard')
  const [hardwarePacks, setHardwarePacks] = useState<string[]>([])

  const [quantumOS, setQuantumOS] = useState(false)
  const [intelligenceOS, setIntelligenceOS] = useState(false)
  const [pricingModel, setPricingModel] = useState<PricingModel>('A')
  const [usage, setUsage] = useState<UsageInputs>(DEFAULT_USAGE)

  const [logoColor, setLogoColor] = useState(LOCKED_BRAND_COLORS.foundingos)
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  const profile: BusinessProfile = useMemo(() => ({
    businessSize,
    industry,
    dataVolume,
    intelligenceNeeds,
    riskLevel,
    growthTrajectory,
    consoleCount,
    expectedMonthlyUsage,
  }), [businessSize, industry, dataVolume, intelligenceNeeds, riskLevel, growthTrajectory, consoleCount, expectedMonthlyUsage])

  const recommendation = useMemo(() => recommendQuantumOS(profile), [profile])

  const industryPack = INDUSTRY_PACKS.find((pack) => pack.brand === industry)
  const availableHardware = HARDWARE_PACKS.filter((pack) => pack.relevantBrands.includes(industry))
  const tier = BASE_TIERS.find((t) => t.name === baseTier)!

  const quantumPrice = quantumOS ? calculateAddOnPrice('quantumos', pricingModel, { tier: baseTier, usage }) : null
  const intelligencePrice = intelligenceOS ? calculateAddOnPrice('intelligenceos', pricingModel, { tier: baseTier, usage }) : null
  const hardwareTotal = hardwarePacks.reduce((total, slug) => total + (HARDWARE_PACKS.find((p) => p.slug === slug)?.monthlyPrice ?? 0), 0)
  const totalMonthly = tier.monthlyPrice + (industryPack?.monthlyPrice ?? 0) + hardwareTotal + (quantumPrice?.amount ?? 0) + (intelligencePrice?.amount ?? 0)

  const stepIndex = STEPS.indexOf(step)
  function goNext() {
    const next = STEPS[stepIndex + 1]
    if (next) setStep(next)
  }
  function goBack() {
    const prev = STEPS[stepIndex - 1]
    if (prev) setStep(prev)
  }

  function toggleHardware(slug: string) {
    setHardwarePacks((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]))
  }

  function complete() {
    // Commercial Mode: attempt real Stripe checkout first. If it's not actually configured
    // (501) or errors, fall back to the exact same Demo Mode activation as before — the
    // existing front-end behavior never breaks, even mid-rollout of real credentials.
    if (commercialMode === 'commercial' && (quantumOS || intelligenceOS)) {
      setCheckoutError(null)
      fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: ownerName || businessName, brandSlug: industry, priceId: 'demo' }),
      })
        .then((res) => res.json().then((data) => ({ status: res.status, data })))
        .then(({ status, data }) => {
          if (status === 200 && data.data?.checkoutUrl) {
            window.location.href = data.data.checkoutUrl
            return
          }
          // Not configured or errored — fall back to demo activation, matching current behavior.
          if (status !== 200) setCheckoutError(data.message ?? 'Checkout unavailable — activating in Demo Mode instead.')
          activateDemo()
        })
        .catch(() => {
          setCheckoutError('Checkout unavailable — activating in Demo Mode instead.')
          activateDemo()
        })
      return
    }

    activateDemo()
  }

  function activateDemo() {
    writeActivationState({
      businessName,
      industry,
      baseTier,
      industryPack: industryPack?.name,
      hardwarePacks,
      quantumOS,
      intelligenceOS,
      pricingModel,
      totalMonthly,
      activatedAt: new Date().toISOString(),
    })
    setStep('complete')
  }

  const brand = brands[industry]

  return (
    <div className="onboarding-shell">
      <div className="onboarding-steps">
        {STEPS.map((s, index) => (
          <span key={s} className={`onboarding-step-chip ${s === step ? 'active' : index < stepIndex ? 'done' : ''}`}>{STEP_LABELS[s]}</span>
        ))}
      </div>

      {step === 'business' && (
        <section className="panel panel-premium">
          <h2>Tell us about your business</h2>
          <div className="onboarding-field"><label>Business name</label><input value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></div>
          <div className="onboarding-grid-2">
            <div className="onboarding-field"><label>Owner name</label><input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} /></div>
            <div className="onboarding-field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          </div>
          <div className="onboarding-grid-2">
            <div className="onboarding-field"><label>Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div className="onboarding-field">
              <label>Industry</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value as BrandSlug)}>
                {INDUSTRY_BRANDS.map((slug) => <option key={slug} value={slug}>{brands[slug].name}</option>)}
              </select>
            </div>
          </div>
          <div className="onboarding-grid-2">
            <div className="onboarding-field">
              <label>Business size</label>
              <select value={businessSize} onChange={(e) => setBusinessSize(e.target.value as BusinessSize)}>
                <option value="solo">Solo</option><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
              </select>
            </div>
            <div className="onboarding-field">
              <label>Data volume</label>
              <select value={dataVolume} onChange={(e) => setDataVolume(e.target.value as DataVolume)}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="onboarding-grid-2">
            <div className="onboarding-field">
              <label>Intelligence needs</label>
              <select value={intelligenceNeeds} onChange={(e) => setIntelligenceNeeds(e.target.value as IntelligenceNeeds)}>
                <option value="basic">Basic</option><option value="moderate">Moderate</option><option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="onboarding-field">
              <label>Risk level</label>
              <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="onboarding-grid-2">
            <div className="onboarding-field">
              <label>Growth trajectory</label>
              <select value={growthTrajectory} onChange={(e) => setGrowthTrajectory(e.target.value as GrowthTrajectory)}>
                <option value="flat">Flat</option><option value="steady">Steady</option><option value="fast">Fast</option>
              </select>
            </div>
            <div className="onboarding-field"><label>Number of consoles</label><input type="number" min={1} value={consoleCount} onChange={(e) => setConsoleCount(Number(e.target.value) || 1)} /></div>
          </div>
          <div className="onboarding-field"><label>Expected monthly usage (actions)</label><input type="number" min={0} value={expectedMonthlyUsage} onChange={(e) => setExpectedMonthlyUsage(Number(e.target.value) || 0)} /></div>
          <button type="button" className="btn btn-primary quantum-btn" onClick={goNext} disabled={!businessName || !email}>Continue</button>
        </section>
      )}

      {step === 'package' && (
        <section className="panel panel-premium">
          <h2>Choose your SystemOS tier</h2>
          <div className="module-card-grid">
            {BASE_TIERS.map((t) => (
              <button key={t.name} type="button" className={`module-card card-premium ${baseTier === t.name ? 'active' : ''}`} onClick={() => setBaseTier(t.name)} style={{ textAlign: 'left', cursor: 'pointer' }}>
                <strong>{t.name}</strong>
                <p>{t.price}</p>
                <small>{t.description}</small>
              </button>
            ))}
          </div>

          {industryPack && (
            <>
              <h2 style={{ marginTop: 20 }}>Industry pack (included for {brand.name})</h2>
              <p>{industryPack.name} — {industryPack.price} — {industryPack.description}</p>
            </>
          )}

          {availableHardware.length > 0 && (
            <>
              <h2 style={{ marginTop: 20 }}>Hardware packs</h2>
              {availableHardware.map((pack) => (
                <label key={pack.slug} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <input type="checkbox" checked={hardwarePacks.includes(pack.slug)} onChange={() => toggleHardware(pack.slug)} />
                  {pack.name} — {pack.price}
                </label>
              ))}
            </>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" className="btn" onClick={goBack}>Back</button>
            <button type="button" className="btn btn-primary quantum-btn" onClick={goNext}>Continue</button>
          </div>
        </section>
      )}

      {step === 'addons' && (
        <section className="panel panel-premium">
          <h2>Add-ons</h2>
          <RecommendationBadge recommendation={recommendation} />

          <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <input type="checkbox" checked={quantumOS} onChange={(e) => setQuantumOS(e.target.checked)} /> QuantumOS
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <input type="checkbox" checked={intelligenceOS} onChange={(e) => setIntelligenceOS(e.target.checked)} /> IntelligenceOS
          </label>

          {(quantumOS || intelligenceOS) && (
            <>
              <h2>Pricing model</h2>
              <div className="onboarding-grid-2">
                <label><input type="radio" name="pricingModel" checked={pricingModel === 'A'} onChange={() => setPricingModel('A')} /> A — Flat pricing</label>
                <label><input type="radio" name="pricingModel" checked={pricingModel === 'B'} onChange={() => setPricingModel('B')} /> B — Tier-dependent pricing</label>
              </div>
              <label style={{ display: 'block', marginTop: 4 }}><input type="radio" name="pricingModel" checked={pricingModel === 'C'} onChange={() => setPricingModel('C')} /> C — Usage-based pricing</label>

              {pricingModel === 'C' && (
                <div className="onboarding-grid-2" style={{ marginTop: 12 }}>
                  {(Object.keys(usage) as (keyof UsageInputs)[]).map((key) => (
                    <div key={key} className="onboarding-field">
                      <label>{key}</label>
                      <input type="number" min={0} value={usage[key]} onChange={(e) => setUsage((current) => ({ ...current, [key]: Number(e.target.value) || 0 }))} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" className="btn" onClick={goBack}>Back</button>
            <button type="button" className="btn btn-primary quantum-btn" onClick={goNext}>Continue</button>
          </div>
        </section>
      )}

      {step === 'payment' && (
        <section className="panel panel-premium">
          <h2>Payment &amp; branding</h2>
          <div className="onboarding-demo-notice">Demo mode — no real payment is processed or stored. These fields are illustrative only.</div>
          <div className="onboarding-field"><label>Cardholder name</label><input value={cardName} onChange={(e) => setCardName(e.target.value)} /></div>
          <div className="onboarding-grid-2">
            <div className="onboarding-field"><label>Card number</label><input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="•••• •••• •••• ••••" /></div>
            <div className="onboarding-field"><label>Expiry / CVC</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" />
                <input value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="CVC" />
              </div>
            </div>
          </div>
          <div className="onboarding-field"><label>Brand colour</label><input type="color" value={logoColor} onChange={(e) => setLogoColor(e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" className="btn" onClick={goBack}>Back</button>
            <button type="button" className="btn btn-primary quantum-btn" onClick={goNext}>Continue</button>
          </div>
        </section>
      )}

      {step === 'review' && (
        <section className="panel panel-premium">
          <h2>Review &amp; activate</h2>
          <div className="onboarding-summary-line"><span>Business</span><span>{businessName} ({brand.name})</span></div>
          <div className="onboarding-summary-line"><span>SystemOS tier</span><span>{tier.name} — {tier.price}</span></div>
          {industryPack && <div className="onboarding-summary-line"><span>Industry pack</span><span>{industryPack.name} — {industryPack.price}</span></div>}
          {hardwarePacks.length > 0 && <div className="onboarding-summary-line"><span>Hardware packs</span><span>{hardwarePacks.length} selected — £{hardwareTotal}/mo</span></div>}
          {quantumPrice && <div className="onboarding-summary-line"><span>QuantumOS ({pricingModel})</span><span>£{quantumPrice.amount}/mo</span></div>}
          {intelligencePrice && <div className="onboarding-summary-line"><span>IntelligenceOS ({pricingModel})</span><span>£{intelligencePrice.amount}/mo</span></div>}
          <div className="onboarding-total"><span>Estimated total</span><span>£{Math.round(totalMonthly * 100) / 100}/mo</span></div>
          <RecommendationBadge recommendation={recommendation} />
          {checkoutError && <div className="onboarding-demo-notice">{checkoutError}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" className="btn" onClick={goBack}>Back</button>
            <button type="button" className="btn btn-primary quantum-btn" onClick={complete}>Activate package</button>
          </div>
        </section>
      )}

      {step === 'complete' && (
        <section className="panel panel-premium">
          <h2>You&apos;re all set, {businessName || 'founder'}.</h2>
          <p>SystemOS, {industryPack?.name}{hardwarePacks.length > 0 ? ', hardware packs' : ''}{quantumOS ? ', QuantumOS' : ''}{intelligenceOS ? ', IntelligenceOS' : ''} are now active for your account (demo activation).</p>
          <a className="btn btn-primary quantum-btn" href={brand.dashboardUrl}>Go to your Owner Console</a>
        </section>
      )}
    </div>
  )
}

export default OnboardingForm
