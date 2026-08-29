'use client'
/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#070d16', color: '#EAEAEA', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ padding: '64px 32px', maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 12px' }}>The console stopped responding</h1>
          <p style={{ color: '#b7c5d6', lineHeight: 1.6 }}>
            A problem occurred while starting this page. Reloading usually resolves it.
          </p>
          {error.digest && <p style={{ color: '#7c8da3', fontSize: '0.75rem' }}>Reference {error.digest}</p>}
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 20, minHeight: 40, padding: '0 18px', borderRadius: 10, border: 0, background: '#4A90E2', color: '#04121f', fontWeight: 700, cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  )
}
