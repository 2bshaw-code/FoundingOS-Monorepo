/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import type { CSSProperties } from 'react'

type Network =
  | 'instagram'
  | 'linkedin'
  | 'tiktok'
  | 'x'
  | 'facebook'
  | 'youtube'
  | 'whatsapp'
  | 'telegram'
  | 'messenger'
  | 'imessage'
  | 'sms'

const targets: Record<Network, { label: string; href: string }> = {
  instagram: { label: 'Instagram', href: 'https://instagram.com/foundretail' },
  linkedin: { label: 'LinkedIn', href: 'https://linkedin.com/company/foundretail' },
  tiktok: { label: 'TikTok', href: 'https://tiktok.com/@foundretail' },
  x: { label: 'X', href: 'https://x.com/foundretail' },
  facebook: { label: 'Facebook', href: 'https://facebook.com/foundretail' },
  youtube: { label: 'YouTube', href: 'https://youtube.com/@foundretail' },
  whatsapp: { label: 'WhatsApp', href: 'https://wa.me/00000000000' },
  telegram: { label: 'Telegram', href: 'https://t.me/foundretail' },
  messenger: { label: 'Messenger', href: 'https://m.me/foundretail' },
  imessage: { label: 'iMessage', href: 'sms:+00000000000' },
  sms: { label: 'SMS', href: 'sms:+00000000000' },
}

const premiumRow = [
  'instagram',
  'linkedin',
  'tiktok',
  'x',
  'facebook',
  'youtube',
  'whatsapp',
  'telegram',
  'messenger',
  'imessage',
  'sms',
] as const

function glyph(network: Network) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  switch (network) {
    case 'instagram':
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></svg>
    case 'linkedin':
      return <svg {...common}><path d="M5 9h3v10H5V9Zm1.5-4A1.5 1.5 0 1 1 6.5 8 1.5 1.5 0 0 1 6.5 5ZM10 9h2.8v1.5h.1c.4-.8 1.4-1.6 2.8-1.6 3 0 3.6 2 3.6 4.7V19h-3v-4c0-1-.1-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19h-3V9Z" stroke="none" fill="currentColor" /></svg>
    case 'tiktok':
      return <svg {...common}><path d="M14 4c.5 2.8 2.2 4.6 5 4.8v3.1c-1.8 0-3.2-.6-4.4-1.5v5c0 3-2.4 5.4-5.4 5.4S3.8 18.4 3.8 15.4c0-3.2 2.7-5.7 5.8-5.4v3.2c-1.2-.2-2.4.6-2.5 2-.1 1.4.9 2.6 2.3 2.6 1.5 0 2.5-1.1 2.5-2.6V4H14Z" stroke="none" fill="currentColor" /></svg>
    case 'x':
      return <svg {...common}><path d="M5 5h4.1l3 4.2L16 5h3l-5.4 7.3L19 19h-4.1l-3.2-4.5L8.3 19H5l5.8-7.8L5 5Z" stroke="none" fill="currentColor" /></svg>
    case 'facebook':
      return <svg {...common}><path d="M13.5 21v-7h2.4l.4-3H13.5V9.1c0-.9.2-1.5 1.5-1.5H16V4.8c-.3 0-1.3-.1-2.6-.1-2.7 0-4.5 1.6-4.5 4.6V11H6.5v3H9v7h4.5Z" stroke="none" fill="currentColor" /></svg>
    case 'youtube':
      return <svg {...common}><path d="M21.4 8.2c-.2-1-.9-1.8-1.9-2-1.7-.4-7.5-.4-7.5-.4s-5.8 0-7.5.4c-1 .2-1.7 1-1.9 2C2.3 9.9 2.3 12 2.3 12s0 2.1.3 3.8c.2 1 .9 1.8 1.9 2 1.7.4 7.5.4 7.5.4s5.8 0 7.5-.4c1-.2 1.7-1 1.9-2 .3-1.7.3-3.8.3-3.8s0-2.1-.3-3.8ZM10.2 15.1V8.9L15.6 12l-5.4 3.1Z" stroke="none" fill="currentColor" /></svg>
    case 'whatsapp':
      return <svg {...common}><path d="M12 3.5A8.5 8.5 0 0 0 4.2 15.2L3 21l5.9-1.2A8.5 8.5 0 1 0 12 3.5Z" stroke="none" fill="currentColor" /><path d="M9.4 8.5c.2-.4.4-.4.8-.4h.5c.2 0 .4 0 .5.3l.6 1.4c.1.3.1.4 0 .6l-.4.5c-.1.2-.2.3 0 .6.3.6.9 1.4 1.7 2.1.7.6 1.3 1 1.9 1.3.3.1.4.1.6 0l.7-.5c.2-.1.4-.2.6 0l1.4.6c.3.1.4.3.4.6 0 .5-.2 1.3-.8 1.6-.6.3-1.3.4-2 .2-1.5-.3-3.1-1.3-4.6-2.8-1.5-1.5-2.5-3.1-2.8-4.6-.2-.7-.1-1.4.2-2 .2-.4.5-.6.8-.6Z" fill="#fff" stroke="none" /></svg>
    case 'telegram':
      return <svg {...common}><path d="M12 3 3.5 11.2c-.4.4-.2 1.1.3 1.2l2.6.8.9 4.4c.1.6.9.8 1.3.4l2.4-2.2 3.8 2.8c.4.3 1 .1 1.1-.4l2.4-11.3c.1-.6-.5-1-1-.7L7.8 13l7.6-6.2-3.4 9.5-3.2-2.4" /></svg>
    case 'messenger':
      return <svg {...common}><path d="M12 3.8c-4.6 0-8.2 3.3-8.2 7.5 0 2.4 1.2 4.6 3.1 6l-.7 2.9 3-1.7c.9.2 1.8.3 2.8.3 4.6 0 8.2-3.3 8.2-7.5S16.6 3.8 12 3.8Z" stroke="none" fill="currentColor" /><path d="M8.2 13.2 11 10.1l2 2 2.8-3.1-3.6 5.8-2-2-2 2.4" fill="#050816" stroke="none" /></svg>
    case 'imessage':
      return <svg {...common}><path d="M12 3.8c4.6 0 8.3 3 8.3 6.8 0 3.7-3.7 6.8-8.3 6.8-.8 0-1.6-.1-2.3-.3L6 18.7l1-2.4C5.4 15 3.7 13 3.7 10.6 3.7 7 7.4 3.8 12 3.8Z" stroke="none" fill="currentColor" /><circle cx="8.7" cy="10.6" r=".8" fill="#050816" stroke="none" /><circle cx="12" cy="10.6" r=".8" fill="#050816" stroke="none" /><circle cx="15.3" cy="10.6" r=".8" fill="#050816" stroke="none" /></svg>
    case 'sms':
      return <svg {...common}><path d="M5 5h14v10H9l-4 4v-4H5V5Z" stroke="none" fill="currentColor" /><path d="M8 9h8M8 11h6" stroke="#050816" strokeWidth="1.3" /></svg>
  }
}

export function PremiumSocialLinks({
  accent,
  mode = 'full',
  label,
}: {
  accent: string
  mode?: 'header' | 'full' | 'inline'
  label?: string
}) {
  const size = mode === 'header' ? 32 : mode === 'inline' ? 30 : 36
  const gap = mode === 'inline' ? 8 : 10
  const style: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap,
    padding: mode === 'inline' ? 0 : 10,
    borderRadius: 18,
    background: mode === 'header' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.03)',
    border: mode === 'inline' ? 'none' : '1px solid rgba(255,255,255,0.08)',
    boxShadow: `0 18px 40px color-mix(in srgb, ${accent} 16%, rgba(0,0,0,0.28))`,
    backdropFilter: 'blur(16px)',
  }
  return (
    <div className="glow-premium" style={style} aria-label={label ?? 'Social and messaging links'}>
      {label && mode !== 'inline' && (
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: accent, padding: '0 4px' }}>
          {label}
        </span>
      )}
      {premiumRow.map((network) => {
        const meta = targets[network]
        return (
          <a
            key={network}
            href={meta.href}
            target="_blank"
            rel="noreferrer"
            aria-label={meta.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: mode === 'inline' ? 0 : 8,
              minHeight: size,
              padding: mode === 'inline' ? 0 : '0 12px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.08)',
              background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 15%, rgba(255,255,255,0.04)), rgba(255,255,255,0.03))`,
              color: 'white',
              textDecoration: 'none',
              boxShadow: `0 0 0 1px color-mix(in srgb, ${accent} 12%, transparent) inset, 0 0 18px color-mix(in srgb, ${accent} 20%, transparent)`,
              transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, opacity 180ms ease',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = 'translateY(-1px)'
              event.currentTarget.style.borderColor = accent
              event.currentTarget.style.boxShadow = `0 0 0 1px color-mix(in srgb, ${accent} 28%, transparent) inset, 0 0 24px color-mix(in srgb, ${accent} 28%, transparent)`
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = 'translateY(0)'
              event.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              event.currentTarget.style.boxShadow = `0 0 0 1px color-mix(in srgb, ${accent} 12%, transparent) inset, 0 0 18px color-mix(in srgb, ${accent} 20%, transparent)`
            }}
          >
            <span style={{ width: size - 8, height: size - 8, display: 'grid', placeItems: 'center', color: accent }}>
              {glyph(network)}
            </span>
            {mode !== 'inline' && <span style={{ fontSize: 12, fontWeight: 800 }}>{meta.label}</span>}
          </a>
        )
      })}
    </div>
  )
}
