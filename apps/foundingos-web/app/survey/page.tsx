/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { brands } from '@foundingos/config'
import { QuantumButtonPrimary, QuantumCard, QuantumHeader } from '@foundingos/ui/quantum'

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
    <main className="q-shell q-centered-shell">
      <QuantumCard brand={brands.foundingos}>
        {submitted ? (
          <>
            <h1 className="q-text-h1">Thank you</h1>
            <p className="q-text-body">Your response has been recorded.</p>
          </>
        ) : (
          <form onSubmit={onSubmit} className="q-form-stack">
            <QuantumHeader brand={brands.foundingos} eyebrow="FounderOS survey" title="Quick question" description="What brought you to FounderOS today?" />
            <label className="manager-field">
              <span>Your answer</span>
              <textarea rows={4} value={answer} onChange={(event) => setAnswer(event.target.value)} />
            </label>
            <QuantumButtonPrimary type="submit">Submit</QuantumButtonPrimary>
          </form>
        )}
      </QuantumCard>
    </main>
  )
}
