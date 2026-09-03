/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import { brands } from '@foundingos/config'

export const metadata = { title: 'Retail | FoundingOS' }

export default function RetailPage() {
  const brand = brands.retail
  return (
    <section className="stack quantum-ambient-grid" style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px' }}>
      <header className="module-header header-premium">
        <p>{brand.name}</p>
        <h1>{brand.tagline}</h1>
        <span>{brand.description}</span>
      </header>

      <article className="fo-card fo-panel-glow" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Included modules</h2>
        <ul>
          {brand.modules.map((module) => (
            <li key={module}>{module}</li>
          ))}
        </ul>
      </article>

      <div className="module-card-grid">
        <Link href="/retail/console" className="module-card card-premium quantum-card">
          <div className="module-card-top"><span>01</span><strong>Open console</strong></div>
          <p>Jump into the FoundRetail manager or starter console.</p>
        </Link>
        <Link href="/home" className="module-card card-premium quantum-card">
          <div className="module-card-top"><span>02</span><strong>Back to home</strong></div>
          <p>Return to your FoundRetail home.</p>
        </Link>
      </div>
    </section>
  )
}
