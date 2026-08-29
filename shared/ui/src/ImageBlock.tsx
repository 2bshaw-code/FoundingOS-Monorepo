/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { CSSProperties } from 'react'

import founderHero from '../../images/stock/founder-hero.svg'
import founderDashboard from '../../images/stock/founder-dashboard.svg'
import foundretailDashboard from '../../images/stock/foundretail-dashboard.svg'
import foundmeatDashboard from '../../images/stock/foundmeat-dashboard.svg'
import founditDashboard from '../../images/stock/foundit-dashboard.svg'
import foundtalentDashboard from '../../images/stock/foundtalent-dashboard.svg'
import foundcryptoDashboard from '../../images/stock/foundcrypto-dashboard.svg'

type ImageVariant = 'founder-hero' | 'founder-dashboard' | 'foundretail-dashboard' | 'foundmeat-dashboard' | 'foundit-dashboard' | 'foundtalent-dashboard' | 'foundcrypto-dashboard'

const images: Record<ImageVariant, string> = {
  'founder-hero': founderHero,
  'founder-dashboard': founderDashboard,
  'foundretail-dashboard': foundretailDashboard,
  'foundmeat-dashboard': foundmeatDashboard,
  'foundit-dashboard': founditDashboard,
  'foundtalent-dashboard': foundtalentDashboard,
  'foundcrypto-dashboard': foundcryptoDashboard,
}

export function ImageBlock({
  variant,
  alt,
  caption,
  className = '',
  glow = '#7dd3fc',
}: {
  variant: ImageVariant
  alt: string
  caption?: string
  className?: string
  glow?: string
}) {
  const style = {
    '--image-glow': glow,
    display: 'block',
    width: '100%',
    margin: 0,
    overflow: 'hidden',
    borderRadius: '28px',
    border: `1px solid color-mix(in srgb, ${glow} 24%, transparent)`,
    background: 'linear-gradient(180deg, rgba(13, 20, 31, 0.94), rgba(7, 13, 22, 0.98))',
    boxShadow: `0 32px 70px rgba(2, 8, 22, 0.56), 0 0 0 1px color-mix(in srgb, ${glow} 12%, transparent) inset`,
  } as CSSProperties
  return (
    <figure className={`image-block ${className}`} style={style}>
      <img src={images[variant]} alt={alt} draggable={false} style={{ display: 'block', width: '100%', height: 'auto' }} />
      {caption && (
        <figcaption style={{ padding: '12px 16px 14px', fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(204, 219, 242, 0.78)', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export type { ImageVariant }
