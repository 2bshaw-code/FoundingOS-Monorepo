/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import styles from './page.module.css'

// The sole real entry point at www.foundingos.com. Submits cross-origin (with
// credentials) to the real, existing /api/tester/login endpoint in foundingos-console —
// no duplicate auth logic, no duplicate credential list. The API's `category` field
// (computed server-side from the real credential id) decides where this page sends the
// browser next; category destinations live on console.foundingos.com except for
// admin/free-roam, which land back on this app's own real Homepage at /home.
const CONSOLE_URL = process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000'

const CATEGORY_DESTINATIONS: Record<string, string> = {
  admin: '/home',
  'free-roam': '/home',
  survey: `${CONSOLE_URL}/tester/survey`,
  tester: `${CONSOLE_URL}/tester/dashboard`,
  investor: `${CONSOLE_URL}/investor`,
  lawyer: `${CONSOLE_URL}/legal`,
}

export default function RootLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const response = await fetch(`${CONSOLE_URL}/api/tester/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, agreedToLegalTerms: agreed }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error ?? 'Unable to sign in.')
        return
      }
      const destination = CATEGORY_DESTINATIONS[data.category] ?? '/home'
      window.location.href = destination
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className={styles.quantumShell}>
      <div className={styles.quantumGrid} aria-hidden="true" />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', justifyItems: 'center' }}>
        <div className={styles.quantumHeader}>
          <div className={styles.quantumLogo} aria-hidden="true">FO</div>
          <strong style={{ color: '#F5F7FA', fontSize: 15, letterSpacing: '0.03em' }}>FoundingOS</strong>
          <p className={styles.quantumStrapline}>The Operating System for Founders.</p>
        </div>

        <div className={styles.quantumCardWrap}>
          <form className={styles.quantumCard} onSubmit={onSubmit}>
            <h1>Sign in</h1>
            <p style={{ opacity: 0.75, margin: 0 }}>Enter your email and your password or access code to continue.</p>

            <label className="manager-field">
              <span>Email</span>
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </label>

            <label className="manager-field">
              <span>Password or access code</span>
              <div className="tester-password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="tester-eye-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '◑' : '◉'}
                </button>
              </div>
            </label>

            <label className="tester-legal-checkbox">
              <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
              <span>I have read and agree to the Terms of Service, Privacy Policy, and applicable agreements.</span>
            </label>

            {error && <p className="tester-login-error">{error}</p>}

            <button type="submit" className={`btn btn-primary ${styles.quantumButton}`} disabled={pending || !agreed}>
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
