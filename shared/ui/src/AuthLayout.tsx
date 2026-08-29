/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { CSSProperties, ReactNode } from 'react'
import { FounderOsLogo } from './logo'
import { founderOsTheme } from './theme'

export function AuthLayout({ children, logo = <FounderOsLogo />, theme = founderOsTheme, brandName = 'FoundingOS' }: { children: ReactNode; logo?: ReactNode; theme?: typeof founderOsTheme; brandName?: string }) {
  const style = {
    '--primary': theme.primary,
    '--ink': theme.secondary,
    '--surface': theme.background,
    '--line': theme.line,
  } as CSSProperties

  return <div className="auth-layout" style={style}><header className="auth-layout__brand">{logo}<strong>{brandName}</strong></header>{children}</div>
}