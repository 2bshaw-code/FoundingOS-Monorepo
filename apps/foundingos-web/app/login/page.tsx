/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { brands } from '@foundingos/config'
import { QuantumButtonPrimary, QuantumCard, QuantumHeader, QuantumTextField } from '@foundingos/ui/quantum'

// Simple demo-mode login for the /landing flow. No auth packages, no console
// imports — separate from, and must not interfere with, /auth/signin or
// /tester-login, which remain untouched.
export default function LandingLoginPage() {
  const router = useRouter()
  const [name, setName] = useState('')

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    router.push('/survey')
  }

  return (
    <main className="q-shell q-login-shell">
      <QuantumHeader brand={brands.foundingos} eyebrow="Demo access" title="Sign in" description="Demo mode — no account required." />
      <QuantumCard brand={brands.foundingos}>
        <form onSubmit={onSubmit} className="q-form-stack">
          <QuantumTextField label="Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
          <QuantumButtonPrimary type="submit">Continue</QuantumButtonPrimary>
        </form>
      </QuantumCard>
    </main>
  )
}
