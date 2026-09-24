/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect } from 'react'

// Silently completes the console handoff for a user who already has a valid website
// session — used only when page.tsx's server-side check confirms both a live session and
// an allowed returnTo are present, so this never runs with unverified data.
export function AutoHandoff({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url
  }, [url])

  return (
    <main className="q-shell q-login-shell">
      <p>Signing you in…</p>
    </main>
  )
}
