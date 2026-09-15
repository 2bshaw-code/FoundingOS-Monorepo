/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TesterLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
        body: JSON.stringify({ email, password }),
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
    <main className="login-shell">
      <form className="login-card fo-card fo-panel-glow tester-login-card" onSubmit={onSubmit}>
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

        {error && <p className="tester-login-error">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Checking…' : 'Register with your email'}
        </button>
      </form>
    </main>
  )
}
