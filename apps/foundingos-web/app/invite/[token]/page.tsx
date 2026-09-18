'use client'

import { useEffect, useState } from 'react'
import { PasswordField } from '../../access/password-field'

type InvitationDetails = { email: string; role: string; tenantName: string; expiresAt: string }

const apiRoot = (process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || '').replace(/\/ops\/?$/, '').replace(/\/+$/, '')

export default function InvitationAcceptancePage({ params }: { params: { token: string } }) {
  const [details, setDetails] = useState<InvitationDetails | null>(null)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'accepted' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!apiRoot) {
      setStatus('error')
      setMessage('Invitation service is not configured for this environment.')
      return
    }
    fetch(`${apiRoot}/ops/platform/team/invitations/inspect?token=${encodeURIComponent(params.token)}`)
      .then(async (response) => {
        const body = await response.json() as { data?: InvitationDetails; message?: string }
        if (!response.ok || !body.data) throw new Error(body.message || 'This invitation is invalid or expired.')
        setDetails(body.data)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'This invitation is invalid or expired.')
      })
  }, [params.token])

  const accept = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    if (password.length < 12) {
      setMessage('Choose a password with at least 12 characters.')
      return
    }
    if (password !== confirmation) {
      setMessage('Passwords do not match.')
      return
    }
    setStatus('loading')
    try {
      const response = await fetch(`${apiRoot}/ops/platform/team/invitations/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token, password }),
      })
      const body = await response.json() as { data?: { nextStep?: string }; message?: string }
      if (!response.ok || !body.data) throw new Error(body.message || 'Invitation acceptance failed.')
      setStatus('accepted')
      setMessage(body.data.nextStep || 'Your account is ready. You can now sign in.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Invitation acceptance failed.')
    }
  }

  return <main className="complete-workspace-access invitation-acceptance">
    <section>
      <div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>Governed business intelligence</small></div></div>
      {status === 'loading' ? <><p className="eyebrow">Secure invitation</p><h1>Preparing your workspace</h1><p>We are validating your invitation securely. This will only take a moment.</p></> : null}
      {status === 'error' ? <><p className="eyebrow">Invitation unavailable</p><h1>This invitation needs attention</h1><div className="complete-workspace-error" role="alert">{message}</div><p>Ask the workspace owner to send a new invitation if this link has expired or already been used.</p></> : null}
      {status === 'accepted' ? <><p className="eyebrow">Welcome to FoundingOS</p><h1>Your account is ready</h1><p>{message}</p><a className="retail-app-primary invitation-link" href="/login">Continue to sign in</a></> : null}
      {status === 'ready' && details ? <><p className="eyebrow">You have been invited</p><h1>Join {details.tenantName}</h1><p>Set up your FoundingOS account for <strong>{details.email}</strong>. Your role is <strong>{details.role.replaceAll('_', ' ')}</strong>.</p><small className="site-access-note">This invitation expires {new Date(details.expiresAt).toLocaleString()}.</small><form onSubmit={(event) => void accept(event)}><PasswordField autoComplete="new-password" label="Password" minLength={12} onChange={setPassword} value={password} /><PasswordField autoComplete="new-password" label="Confirm password" minLength={12} onChange={setConfirmation} value={confirmation} />{message ? <div className="complete-workspace-error" role="alert">{message}</div> : null}<button className="retail-app-primary" type="submit">Accept invitation</button></form></> : null}
    </section>
  </main>
}
