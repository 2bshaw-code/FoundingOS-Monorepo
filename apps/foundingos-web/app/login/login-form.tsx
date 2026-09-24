/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { brands } from '@foundingos/config'
import { QuantumButtonPrimary, QuantumCard, QuantumHeader, QuantumTextField } from '@foundingos/ui/quantum'
import { PasswordField } from '../access/password-field'

// The real email/password form itself. Rendered by page.tsx (a server component) only when
// no already-valid website session exists — if one does, page.tsx skips this entirely and
// hands the existing session straight to the console (or to /workspace), so a user who is
// already signed in is never asked to log in again just to reach the console.
export function LoginForm({ returnTo }: { returnTo: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    try {
      const response = await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnTo }),
      })
      const body = await response.json() as { success?: boolean; message?: string; handoff?: { token: string; refreshToken: string } }
      if (!response.ok || !body.success) throw new Error(body.message || 'That email or password was not accepted.')
      if (body.handoff) {
        // Tokens travel only in the URL fragment (never sent to any server in a request),
        // and only to the exact console origin the server already validated.
        window.location.href = `${returnTo}#token=${encodeURIComponent(body.handoff.token)}&refreshToken=${encodeURIComponent(body.handoff.refreshToken)}`
        return
      }
      router.push('/workspace')
      router.refresh()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Sign-in failed. Please try again.')
    }
  }

  return (
    <main className="q-shell q-login-shell">
      <QuantumHeader brand={brands.foundingos} eyebrow="FoundingOS account" title="Sign in" description="Use the email and password for your FoundingOS workspace." />
      <QuantumCard brand={brands.foundingos}>
        <form onSubmit={(event) => void onSubmit(event)} className="q-form-stack">
          <QuantumTextField
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
          />
          <PasswordField label="Password" autoComplete="current-password" value={password} onChange={setPassword} />
          {status === 'error' ? <div className="complete-workspace-error" role="alert">{message}</div> : null}
          <QuantumButtonPrimary type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Signing in…' : 'Sign in'}
          </QuantumButtonPrimary>
        </form>
      </QuantumCard>
    </main>
  )
}
