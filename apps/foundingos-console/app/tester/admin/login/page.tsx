/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TesterAdminLoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const response = await fetch('/api/tester/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error ?? 'Unable to sign in.')
        return
      }
      router.push(data.redirect ?? '/tester/admin')
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
        <h1>Tester Program — Admin</h1>
        <p>Enter the admin passcode to review tester survey results.</p>

        <label className="manager-field">
          <span>Admin passcode</span>
          <input type="password" required value={passcode} onChange={(event) => setPasscode(event.target.value)} autoComplete="off" />
        </label>

        {error && <p className="tester-login-error">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Checking…' : 'View results'}
        </button>
      </form>
    </main>
  )
}
