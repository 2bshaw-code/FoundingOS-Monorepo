/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState, type ReactNode } from 'react'
import { BrandLogo, ImageBlock } from '@founder-os/ui'
import { BobIntroCard } from '../components/BobIntroCard'

const brandCards = [
  { label: 'FoundRetail', href: 'http://localhost:5210', brand: 'foundretail', accent: '#25D366', title: 'E-Commerce Solutions' },
  { label: 'FoundMeat', href: 'http://localhost:5220', brand: 'foundmeat', accent: '#F94144', title: 'Supply Chain & Logistics' },
  { label: 'FoundThis', href: 'http://localhost:5230', brand: 'foundthis', accent: '#FFD600', title: 'Data & Leads' },
  { label: 'FoundTalent', href: 'http://localhost:5240', brand: 'foundtalent', accent: '#F97316', title: 'Talent Acquisition' },
  { label: 'FoundCrypto', href: 'http://localhost:5250', brand: 'foundcrypto', accent: '#7C3AED', title: 'Crypto & Finance' },
] as const

const featureCards = [
  { icon: '◉', title: 'Unified Dashboard', text: 'Manage all your brands from a single, intuitive interface.' },
  { icon: '◌', title: 'Cross-Brand Insights', text: 'Track performance across all ventures in real time.' },
  { icon: '◍', title: 'Automated Workflows', text: 'Streamline operations with powerful automation tools.' },
] as const

const partnerNames = ['NextMart', 'PrimeSavory', 'ScrapePro', 'TalentHive', 'CoinVestor'] as const

const navItems = [
  { label: 'Home', href: '/', icon: '⌂' },
  { label: 'Products', href: '#products', icon: '◉' },
  { label: 'Pricing', href: '/pricing', icon: '◆' },
  { label: 'Documentation', href: '/documentation', icon: '⌁' },
  { label: 'Support', href: '/support', icon: '✦' },
  { label: 'Status', href: '/status', icon: '●' },
  { label: 'Company', href: '/company/about', icon: '◈' },
  { label: 'Legal', href: '/legal/terms', icon: '○' },
] as const

const companyLinks = [
  { label: 'About', href: '/company/about' },
  { label: 'Careers', href: '/company/careers' },
  { label: 'Press', href: '/company/press' },
  { label: 'Social Media Hub', href: '/company/social' },
  { label: 'Contact', href: '/company/contact' },
] as const

const legalLinks = [
  { label: 'Terms & Conditions', href: '/legal/terms' },
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Cookie Policy', href: '/legal/cookies' },
  { label: 'GDPR & Compliance', href: '/legal/compliance' },
  { label: 'Security Overview', href: '/legal/security' },
] as const

const downloadBadges = [
  ['macOS', '⌘', 'Desktop build'],
  ['Windows', '⊞', 'Desktop build'],
  ['iOS', '', 'App Store'],
  ['Android', '⌁', 'Google Play'],
  ['Linux', '◌', 'Optional'],
] as const

const messagingOptions = [
  { label: 'WhatsApp', href: '/company/contact', eyebrow: 'Messaging' },
  { label: 'Telegram', href: '/company/contact', eyebrow: 'Messaging' },
  { label: 'Messenger', href: '/company/contact', eyebrow: 'Messaging' },
  { label: 'iMessage', href: '/company/contact', eyebrow: 'Messaging' },
  { label: 'SMS', href: '/company/contact', eyebrow: 'Messaging' },
] as const

const messageExamples = [
  {
    service: 'WhatsApp',
    tone: 'Customer support',
    avatar: 'WA',
    time: '09:42',
    messages: [
      { from: 'customer', text: 'Can you help me set up my retail account today?' },
      { from: 'brand', text: 'Absolutely — your onboarding packet is ready, and we can review your package now.' },
      { from: 'customer', text: 'Perfect, I want the premium plan.' },
    ],
  },
  {
    service: 'Telegram',
    tone: 'Launch coordination',
    avatar: 'TG',
    time: '10:18',
    messages: [
      { from: 'brand', text: 'Your brand assets and dashboard preview are ready for approval.' },
      { from: 'customer', text: 'Great — send the verification checklist too.' },
      { from: 'brand', text: 'Done. The checklist is now in your onboarding flow.' },
    ],
  },
  {
    service: 'Messenger',
    tone: 'Sales enquiry',
    avatar: 'ME',
    time: '11:06',
    messages: [
      { from: 'customer', text: 'I’d like pricing for all five brands.' },
      { from: 'brand', text: 'I’m sending a premium comparison view with plan options and support tiers.' },
      { from: 'customer', text: 'Thanks, that’s exactly what I needed.' },
    ],
  },
  {
    service: 'iMessage',
    tone: 'VIP concierge',
    avatar: 'IM',
    time: '12:24',
    messages: [
      { from: 'brand', text: 'Your founder onboarding is ready to confirm.' },
      { from: 'customer', text: 'Looks good — let’s activate the console.' },
      { from: 'brand', text: 'Confirmed. Welcome to FoundingOS.' },
    ],
  },
] as const

const onboardingSteps = [
  {
    id: '01',
    title: 'Account Application',
    copy: 'Create your FoundingOS account, choose the ecosystem you want to activate, and confirm your primary contact details.',
  },
  {
    id: '02',
    title: 'Package Selection',
    copy: 'Select the right plan for your brand portfolio and review what is included before you commit.',
  },
  {
    id: '03',
    title: 'Business Details',
    copy: 'Add your company information, brand identity, billing preferences, and operating context.',
  },
  {
    id: '04',
    title: 'Verification',
    copy: 'Complete identity and business verification so the right access, protections, and support can be enabled.',
  },
  {
    id: '05',
    title: 'Confirmation',
    copy: 'Review your onboarding summary, accept the terms, and enter your console with everything ready.',
  },
] as const

function PlatformMark({ platform }: { platform: 'macos' | 'windows' | 'ios' | 'android' | 'linux' }) {
  const common = { className: 'h-5 w-5', viewBox: '0 0 24 24', role: 'img' as const, 'aria-hidden': true }
  switch (platform) {
    case 'macos':
      return <svg {...common}><path d="M12 3c2.2 0 4 1.8 4 4 0 1.3-.6 2.4-1.6 3.1.1.2.2.4.2.6 0 .8-.6 1.4-1.4 1.4H10.8c-.8 0-1.4-.6-1.4-1.4 0-.2.1-.4.2-.6C8.6 9.4 8 8.3 8 7c0-2.2 1.8-4 4-4Z" fill="currentColor"/><path d="M9 14h6l1.2 4.8c.1.5-.2 1-.7 1.2-.1 0-.2 0-.3 0H8.8c-.5 0-1-.4-1-1 0-.1 0-.2 0-.3L9 14Z" fill="none" stroke="currentColor" strokeWidth="1.3"/></svg>
    case 'windows':
      return <svg {...common}><path d="M3 5.5 10.4 4.4v6.4H3V5.5Zm8.4-1.2L21 3v7.8h-9.6V4.3ZM3 12.4h7.4v6.4L3 17.6v-5.2Zm8.4 0H21V21l-9.6-1.2v-7.4Z" fill="currentColor"/></svg>
    case 'ios':
      return <svg {...common}><path d="M15.7 2.5c-.9.1-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.7 1 .1 2.1-.5 2.7-1.2.7-.7 1.2-1.8.8-2.9Z" fill="currentColor"/><path d="M12.2 7.2c-2.7 0-4.4 2.2-4.4 5.2 0 3.9 2.7 9.1 4.4 9.1 1.1 0 1.6-.7 2.7-.7 1.1 0 1.4.7 2.5.7 1.3 0 4-4.8 4-8.7 0-3.8-2.4-5.6-4.6-5.6-1.2 0-2.2.7-2.8.7-.7 0-1.7-.7-1.8-.7Z" fill="currentColor"/></svg>
    case 'android':
      return <svg {...common}><path d="M7 8.5h10c1.1 0 2 .9 2 2V18c0 .6-.4 1-1 1h-1v2H7v-2H6c-.6 0-1-.4-1-1v-7.5c0-1.1.9-2 2-2Z" fill="currentColor"/><path d="M8.1 7.2 6.7 5.4M15.9 7.2l1.4-1.8M9.2 4.8l-.9-1.6M14.8 4.8l.9-1.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
    case 'linux':
      return <svg {...common}><path d="M12 3.2c2.4 0 4.3 1.9 4.3 4.3 0 1.4-.7 2.7-1.8 3.4v1.2l1.4 1.8c.7.9 1.1 2 .8 3.2-.3 1.2-1.3 2-2.5 2H9.8c-1.2 0-2.2-.8-2.5-2-.3-1.2.1-2.3.8-3.2l1.4-1.8V10.9c-1.1-.7-1.8-2-1.8-3.4 0-2.4 1.9-4.3 4.3-4.3Z" fill="currentColor"/></svg>
  }
}

function SocialMark({ network }: { network: 'instagram' | 'linkedin' | 'tiktok' | 'x' }) {
  const common = { className: 'h-5 w-5', viewBox: '0 0 24 24', role: 'img' as const, 'aria-hidden': true }
  switch (network) {
    case 'instagram':
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="7" r="1" fill="currentColor"/></svg>
    case 'linkedin':
      return <svg {...common}><path d="M5 9h3v10H5V9Zm1.5-4A1.5 1.5 0 1 1 6.5 8 1.5 1.5 0 0 1 6.5 5ZM10 9h2.8v1.5h.1c.4-.8 1.4-1.6 2.8-1.6 3 0 3.6 2 3.6 4.7V19h-3v-4c0-1-.1-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19h-3V9Z" fill="currentColor"/></svg>
    case 'tiktok':
      return <svg {...common}><path d="M14 4c.5 2.8 2.2 4.6 5 4.8v3.1c-1.8 0-3.2-.6-4.4-1.5v5c0 3-2.4 5.4-5.4 5.4S3.8 18.4 3.8 15.4c0-3.2 2.7-5.7 5.8-5.4v3.2c-1.2-.2-2.4.6-2.5 2-.1 1.4.9 2.6 2.3 2.6 1.5 0 2.5-1.1 2.5-2.6V4H14Z" fill="currentColor"/></svg>
    case 'x':
      return <svg {...common}><path d="M5 5h4.1l3 4.2L16 5h3l-5.4 7.3L19 19h-4.1l-3.2-4.5L8.3 19H5l5.8-7.8L5 5Z" fill="currentColor"/></svg>
  }
}

function ExtendedSocialMark({ network }: { network: 'instagram' | 'linkedin' | 'tiktok' | 'x' | 'facebook' | 'youtube' }) {
  if (network === 'facebook') {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7h2.4l.4-3H13.5V9.1c0-.9.2-1.5 1.5-1.5H16V4.8c-.3 0-1.3-.1-2.6-.1-2.7 0-4.5 1.6-4.5 4.6V11H6.5v3H9v7h4.5Z" fill="currentColor"/></svg>
  }
  if (network === 'youtube') {
    return <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 8.2c-.2-1-.9-1.8-1.9-2-1.7-.4-7.5-.4-7.5-.4s-5.8 0-7.5.4c-1 .2-1.7 1-1.9 2C2.3 9.9 2.3 12 2.3 12s0 2.1.3 3.8c.2 1 .9 1.8 1.9 2 1.7.4 7.5.4 7.5.4s5.8 0 7.5-.4c1-.2 1.7-1 1.9-2 .3-1.7.3-3.8.3-3.8s0-2.1-.3-3.8ZM10.2 15.1V8.9L15.6 12l-5.4 3.1Z" fill="currentColor"/></svg>
  }
  return <SocialMark network={network} />
}

function MessagingMark({ service }: { service: 'WhatsApp' | 'Telegram' | 'Messenger' | 'iMessage' | 'SMS' }) {
  const common = { className: 'h-5 w-5', viewBox: '0 0 24 24', role: 'img' as const, 'aria-hidden': true }
  switch (service) {
    case 'WhatsApp':
      return <svg {...common}><path d="M12 3.5A8.5 8.5 0 0 0 4.2 15.2L3 21l5.9-1.2A8.5 8.5 0 1 0 12 3.5Z" fill="currentColor"/><path d="M9.4 8.5c.2-.4.4-.4.8-.4h.5c.2 0 .4 0 .5.3l.6 1.4c.1.3.1.4 0 .6l-.4.5c-.1.2-.2.3 0 .6.3.6.9 1.4 1.7 2.1.7.6 1.3 1 1.9 1.3.3.1.4.1.6 0l.7-.5c.2-.1.4-.2.6 0l1.4.6c.3.1.4.3.4.6 0 .5-.2 1.3-.8 1.6-.6.3-1.3.4-2 .2-1.5-.3-3.1-1.3-4.6-2.8-1.5-1.5-2.5-3.1-2.8-4.6-.2-.7-.1-1.4.2-2 .2-.4.5-.6.8-.6Z" fill="#fff"/></svg>
    case 'Telegram':
      return <svg {...common}><path d="M12 3 3.5 11.2c-.4.4-.2 1.1.3 1.2l2.6.8.9 4.4c.1.6.9.8 1.3.4l2.4-2.2 3.8 2.8c.4.3 1 .1 1.1-.4l2.4-11.3c.1-.6-.5-1-1-.7L7.8 13l7.6-6.2-3.4 9.5-3.2-2.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    case 'Messenger':
      return <svg {...common}><path d="M12 3.8c-4.6 0-8.2 3.3-8.2 7.5 0 2.4 1.2 4.6 3.1 6l-.7 2.9 3-1.7c.9.2 1.8.3 2.8.3 4.6 0 8.2-3.3 8.2-7.5S16.6 3.8 12 3.8Z" fill="currentColor"/><path d="M8.2 13.2 11 10.1l2 2 2.8-3.1-3.6 5.8-2-2-2 2.4" fill="#050816"/></svg>
    case 'iMessage':
      return <svg {...common}><path d="M12 3.8c4.6 0 8.3 3 8.3 6.8 0 3.7-3.7 6.8-8.3 6.8-.8 0-1.6-.1-2.3-.3L6 18.7l1-2.4C5.4 15 3.7 13 3.7 10.6 3.7 7 7.4 3.8 12 3.8Z" fill="currentColor"/><circle cx="8.7" cy="10.6" r=".8" fill="#050816"/><circle cx="12" cy="10.6" r=".8" fill="#050816"/><circle cx="15.3" cy="10.6" r=".8" fill="#050816"/></svg>
    case 'SMS':
      return <svg {...common}><path d="M5 5h14v10H9l-4 4v-4H5V5Z" fill="currentColor"/><path d="M8 9h8M8 11h6" stroke="#050816" strokeWidth="1.3" strokeLinecap="round"/></svg>
  }
}

function RotatingMessageScreens() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % messageExamples.length), 3200)
    return () => window.clearInterval(timer)
  }, [])
  const active = messageExamples[index]
  return (
    <div className="chat-carousel">
      <div className="chat-carousel-header">
        <div>
          <div className="section-badge">Messaging Hub</div>
          <h3>{active.service}</h3>
        </div>
        <div className="chat-carousel-dots" aria-hidden="true">
          {messageExamples.map((_, dotIndex) => <span key={dotIndex} className={dotIndex === index ? 'is-active' : ''} />)}
        </div>
      </div>
      <div className="chat-screen">
        <div className="chat-screen-topbar">
          <div className="chat-avatar">{active.avatar}</div>
          <div>
            <strong>{active.service}</strong>
            <span>{active.tone}</span>
          </div>
          <time>{active.time}</time>
        </div>
        <div className="chat-bubbles">
          {active.messages.map((message) => (
            <div key={message.text} className={`chat-bubble ${message.from === 'brand' ? 'brand' : 'customer'}`}>{message.text}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CorporateLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className="info-shell">
      <header className="info-header">
        <div className="site-brand">
          <BrandLogo brand="founder-os" className="h-10 w-10" />
          <span>FoundingOS</span>
        </div>
        <nav className="site-nav">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="nav-chip">
              <span aria-hidden="true" className="nav-chip-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <a href="http://localhost:4000/console" className="nav-cta">Console</a>
      </header>

      <section className="info-hero">
        <div className="info-kicker">FoundingOS</div>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>

      <section className="info-content">{children}</section>

      <footer className="site-footer">
        <div className="footer-brand-row">
          <div className="site-brand">
            <BrandLogo brand="founder-os" className="h-9 w-9" />
            <span>FoundingOS</span>
          </div>
          <div className="footer-socials">
            <span>Instagram</span>
            <span>LinkedIn</span>
            <span>X</span>
            <span>TikTok</span>
          </div>
        </div>
        <div className="footer-links-row">
          {companyLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
          {legalLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
        </div>
        <div className="footer-bottom">© 2026 FoundingOS. Built for global founders.</div>
      </footer>
    </main>
  )
}

export function Home() {
  return (
    <main className="landing-shell">
      <section className="hero-section">
        <div className="hero-bg" />
        <header className="landing-header">
          <div className="brand-lockup">
            <BrandLogo brand="founder-os" className="h-12 w-12" />
            <span className="brand-text">FoundingOS</span>
          </div>
          <nav className="header-nav">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="nav-chip">
                <span aria-hidden="true" className="nav-chip-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
            <a href="/console" className="nav-signin">Console</a>
          </nav>
        </header>

        <div className="hero-content">
          <div className="hero-copy">
            <div className="eyebrow">FoundingOS</div>
            <h1>Build &amp; Scale Your Brands with Confidence.</h1>
            <p>The unified ecosystem powering FoundRetail, FoundMeat, FoundThis, FoundTalent, FoundCrypto.</p>
            <div className="cta-row">
              <a href="#products" className="secondary-btn">Explore Brands</a>
            </div>
          </div>

          <div className="hero-visual" aria-label="FoundingOS dashboard preview">
            <ImageBlock variant="founder-hero" alt="FoundingOS cinematic dashboard preview" caption="FoundingOS dashboard preview" className="hero-image-block" />
            <div className="dashboard-frame">
              <div className="window-topbar">
                <span className="dot red" />
                <span className="dot amber" />
                <span className="dot green" />
              </div>

              <div className="dashboard-surface">
                <div className="dashboard-header-row">
                  <div>
                    <span className="dashboard-kicker">Control centre</span>
                    <strong>FoundingOS</strong>
                  </div>
                  <div className="status-pill">Live</div>
                </div>

                <div className="dashboard-grid">
                  <div className="mini-panel mini-panel-lg dashboard-main">
                    <div className="mini-label">Revenue flow</div>
                    <div className="line-chart" />
                    <div className="chart-meta">
                      <span className="meta-value">$2.4M</span>
                      <span className="meta-delta">+18.2%</span>
                    </div>
                  </div>

                  <div className="mini-panel mini-panel-sm">
                    <div className="mini-label">Tasks</div>
                    <ul className="task-list">
                      <li><span className="task-dot blue" />Campaign launch</li>
                      <li><span className="task-dot green" />Inventory sync</li>
                      <li><span className="task-dot purple" />Portfolio rebalance</li>
                    </ul>
                  </div>

                  <div className="mini-panel mini-panel-sm">
                    <div className="mini-label">Automation</div>
                    <div className="mini-bars-flow">
                      <span className="flow-segment a" />
                      <span className="flow-segment b" />
                      <span className="flow-segment c" />
                    </div>
                  </div>

                  <div className="mini-panel mini-panel-sm crypto-panel">
                    <div className="mini-label">Crypto portfolio</div>
                    <div className="portfolio-coin-row">
                      <span className="coin-pill btc">BTC</span>
                      <span className="coin-pill eth">ETH</span>
                      <span className="coin-pill sol">SOL</span>
                    </div>
                    <div className="crypto-figure">$486.2K</div>
                  </div>
                </div>

                <div className="brand-pills">
                  <span className="pill retail">FoundRetail</span>
                  <span className="pill metrics">FoundMeat</span>
                  <span className="pill meat">FoundThis</span>
                  <span className="pill crypto">FoundTalent</span>
                  <span className="pill purple">FoundCrypto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="brands-section brand-strip" id="brands">
        <div className="section-header center-header">
          <h2>All Your Brands, One Platform</h2>
          <p>Easily switch between and grow your businesses from one central hub.</p>
        </div>

        <div className="brand-grid">
          {brandCards.map(({ label, href, brand, accent, title }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="brand-tile" style={{ ['--brand-accent' as string]: accent }}>
              <div className="tile-topline">
                <div className="tile-badge"><BrandLogo brand={brand} className="h-6 w-6" /></div>
                <span>{label}</span>
              </div>
              <div className="tile-visual" />
              <div className="tile-caption">{title}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="ecosystem-band" aria-labelledby="meet-bob-ai">
        <BobIntroCard
          eyebrow="Meet FoundAI"
          id="meet-bob-ai"
          title="FoundAI — The Best Onboarding Bot in the World."
          paragraphs={[
            'FoundAI wasn’t created to be another chatbot. It was created to solve the single biggest problem in business software: people hate onboarding, people hate learning new systems, and people hate complicated dashboards.',
            'FoundingOS gives every user — from retail staff to meat suppliers, recruiters, IT teams, crypto traders, and founders — one universal guide who knows exactly what they need.',
            'FoundAI is simple, huge-capable, friendly, approachable, human-first, and a co-founder rather than a tool. It handles onboarding, setup, training, workflows, tasks, and questions instantly.',
          ]}
        />
      </section>

      <section className="ecosystem-band">
        <div className="ecosystem-grid">
          <article className="ecosystem-card download-card">
            <div className="section-badge">Download FoundingOS</div>
            <h2>Install the console on every device your team uses.</h2>
            <div className="badge-grid">
              {downloadBadges.map(([platform, , note]) => (
                <div key={platform} className="download-badge">
                <span className="download-mark" aria-hidden="true">
                  {platform === 'macOS' ? <PlatformMark platform="macos" /> : platform === 'Windows' ? <PlatformMark platform="windows" /> : platform === 'iOS' ? <PlatformMark platform="ios" /> : platform === 'Android' ? <PlatformMark platform="android" /> : <PlatformMark platform="linux" />}
                </span>
                <div>
                  <strong>{platform}</strong>
                  <span>{note}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="ecosystem-card trust-card">
            <div className="section-badge">Apple Pay</div>
            <h2>Premium checkout with trusted Apple Pay support.</h2>
            <p>FoundingOS supports a fast, familiar payment flow for founders and teams who expect seamless purchasing.</p>
            <div className="apple-pay-badge" aria-label="Apple Pay supported">
              <span className="apple-mark" aria-hidden="true"></span>
              <strong>Apple Pay</strong>
            </div>
          </article>
        </div>

        <article className="ecosystem-card message-card">
          <div>
            <div className="section-badge">Message Us</div>
            <h2>Start as a Customer and talk with the team in real time.</h2>
            <p>Use WhatsApp or in-app chat to ask about onboarding, brand setup, pricing, and account access.</p>
          </div>
          <div className="message-actions">
            {messagingOptions.map((option) => (
              <a key={option.label} href={option.href} className="message-cta">
                <span className="message-cta-icon"><MessagingMark service={option.label} /></span>
                <div>
                  <span>{option.eyebrow}</span>
                  <strong>{option.label}</strong>
                </div>
              </a>
            ))}
          </div>
        </article>

        <article className="ecosystem-card chat-carousel-card">
          <RotatingMessageScreens />
        </article>
      </section>

      <section className="feature-band" id="products">
        <div className="feature-grid">
          {featureCards.map(({ icon, title, text }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="insights-section" id="insights">
        <div className="section-header left-header">
          <h2>Real-Time Analytics &amp; Insights</h2>
          <p>Get the data you need to make smarter decisions.</p>
        </div>

        <div className="insights-grid">
          <div className="stat-panel light-panel">
            <div className="panel-title">Sales Performance</div>
            <div className="mini-bars">
              <span style={{ height: '34%' }} />
              <span style={{ height: '48%' }} />
              <span style={{ height: '56%' }} />
              <span style={{ height: '62%' }} />
              <span style={{ height: '76%' }} />
              <span style={{ height: '96%' }} />
              <span style={{ height: '72%' }} />
              <span style={{ height: '88%' }} />
            </div>
          </div>

          <div className="stat-panel glass-panel">
            <div className="panel-title">Automation Status</div>
            <div className="ring-wrap">
              <div className="ring-chart"><span>75%</span></div>
            </div>
          </div>

          <div className="stat-panel stack-panel">
            <div className="stack-row"><span>Campaign Scheduled</span><strong>Marketing Intelligence</strong></div>
            <div className="stack-row"><span>Payment Processed</span><strong>Complete</strong></div>
            <div className="stack-row"><span>New Leads</span><strong>+24%</strong></div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="section-header center-header narrow-header">
          <h2>Join Successful Founders Scaling with Us</h2>
        </div>

        <div className="partner-row">
          {partnerNames.map((name) => <div key={name} className="partner-pill">{name}</div>)}
        </div>

        <div className="cta-row wide-cta">
          <a href="/onboarding" className="primary-btn">Get Started</a>
          <a href="#brands" className="secondary-btn">Book a Demo</a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand-row">
          <div className="site-brand">
            <BrandLogo brand="founder-os" className="h-9 w-9" />
            <span>FoundingOS</span>
          </div>
          <div className="footer-socials">
            {(['instagram', 'linkedin', 'tiktok', 'x', 'facebook', 'youtube'] as const).map((network) => (
              <span key={network} className="footer-social-pill"><ExtendedSocialMark network={network} /><span>{network === 'x' ? 'X' : network[0].toUpperCase() + network.slice(1)}</span></span>
            ))}
          </div>
        </div>
        <div className="footer-links-row">
          {companyLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
          {legalLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
        </div>
        <div className="footer-bottom">© 2026 FoundingOS. Built for global founders.</div>
      </footer>
    </main>
  )
}

export function PricingPage() {
  return (
    <CorporateLayout title="Pricing" intro="Flexible plans designed for founders scaling multiple brands with operational clarity.">
      <div className="pricing-grid">
        {[
          { name: 'Launch', price: '$0', description: 'Best for early validation and brand exploration.' },
          { name: 'Scale', price: '$299', description: 'For growing portfolios that need orchestration and automation.' },
          { name: 'Enterprise', price: 'Custom', description: 'For multi-brand operating groups with advanced compliance and governance.' },
        ].map((tier) => (
          <article key={tier.name} className="info-card">
            <div className="plan-name">{tier.name}</div>
            <div className="plan-price">{tier.price}</div>
            <p>{tier.description}</p>
            <ul>
              <li>Unified brand dashboard</li>
              <li>Workflow automation</li>
              <li>Priority support</li>
            </ul>
          </article>
        ))}
      </div>
    </CorporateLayout>
  )
}

export function OnboardingPage() {
  return (
    <CorporateLayout title="Onboarding" intro="A guided customer journey for applications, package selection, business details, verification, and confirmation.">
      <div className="onboarding-shell">
        <aside className="onboarding-rail">
          <div className="onboarding-hero-card">
            <div className="section-badge">FoundingOS Onboarding</div>
            <h2>Launch your account in five guided steps.</h2>
            <p>Everything is structured to feel premium, clear, and customer-friendly from the first click.</p>
            <ImageBlock variant="founder-dashboard" alt="FoundingOS onboarding dashboard preview" caption="Onboarding dashboard preview" className="mt-6" />
          </div>
          <div className="onboarding-visual">
            <div className="onboarding-window">
              <div className="window-topbar">
                <span className="dot red" />
                <span className="dot amber" />
                <span className="dot green" />
              </div>
              <div className="onboarding-preview">
                <div className="preview-card preview-card-large">
                  <span className="preview-label">Application status</span>
                  <strong>Ready to start</strong>
                  <div className="preview-progress"><span /></div>
                </div>
                <div className="preview-card preview-card-small">
                  <span className="preview-label">Identity</span>
                  <strong>Verification secure</strong>
                </div>
                <div className="preview-card preview-card-small">
                  <span className="preview-label">Plan</span>
                  <strong>Package selected</strong>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="onboarding-steps">
          {onboardingSteps.map((step) => (
            <article key={step.id} className="onboarding-step-card">
              <span className="onboarding-step-id">{step.id}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </CorporateLayout>
  )
}

export function DocumentationPage() {
  return (
    <CorporateLayout title="Documentation" intro="Developer-friendly infrastructure, product guidance, compliance references, and launch resources for every brand.">
      <div className="doc-grid">
        {[
          ['Overview', 'Understand the architecture behind the FoundingOS ecosystem.'],
          ['Brand Console API', 'Integrate operations, messaging, and automation across every brand.'],
          ['Deployment', 'Launch and manage secure environments for local and production workflows.'],
          ['Security', 'Learn our compliance posture, session controls, and data protections.'],
        ].map(([heading, text]) => (
          <article key={heading} className="info-card">
            <h3>{heading}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </CorporateLayout>
  )
}

export function SupportPage() {
  return (
    <CorporateLayout title="Support" intro="Expert support across onboarding, implementation, migration, and operational troubleshooting.">
      <div className="support-grid">
        {[
          ['Priority support', 'Talk with specialists for rollout, migration, and day-to-day platform health.'],
          ['Customer success', 'Build a playbook for each brand with strategic operational guidance.'],
          ['Launch assistance', 'Get hands-on help for authentication, routing, brand setup, and rollout.'],
        ].map(([heading, text]) => (
          <article key={heading} className="info-card">
            <h3>{heading}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </CorporateLayout>
  )
}

export function StatusPage() {
  return (
    <CorporateLayout title="Status" intro="Platform health, uptime, reliability, and service transparency for the FoundingOS ecosystem.">
      <div className="status-grid">
        {[
          ['FoundingOS', 'Operational'],
          ['FoundRetail', 'Operational'],
          ['FoundMeat', 'Operational'],
          ['FoundThis', 'Operational'],
          ['FoundTalent', 'Operational'],
          ['FoundCrypto', 'Operational'],
        ].map(([service, health]) => (
          <article key={service} className="status-row">
            <span>{service}</span>
            <strong>{health}</strong>
          </article>
        ))}
      </div>
    </CorporateLayout>
  )
}

export function CompanyAboutPage() {
  return (
    <CorporateLayout title="About" intro="FoundingOS is the operating layer for founder-led businesses building coordinated, scalable portfolios.">
      <div className="info-card wide-card">
        <p>We help founders structure a premium operating stack across retail, meat, intelligence, talent, and crypto businesses — giving each brand a dedicated platform while unifying oversight, decision-making, automation, and analytics.</p>
      </div>
    </CorporateLayout>
  )
}

export function CompanyCareersPage() {
  return (
    <CorporateLayout title="Careers" intro="Join a team building the next generation of founder infrastructure for modern operating companies.">
      <div className="info-card wide-card">
        <p>We are hiring across product, design, operations, data, and systems engineering. We build premium tools for portfolios that want clarity, automation, and scale.</p>
      </div>
    </CorporateLayout>
  )
}

export function CompanyPressPage() {
  return (
    <CorporateLayout title="Press" intro="Recent milestones, launch updates, and strategic announcements for the FoundingOS ecosystem.">
      <div className="info-card wide-card">
        <p>FoundingOS continues to expand across multi-brand operating groups, bringing premium enterprise tooling to founder-led ecosystems with a common visual and operational language.</p>
      </div>
    </CorporateLayout>
  )
}

export function CompanySocialPage() {
  return (
    <CorporateLayout title="Social Media Hub" intro="Follow FoundingOS across the channels where founders, operators, and builders stay informed.">
      <div className="social-grid">
        {(['instagram', 'linkedin', 'tiktok', 'x', 'facebook', 'youtube'] as const).map((channel) => (
          <article key={channel} className="info-card social-card">
            <div className="social-card-icon"><ExtendedSocialMark network={channel} /></div>
            <h3>{channel === 'x' ? 'X' : channel[0].toUpperCase() + channel.slice(1)}</h3>
            <p>Updates, product stories, launch highlights, and founder insights.</p>
          </article>
        ))}
      </div>
    </CorporateLayout>
  )
}

export function CompanyContactPage() {
  return (
    <CorporateLayout title="Contact" intro="Reach out for partnerships, enterprise sales, product feedback, or founder onboarding support.">
      <div className="contact-grid">
        <article className="info-card wide-card">
          <p>Email: founders@founder-os.com<br />Support: support@founder-os.com<br />HQ: London / Remote global</p>
        </article>
        <article className="info-card wide-card contact-hub-card">
          <div className="section-badge">Messaging Hub</div>
          <h3 className="mt-3 text-2xl font-bold">Talk through your preferred channel.</h3>
          <div className="message-actions mt-6">
            {messagingOptions.map((option) => (
              <a key={option.label} href={option.href} className="message-cta">
                <span className="message-cta-icon"><MessagingMark service={option.label} /></span>
                <div>
                  <span>{option.eyebrow}</span>
                  <strong>{option.label}</strong>
                </div>
              </a>
            ))}
          </div>
        </article>
      </div>
    </CorporateLayout>
  )
}

export function LegalTermsPage() {
  return (
    <CorporateLayout title="Terms & Conditions" intro="The foundational rules governing access, usage, and operational responsibilities across the FoundingOS ecosystem.">
      <div className="info-card wide-card"><p>These Terms govern your use of the FoundingOS platform and related brand consoles. By accessing the service, you agree to use the platform responsibly, lawfully, and in alignment with your applicable operating obligations.</p></div>
    </CorporateLayout>
  )
}

export function LegalPrivacyPage() {
  return (
    <CorporateLayout title="Privacy Policy" intro="We handle personal and operational data with a privacy-first approach across all founder products and brand consoles.">
      <div className="info-card wide-card"><p>FoundingOS collects only the information necessary to operate secure and efficient workflows across the ecosystem. We apply access controls, encryption, retention policies, and transparent governance for all personal data.</p></div>
    </CorporateLayout>
  )
}

export function LegalCookiesPage() {
  return (
    <CorporateLayout title="Cookie Policy" intro="We use cookies to maintain session continuity, product performance, analytics, and safe user experience across brands.">
      <div className="info-card wide-card"><p>Cookies help us recognize recurring visitors, keep secure sessions stable, and understand which product areas require refinement. You may manage preferences within our cookie settings and browser controls.</p></div>
    </CorporateLayout>
  )
}

export function LegalCompliancePage() {
  return (
    <CorporateLayout title="GDPR & Compliance" intro="FoundingOS is designed to meet the operational expectations of modern, regulated, and founder-led businesses.">
      <div className="info-card wide-card"><p>We maintain appropriate controls around data minimization, user access, retention, audits, and cross-region governance so product teams can build with confidence while meeting compliance obligations.</p></div>
    </CorporateLayout>
  )
}

export function LegalSecurityPage() {
  return (
    <CorporateLayout title="Security Overview" intro="Security is designed into the platform from onboarding through active operations and incident response.">
      <div className="info-card wide-card"><p>FoundingOS applies secure authentication, session boundaries, access controls, environment isolation, and operational monitoring to protect brand and founder activity across the ecosystem.</p></div>
    </CorporateLayout>
  )
}

export default Home
