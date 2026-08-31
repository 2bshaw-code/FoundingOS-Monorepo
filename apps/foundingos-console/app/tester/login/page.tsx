/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LEGAL_DOCUMENTS, LEGAL_CONTENT_VERSION } from '../legal-content'
import styles from './page.module.css'

export default function TesterLoginPage() {
  const router = useRouter()
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
      const response = await fetch('/api/tester/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, agreedToLegalTerms: agreed }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error ?? 'Unable to sign in.')
        return
      }
      router.push(data.redirect ?? '/tester/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className={`login-shell ${styles.quantumShell}`}>
      <div className={styles.quantumGrid} aria-hidden="true" />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', justifyItems: 'center' }}>
        <div className={styles.quantumHeader}>
          <div className={styles.quantumLogo} aria-hidden="true">FO</div>
          <strong style={{ color: '#F5F7FA', fontSize: 15, letterSpacing: '0.03em' }}>FoundingOS</strong>
          <p className={styles.quantumStrapline}>The Operating System for Founders.</p>
        </div>

        <div className={styles.quantumCardWrap}>
          <form className={`login-card fo-card fo-panel-glow tester-login-card ${styles.quantumCard}`} onSubmit={onSubmit}>
            <div className="tester-login-logo" aria-hidden="true">FO</div>
            <h1>FounderOS Tester Access</h1>
            <p>Sign in with your email and pre-issued access code to begin your tailored survey.</p>

            <label className="manager-field">
              <span>Email</span>
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </label>

            <label className="manager-field">
              <span>Access code</span>
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
                  aria-label={showPassword ? 'Hide access code' : 'Show access code'}
                >
                  {showPassword ? '◑' : '◉'}
                </button>
              </div>
            </label>

            <div className="tester-legal-block">
              <p className="tester-legal-heading">Agreements (v{LEGAL_CONTENT_VERSION}) — please review before continuing</p>
              {LEGAL_DOCUMENTS.map((doc) => (
                <details key={doc.id} className="tester-legal-doc">
                  <summary>{doc.title}</summary>
                  <p>{doc.body}</p>
                </details>
              ))}
              <label className="tester-legal-checkbox">
                <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} required />
                <span>I have read and agree to all of the above agreements.</span>
              </label>
            </div>

            {error && <p className="tester-login-error">{error}</p>}

            <button type="submit" className={`btn btn-primary ${styles.quantumButton}`} disabled={pending || !agreed}>
              {pending ? 'Checking…' : 'Register with your email'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
