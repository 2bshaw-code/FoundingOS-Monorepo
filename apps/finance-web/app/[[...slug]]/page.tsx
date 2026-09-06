/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

'use client'

import { useState } from 'react'
import { brands } from '@foundingos/config'
import { QuantumConsoleEntry } from '@foundingos/ui/quantum-console-modal'
import { PackageModal } from '@foundingos/ui/package-modal'
import { RotatingMessageFeed } from '@foundingos/ui/rotating-message-feed'
import { CORE_MODULES } from '@foundingos/config/modules'
import { PremiumSocialLinks, QuantumBrandUpliftPanel, QuantumSphereLogo } from '@foundingos/ui'

const features = [
  { title: 'Operational clarity', description: 'Keep every workflow, message, and update connected across the teams and channels your business uses.', icon: '◉' },
  { title: 'Multi-channel flow', description: 'Run customer, buyer, applicant, lead, and market operations through WhatsApp, Telegram, Messenger, Instagram DM, and SMS.', icon: '◎' },
  { title: 'Smarter automation', description: 'Trigger faster responses, route work, and reduce manual follow-up while preserving human control.', icon: '◍' },
  { title: 'Premium visibility', description: 'See your business in one view without losing the detail and context needed for decisive action.', icon: '◆' },
] as const

const pricing = [
  { slug: 'traderos', name: 'StarterPack', price: '£19.99', blurb: 'For lean teams starting with cleaner workflows and faster channel responses.', features: ['1 workspace', 'Core automation', 'Multi-channel messaging', 'Basic reporting'], featured: false },
  { slug: 'investoros', name: 'Growth', price: '£49.99', blurb: 'For teams scaling with more complexity, more volume, and stronger operational visibility.', features: ['Up to 5 workspaces', 'Smart routing', 'Advanced reporting', 'Team coordination'], featured: true },
  { slug: 'whaleos', name: 'Enterprise', price: '£99.99', blurb: 'For multi-team operations that need premium automation, governance, and control.', features: ['Unlimited workspaces', 'Advanced automation', 'Governance controls', 'Priority support'], featured: false },
] as const

const messagingOptions = [
  'WhatsApp', 'Telegram', 'Facebook Messenger', 'Instagram DM', 'SMS'
] as const

const financeHomeUrl = brands.finance.webUrl
const financePackageUrl = (slug: string) => `${brands.finance.consoleUrl.replace(/\/+$/, '')}/console/packages/${slug}`

export default function Page() {
  const [foundAiOpen, setFoundAiOpen] = useState(false)
  const [foundAiLoading, setFoundAiLoading] = useState(false)
  const [foundAiAnswer, setFoundAiAnswer] = useState('')
  const foundAiHighlights = [
    'Understands your business instantly',
    'Guides customers through services & pricing',
    'Explains processes clearly and simply',
    'Works across WhatsApp, Telegram, Messenger, Instagram DM & SMS',
  ] as const
  const foundAiQuestions = [
    'How do I review cashflow?',
    'What should I watch before reconciliation?',
    'Can you explain reporting simply?',
    'Which console manages invoicing?',
  ] as const
  const foundAiActions = [
    { label: 'Check cashflow risk', answer: 'Momentum is improving in your top accounts, but one high-variance category is flashing elevated risk and should be reviewed before the next reconciliation window.' },
    { label: 'Prioritise invoice triage', answer: 'I’ve sorted the most relevant invoices and highlighted which need immediate attention versus which can wait.' },
    { label: 'Prepare a reporting brief', answer: 'Your strongest route is a measured spend review on the most active category, paired with a tighter risk guard for the volatile segment.' },
    { label: 'Review reconciliation pressure', answer: 'Reconciliation risk is building around the next reporting deadline, so I’ve flagged a tighter close plan and a fresh briefing for the team.' },
  ] as const
  const handleFoundAiAction = (answer: string) => {
    setFoundAiLoading(true)
    setFoundAiAnswer('')
    window.setTimeout(() => {
      setFoundAiAnswer(answer)
      setFoundAiLoading(false)
    }, 700)
  }

  return (
    <main className="quantum-sig-finance" style={{ minHeight: '100vh', background: '#070c14', color: '#f5f3ff', fontFamily: 'Inter, Segoe UI, sans-serif' }}>
      <header className="quantum-header" style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(7,12,20,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#f5f3ff' }}>
            <QuantumSphereLogo size={42} />
            <div>
              <strong style={{ display: 'block', fontSize: 22, lineHeight: 1.1 }}>FoundFinance</strong>
              <small style={{ color: '#ddd6fe', fontSize: 12 }}>{'Finance Intelligence OS'}</small>
            </div>
          </a>

          <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <a href="#top" className="quantum-link-glow" style={navChip}>Home</a>
            <a href="#features" className="quantum-link-glow" style={navChip}>Features</a>
            <a href="#messaging" className="quantum-link-glow" style={navChip}>Messaging Channels</a>
            <QuantumConsoleEntry brandName={brands.finance.name} glyph="£" starterUrl={brands.finance.starterConsoleUrl} growthUrl={brands.finance.consoleUrl} />
            <a href="#pricing" className="quantum-link-glow" style={navChip}>Insights</a>
            <a href="#contact" className="quantum-link-glow" style={navChip}>Support</a>
            <a href={financeHomeUrl} className="quantum-link-glow" style={navChip}>Back to home</a>
            <a href="/legal" className="quantum-link-glow" style={navChip}>Legal</a>
          </nav>
        </div>
      </header>

      <section id="top" style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at top left, rgba(0,51,170,0.12), transparent 30%), #0d0b17' }}>
        <div className="quantum-particle-drift"><span className="quantum-particle" /><span className="quantum-particle" /><span className="quantum-particle" /><span className="quantum-particle" /><span className="quantum-particle" /></div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 20px 52px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28, alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, color: '#d8b4fe', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>FoundFinance brand ecosystem</p>
            <h1 style={{ margin: '22px 0 0', fontSize: 'clamp(48px, 7vw, 92px)', lineHeight: 0.96, letterSpacing: '-0.05em', maxWidth: 700 }}>{'Clearer cashflow. Faster reconciliation.'}</h1>
            <p style={{ marginTop: 22, maxWidth: 620, color: '#ddd6fe', fontSize: 20, lineHeight: 1.8 }}>{'FoundFinance connects cashflow, invoicing, reconciliation, and reporting across all core channels.'}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 28 }}>
              <PackageModal tier={pricing.find((t) => t.slug === 'traderos')!} packageUrl={financePackageUrl('traderos')} accent={brands.finance.accent} buttonLabel="Choose your package" buttonStyle={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: '#0033AA', color: '#061018', textDecoration: 'none', fontWeight: 900 }} />
              <a href="#features" className="quantum-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#f5f3ff', textDecoration: 'none', fontWeight: 900, border: '1px solid rgba(255,255,255,0.08)' }}>View features</a>
            </div>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(15,23,32,0.82))', padding: 24, boxShadow: '0 26px 70px rgba(0,0,0,0.25)' }}>
            <div style={{ minHeight: 320, borderRadius: 24, background: 'radial-gradient(circle at top, rgba(0,51,170,0.18), transparent 58%), rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: 22, display: 'grid', gap: 14 }}>
              {['Operations visibility', 'Multi-channel messaging', 'Automation workflow', 'Brand reporting'].map((item) => (
                <div key={item} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                  <span style={{ color: '#f5f3ff' }}>{item}</span>
                  <span style={{ color: '#0033AA', fontWeight: 800 }}>Live</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <QuantumBrandUpliftPanel brand={brands.finance} />

      <section id="features" style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 20px 24px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#0033AA', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Features</p>
          <h2 style={{ margin: 0, fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.08 }}>A premium operating layer for your brand.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {features.map((feature) => (
            <article key={feature.title} className="quantum-card" style={{ padding: 22, borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
              <span className="quantum-corner-marker">£</span>
              <div className="quantum-icon-pulse" style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(0,51,170,0.12)', color: '#0033AA', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{feature.icon}</div>
              <h3 style={{ margin: '18px 0 10px', fontSize: 26 }}>{feature.title}</h3>
              <p style={{ margin: 0, lineHeight: 1.7, color: '#ddd6fe' }}>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="core-modules" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.08 }}>Core Modules</h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: '#bfd8ee' }}>Every console in the FoundingOS ecosystem ships with these core modules.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {CORE_MODULES.map((moduleItem) => (
            <article key={moduleItem.id} className="premium-card premium-fade-in" style={{ padding: 22 }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 18 }}>{moduleItem.label}</h3>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#bfd8ee', fontSize: 13 }}>{moduleItem.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="found-ai" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, background: 'linear-gradient(135deg, rgba(0,51,170,0.12), rgba(13,18,22,0.8))', padding: 28 }}>
          <div style={{ minHeight: 320, borderRadius: 24, background: 'radial-gradient(circle at top, rgba(0,51,170,0.28), transparent 58%), rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', padding: 20, textAlign: 'center' }}>
            <div style={{ display: 'grid', gap: 14, justifyItems: 'center', width: '100%' }}>
              <div style={{ width: 132, height: 132, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.34), transparent 38%), #0033AA', color: '#061018', display: 'grid', placeItems: 'center', fontSize: 56, fontWeight: 900, boxShadow: '0 0 0 14px rgba(255,255,255,0.04), 0 0 44px rgba(0,51,170,0.45)', animation: 'foundAiFloat 4s ease-in-out infinite' }}>AI</div>
              <div>
                <div style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 12, fontWeight: 800, color: '#ddd6fe' }}>FoundAI</div>
                <h3 style={{ margin: '10px 0 0', fontSize: 28, lineHeight: 1.1 }}>Premium support for modern finance conversations</h3>
                <p style={{ margin: '12px auto 0', maxWidth: 320, color: '#ddd6fe', lineHeight: 1.7 }}>Instant answers, clearer guidance, and a more human experience across every finance journey.</p>
              </div>
              <div style={{ display: 'grid', gap: 10, width: '100%', maxWidth: 620 }}>
                {foundAiHighlights.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#f5f3ff', fontWeight: 700 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0033AA', boxShadow: '0 0 18px rgba(0,51,170,0.55)' }} />
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 8 }}>
                <button type="button" onClick={() => { setFoundAiAnswer(''); setFoundAiLoading(false); setFoundAiOpen(true); }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: '#0033AA', color: '#061018', textDecoration: 'none', fontWeight: 900, border: 'none', cursor: 'pointer' }}>Explore What FoundAI Can Do</button>
                <PackageModal tier={pricing.find((t) => t.slug === 'traderos')!} packageUrl={financePackageUrl('traderos')} accent={brands.finance.accent} buttonLabel="Choose your package" buttonStyle={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, padding: '0 22px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#f5f3ff', textDecoration: 'none', fontWeight: 900, border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="messaging" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#0033AA', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Messaging Channels</p>
          <h2 style={{ margin: 0, fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.08 }}>All workflows can run through any supported channel.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {messagingOptions.map((channel) => (
            <div key={channel} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(0,51,170,0.12)', color: '#0033AA', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{channel.slice(0, 2).toUpperCase()}</div>
              <p style={{ margin: '14px 0 0', fontSize: 18, fontWeight: 800 }}>{channel}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="what-you-get" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 42px)' }}>What You Get</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {['Starter Console', 'Growth Console', 'SuperDashboard', 'FoundAI', 'Intelligence', 'Automation', 'Integrations'].map((item) => (
            <div key={item} style={{ padding: 18, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', textAlign: 'center', fontWeight: 700 }}>{item}</div>
          ))}
        </div>
      </section>

      <section id="unified-messaging" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 24px' }}>
        <RotatingMessageFeed messages={["Can you review my portfolio?", "What's the risk level?", "Can I book a consultation?", "Is this investment tax-efficient?"]} accent={brands.finance.accent} />
      </section>

      <section id="pricing" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ margin: 0, color: '#0033AA', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Pricing</p>
          <h3 style={{ margin: '16px 0 0', fontSize: 'clamp(32px, 4vw, 46px)' }}>Choose your package</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {pricing.map((tier) => (
            <article key={tier.name} style={{ padding: 24, borderRadius: 18, border: tier.featured ? '1px solid ' + '#0033AA' : '1px solid rgba(255,255,255,0.08)', background: tier.featured ? 'linear-gradient(180deg, rgba(0,51,170,0.12), rgba(10,15,20,0.85))' : 'rgba(255,255,255,0.02)', display: 'grid', gap: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#0033AA', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>{tier.name}</p>
                <h4 style={{ margin: '10px 0 0', fontSize: 42 }}>{tier.price}</h4>
              </div>
              <p style={{ margin: 0, color: '#ddd6fe', lineHeight: 1.7 }}>{tier.blurb}</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#f5f3ff', lineHeight: 1.9 }}>
                {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <PackageModal tier={tier} packageUrl={financePackageUrl(tier.slug)} accent={brands.finance.accent} buttonLabel="Get started" buttonStyle={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 46, borderRadius: 12, background: '#0033AA', color: '#071014', fontWeight: 900, textDecoration: 'none' }} />
            </article>
          ))}
        </div>
      </section>
      <section id="signup" style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 20px 24px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, background: 'rgba(255,255,255,0.03)', padding: 22, display: 'grid', gap: 14 }}>
          <p style={{ margin: 0, color: '#0033AA', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Signup</p>
          <h3 style={{ margin: 0, fontSize: 'clamp(26px, 3.4vw, 38px)' }}>Sign up with Google, Apple, or email.</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <a href="#google" className="quantum-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', textDecoration: 'none', fontWeight: 800 }}>Google account signup</a>
            <a href="#apple" className="quantum-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', textDecoration: 'none', fontWeight: 800 }}>Apple account signup</a>
            <a href="#email" className="quantum-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', textDecoration: 'none', fontWeight: 800 }}>Email signup</a>
          </div>
        </div>
      </section>
      <section id="contact" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 12px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, background: 'rgba(255,255,255,0.03)', padding: 22, display: 'grid', gap: 14 }}>
          <p style={{ margin: 0, color: '#0033AA', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Contact</p>
          <h3 style={{ margin: 0, fontSize: 'clamp(26px, 3.4vw, 38px)' }}>Connect with FoundFinance on every channel.</h3>
        </div>
      </section>
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#070c14', marginTop: 60 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 40px', display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <strong style={{ fontSize: 22 }}>{'FoundFinance'}</strong>
            <p style={{ margin: '10px 0 0', maxWidth: 480, color: '#ddd6fe', lineHeight: 1.7 }}>{'Finance insight and reconciliation support for sharper, more structured operations.'}</p>
            <p className="quantum-footer-summary">Powered by Quantum intelligence — real-time signals, always on.</p>
            <p style={{ margin: '10px 0 0', color: '#ddd6fe' }}>Registered address: 24 Founder Way, London, UK</p>
          </div>
          <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
            <div style={{ color: '#ddd6fe' }}>hello@FoundFinance.com</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href="/legal" style={{ color: '#0033AA', textDecoration: 'none', fontWeight: 700 }}>Privacy Policy</a>
              <a href="/legal" style={{ color: '#0033AA', textDecoration: 'none', fontWeight: 700 }}>Terms</a>
              <a href="/legal" style={{ color: '#0033AA', textDecoration: 'none', fontWeight: 700 }}>Cookies</a>
            </div>
            <div style={{ color: '#ddd6fe', fontSize: 14 }}>© 2026 FoundFinance • All rights reserved</div>
          </div>
          <div style={{ width: '100%', marginTop: 8 }}>
            <PremiumSocialLinks accent="#0033AA" mode="full" label="Social & messaging" />
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => { setFoundAiAnswer(''); setFoundAiLoading(false); setFoundAiOpen(true); }}
        aria-label="Open FoundAI"
        style={{ position: 'fixed', right: 22, bottom: 22, zIndex: 65, width: 90, height: 90, borderRadius: '50%', border: 'none', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.26), transparent 42%), #0033AA', color: '#061018', boxShadow: '0 18px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.18), 0 0 28px rgba(0,51,170,0.45)', cursor: 'pointer', animation: 'foundAiFloat 4s ease-in-out infinite, foundAiGlow 2.8s ease-in-out infinite' }}
      >
        <span style={{ display: 'grid', placeItems: 'center', gap: 2, lineHeight: 1 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>FoundAI</span>
          <span style={{ fontSize: 22, fontWeight: 900 }}>AI</span>
        </span>
      </button>


        {foundAiOpen && (
          <div onClick={() => setFoundAiOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(1, 5, 10, 0.72)', display: 'grid', placeItems: 'center', padding: 20, zIndex: 60 }}>
            <div onClick={(event) => event.stopPropagation()} style={{ position: 'relative', width: 'min(440px, 92vw)', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(10, 15, 20, 0.98))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, boxShadow: '0 28px 80px rgba(0,0,0,0.45)', padding: 24, color: '#edf7ff' }}>
              <button type="button" onClick={() => setFoundAiOpen(false)} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', cursor: 'pointer', fontSize: 18 }}>×</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 74, height: 74, borderRadius: '50%', background: '#0033AA', color: '#071014', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 28, boxShadow: '0 0 0 8px rgba(255,255,255,0.04)', animation: 'foundAiFloat 4s ease-in-out infinite' }}>AI</div>
                <div>
                  <div style={{ letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: 11, fontWeight: 800, color: '#0033AA' }}>FoundAI</div>
                  <h3 style={{ margin: '8px 0 0', fontSize: 24 }}>Your smart brand assistant</h3>
                </div>
              </div>
              <p style={{ margin: 0, color: '#bfd8ee', lineHeight: 1.7 }}>FoundAI helps your finance team track cashflow, reconciliation, and reporting so decisions stay sharp, fast, and well-informed.</p>
              <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
                {foundAiActions.map((action) => (
                  <button key={action.label} type="button" onClick={() => handleFoundAiAction(action.answer)} style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '12px 14px', color: '#edf7ff', textAlign: 'left', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                    {action.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', minHeight: 100, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {foundAiLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#0033AA', fontWeight: 700 }}>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0033AA', animation: 'foundAiPulse 1s ease-in-out infinite' }} />
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0033AA', animation: 'foundAiPulse 1s ease-in-out 0.15s infinite' }} />
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0033AA', animation: 'foundAiPulse 1s ease-in-out 0.3s infinite' }} />
                    </span>
                    FoundAI is preparing your answer...
                  </div>
                ) : (
                  <div style={{ color: '#edf7ff', lineHeight: 1.7, textAlign: 'left', width: '100%' }}>
                    {foundAiAnswer || "Tap a smart action to see FoundAI's recommendation."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      <style jsx>{`
        summary::-webkit-details-marker { display: none; }
        details[open] summary { background: rgba(255,255,255,0.06); }
        @keyframes foundAiFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes foundAiPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes foundAiGlow {
          0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 18px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.18), 0 0 28px rgba(0,51,170,0.45); }
          50% { transform: translateY(-2px) scale(1.03); box-shadow: 0 22px 48px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.22), 0 0 34px rgba(0,51,170,0.62); }
        }
        @media (max-width: 900px) {
          nav { justify-content: flex-start !important; }
          #top > div { grid-template-columns: 1fr !important; }
          #found-ai > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

const navChip = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '6px 2px', color: '#f5f3ff', textDecoration: 'none', fontSize: 13, fontWeight: 700,
}
