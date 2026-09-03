/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { brands } from '@foundingos/config'

export const metadata = { title: 'Retail Console | FoundingOS' }

export default function RetailConsolePage() {
  return (
    <main className="quantum-ambient-grid" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <article className="fo-card fo-panel-glow" style={{ padding: 32, textAlign: 'center', maxWidth: 420 }}>
        <h1>FoundRetail Console</h1>
        <p>Continue to the FoundRetail manager console.</p>
        <a className="btn btn-primary" href={brands.retail.consoleUrl}>Open console</a>
      </article>
    </main>
  )
}
