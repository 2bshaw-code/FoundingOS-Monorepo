/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'

export const metadata = { title: 'Thank You | FoundFinance' }

export default function SurveyThankYouPage() {
  return (
    <main className="quantum-ambient-grid" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <article className="fo-card fo-panel-glow" style={{ padding: 32, textAlign: 'center', maxWidth: 420 }}>
        <h1>Thank you</h1>
        <p>Your feedback has been recorded and sent to the FoundFinance team.</p>
        <Link className="btn btn-primary" href="/survey">Submit another response</Link>
      </article>
    </main>
  )
}
