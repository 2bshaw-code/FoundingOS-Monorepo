/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { brands } from '@foundingos/config'
import { QuantumCard, QuantumHeader } from '@foundingos/ui/quantum'

const supportCards = [
  {
    title: 'Testing the system?',
    copy: 'Every demo has a real feedback form built in — use the Feedback link on your Demos & Surveys dashboard once you are signed in. That reaches us directly and is the fastest way to report a bug or share a thought.',
  },
  {
    title: 'Something not working?',
    copy: 'Tell us what you were trying to do, what happened instead, and which brand/page you were on — that is all we need to look into it.',
  },
  {
    title: 'Questions about a specific brand?',
    copy: 'Each brand connected to FoundingOS has its own Legal & Compliance page linked from its own site footer, alongside this one for FoundingOS itself.',
  },
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
          <a href="/contact" className="q-button q-button-primary">Contact & Support</a>
          <a href="/legal" className="q-button q-button-ghost">Legal</a>
        </div>
      </nav>
      <main className="q-shell">
        <QuantumHeader
          brand={brands.foundingos}
          eyebrow="Contact & Support"
          title="We are here to help"
          description="Whether you are a tester, an investor, or exploring FoundingOS, this is the fastest path to the right support loop."
        />
        <div className="q-card-stack">
          {supportCards.map((card) => (
            <QuantumCard key={card.title} brand={brands.foundingos}>
              <h2 className="q-text-h2">{card.title}</h2>
              <p className="q-text-body">{card.copy}</p>
            </QuantumCard>
          ))}
        </div>
      </main>
      <footer className="q-footer-row">
        <strong>FoundingOS</strong>
        <p>See our <a className="q-link-accent" href="/legal">Legal & Compliance</a> page for how we handle data.</p>
      </footer>
    </>
  )
}
