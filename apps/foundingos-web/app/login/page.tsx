/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <main className="stack quantum-ambient-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form onSubmit={onSubmit} className="login-card fo-card fo-panel-glow" style={{ maxWidth: 380, width: '100%' }}>
        <h1 style={{ marginBottom: 8 }}>Sign In</h1>
        <p style={{ opacity: 0.75, marginBottom: 20 }}>Demo mode — no account required.</p>
        <label className="manager-field">
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
        </label>
        <button type="submit" className="btn btn-primary quantum-btn" style={{ marginTop: 16, width: '100%' }}>
          Continue
        </button>
      </form>
    </main>
  )
}
