/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Reads the token pair the website's /login placed in the URL fragment (never a query
// string, so it never reaches this app's server access logs) and exchanges it for a real
// console session via /api/session/handoff. This is the console-side half of the single,
// unified sign-in — see apps/foundingos-web/app/login/page.tsx and
// apps/foundingos-console/app/login/page.tsx for the two entry points that lead here.
export default function SessionHandoffPage() {
  const router = useRouter()
  const [message, setMessage] = useState('Signing you in…')

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const token = params.get('token')
    const refreshToken = params.get('refreshToken')
    // Clear the fragment immediately so the tokens never linger in browser history.
    window.history.replaceState(null, '', window.location.pathname)

    if (!token || !refreshToken) {
      setMessage('Missing sign-in details. Redirecting to sign in…')
      router.replace('/login')
      return
    }

    fetch('/api/session/handoff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('handoff failed')
        router.replace('/workspace')
      })
      .catch(() => {
        setMessage('That sign-in has expired. Redirecting to sign in…')
        router.replace('/login')
      })
  }, [router])

  return (
    <main className="q-shell q-login-shell">
      <p>{message}</p>
    </main>
  )
}
