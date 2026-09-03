/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

'use client'

// Same structural pattern as every brand's own /legal page (crypto-web, finance-web,
// retail-web, etc.) — foundingos-web (the main umbrella site) was the one brand site missing
// this. Content is deliberately a short, honest public summary (not a full binding contract,
// same scope as every other brand's version) — draft, pending review by a qualified lawyer
// before this is relied on as final. Reflects what the real sign-in flow actually collects
// (email, and Google/Apple account info if that's the chosen sign-in method, plus a session
// cookie) rather than generic boilerplate about data it doesn't collect.

const legalSections = [
  { name: 'Privacy Policy', copy: 'We collect the email address (or Google/Apple account details, if that\u2019s how you sign in) needed to create your account, plus a session cookie that keeps you signed in. We don\u2019t sell your data, and we don\u2019t collect payment or financial account details beyond what\u2019s needed to run the specific brand tools you choose to use.' },
  { name: 'Terms & Conditions', copy: 'These terms govern access to FoundingOS and the brands connected to it. FoundingOS is under active development \u2014 features, pricing tiers, and specific brand tools may change as the system evolves. Use of any brand\u2019s tools is also subject to that brand\u2019s own terms where shown.' },
  { name: 'Cookie Policy', copy: 'We use a session cookie to keep you signed in across FoundingOS and the brands connected to it, and basic, anonymous analytics to understand which parts of the system are actually being used. No advertising or tracking cookies.' },
  { name: 'Compliance & Data Handling', copy: 'Each brand\u2019s data is kept separate and is never mixed with another brand\u2019s data, even though every brand runs on the same underlying FoundingOS system. Access to any brand\u2019s data is limited to that brand\u2019s own account.' },
  { name: 'Illustrative Data Disclosure', copy: 'Some dashboards, demos, and reports across FoundingOS use clearly-labeled illustrative or sample data for demonstration purposes. Anywhere real figures are shown, they\u2019re marked as real; anywhere they\u2019re not, they\u2019re marked as illustrative \u2014 we don\u2019t present sample data as real results.' },
] as const

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', background: '#05060a', color: '#ffffff', fontFamily: 'Inter, Segoe UI, sans-serif' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(7,12,20,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#ffffff' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#00E0FF', color: '#071014', display: 'grid', placeItems: 'center', fontWeight: 900 }}>⌂</div>
            <div>
              <strong style={{ display: 'block', fontSize: 22, lineHeight: 1.1 }}>FoundingOS</strong>
              <small style={{ color: '#b9c2cf', fontSize: 12 }}>One control room for all your money, tools, and apps</small>
            </div>
          </a>
          <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <a href="/home" style={navChip}>Home</a>
            <a href="/contact" style={navChip}>Contact &amp; Support</a>
            <a href="/legal" style={{ ...navChip, background: 'rgba(0,224,255,0.12)' }}>Legal</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px 80px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 28 }}>
          <p style={{ margin: 0, color: '#00E0FF', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Legal</p>
          <h1 style={{ margin: 0, fontSize: 'clamp(38px, 5vw, 62px)', lineHeight: 1.06 }}>FoundingOS Legal &amp; Compliance</h1>
          <p style={{ margin: 0, maxWidth: 760, color: '#b9c2cf', lineHeight: 1.8 }}>This is a short, plain-English summary of how FoundingOS handles your data and what using it means \u2014 it\u2019s a draft pending review by a qualified lawyer, not a substitute for legal advice.</p>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {legalSections.map((section) => (
            <section key={section.name} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, background: 'rgba(255,255,255,0.02)', padding: 22 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 24, color: '#ffffff' }}>{section.name}</h2>
              <p style={{ margin: 0, color: '#b9c2cf', lineHeight: 1.8 }}>{section.copy}</p>
            </section>
          ))}
        </div>
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#070c14' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 40px', display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: 22 }}>FoundingOS</strong>
            <p style={{ margin: '10px 0 0', color: '#b9c2cf' }}>Questions about this policy? See <a href="/contact" style={{ color: '#00E0FF' }}>Contact &amp; Support</a>.</p>
          </div>
          <div style={{ color: '#b9c2cf' }}>© 2026 FoundingOS • All rights reserved</div>
        </div>
      </footer>
    </main>
  )
}

const navChip = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#ffffff', textDecoration: 'none', fontSize: 13, fontWeight: 700,
}
