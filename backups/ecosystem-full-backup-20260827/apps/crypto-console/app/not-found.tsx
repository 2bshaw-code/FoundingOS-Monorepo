/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export default function NotFound() {
  return (
    <div style={{ padding: '48px 32px', maxWidth: 620, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: '#EAEAEA' }}>
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#93a5bb', marginBottom: 10 }}>Not found</p>
      <h1 style={{ fontSize: '1.6rem', margin: '0 0 12px', letterSpacing: '-0.02em' }}>That page is not part of this console</h1>
      <p style={{ color: '#b7c5d6', lineHeight: 1.6, marginBottom: 24 }}>
        The module may not be included in your package, or the link may be out of date.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <a href="/console" style={{ minHeight: 40, padding: '0 18px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', background: '#4A90E2', color: '#04121f', fontWeight: 700, textDecoration: 'none' }}>Dashboard</a>
        <a href="/console/app-store" style={{ minHeight: 40, padding: '0 18px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', color: '#EAEAEA', textDecoration: 'none' }}>Browse modules</a>
      </div>
    </div>
  )
}
