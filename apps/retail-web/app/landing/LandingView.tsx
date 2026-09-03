/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const LEGAL_ITEMS = [
  { id: 'tos', title: 'Terms & Conditions', body: 'By continuing you agree to use FoundRetail for evaluation purposes only, in line with fair and lawful use.' },
  { id: 'privacy', title: 'Privacy Policy', body: 'Any details you enter here are used only to personalise your FoundRetail preview and are never sold or shared.' },
  { id: 'tester-agreement', title: 'Tester Agreement', body: 'As a tester you agree to provide honest feedback and to report issues you encounter during your preview.' },
  { id: 'nda', title: 'NDA (Non-Disclosure Agreement)', body: 'This preview is confidential. Please do not share screenshots, credentials, or details outside your organisation.' },
] as const

export function LandingView() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => { document.title = 'Landing | FoundingOS' }, [])

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!agreed) return
    if (typeof window !== 'undefined') window.sessionStorage.setItem('testerEmail', email)
    router.push('/home')
  }

  return (
    <main className="login-shell quantum-ambient-grid" style={{ minHeight: '100vh' }}>
      <form className="login-card fo-card fo-panel-glow tester-login-card" onSubmit={onSubmit}>
        <div className="tester-login-logo" aria-hidden="true">◉</div>
        <h1>FoundRetail</h1>
        <p>Sign in to preview your FoundRetail experience.</p>

        <label className="manager-field">
          <span>Email</span>
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
        </label>

        <label className="manager-field">
          <span>Password</span>
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

        <div className="tester-legal-block">
          <p className="tester-legal-heading">Please review before continuing</p>
          {LEGAL_ITEMS.map((item) => (
            <details key={item.id} className="tester-legal-doc">
              <summary>{item.title}</summary>
              <p>{item.body}</p>
            </details>
          ))}
          <label className="tester-legal-checkbox">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} required />
            <span>I have read and agree to the Terms &amp; Conditions, Privacy Policy, Tester Agreement, and NDA.</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={!agreed}>Sign in</button>
      </form>
    </main>
  )
}
