/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { brands } from '@foundingos/config'

export function LockdownBanner({ brandName, logo, accent }: { brandName: string; logo?: string; accent?: string }) {
  const theme = accent ? ({ '--accent': accent } as React.CSSProperties) : undefined
  return (
    <div className="lockdown-overlay" role="status" style={theme}>
      {logo && <span className="lockdown-banner-logo" aria-hidden="true">{logo}</span>}
      <span className="lockdown-banner-dot" aria-hidden="true" />
      <p>{brandName} console is locked. Access is restricted after testing.</p>
      <div className="lockdown-overlay-actions">
        <a className="btn btn-primary" href={`${brands.foundingos.webUrl}/`}>Go to FoundingOS Onboarding</a>
        <a className="btn btn-secondary" href={brands.foundingos.webUrl}>Learn About SuperDashboard</a>
      </div>
    </div>
  )
}

export default LockdownBanner
