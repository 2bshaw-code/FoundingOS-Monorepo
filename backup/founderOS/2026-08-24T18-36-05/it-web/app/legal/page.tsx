
'use client'

import { brands } from '@foundingos/config'

const legalSections = [
  
    { name: 'Privacy Policy', copy: 'We handle prospect, lead, and enquiry data with strict access controls and privacy-first operational safeguards.' },
    { name: 'Terms & Conditions', copy: 'These terms govern lead capture, discovery workflows, data usage, and service access across the FoundIT environment.' },
    { name: 'Cookie Policy', copy: 'Cookies support marketing analytics, discovery tracking, and the stability of lead and reporting experiences.' },
    { name: 'Compliance & Data Handling', copy: 'We apply lawful retention, account controls, and operational governance to protect lead and market intelligence data.' },
    { name: 'Market Data & Scraping Compliance', copy: 'Lead and market data use is governed by lawful sources, policy controls, and compliance-safe automation.' }
] as const

const consoleLinks = [
  { name: 'Intelligence Console', href: 'http://localhost:3003' },
  { name: 'Data Operations Console', href: 'http://localhost:3003/data' },
] as const

const itHomeUrl = brands.it.webUrl

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#0b1321', color: '#f8fafc', fontFamily: 'Inter, Segoe UI, sans-serif' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(7,12,20,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#f8fafc' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#FFD600', color: '#071014', display: 'grid', placeItems: 'center', fontWeight: 900 }}>✦</div>
            <div>
              <strong style={{ display: 'block', fontSize: 22, lineHeight: 1.1 }}>FoundIT</strong>
              <small style={{ color: '#dfeaf8', fontSize: 12 }}>{'Local Discovery OS'}</small>
            </div>
          </a>

          <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <a href="/" style={navChip}>Home</a>
            <a href="/#features" style={navChip}>Features</a>
            <a href="/#messaging" style={navChip}>Messaging Channels</a>
            <details style={{ position: 'relative', display: 'inline-block' }}>
              <summary style={{ ...navChip, listStyle: 'none', cursor: 'pointer' }}>Consoles</summary>
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', minWidth: 280, background: 'rgba(8,13,20,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.35)', display: 'grid', gap: 8, zIndex: 30 }}>
                {consoleLinks.map(({ name, href }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#f8fafc', textDecoration: 'none', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 13, fontWeight: 700 }}>{name}</a>
                ))}
              </div>
            </details>
            <a href={itHomeUrl} target="_blank" rel="noopener noreferrer" style={{ ...navChip, background: 'rgba(255,214,0,0.12)', borderColor: 'rgba(255,255,255,0.12)', color: '#f8fafc' }}>Back to home</a>
            <a href="/legal" style={{ ...navChip, background: 'rgba(255,214,0,0.12)', borderColor: 'rgba(255,255,255,0.12)', color: '#f8fafc' }}>Legal</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px 80px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 28 }}>
          <p style={{ margin: 0, color: '#FFD600', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Legal</p>
          <h1 style={{ margin: 0, fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1.06 }}>{'FoundIT'} Legal & Compliance</h1>
          <p style={{ margin: 0, maxWidth: 760, color: '#dfeaf8', lineHeight: 1.8 }}>This legal hub sets out how FoundIT handles customer, partner, operational, and platform data across the channels and systems inside the FoundIT environment.</p>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {legalSections.map((section) => (
            <section key={section.name} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, background: 'rgba(255,255,255,0.02)', padding: 22 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 24, color: '#f8fafc' }}>{section.name}</h2>
              <p style={{ margin: 0, color: '#dfeaf8', lineHeight: 1.8 }}>{section.copy}</p>
            </section>
          ))}
        </div>
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#070c14', marginTop: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 40px', display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: 22 }}>{'FoundIT'}</strong>
            <p style={{ margin: '10px 0 0', color: '#dfeaf8' }}>Registered address: 24 Founder Way, London, UK</p>
          </div>
          <div style={{ color: '#dfeaf8' }}>© 2026 FoundIT • All rights reserved</div>
        </div>
      </footer>

      <style jsx>{`
        summary::-webkit-details-marker { display: none; }
        details[open] summary { background: rgba(255,255,255,0.06); }
      `}</style>
    </main>
  )
}

const navChip = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', textDecoration: 'none', fontSize: 13, fontWeight: 700,
}
