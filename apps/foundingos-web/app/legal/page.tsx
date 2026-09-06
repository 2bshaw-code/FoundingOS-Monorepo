/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { brands } from '@foundingos/config'
import { QuantumCard, QuantumHeader } from '@foundingos/ui/quantum'

const legalSections = [
  { name: 'Privacy Policy', copy: 'We collect the email address or connected account details needed to create your account, plus a session cookie that keeps you signed in. We do not sell your data.' },
  { name: 'Terms & Conditions', copy: 'These terms govern access to FoundingOS and the brands connected to it. FoundingOS is under active development, so features, pricing tiers, and specific brand tools may change as the system evolves.' },
  { name: 'Cookie Policy', copy: 'We use a session cookie to keep you signed in across FoundingOS and basic anonymous analytics to understand which parts of the system are actually being used.' },
  { name: 'Compliance & Data Handling', copy: 'Each brand data boundary remains separate and is never mixed with another brand data boundary, even though every brand runs on the same underlying FoundingOS system.' },
  { name: 'Illustrative Data Disclosure', copy: 'Some dashboards, demos, and reports use clearly labelled illustrative or sample data. Real figures are marked as real; sample data is not presented as real results.' },
] as const

export default function Page() {
  return (
    <>
      <nav className="q-page-nav">
        <a href="/" className="q-brand-mark">
          <span className="q-logo-tile">⌂</span>
          <span>
            <strong>FoundingOS</strong>
            <small className="q-copy-muted">One control room for every brand</small>
          </span>
        </a>
        <div className="q-nav-links">
          <a href="/home" className="q-button q-button-ghost">Home</a>
          <a href="/contact" className="q-button q-button-ghost">Contact & Support</a>
          <a href="/legal" className="q-button q-button-primary">Legal</a>
        </div>
      </nav>
      <main className="q-shell">
        <QuantumHeader
          brand={brands.foundingos}
          eyebrow="Legal"
          title="FoundingOS Legal & Compliance"
          description="A short, plain-English summary of how FoundingOS handles your data and what using it means."
        />
        <div className="q-card-stack">
          {legalSections.map((section) => (
            <QuantumCard key={section.name} brand={brands.foundingos}>
              <h2 className="q-text-h2">{section.name}</h2>
              <p className="q-text-body">{section.copy}</p>
            </QuantumCard>
          ))}
        </div>
      </main>
      <footer className="q-footer-row">
        <strong>FoundingOS</strong>
        <p>Questions about this policy? See <a className="q-link-accent" href="/contact">Contact & Support</a>.</p>
      </footer>
    </>
  )
}
