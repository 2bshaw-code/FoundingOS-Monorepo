/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'

// First survey question for the /landing flow. Intentionally self-contained —
// no console components, no shared survey engine — this is a separate, simple
// flow from the real Customer/Buyer/Investor survey system in foundingos-console.
export default function LandingSurveyPage() {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="stack quantum-ambient-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="login-card fo-card fo-panel-glow" style={{ maxWidth: 480, width: '100%' }}>
        {submitted ? (
          <>
            <h1>Thank you</h1>
            <p style={{ opacity: 0.8 }}>Your response has been recorded.</p>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <h1 style={{ marginBottom: 8 }}>Quick question</h1>
            <p style={{ opacity: 0.75, marginBottom: 20 }}>What brought you to FounderOS today?</p>
            <label className="manager-field">
              <span>Your answer</span>
              <textarea rows={4} value={answer} onChange={(event) => setAnswer(event.target.value)} />
            </label>
            <button type="submit" className="btn btn-primary quantum-btn" style={{ marginTop: 16, width: '100%' }}>
              Submit
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
