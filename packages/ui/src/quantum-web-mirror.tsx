/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useMemo, useState } from 'react'
import { brandList, type BrandDefinition } from '@foundingos/config'

// Shared example data mirroring the mobile modules — additive, content-only.

type CarBodyType = 'Hatchback' | 'SUV' | 'Saloon' | 'Pickup' | 'Van'

type UsedCar = {
  id: string
  name: string
  price: number
  currency: string
  mileageKm: number
  year: number
  bodyType: CarBodyType
  fuel: string
  transmission: string
  color: string
  description: string
  finance: { depositPct: number; monthly: number; termMonths: number }
}

const BODY_TYPES: Array<CarBodyType | 'All'> = ['All', 'Hatchback', 'SUV', 'Saloon', 'Pickup', 'Van']
const PRICE_FILTERS: Array<{ label: string; value?: number }> = [
  { label: 'Any price', value: undefined },
  { label: 'Under £15k', value: 15000 },
  { label: 'Under £25k', value: 25000 },
  { label: 'Under £40k', value: 40000 },
]
const MILEAGE_FILTERS: Array<{ label: string; value?: number }> = [
  { label: 'Any mileage', value: undefined },
  { label: 'Under 40k km', value: 40000 },
  { label: 'Under 80k km', value: 80000 },
  { label: 'Under 120k km', value: 120000 },
]

const USED_CARS: UsedCar[] = [
  { id: 'car-civic-2021', name: 'Honda Civic 1.5 Sport', price: 18900, currency: '£', mileageKm: 34200, year: 2021, bodyType: 'Hatchback', fuel: 'Petrol', transmission: 'Manual', color: 'Rallye Red', description: 'One-owner Civic Sport with full service history, reverse camera, and lane-keep assist. Fresh MOT and two keys.', finance: { depositPct: 10, monthly: 349, termMonths: 48 } },
  { id: 'car-rav4-2020', name: 'Toyota RAV4 Hybrid AWD', price: 27400, currency: '£', mileageKm: 56800, year: 2020, bodyType: 'SUV', fuel: 'Hybrid', transmission: 'Automatic', color: 'Graphite Grey', description: 'Efficient hybrid SUV with AWD, adaptive cruise, and heated seats. Ideal family workhorse with strong resale value.', finance: { depositPct: 10, monthly: 499, termMonths: 48 } },
  { id: 'car-3series-2022', name: 'BMW 320i M Sport', price: 33900, currency: '£', mileageKm: 21900, year: 2022, bodyType: 'Saloon', fuel: 'Petrol', transmission: 'Automatic', color: 'Portimao Blue', description: 'M Sport saloon with low mileage, digital cockpit, and parking sensors front and rear. Dealer warranty included.', finance: { depositPct: 15, monthly: 589, termMonths: 48 } },
  { id: 'car-hilux-2019', name: 'Toyota Hilux 2.4 Invincible', price: 29900, currency: '£', mileageKm: 87400, year: 2019, bodyType: 'Pickup', fuel: 'Diesel', transmission: 'Manual', color: 'Silver Sky', description: 'Work-ready double-cab pickup with tow bar, load liner, and 4x4 low range. Serviced every 10k km.', finance: { depositPct: 15, monthly: 539, termMonths: 48 } },
  { id: 'car-transit-2020', name: 'Ford Transit Custom 300', price: 21900, currency: '£', mileageKm: 96200, year: 2020, bodyType: 'Van', fuel: 'Diesel', transmission: 'Manual', color: 'Frozen White', description: 'Fleet-maintained panel van with ply lining, bulkhead, and dual sliding doors. Ready for immediate work.', finance: { depositPct: 10, monthly: 419, termMonths: 48 } },
]

type JourneyCohort = 'Small' | 'Medium' | 'Large'
const JOURNEY_COHORTS: JourneyCohort[] = ['Small', 'Medium', 'Large']
const JOURNEY_STAGES: Array<{ id: string; label: string; icon: string; description: string; values: Record<JourneyCohort, number> }> = [
  { id: 'awareness', label: 'Awareness', icon: '◎', description: 'First touch: ads, referrals, WhatsApp broadcasts, and marketplace discovery.', values: { Small: 120, Medium: 840, Large: 5200 } },
  { id: 'consideration', label: 'Consideration', icon: '◐', description: 'Browsing products, comparing prices, saving favourites, asking questions.', values: { Small: 64, Medium: 432, Large: 2600 } },
  { id: 'engagement', label: 'Engagement', icon: '◈', description: 'Active conversations, quotes requested, demos booked, carts started.', values: { Small: 38, Medium: 256, Large: 1500 } },
  { id: 'purchase', label: 'Purchase', icon: '◉', description: 'Orders placed and payments confirmed across card, mobile money, and crypto.', values: { Small: 21, Medium: 148, Large: 860 } },
  { id: 'retention', label: 'Retention', icon: '⟡', description: 'Repeat purchases, loyalty actions, reviews, and referral generation.', values: { Small: 14, Medium: 102, Large: 590 } },
]

function stageConversion(index: number, cohort: JourneyCohort) {
  if (index === 0) return '100%'
  const previous = JOURNEY_STAGES[index - 1].values[cohort]
  return `${Math.round((JOURNEY_STAGES[index].values[cohort] / previous) * 100)}%`
}

export function WebBrandWheel() {
  const brands = useMemo(() => brandList.filter((brand) => brand.slug !== 'foundingos'), [])
  const [activeSlug, setActiveSlug] = useState<string>(brands[0]?.slug ?? 'retail')
  const active = brands.find((brand) => brand.slug === activeSlug) ?? brands[0]

  return (
    <section id="brand-wheel" className="module-grid quantum-web-wheel" aria-label="360 BrandWheel">
      <article className="card-premium quantum-card" style={{ gridColumn: '1 / -1' }}>
        <p className="eyebrow">360 BrandWheel</p>
        <h2 className="header-premium">Switch brands without leaving the page</h2>
        <p>Exactly like the mobile BrandWheel — selecting a brand updates the accent, visuals, and module preview instantly, with no navigation.</p>
        <div className="quantum-web-wheel-ring">
          {brands.map((brand, index) => {
            const angle = (index / brands.length) * 360 - 90
            const isActive = brand.slug === activeSlug
            return (
              <button
                key={brand.slug}
                type="button"
                className={`quantum-web-wheel-node${isActive ? ' is-active' : ''}`}
                style={{ '--accent': brand.accent, transform: `rotate(${angle}deg) translate(140px) rotate(${-angle}deg)` } as React.CSSProperties}
                onClick={() => setActiveSlug(brand.slug)}
                aria-pressed={isActive}
              >
                <span className="quantum-web-wheel-badge">{brand.logo}</span>
                <span className="quantum-web-wheel-label">{brand.name.replace('Found', '')}</span>
              </button>
            )
          })}
          {active ? (
            <div className="quantum-web-wheel-hub" style={{ '--accent': active.accent } as React.CSSProperties}>
              <span className="quantum-web-wheel-hub-badge">{active.logo}</span>
              <strong>{active.name}</strong>
              <span>{active.tagline}</span>
            </div>
          ) : null}
        </div>
        {active ? (
          <div className="quantum-web-wheel-detail" style={{ '--accent': active.accent } as React.CSSProperties}>
            <h3>{active.name}</h3>
            <p>{active.summary}</p>
            <div className="quantum-web-wheel-modules">
              {active.modules.map((module) => <span key={module} className="quantum-web-wheel-module">{module}</span>)}
            </div>
          </div>
        ) : null}
      </article>
    </section>
  )
}

export function WebCustomerJourney({ accent, brandName }: { accent: string; brandName: string }) {
  const [cohort, setCohort] = useState<JourneyCohort>('Medium')
  const max = Math.max(...JOURNEY_STAGES.map((stage) => stage.values[cohort]))

  return (
    <article className="card-premium quantum-card quantum-journey" style={{ '--accent': accent } as React.CSSProperties}>
      <p className="eyebrow">{brandName} journey</p>
      <h3>Visual customer progression</h3>
      <p>Track how customers move from first touch to loyal repeat buyer, by cohort.</p>
      <div className="quantum-journey-cohorts">
        {JOURNEY_COHORTS.map((entry) => (
          <button
            key={entry}
            type="button"
            className={`quantum-journey-cohort${cohort === entry ? ' is-active' : ''}`}
            onClick={() => setCohort(entry)}
            aria-pressed={cohort === entry}
          >
            {entry}
          </button>
        ))}
      </div>
      <ol className="quantum-journey-stages">
        {JOURNEY_STAGES.map((stage, index) => {
          const fill = Math.max(8, Math.round((stage.values[cohort] / max) * 100))
          return (
            <li key={stage.id} className="quantum-journey-stage">
              <span className="quantum-journey-dot" aria-hidden="true">{stage.icon}</span>
              <div className="quantum-journey-copy">
                <div className="quantum-journey-stage-header">
                  <strong>{stage.label}</strong>
                  <span>{stage.values[cohort].toLocaleString('en-GB')} · {stageConversion(index, cohort)}</span>
                </div>
                <p>{stage.description}</p>
                <div className="quantum-journey-meter" role="img" aria-label={`${stage.label} ${fill}% of cohort peak`}>
                  <span style={{ width: `${fill}%` }} />
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </article>
  )
}

export function WebUsedCarShop({ accent }: { accent: string }) {
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [maxMileage, setMaxMileage] = useState<number | undefined>(undefined)
  const [bodyType, setBodyType] = useState<(typeof BODY_TYPES)[number]>('All')
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)

  const cars = USED_CARS.filter((car) => {
    if (bodyType !== 'All' && car.bodyType !== bodyType) return false
    if (maxPrice !== undefined && car.price > maxPrice) return false
    if (maxMileage !== undefined && car.mileageKm > maxMileage) return false
    return true
  })

  const filterButton = (label: string, active: boolean, onClick: () => void) => (
    <button key={label} type="button" className={`quantum-carshop-filter${active ? ' is-active' : ''}`} onClick={onClick} aria-pressed={active}>
      {label}
    </button>
  )

  return (
    <article className="card-premium quantum-card quantum-carshop" style={{ '--accent': accent, gridColumn: '1 / -1' } as React.CSSProperties}>
      <p className="eyebrow">FoundRetail automotive</p>
      <h3>Used Car Shop</h3>
      <p>Example forecourt inventory with price, mileage, body type filters, and finance-ready detail views — the same module that ships in the mobile app.</p>

      <div className="quantum-carshop-filters">
        <div className="quantum-carshop-filter-row">{PRICE_FILTERS.map((filter) => filterButton(filter.label, maxPrice === filter.value, () => setMaxPrice(filter.value)))}</div>
        <div className="quantum-carshop-filter-row">{MILEAGE_FILTERS.map((filter) => filterButton(filter.label, maxMileage === filter.value, () => setMaxMileage(filter.value)))}</div>
        <div className="quantum-carshop-filter-row">{BODY_TYPES.map((filter) => filterButton(filter, bodyType === filter, () => setBodyType(filter)))}</div>
      </div>

      {cars.length === 0 ? (
        <p className="quantum-carshop-empty">No vehicles match those filters.</p>
      ) : (
        <div className="quantum-carshop-grid">
          {cars.map((car) => {
            const isOpen = selectedCarId === car.id
            return (
              <div key={car.id} className="quantum-carshop-card">
                <div className="quantum-carshop-photo" aria-label={`${car.name} photo placeholder`}>
                  <span>◈</span>
                  <small>{car.color}</small>
                </div>
                <div className="quantum-carshop-card-copy">
                  <strong>{car.name}</strong>
                  <span className="quantum-carshop-meta">{car.currency}{car.price.toLocaleString('en-GB')} · {car.mileageKm.toLocaleString('en-GB')} km · {car.year}</span>
                  <span className="quantum-carshop-meta">{car.bodyType} · {car.fuel} · {car.transmission}</span>
                </div>
                {isOpen ? (
                  <div className="quantum-carshop-detail">
                    <p>{car.description}</p>
                    <p className="quantum-carshop-finance">
                      Finance: {car.finance.depositPct}% deposit · {car.currency}{car.finance.monthly}/mo · {car.finance.termMonths} months
                    </p>
                    <p className="quantum-carshop-meta">Photos: 8 angles + interior (demo placeholders)</p>
                    <div className="quantum-carshop-ctas">
                      <button type="button" className="btn btn-primary btn-premium">Reserve this car</button>
                      <button type="button" className="btn btn-secondary">Book a test drive</button>
                    </div>
                  </div>
                ) : null}
                <button type="button" className="btn btn-secondary quantum-carshop-toggle" onClick={() => setSelectedCarId(isOpen ? null : car.id)}>
                  {isOpen ? 'Hide details' : 'View details'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}

export function WebBrandModulePanel({ brand }: { brand: BrandDefinition }) {
  return (
    <div className="quantum-web-brand-modules">
      <WebCustomerJourney accent={brand.accent} brandName={brand.name} />
      {brand.slug === 'retail' ? <WebUsedCarShop accent={brand.accent} /> : null}
    </div>
  )
}

const TUTORIALS: Array<{ id: string; title: string; description: string; steps: string[]; image: string; why: string; helps: string; does: string }> = [
  {
    id: 'foundingos-overview',
    title: 'FoundingOS overview',
    description: 'See the whole multi-brand operating system in one command layer.',
    steps: ['Open the FoundingOS console.', 'Review the brand registry and cross-brand activity.', 'Check package entitlements before acting.', 'Approve a queued AI recommendation.'],
    image: '/demo/screens/home.jpg',
    why: 'Founders need one source of truth across every brand, not ten disconnected dashboards.',
    helps: 'It collapses reporting, entitlements, and AI decisions into a single safe surface.',
    does: 'FoundingOS keeps every brand connected, governed, and approval-ready from day one.',
  },
  {
    id: 'brand-switching',
    title: 'Brand switching with the 360 BrandWheel',
    description: 'Change the active brand context instantly — on mobile and web — without losing your place.',
    steps: ['Open the BrandWheel.', 'Select a brand node on the ring.', 'Watch the accent, modules, and visuals update instantly.', 'Continue working in the new brand context.'],
    image: '/demo/screens/brandwheel.jpg',
    why: 'Operators work across brands all day and cannot afford constant re-navigation.',
    helps: 'It keeps context switching instant and safe — the shell never changes, only the brand accent does.',
    does: 'FoundingOS applies the selected brand identity everywhere, instantly, with locked brand colours.',
  },
  {
    id: 'retail-used-car-shop',
    title: 'Retail Used Car Shop',
    description: 'Run an automotive forecourt inside FoundRetail with filters, detail pages, and finance options.',
    steps: ['Open the FoundRetail brand.', 'Filter stock by price, mileage, and body type.', 'Open a vehicle to review photos, description, and finance.', 'Reserve the car or book a test drive.'],
    image: '/demo/screens/carshop.jpg',
    why: 'Retailers increasingly sell high-value stock that needs richer detail than a simple product row.',
    helps: 'It gives sales teams a clean forecourt view with finance-first selling built in.',
    does: 'FoundingOS turns any retail catalogue into a premium, filterable showroom.',
  },
  {
    id: 'customer-journey',
    title: 'Customer Journey analytics',
    description: 'Visualise Awareness → Consideration → Engagement → Purchase → Retention for every cohort.',
    steps: ['Open a brand page.', 'Pick a cohort: Small, Medium, or Large.', 'Read stage counts and conversion percentages.', 'Spot the weakest stage and act on it.'],
    image: '/demo/screens/journey.jpg',
    why: 'Growth stalls when teams cannot see where customers drop off.',
    helps: 'It makes funnel health obvious at a glance, per business size.',
    does: 'FoundingOS renders the journey with Quantum glow meters so the next action is always clear.',
  },
  {
    id: 'superdash',
    title: 'Superdash command view',
    description: 'One dashboard for metrics, AI insights, and quick actions across every brand.',
    steps: ['Open Superdash.', 'Review brand metrics and anomaly flags.', 'Trigger a quick action — collect payment, create order, approve workflow.', 'Let the offline outbox sync when connectivity returns.'],
    image: '/demo/screens/foundingos-demo.jpg',
    why: 'Leaders need the full picture without opening eight tools.',
    helps: 'It combines live metrics, AI guidance, and one-tap actions in a single view.',
    does: 'FoundingOS keeps every decision one glance and one approval away.',
  },
  {
    id: 'package-model-d',
    title: 'Package Model D entitlements',
    description: 'Understand how Starter, Growth, and Enterprise tiers unlock modules and bolt-ons.',
    steps: ['Open the package view.', 'Compare Starter, Growth, and Enterprise inclusions.', 'Preview the bolt-ons each tier unlocks.', 'Confirm the right tier for each brand.'],
    image: '/demo/screens/tutorials.jpg',
    why: 'Pricing only works when every team knows exactly what their tier unlocks.',
    helps: 'It removes upgrade ambiguity and makes entitlement checks automatic.',
    does: 'FoundingOS gates features cleanly per tier so growth never breaks the system.',
  },
  {
    id: 'ai-onboarding',
    title: 'AI onboarding with FoundAI',
    description: 'Let FoundAI onboard every user role with human-first guidance.',
    steps: ['Meet FoundAI on first launch.', 'Describe your role and goals.', 'Let FoundAI configure the workspace.', 'Ask anything — FoundAI answers in context.'],
    image: '/demo/screens/talent-demo.jpg',
    why: 'People abandon software when onboarding feels like homework.',
    helps: 'It turns setup and training into a conversation instead of a manual.',
    does: 'FoundingOS makes every user productive in minutes, not weeks.',
  },
  {
    id: 'multi-brand-ecosystem',
    title: 'Multi-brand SaaS ecosystem',
    description: 'See how Retail, Meat, Talent, Crypto, Finance, Health, Logistics, and FoundThat share one OS.',
    steps: ['Open the brand directory.', 'Compare modules across brands.', 'Switch brands with the BrandWheel.', 'Watch entitlements and accents stay perfectly locked.'],
    image: '/demo/screens/brand-demos.jpg',
    why: 'Multi-brand groups waste fortunes on duplicated tools and drift.',
    helps: 'It gives every brand its own identity on top of one shared operating layer.',
    does: 'FoundingOS runs every brand on one stable, Quantum-grade foundation.',
  },
]

export function WebTutorialSystem() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section id="tutorials" className="module-grid quantum-tutorials" aria-label="Demos and tutorials">
      <article className="card-premium" style={{ gridColumn: '1 / -1' }}>
        <h2 className="header-premium">Demos and tutorials</h2>
        <p>Step-by-step walkthroughs with screenshots, user flows, and the business case for every part of the ecosystem — mirroring the mobile demo system.</p>
      </article>
      {TUTORIALS.map((tutorial) => {
        const isOpen = openId === tutorial.id
        return (
          <article key={tutorial.id} className="card-premium quantum-tutorial-card">
            <div className="quantum-tutorial-media">
              <img src={tutorial.image} alt={`${tutorial.title} walkthrough`} loading="lazy" />
            </div>
            <div className="quantum-tutorial-copy">
              <h3>{tutorial.title}</h3>
              <p>{tutorial.description}</p>
              {isOpen ? (
                <div className="quantum-tutorial-detail">
                  <ol className="quantum-tutorial-steps">
                    {tutorial.steps.map((step, index) => (
                      <li key={step}>
                        <span className="quantum-tutorial-step-index">{index + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="quantum-tutorial-blocks">
                    <div>
                      <strong>Why this matters</strong>
                      <p>{tutorial.why}</p>
                    </div>
                    <div>
                      <strong>How this helps your business</strong>
                      <p>{tutorial.helps}</p>
                    </div>
                    <div>
                      <strong>What FoundingOS does for you</strong>
                      <p>{tutorial.does}</p>
                    </div>
                  </div>
                </div>
              ) : null}
              <button type="button" className="btn btn-secondary quantum-tutorial-toggle" onClick={() => setOpenId(isOpen ? null : tutorial.id)} aria-expanded={isOpen}>
                {isOpen ? 'Close walkthrough' : 'Open walkthrough'}
              </button>
            </div>
          </article>
        )
      })}
    </section>
  )
}
