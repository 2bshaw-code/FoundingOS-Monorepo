/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import { SURVEY_CATEGORIES } from '../survey/survey-categories'
import { TesterGreeting } from './TesterGreeting'

export const metadata = { title: 'Home | FoundingOS' }

export default function HomePage() {
  return (
    <section className="stack quantum-ambient-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px' }}>
      <header className="module-header header-premium">
        <p>FoundRetail</p>
        <h1>Welcome back</h1>
        <span>Explore FoundRetail, open your console, or share quick feedback with the team.</span>
        <TesterGreeting />
      </header>

      <div className="module-card-grid">
        <Link href="/retail" className="module-card card-premium quantum-card">
          <div className="module-card-top"><span>01</span><strong>About FoundRetail</strong></div>
          <p>See what FoundRetail does and which modules are included.</p>
        </Link>
        <Link href="/retail/console" className="module-card card-premium quantum-card">
          <div className="module-card-top"><span>02</span><strong>Open console</strong></div>
          <p>Jump into the FoundRetail manager or starter console.</p>
        </Link>
        <Link href="/website" className="module-card card-premium quantum-card">
          <div className="module-card-top"><span>03</span><strong>Full website</strong></div>
          <p>Visit the complete FoundRetail marketing site — features, pricing, and more.</p>
        </Link>
      </div>

      <article className="fo-card fo-panel-glow" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Give feedback</h2>
        <p>Pick a category — each takes under a minute.</p>
        <div className="module-card-grid">
          {SURVEY_CATEGORIES.map((category, index) => (
            <Link key={category.slug} href={`/survey/${category.slug}`} className="module-card card-premium quantum-card">
              <div className="module-card-top"><span>{String(index + 1).padStart(2, '0')}</span><strong>{category.label}</strong></div>
              <p>{category.questions.length} quick question(s).</p>
            </Link>
          ))}
        </div>
      </article>
    </section>
  )
}
