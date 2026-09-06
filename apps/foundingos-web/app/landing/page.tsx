/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import { brands } from '@foundingos/config'
import { QuantumCard, QuantumHeader } from '@foundingos/ui/quantum'

// Minimal Quantum-style landing page — no console imports, no dashboard UI.
// Used only when the domain foundingos.com is pointed at this route; the
// existing rich homepage at / is untouched.
export default function LandingPage() {
  return (
    <main className="q-shell q-centered-shell">
      <div className="quantum-particle-drift"><span className="quantum-particle" /><span className="quantum-particle" /><span className="quantum-particle" /></div>
      <QuantumCard brand={brands.foundingos}>
        <QuantumHeader brand={brands.foundingos} eyebrow="FounderOS" title="FounderOS" description="One ecosystem. Every brand connected." />
        <Link href="/login" className="q-button q-button-primary q-button-large">Sign In</Link>
      </QuantumCard>
    </main>
  )
}
