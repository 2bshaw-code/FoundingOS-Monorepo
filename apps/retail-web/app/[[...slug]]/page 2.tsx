
'use client'

import { useState } from 'react'
import { brands } from '@foundingos/config'
import { PremiumSocialLinks } from '@foundingos/ui'
import { RetailNavigation } from './RetailNavigation'

const features = [
  { title: 'Operational clarity', description: 'Keep every workflow, message, and update connected across the teams and channels your business uses.', icon: '◉' },
  { title: 'Multi-channel flow', description: 'Run customer, buyer, applicant, lead, and market operations through WhatsApp, Telegram, Messenger, Instagram DM, and SMS.', icon: '◎' },
  { title: 'Smarter automation', description: 'Trigger faster responses, route work, and reduce manual follow-up while preserving human control.', icon: '◍' },
  { title: 'Premium visibility', description: 'See your business in one view without losing the detail and context needed for decisive action.', icon: '◆' },
] as const

const pricing = [
  { slug: 'standard', name: 'Starter', price: '£19.99', blurb: 'For lean teams starting with cleaner workflows and faster channel responses.', features: ['1 workspace', 'Core automation', 'Multi-channel messaging', 'Basic reporting'], featured: false },
  { slug: 'pro', name: 'Growth', price: '£49.99', blurb: 'For teams scaling with more complexity, more volume, and stronger operational visibility.', features: ['Up to 5 workspaces', 'Smart routing', 'Advanced reporting', 'Team coordination'], featured: true },
  { slug: 'enterprise', name: 'Enterprise', price: '£99.99', blurb: 'For multi-team operations that need premium automation, governance, and control.', features: ['Unlimited workspaces', 'Advanced automation', 'Governance controls', 'Priority support'], featured: false },
] as const

const messagingOptions = [
  'WhatsApp', 'Telegram', 'Facebook Messenger', 'Instagram DM', 'SMS'
] as const

const retailPackageUrl = (slug: string) => `${brands.retail.consoleUrl.replace(/\/+$/, '')}/console/packages/${slug}`

export default function Page() {
    const [bobOpen, setBrandIntelligenceOpen] = useState(false)
    const [bobLoading, setBrandIntelligenceLoading] = useState(false)
    const [bobAnswer, setBrandIntelligenceAnswer] = useState('')
    const bobHighlights = [
      'Understands your business instantly',
      'Guides customers through services & pricing',
      'Explains processes clearly and simply',
      'Works across WhatsApp, Telegram, Messenger, Instagram DM & SMS',
    ] as const
    const bobQuestions = [
      'How do I track stock and delivery status?',
      'What package should I choose for my team?',
      'Can you explain the ordering workflow simply?',
      'Which channel should I use for customer replies?',
    ] as const
    const bobActions = [
      { label: 'Check stock risk', answer: 'Stock is healthy for your top sellers, but the South branch is running low on a fast-moving item and should be replenished before 4pm.' },
      { label: 'Route customer follow-up', answer: 'I’ve prioritised the new customer questions and drafted the best follow-up for each conversation queue.' },
      { label: 'Promote best sellers', answer: 'Your fastest-moving products are trending in repeat orders; I’ve prepared a promotion sequence for the next campaign.' },
      { label: 'Review delivery pressure', answer: 'Delivery risk is rising on the evening route, so I’ve flagged a dispatch review and an updated ETA message.' },
    ] as const
    const consoleDetails = [
          { name: 'Retail Manager Console', href: `${brands.retail.consoleUrl.replace(/\/+$/, '')}/console`, description: 'Manage retail operations, stock, and customer workflows from one central view.' },
          { name: 'Retail Staff Console', href: `${brands.retail.consoleUrl.replace(/\/+$/, '')}/console`, description: 'Handle day-to-day service tasks, fulfilment updates, and support follow-up.' },
    ] as const

    const handleBrandIntelligenceAction = (answer: string) => {
      setBrandIntelligenceLoading(true)
      setBrandIntelligenceAnswer('')
      window.setTimeout(() => {
        setBrandIntelligenceAnswer(answer)
        setBrandIntelligenceLoading(false)
      }, 700)
    }

  return (
    <main style={{ minHeight: '100vh', background: '#070c14', color: '#edf7ff', fontFamily: 'Inter, Segoe UI, sans-serif' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(7,12,20,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#edf7ff' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#00E676', color: '#071014', display: 'grid', placeItems: 'center', fontWeight: 900, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>◉</div>
            <div>
              <strong style={{ display: 'block', fontSize: 22, lineHeight: 1.1 }}>FoundRetail</strong>
              <small style={{ color: '#bfd8ee', fontSize: 12 }}>{'WhatsApp Retail OS'}</small>
            </div>
          </a>

          <RetailNavigation />
        </div>
      </header>

      <section id="top" style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at top left, rgba(0,230,118,0.12), transparent 30%), #07131d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 20px 52px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28, alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, color: '#8ef0ad', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>FoundRetail brand ecosystem</p>
            <h1 style={{ margin: '22px 0 0', fontSize: 'clamp(48px, 7vw, 92px)', lineHeight: 0.96, letterSpacing: '-0.05em', maxWidth: 700 }}>{'A calmer way to run conversational retail.'}</h1>
            <p style={{ marginTop: 22, maxWidth: 620, color: '#bfd8ee', fontSize: 20, lineHeight: 1.8 }}>{'FoundRetail connects catalogue, stock, orders, and service journeys across the channels customers already use.'}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 28 }}>
              <a href={retailPackageUrl('standard')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: '#00E676', color: '#061018', textDecoration: 'none', fontWeight: 900 }}>Choose your package</a>
              <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#edf7ff', textDecoration: 'none', fontWeight: 900, border: '1px solid rgba(255,255,255,0.08)' }}>View features</a>
            </div>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(15,23,32,0.82))', padding: 24, boxShadow: '0 26px 70px rgba(0,0,0,0.25)' }}>
            <div style={{ minHeight: 320, borderRadius: 24, background: 'radial-gradient(circle at top, rgba(0,230,118,0.18), transparent 58%), rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: 22, display: 'grid', gap: 14 }}>
              {['Operations visibility', 'Multi-channel messaging', 'Automation workflow', 'Brand reporting'].map((item) => (
                <div key={item} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                  <span style={{ color: '#edf7ff' }}>{item}</span>
                  <span style={{ color: '#00E676', fontWeight: 800 }}>Live</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 20px 24px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#00E676', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Features</p>
          <h2 style={{ margin: 0, fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.08 }}>A premium operating layer for your brand.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {features.map((feature) => (
            <article key={feature.title} style={{ padding: 22, borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(0,230,118,0.12)', color: '#00E676', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{feature.icon}</div>
              <h3 style={{ margin: '18px 0 10px', fontSize: 26 }}>{feature.title}</h3>
              <p style={{ margin: 0, lineHeight: 1.7, color: '#bfd8ee' }}>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="bob" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, background: 'linear-gradient(135deg, rgba(0,230,118,0.12), rgba(13,18,22,0.8))', padding: 28 }}>
          <div style={{ minHeight: 320, borderRadius: 24, background: 'radial-gradient(circle at top, rgba(0,230,118,0.28), transparent 58%), rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', padding: 20, textAlign: 'center' }}>
            <div style={{ display: 'grid', gap: 14, justifyItems: 'center', width: '100%' }}>
              <div style={{ width: 132, height: 132, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.34), transparent 38%), #00E676', color: '#061018', display: 'grid', placeItems: 'center', fontSize: 56, fontWeight: 900, boxShadow: '0 0 0 14px rgba(255,255,255,0.04), 0 0 44px rgba(0,230,118,0.45)', animation: 'bobFloat 4s ease-in-out infinite' }}>B</div>
              <div>
                <div style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 12, fontWeight: 800, color: '#8ef0ad' }}>Brand Intelligence AI</div>
                <h3 style={{ margin: '10px 0 0', fontSize: 28, lineHeight: 1.1 }}>Premium support for modern retail conversations</h3>
                <p style={{ margin: '12px auto 0', maxWidth: 320, color: '#bfd8ee', lineHeight: 1.7 }}>Instant answers, clearer guidance, and a more human customer experience across every retail journey.</p>
              </div>
              <div style={{ display: 'grid', gap: 10, width: '100%', maxWidth: 620 }}>
                {bobHighlights.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#edf7ff', fontWeight: 700 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00E676', boxShadow: '0 0 18px rgba(0,230,118,0.55)' }} />
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 8 }}>
                <button type="button" onClick={() => { setBrandIntelligenceAnswer(''); setBrandIntelligenceLoading(false); setBrandIntelligenceOpen(true); }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: '#00E676', color: '#061018', textDecoration: 'none', fontWeight: 900, border: 'none', cursor: 'pointer' }}>Explore What Brand Intelligence Can Do</button>
                <a href={retailPackageUrl('standard')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#edf7ff', textDecoration: 'none', fontWeight: 900, border: '1px solid rgba(255,255,255,0.08)' }}>Choose your package</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="consoles" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 24px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, background: 'rgba(255,255,255,0.03)', padding: 28 }}>
          <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
            <p style={{ margin: 0, color: '#00E676', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Our Consoles</p>
            <h3 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 42px)' }}>Purpose-built consoles for retail teams.</h3>
            <p style={{ margin: 0, maxWidth: 760, color: '#bfd8ee', lineHeight: 1.8 }}>Each console supports a distinct part of the retail operation, from management and service handling to day-to-day execution.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {consoleDetails.map((console) => (
              <article key={console.name} style={{ padding: 20, borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <h4 style={{ margin: 0, fontSize: 20 }}>{console.name}</h4>
                <p style={{ margin: '10px 0 0', color: '#bfd8ee', lineHeight: 1.7 }}>{console.description}</p>
                <a href={console.href} style={{ display: 'inline-flex', marginTop: 14, color: '#00E676', fontWeight: 800, textDecoration: 'none' }}>Open console →</a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="messaging" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#00E676', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Messaging Channels</p>
          <h2 style={{ margin: 0, fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.08 }}>All workflows can run through any supported channel.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {messagingOptions.map((channel) => (
            <div key={channel} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(0,230,118,0.12)', color: '#00E676', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{channel.slice(0, 2).toUpperCase()}</div>
              <p style={{ margin: '14px 0 0', fontSize: 18, fontWeight: 800 }}>{channel}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#00E676', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Pricing</p>
          <h3 style={{ margin: '16px 0 0', fontSize: 'clamp(32px, 4vw, 46px)' }}>Choose your package</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {pricing.map((tier) => (
            <article key={tier.name} style={{ padding: 24, borderRadius: 18, border: tier.featured ? '1px solid ' + '#00E676' : '1px solid rgba(255,255,255,0.08)', background: tier.featured ? 'linear-gradient(180deg, rgba(0,230,118,0.12), rgba(10,15,20,0.85))' : 'rgba(255,255,255,0.02)', display: 'grid', gap: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#00E676', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>{tier.name}</p>
                <h4 style={{ margin: '10px 0 0', fontSize: 42 }}>{tier.price}</h4>
              </div>
              <p style={{ margin: 0, color: '#bfd8ee', lineHeight: 1.7 }}>{tier.blurb}</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#edf7ff', lineHeight: 1.9 }}>
                {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <a href={retailPackageUrl(tier.slug)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 46, borderRadius: 12, background: '#00E676', color: '#071014', fontWeight: 900, textDecoration: 'none' }}>Get started</a>
            </article>
          ))}
        </div>
      </section>
      <section id="signup" style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 20px 24px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, background: 'rgba(255,255,255,0.03)', padding: 22, display: 'grid', gap: 14 }}>
          <p style={{ margin: 0, color: '#00E676', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Signup</p>
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
          <p style={{ margin: 0, color: '#00E676', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Contact</p>
          <h3 style={{ margin: 0, fontSize: 'clamp(26px, 3.4vw, 38px)' }}>Connect with FoundRetail on every channel.</h3>
        </div>
      </section>
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#070c14', marginTop: 60 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 40px', display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <strong style={{ fontSize: 22 }}>{'FoundRetail'}</strong>
            <p style={{ margin: '10px 0 0', maxWidth: 480, color: '#bfd8ee', lineHeight: 1.7 }}>{'Modern retail operations for customer journeys and storefront confidence.'}</p>
            <p style={{ margin: '10px 0 0', color: '#bfd8ee' }}>Registered address: 24 Founder Way, London, UK</p>
          </div>
          <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
            <div style={{ color: '#bfd8ee' }}>hello@FoundRetail.com</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href="/legal" style={{ color: '#00E676', textDecoration: 'none', fontWeight: 700 }}>Privacy Policy</a>
              <a href="/legal" style={{ color: '#00E676', textDecoration: 'none', fontWeight: 700 }}>Terms</a>
              <a href="/legal" style={{ color: '#00E676', textDecoration: 'none', fontWeight: 700 }}>Cookies</a>
            </div>
            <div style={{ color: '#bfd8ee', fontSize: 14 }}>© 2026 FoundRetail • All rights reserved</div>
          </div>
          <div style={{ width: '100%', marginTop: 8 }}>
            <PremiumSocialLinks accent="#00E676" mode="full" label="Social & messaging" />
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => { setBrandIntelligenceAnswer(''); setBrandIntelligenceLoading(false); setBrandIntelligenceOpen(true); }}
        aria-label="Open Brand Intelligence AI"
        style={{ position: 'fixed', right: 22, bottom: 22, zIndex: 65, width: 90, height: 90, borderRadius: '50%', border: 'none', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.26), transparent 42%), #00E676', color: '#061018', boxShadow: '0 18px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.18), 0 0 28px rgba(0,230,118,0.45)', cursor: 'pointer', animation: 'bobFloat 4s ease-in-out infinite, bobGlow 2.8s ease-in-out infinite' }}
      >
        <span style={{ display: 'grid', placeItems: 'center', gap: 2, lineHeight: 1 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>Brand Intelligence</span>
          <span style={{ fontSize: 22, fontWeight: 900 }}>AI</span>
        </span>
      </button>


        {bobOpen && (
          <div onClick={() => setBrandIntelligenceOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(1, 5, 10, 0.72)', display: 'grid', placeItems: 'center', padding: 20, zIndex: 60 }}>
            <div onClick={(event) => event.stopPropagation()} style={{ position: 'relative', width: 'min(440px, 92vw)', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(10, 15, 20, 0.98))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, boxShadow: '0 28px 80px rgba(0,0,0,0.45)', padding: 24, color: '#edf7ff' }}>
              <button type="button" onClick={() => setBrandIntelligenceOpen(false)} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', cursor: 'pointer', fontSize: 18 }}>×</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 74, height: 74, borderRadius: '50%', background: '#00E676', color: '#071014', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 28, boxShadow: '0 0 0 8px rgba(255,255,255,0.04)', animation: 'bobFloat 4s ease-in-out infinite' }}>B</div>
                <div>
                  <div style={{ letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: 11, fontWeight: 800, color: '#00E676' }}>Brand Intelligence AI</div>
                  <h3 style={{ margin: '8px 0 0', fontSize: 24 }}>Your smart brand assistant</h3>
                </div>
              </div>
              <p style={{ margin: 0, color: '#bfd8ee', lineHeight: 1.7 }}>Brand Intelligence AI helps your retail team move faster on orders, stock, delivery promises, and customer conversations across every channel.</p>
              <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
                {bobActions.map((action) => (
                  <button key={action.label} type="button" onClick={() => handleBrandIntelligenceAction(action.answer)} style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '12px 14px', color: '#edf7ff', textAlign: 'left', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                    {action.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', minHeight: 100, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {bobLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#00E676', fontWeight: 700 }}>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E676', animation: 'bobPulse 1s ease-in-out infinite' }} />
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E676', animation: 'bobPulse 1s ease-in-out 0.15s infinite' }} />
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E676', animation: 'bobPulse 1s ease-in-out 0.3s infinite' }} />
                    </span>
                    Brand Intelligence is preparing your answer...
                  </div>
                ) : (
                  <div style={{ color: '#edf7ff', lineHeight: 1.7, textAlign: 'left', width: '100%' }}>
                    {bobAnswer || "Tap a smart action to see Brand Intelligence AI's recommendation."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </main>
  )
}
