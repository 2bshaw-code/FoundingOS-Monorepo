/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Link } from 'react-router-dom'

export default function FounderHome() {
  return (
    <div
      style={{
        background: '#0d0d0d',
        color: 'white',
        minHeight: '100vh',
        padding: '60px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>FoundingOS</h1>
      <p style={{ fontSize: '20px', marginBottom: '40px' }}>Select a suite</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Link style={linkStyle} to="/foundretail/">Core.Operations</Link>
        <Link style={linkStyle} to="/foundthis/">Core.Intelligence</Link>
        <Link style={linkStyle} to="/foundtalent/">Core.Workforce</Link>
      </div>
    </div>
  )
}

const linkStyle = {
  fontSize: '24px',
  color: '#00aaff',
  textDecoration: 'none',
  padding: '10px 0',
}
