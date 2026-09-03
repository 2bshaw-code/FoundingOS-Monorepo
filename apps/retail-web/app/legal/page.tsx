/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

'use client'

import { brands } from '@foundingos/config'
import styles from './legal.module.css'

const legalSections = [
  
    { name: 'Privacy Policy', copy: 'We protect customer, order, and service data across all retail communication channels and operational workflows.' },
    { name: 'Terms & Conditions', copy: 'These terms govern service access, subscription use, customer communication, and order fulfilment responsibilities.' },
    { name: 'Cookie Policy', copy: 'Cookies support session continuity, retail insights, customer journey analytics, and feature quality monitoring.' },
    { name: 'Compliance & Data Handling', copy: 'We manage retail data lawfully, with secure operational access, retention controls, and privacy safeguards.' },
    { name: 'Refunds & Delivery', copy: 'Orders, delivery promises, and refund outcomes are governed by transparent terms and customer service policy.' }
] as const

const consoleLinks = [
  { name: 'Retail Manager Console', href: brands.retail.consoleUrl },
  { name: 'Retail Starter Console', href: brands.retail.starterConsoleUrl },
] as const

const retailHomeUrl = brands.retail.webUrl

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#07131d', color: '#edf7ff', fontFamily: 'Inter, Segoe UI, sans-serif' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(7,12,20,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <a href="/website" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#edf7ff' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#00E676', color: '#071014', display: 'grid', placeItems: 'center', fontWeight: 900 }}>◉</div>
            <div>
              <strong style={{ display: 'block', fontSize: 22, lineHeight: 1.1 }}>FoundRetail</strong>
              <small style={{ color: '#bfd8ee', fontSize: 12 }}>{'WhatsApp Retail OS'}</small>
            </div>
          </a>

          <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <a href="/website" style={navChip}>Home</a>
            <a href="/website#features" style={navChip}>Features</a>
            <a href="/website#messaging" style={navChip}>Messaging Channels</a>
            <details className={styles.detailsOpen} style={{ position: 'relative', display: 'inline-block' }}>
              <summary className={styles.summaryToggle} style={navChip}>Consoles</summary>
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', minWidth: 280, background: 'rgba(8,13,20,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.35)', display: 'grid', gap: 8, zIndex: 30 }}>
                {consoleLinks.map(({ name, href }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#edf7ff', textDecoration: 'none', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 13, fontWeight: 700 }}>{name}</a>
                ))}
              </div>
            </details>
            <a href={retailHomeUrl} target="_blank" rel="noopener noreferrer" style={{ ...navChip, background: 'rgba(0,230,118,0.12)', borderColor: 'rgba(255,255,255,0.12)', color: '#edf7ff' }}>Back to home</a>
            <a href="/legal" style={{ ...navChip, background: 'rgba(0,230,118,0.12)', borderColor: 'rgba(255,255,255,0.12)', color: '#edf7ff' }}>Legal</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px 80px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 28 }}>
          <p style={{ margin: 0, color: '#00E676', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Legal</p>
          <h1 style={{ margin: 0, fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1.06 }}>{'FoundRetail'} Legal & Compliance</h1>
          <p style={{ margin: 0, maxWidth: 760, color: '#bfd8ee', lineHeight: 1.8 }}>This legal hub sets out how FoundRetail handles customer, partner, operational, and platform data across the channels and systems inside the FoundRetail environment.</p>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {legalSections.map((section) => (
            <section key={section.name} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, background: 'rgba(255,255,255,0.02)', padding: 22 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 24, color: '#edf7ff' }}>{section.name}</h2>
              <p style={{ margin: 0, color: '#bfd8ee', lineHeight: 1.8 }}>{section.copy}</p>
            </section>
          ))}
        </div>
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#070c14', marginTop: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 40px', display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: 22 }}>{'FoundRetail'}</strong>
            <p style={{ margin: '10px 0 0', color: '#bfd8ee' }}>Registered address: 24 Founder Way, London, UK</p>
          </div>
          <div style={{ color: '#bfd8ee' }}>© 2026 FoundRetail • All rights reserved</div>
        </div>
      </footer>
    </main>
  )
}

const navChip = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#edf7ff', textDecoration: 'none', fontSize: 13, fontWeight: 700,
}
