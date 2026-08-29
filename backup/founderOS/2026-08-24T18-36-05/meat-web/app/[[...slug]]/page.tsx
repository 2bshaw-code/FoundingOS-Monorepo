
'use client'

import { useState } from 'react'
import { brands } from '@foundingos/config'
import { PremiumSocialLinks } from '@foundingos/ui'

const features = [
  { title: 'Operational clarity', description: 'Keep every workflow, message, and update connected across the teams and channels your business uses.', icon: '◉' },
  { title: 'Multi-channel flow', description: 'Run customer, buyer, applicant, lead, and market operations through WhatsApp, Telegram, Messenger, Instagram DM, and SMS.', icon: '◎' },
  { title: 'Smarter automation', description: 'Trigger faster responses, route work, and reduce manual follow-up while preserving human control.', icon: '◍' },
  { title: 'Premium visibility', description: 'See your business in one view without losing the detail and context needed for decisive action.', icon: '◆' },
] as const

const pricing = [
  { slug: 'butcheros', name: 'Starter', price: '£19.99', blurb: 'For lean teams starting with cleaner workflows and faster channel responses.', features: ['1 workspace', 'Core automation', 'Multi-channel messaging', 'Basic reporting'], featured: false },
  { slug: 'factoryos', name: 'Growth', price: '£49.99', blurb: 'For teams scaling with more complexity, more volume, and stronger operational visibility.', features: ['Up to 5 workspaces', 'Smart routing', 'Advanced reporting', 'Team coordination'], featured: true },
  { slug: 'distributionos', name: 'Enterprise', price: '£99.99', blurb: 'For multi-team operations that need premium automation, governance, and control.', features: ['Unlimited workspaces', 'Advanced automation', 'Governance controls', 'Priority support'], featured: false },
] as const

const messagingOptions = [
  'WhatsApp', 'Telegram', 'Facebook Messenger', 'Instagram DM', 'SMS'
] as const

const consoleLinks = [
  { name: 'Supplier Console', href: `${brands.meat.consoleUrl.replace(/\/+$/, '')}/console` },
  { name: 'Buyer Console', href: `${brands.meat.consoleUrl.replace(/\/+$/, '')}/console` },
] as const

const meatHomeUrl = brands.meat.webUrl
const meatPackageUrl = (slug: string) => `${brands.meat.consoleUrl.replace(/\/+$/, '')}/console/packages/${slug}`

export default function Page() {
  const [bobOpen, setBobOpen] = useState(false)
  const [bobLoading, setBobLoading] = useState(false)
  const [bobAnswer, setBobAnswer] = useState('')
  const bobHighlights = [
    'Understands your business instantly',
    'Guides customers through services & pricing',
    'Explains processes clearly and simply',
    'Works across WhatsApp, Telegram, Messenger, Instagram DM & SMS',
  ] as const
  const bobQuestions = [
    'How do I check supplier availability?',
    'What are today’s best options?',
    'Can you explain delivery timings?',
    'Which console should I use?',
  ] as const
  const bobActions = [
    { label: 'Check stock risk', answer: 'Stock is healthy for your top sellers, but the pending supply route is running tight and should be reviewed before the next delivery window.' },
    { label: 'Route supplier follow-up', answer: 'I’ve prioritised the supplier check-ins and suggested the fastest path to resolve delay risk and delivery issues.' },
    { label: 'Promote fast movers', answer: 'Your highest-turn products are trending with repeat buyers, and I’ve prepared a focused promotional sequence for the next cycle.' },
    { label: 'Review fulfilment pressure', answer: 'Fulfilment risk is rising for the late-day route, so I’ve flagged a dispatch review and a better ETA update for buyers.' },
  ] as const
  const consoleDetails = [
    { name: 'Supplier Console', href: `${brands.meat.consoleUrl.replace(/\/+$/, '')}/console`, description: 'Track supplier stock, inbound updates, and trading readiness in one place.' },
    { name: 'Buyer Console', href: `${brands.meat.consoleUrl.replace(/\/+$/, '')}/console`, description: 'Review listings, place orders, and follow trade progress through a buyer-friendly view.' },
  ] as const

  const handleBobAction = (answer: string) => {
    setBobLoading(true)
    setBobAnswer('')
    window.setTimeout(() => {
      setBobAnswer(answer)
      setBobLoading(false)
    }, 700)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#070c14', color: '#fff1f1', fontFamily: 'Inter, Segoe UI, sans-serif' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(7,12,20,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#fff1f1' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#E53935', color: '#071014', display: 'grid', placeItems: 'center', fontWeight: 900, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>◆</div>
            <div>
              <strong style={{ display: 'block', fontSize: 22, lineHeight: 1.1 }}>FoundMeat</strong>
              <small style={{ color: '#f3d5d2', fontSize: 12 }}>{'Local Meat Trade OS'}</small>
            </div>
          </a>

          <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <a href="#top" style={navChip}>Home</a>
            <a href="#features" style={navChip}>Features</a>
            <a href="#messaging" style={navChip}>Messaging Channels</a>
            <details style={{ position: 'relative', display: 'inline-block' }}>
              <summary style={{ ...navChip, listStyle: 'none', cursor: 'pointer' }}>Consoles</summary>
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', minWidth: 280, background: 'rgba(8,13,20,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.35)', display: 'grid', gap: 8, zIndex: 30 }}>
                {consoleLinks.map(({ name, href }) => (
                  <a key={name} href={href} style={{ color: '#fff1f1', textDecoration: 'none', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 13, fontWeight: 700 }}>{name}</a>
                ))}
              </div>
            </details>
            <a href={meatHomeUrl} style={navChip}>Back to home</a>
            <a href="/legal" style={navChip}>Legal</a>
          </nav>
        </div>
      </header>

      <section id="top" style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at top left, rgba(229,57,53,0.12), transparent 30%), #140d0d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 20px 52px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28, alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, color: '#fca5a5', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>FoundMeat brand ecosystem</p>
            <h1 style={{ margin: '22px 0 0', fontSize: 'clamp(48px, 7vw, 92px)', lineHeight: 0.96, letterSpacing: '-0.05em', maxWidth: 700 }}>{'Fresh supply. Clearer trade.'}</h1>
            <p style={{ marginTop: 22, maxWidth: 620, color: '#f3d5d2', fontSize: 20, lineHeight: 1.8 }}>{'FoundMeat connects suppliers, buyers, stock, and fulfilment across trusted trading journeys without friction.'}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 28 }}>
              <a href={meatPackageUrl('butcheros')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: '#E53935', color: '#061018', textDecoration: 'none', fontWeight: 900 }}>Choose your package</a>
              <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff1f1', textDecoration: 'none', fontWeight: 900, border: '1px solid rgba(255,255,255,0.08)' }}>View features</a>
            </div>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(15,23,32,0.82))', padding: 24, boxShadow: '0 26px 70px rgba(0,0,0,0.25)' }}>
            <div style={{ minHeight: 320, borderRadius: 24, background: 'radial-gradient(circle at top, rgba(229,57,53,0.18), transparent 58%), rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: 22, display: 'grid', gap: 14 }}>
              {['Operations visibility', 'Multi-channel messaging', 'Automation workflow', 'Brand reporting'].map((item) => (
                <div key={item} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                  <span style={{ color: '#fff1f1' }}>{item}</span>
                  <span style={{ color: '#E53935', fontWeight: 800 }}>Live</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 20px 24px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#E53935', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Features</p>
          <h2 style={{ margin: 0, fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.08 }}>A premium operating layer for your brand.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {features.map((feature) => (
            <article key={feature.title} style={{ padding: 22, borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(229,57,53,0.12)', color: '#E53935', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{feature.icon}</div>
              <h3 style={{ margin: '18px 0 10px', fontSize: 26 }}>{feature.title}</h3>
              <p style={{ margin: 0, lineHeight: 1.7, color: '#f3d5d2' }}>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="bob" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, background: 'linear-gradient(135deg, rgba(229,57,53,0.12), rgba(13,18,22,0.8))', padding: 28 }}>
          <div style={{ minHeight: 320, borderRadius: 24, background: 'radial-gradient(circle at top, rgba(229,57,53,0.28), transparent 58%), rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', padding: 20, textAlign: 'center' }}>
            <div style={{ display: 'grid', gap: 14, justifyItems: 'center', width: '100%' }}>
              <div style={{ width: 132, height: 132, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.34), transparent 38%), #E53935', color: '#061018', display: 'grid', placeItems: 'center', fontSize: 56, fontWeight: 900, boxShadow: '0 0 0 14px rgba(255,255,255,0.04), 0 0 44px rgba(229,57,53,0.45)', animation: 'bobFloat 4s ease-in-out infinite' }}>B</div>
              <div>
                <div style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 12, fontWeight: 800, color: '#fca5a5' }}>Bob AI</div>
                <h3 style={{ margin: '10px 0 0', fontSize: 28, lineHeight: 1.1 }}>Premium support for modern trade conversations</h3>
                <p style={{ margin: '12px auto 0', maxWidth: 320, color: '#f3d5d2', lineHeight: 1.7 }}>Instant answers, clearer guidance, and a more human customer experience across every trade journey.</p>
              </div>
              <div style={{ display: 'grid', gap: 10, width: '100%', maxWidth: 620 }}>
                {bobHighlights.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff1f1', fontWeight: 700 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E53935', boxShadow: '0 0 18px rgba(229,57,53,0.55)' }} />
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 8 }}>
                <button type="button" onClick={() => { setBobAnswer(''); setBobLoading(false); setBobOpen(true); }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: '#E53935', color: '#061018', textDecoration: 'none', fontWeight: 900, border: 'none', cursor: 'pointer' }}>Explore What Bob Can Do</button>
                <a href={meatPackageUrl('butcheros')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff1f1', textDecoration: 'none', fontWeight: 900, border: '1px solid rgba(255,255,255,0.08)' }}>Choose your package</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="consoles" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 24px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, background: 'rgba(255,255,255,0.03)', padding: 28 }}>
          <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
            <p style={{ margin: 0, color: '#E53935', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Our Consoles</p>
            <h3 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 42px)' }}>Purpose-built consoles for trade teams.</h3>
            <p style={{ margin: 0, maxWidth: 760, color: '#f3d5d2', lineHeight: 1.8 }}>Each console supports a distinct part of the operation, from supplier management to buyer ordering and fulfilment follow-up.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {consoleDetails.map((console) => (
              <article key={console.name} style={{ padding: 20, borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <h4 style={{ margin: 0, fontSize: 20 }}>{console.name}</h4>
                <p style={{ margin: '10px 0 0', color: '#f3d5d2', lineHeight: 1.7 }}>{console.description}</p>
                <a href={console.href} style={{ display: 'inline-flex', marginTop: 14, color: '#E53935', fontWeight: 800, textDecoration: 'none' }}>Open console →</a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="messaging" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#E53935', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Messaging Channels</p>
          <h2 style={{ margin: 0, fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.08 }}>All workflows can run through any supported channel.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {messagingOptions.map((channel) => (
            <div key={channel} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(229,57,53,0.12)', color: '#E53935', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{channel.slice(0, 2).toUpperCase()}</div>
              <p style={{ margin: '14px 0 0', fontSize: 18, fontWeight: 800 }}>{channel}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#E53935', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Pricing</p>
          <h3 style={{ margin: '16px 0 0', fontSize: 'clamp(32px, 4vw, 46px)' }}>Choose your package</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {pricing.map((tier) => (
            <article key={tier.name} style={{ padding: 24, borderRadius: 18, border: tier.featured ? '1px solid ' + '#E53935' : '1px solid rgba(255,255,255,0.08)', background: tier.featured ? 'linear-gradient(180deg, rgba(229,57,53,0.12), rgba(10,15,20,0.85))' : 'rgba(255,255,255,0.02)', display: 'grid', gap: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#E53935', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>{tier.name}</p>
                <h4 style={{ margin: '10px 0 0', fontSize: 42 }}>{tier.price}</h4>
              </div>
              <p style={{ margin: 0, color: '#f3d5d2', lineHeight: 1.7 }}>{tier.blurb}</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#fff1f1', lineHeight: 1.9 }}>
                {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <a href={meatPackageUrl(tier.slug)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 46, borderRadius: 12, background: '#E53935', color: '#071014', fontWeight: 900, textDecoration: 'none' }}>Get started</a>
            </article>
          ))}
        </div>
      </section>
      <section id="signup" style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 20px 24px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, background: 'rgba(255,255,255,0.03)', padding: 22, display: 'grid', gap: 14 }}>
          <p style={{ margin: 0, color: '#E53935', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Signup</p>
          <h3 style={{ margin: 0, fontSize: 'clamp(26px, 3.4vw, 38px)' }}>Sign up with Google, Apple, or email.</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <a href="#google" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', textDecoration: 'none', fontWeight: 800 }}>Google account signup</a>
            <a href="#apple" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', textDecoration: 'none', fontWeight: 800 }}>Apple account signup</a>
            <a href="#email" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', textDecoration: 'none', fontWeight: 800 }}>Email signup</a>
          </div>
        </div>
      </section>
      <section id="contact" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 12px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, background: 'rgba(255,255,255,0.03)', padding: 22, display: 'grid', gap: 14 }}>
          <p style={{ margin: 0, color: '#E53935', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Contact</p>
          <h3 style={{ margin: 0, fontSize: 'clamp(26px, 3.4vw, 38px)' }}>Connect with FoundMeat on every channel.</h3>
        </div>
      </section>
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#070c14', marginTop: 60 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 40px', display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <strong style={{ fontSize: 22 }}>{'FoundMeat'}</strong>
            <p style={{ margin: '10px 0 0', maxWidth: 480, color: '#f3d5d2', lineHeight: 1.7 }}>{'Reliable trade operations for suppliers, buyers, and local food teams.'}</p>
            <p style={{ margin: '10px 0 0', color: '#f3d5d2' }}>Registered address: 24 Founder Way, London, UK</p>
          </div>
          <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
            <div style={{ color: '#f3d5d2' }}>hello@FoundMeat.com</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href="/legal" style={{ color: '#E53935', textDecoration: 'none', fontWeight: 700 }}>Privacy Policy</a>
              <a href="/legal" style={{ color: '#E53935', textDecoration: 'none', fontWeight: 700 }}>Terms</a>
              <a href="/legal" style={{ color: '#E53935', textDecoration: 'none', fontWeight: 700 }}>Cookies</a>
            </div>
            <div style={{ color: '#f3d5d2', fontSize: 14 }}>© 2026 FoundMeat • All rights reserved</div>
          </div>
          <div style={{ width: '100%', marginTop: 8 }}>
            <PremiumSocialLinks accent="#E53935" mode="full" label="Social & messaging" />
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => { setBobAnswer(''); setBobLoading(false); setBobOpen(true); }}
        aria-label="Open Bob AI"
        style={{ position: 'fixed', right: 22, bottom: 22, zIndex: 65, width: 90, height: 90, borderRadius: '50%', border: 'none', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.26), transparent 42%), #E53935', color: '#061018', boxShadow: '0 18px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.18), 0 0 28px rgba(229,57,53,0.45)', cursor: 'pointer', animation: 'bobFloat 4s ease-in-out infinite, bobGlow 2.8s ease-in-out infinite' }}
      >
        <span style={{ display: 'grid', placeItems: 'center', gap: 2, lineHeight: 1 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>Bob</span>
          <span style={{ fontSize: 22, fontWeight: 900 }}>AI</span>
        </span>
      </button>


        {bobOpen && (
          <div onClick={() => setBobOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(1, 5, 10, 0.72)', display: 'grid', placeItems: 'center', padding: 20, zIndex: 60 }}>
            <div onClick={(event) => event.stopPropagation()} style={{ position: 'relative', width: 'min(440px, 92vw)', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(10, 15, 20, 0.98))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, boxShadow: '0 28px 80px rgba(0,0,0,0.45)', padding: 24, color: '#edf7ff' }}>
              <button type="button" onClick={() => setBobOpen(false)} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', cursor: 'pointer', fontSize: 18 }}>×</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 74, height: 74, borderRadius: '50%', background: '#E53935', color: '#071014', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 28, boxShadow: '0 0 0 8px rgba(255,255,255,0.04)', animation: 'bobFloat 4s ease-in-out infinite' }}>B</div>
                <div>
                  <div style={{ letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: 11, fontWeight: 800, color: '#E53935' }}>Bob AI</div>
                  <h3 style={{ margin: '8px 0 0', fontSize: 24 }}>Your smart brand assistant</h3>
                </div>
              </div>
              <p style={{ margin: 0, color: '#bfd8ee', lineHeight: 1.7 }}>Bob AI keeps suppliers, buyers, and fulfilment teams aligned on live stock, delivery timing, and trade updates.</p>
              <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
                {bobActions.map((action) => (
                  <button key={action.label} type="button" onClick={() => handleBobAction(action.answer)} style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '12px 14px', color: '#edf7ff', textAlign: 'left', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                    {action.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', minHeight: 100, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {bobLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#E53935', fontWeight: 700 }}>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E53935', animation: 'bobPulse 1s ease-in-out infinite' }} />
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E53935', animation: 'bobPulse 1s ease-in-out 0.15s infinite' }} />
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E53935', animation: 'bobPulse 1s ease-in-out 0.3s infinite' }} />
                    </span>
                    Bob is preparing your answer...
                  </div>
                ) : (
                  <div style={{ color: '#edf7ff', lineHeight: 1.7, textAlign: 'left', width: '100%' }}>
                    {bobAnswer || "Tap a smart action to see Bob AI's recommendation."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      <style jsx>{`
        summary::-webkit-details-marker { display: none; }
        details[open] summary { background: rgba(255,255,255,0.06); }
        @keyframes bobFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bobPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes bobGlow {
          0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 18px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.18), 0 0 28px rgba(229,57,53,0.45); }
          50% { transform: translateY(-2px) scale(1.03); box-shadow: 0 22px 48px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.22), 0 0 34px rgba(229,57,53,0.62); }
        }
        @media (max-width: 900px) {
          nav { justify-content: flex-start !important; }
          #top > div { grid-template-columns: 1fr !important; }
          #bob > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

const navChip = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff1f1', textDecoration: 'none', fontSize: 13, fontWeight: 700,
}
