/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { CSSProperties, ReactNode } from 'react'
import { BrandLogo, type BrandSlug } from './BrandLogo'
import { founderOsTheme } from '../src/theme'

const brandLabels: Record<BrandSlug, string> = {
  'founding-os': 'FoundingOS',
  'founder-os': 'FoundingOS',
  foundretail: 'FoundRetail',
  foundmeat: 'FoundMeat',
  foundthis: 'FoundThis',
  foundit: 'FoundThis',
  foundtalent: 'FoundTalent',
  foundcrypto: 'FoundCrypto',
}

const brandAccents: Record<BrandSlug, string> = {
  'founding-os': founderOsTheme.primary,
  'founder-os': founderOsTheme.primary,
  foundretail: '#25D366',
  foundmeat: '#B00020',
  foundthis: '#FFD600',
  foundit: '#FFD600',
  foundtalent: '#F97316',
  foundcrypto: '#7C3AED',
}

export function BrandCard({
  brand,
  title,
  description,
  children,
  className = '',
  accent,
}: {
  brand: BrandSlug
  title?: string
  description?: string
  children?: ReactNode
  className?: string
  accent?: string
}) {
  const color = accent ?? brandAccents[brand] ?? founderOsTheme.primary
  const cardStyle = {
    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(8, 12, 22, 0.96))',
    borderColor: `${color}66`,
    boxShadow: `0 18px 50px rgba(2, 6, 23, 0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
  } as CSSProperties

  return (
    <article className={`rounded-2xl border p-5 backdrop-blur-sm ${className}`} style={cardStyle}>
      <div className="mb-4 flex items-center gap-3">
        <BrandLogo brand={brand} className="h-11 w-11 shrink-0 rounded-xl border border-white/10" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color }}>{brandLabels[brand]}</p>
          {title && <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>}
        </div>
      </div>
      {description && <p className="mb-4 text-sm leading-6 text-slate-300">{description}</p>}
      {children}
    </article>
  )
}
