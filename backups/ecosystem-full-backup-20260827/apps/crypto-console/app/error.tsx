'use client'
/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect } from 'react'

export default function ConsoleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Digest lets us match this screen to a server log line.
    console.error('[console] unhandled error', { message: error.message, digest: error.digest })
  }, [error])

  return (
    <div style={{ padding: '48px 32px', maxWidth: 620, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: '#EAEAEA' }}>
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#93a5bb', marginBottom: 10 }}>
        Something went wrong
      </p>
      <h1 style={{ fontSize: '1.6rem', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
        This screen could not load
      </h1>
      <p style={{ color: '#b7c5d6', lineHeight: 1.6, margin: '0 0 8px' }}>
        The rest of the console is still running. You can retry this page, or head back to the dashboard.
      </p>
      {error.digest && (
        <p style={{ color: '#7c8da3', fontSize: '0.75rem', margin: '0 0 24px' }}>
          Reference <code style={{ padding: '2px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.07)' }}>{error.digest}</code>
        </p>
      )}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={reset}
          style={{ minHeight: 40, padding: '0 18px', borderRadius: 10, border: 0, background: '#4A90E2', color: '#04121f', fontWeight: 700, cursor: 'pointer' }}
        >
          Try again
        </button>
        <a
          href="/console"
          style={{ minHeight: 40, padding: '0 18px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: '#EAEAEA', textDecoration: 'none' }}
        >
          Back to dashboard
        </a>
      </div>
    </div>
  )
}
