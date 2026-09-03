/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

'use client'

// Real Contact & Support page — the footer/nav "Contact"/"Support" links across this site
// previously pointed at /contact, which (via the catch-all [...slug] route) just re-rendered
// the homepage with no actual contact content. This is a real, dedicated page with honest
// support info — no fake live-chat widget or phone number that doesn't exist.

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
            <a href="/contact" style={{ ...navChip, background: 'rgba(0,224,255,0.12)' }}>Contact &amp; Support</a>
            <a href="/legal" style={navChip}>Legal</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px 80px' }}>
        <div style={{ display: 'grid', gap: 10, marginBottom: 32 }}>
          <p style={{ margin: 0, color: '#00E0FF', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Contact &amp; Support</p>
          <h1 style={{ margin: 0, fontSize: 'clamp(34px, 5vw, 52px)', lineHeight: 1.06 }}>We&rsquo;re here to help</h1>
          <p style={{ margin: 0, maxWidth: 640, color: '#b9c2cf', lineHeight: 1.8 }}>Whether you&rsquo;re a tester, an investor, or just exploring FoundingOS, here&rsquo;s the fastest way to reach us.</p>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          <section style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, background: 'rgba(255,255,255,0.02)', padding: 22 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>Testing the system?</h2>
            <p style={{ margin: 0, color: '#b9c2cf', lineHeight: 1.8 }}>Every demo has a real feedback form built in \u2014 use the "Feedback" link on your Demos &amp; Surveys dashboard once you&rsquo;re signed in. That reaches us directly and is the fastest way to report a bug or share a thought.</p>
          </section>

          <section style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, background: 'rgba(255,255,255,0.02)', padding: 22 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>Something not working?</h2>
            <p style={{ margin: 0, color: '#b9c2cf', lineHeight: 1.8 }}>Tell us what you were trying to do, what happened instead, and which brand/page you were on \u2014 that\u2019s all we need to look into it.</p>
          </section>

          <section style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, background: 'rgba(255,255,255,0.02)', padding: 22 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>Questions about a specific brand?</h2>
            <p style={{ margin: 0, color: '#b9c2cf', lineHeight: 1.8 }}>Each brand connected to FoundingOS (FoundRetail, FoundCrypto, and the rest) has its own Legal &amp; Compliance page linked from its own site footer, alongside this one for FoundingOS itself.</p>
          </section>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#070c14' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 40px', display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: 22 }}>FoundingOS</strong>
            <p style={{ margin: '10px 0 0', color: '#b9c2cf' }}>See our <a href="/legal" style={{ color: '#00E0FF' }}>Legal &amp; Compliance</a> page for how we handle data.</p>
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
