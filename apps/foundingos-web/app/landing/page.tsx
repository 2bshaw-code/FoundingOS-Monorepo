/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'

// Minimal Quantum-style landing page — no console imports, no dashboard UI.
// Used only when the domain foundingos.com is pointed at this route; the
// existing rich homepage at / is untouched.
export default function LandingPage() {
  return (
    <main className="stack quantum-ambient-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <div className="quantum-particle-drift"><span className="quantum-particle" /><span className="quantum-particle" /><span className="quantum-particle" /></div>
      <div>
        <p style={{ letterSpacing: 2, textTransform: 'uppercase', fontSize: 12, opacity: 0.7 }}>FounderOS</p>
        <h1 className="header-premium" style={{ fontSize: 48, margin: '12px 0' }}>FounderOS</h1>
        <p style={{ maxWidth: 480, margin: '0 auto 32px', opacity: 0.8 }}>
          One ecosystem. Every brand connected.
        </p>
        <Link href="/login" className="btn btn-primary quantum-btn" style={{ fontSize: 16, padding: '14px 32px' }}>
          Sign In
        </Link>
      </div>
    </main>
  )
}
