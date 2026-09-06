/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { CSSProperties } from 'react'
import { clsx } from 'clsx'
import type { BrandDefinition } from '@foundingos/config'
import { brands, FOUNDINGOS_BASE, LOCKED_BRAND_COLORS } from '@foundingos/config'

export const qSpace = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
} as const

export const qText = {
  h1: 'q-text-h1',
  h2: 'q-text-h2',
  h3: 'q-text-h3',
  body: 'q-text-body',
  caption: 'q-text-caption',
  overline: 'q-text-overline',
} as const

export const qColors = {
  base: FOUNDINGOS_BASE,
  foundingos: LOCKED_BRAND_COLORS.foundingos,
  retail: LOCKED_BRAND_COLORS.retail,
  meat: LOCKED_BRAND_COLORS.meat,
  foundthat: LOCKED_BRAND_COLORS.foundthat,
  talent: LOCKED_BRAND_COLORS.talent,
  crypto: LOCKED_BRAND_COLORS.crypto,
  finance: LOCKED_BRAND_COLORS.finance,
  health: LOCKED_BRAND_COLORS.health,
  logistics: LOCKED_BRAND_COLORS.logistics,
} as const

type Tone = 'default' | 'success' | 'warning' | 'danger'
type ComponentChildren = any
type ElementProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T]

function brandStyle(brand?: BrandDefinition | { accent?: string }): CSSProperties | undefined {
  if (!brand?.accent) return undefined
  return { '--q-accent': brand.accent } as CSSProperties
}

export function brandBySlug(slug?: string) {
  if (!slug || !(slug in brands)) return brands.foundingos
  return brands[slug as keyof typeof brands]
}

export function QuantumBackground({ children, brand, className }: { children: ComponentChildren; brand?: BrandDefinition | { accent?: string }; className?: string }) {
  return (
    <div className={clsx('q-background', className)} style={brandStyle(brand)}>
      <div className="q-background-grid" aria-hidden="true" />
      <div className="q-background-glow" aria-hidden="true" />
      <div className="q-background-content">{children}</div>
    </div>
  )
}

export function QuantumOverlay({ children, open = true }: { children: ComponentChildren; open?: boolean }) {
  if (!open) return null
  return <div className="q-overlay">{children}</div>
}

export function QuantumCard({
  children,
  className,
  brand,
  as = 'article',
  ...props
}: { children: ComponentChildren; className?: string; brand?: BrandDefinition | { accent?: string }; as?: 'article' | 'section' | 'div' } & Record<string, unknown>) {
  const shared = { ...props, className: clsx('q-card', className), style: brandStyle(brand) }
  if (as === 'section') return <section {...shared}>{children}</section>
  if (as === 'div') return <div {...shared}>{children}</div>
  return <article {...shared}>{children}</article>
}

export function QuantumMetricCard({ label, value, detail, tone = 'default', brand, children }: { label: string; value: ComponentChildren; detail?: ComponentChildren; tone?: Tone; brand?: BrandDefinition | { accent?: string }; children?: ComponentChildren }) {
  return (
    <QuantumCard className={clsx('q-metric-card', `q-tone-${tone}`)} brand={brand}>
      <p className={qText.overline}>{label}</p>
      <strong className={qText.h2}>{value}</strong>
      {children}
      {detail ? <span className={qText.caption}>{detail}</span> : null}
    </QuantumCard>
  )
}

export function QuantumListCard({ title, subtitle, items, brand }: { title: string; subtitle?: string; items: Array<{ label: ComponentChildren; detail?: ComponentChildren; href?: string }>; brand?: BrandDefinition | { accent?: string } }) {
  return (
    <QuantumCard className="q-list-card" brand={brand}>
      <QuantumSubHeader eyebrow={subtitle} title={title} />
      <div className="q-list-stack">
        {items.map((item, index) => {
          const content = (
            <>
              <span>{item.label}</span>
              {item.detail ? <small>{item.detail}</small> : null}
            </>
          )
          return item.href ? (
            <a key={`${item.href}-${index}`} className="q-list-row" href={item.href}>{content}</a>
          ) : (
            <div key={index} className="q-list-row">{content}</div>
          )
        })}
      </div>
    </QuantumCard>
  )
}

export function QuantumButtonPrimary(props: ElementProps<'button'>) {
  return <button {...props} className={clsx('q-button q-button-primary', props.className)} />
}

export function QuantumButtonGhost(props: ElementProps<'button'>) {
  return <button {...props} className={clsx('q-button q-button-ghost', props.className)} />
}

export function QuantumIconButton({ label, children, ...props }: ElementProps<'button'> & { label: string }) {
  return (
    <button {...props} aria-label={label} className={clsx('q-icon-button', props.className)}>
      {children}
    </button>
  )
}

export function QuantumTextField({ label, hint, ...props }: ElementProps<'input'> & { label: string; hint?: string }) {
  return (
    <label className="q-field">
      <span>{label}</span>
      <input {...props} />
      {hint ? <small>{hint}</small> : null}
    </label>
  )
}

export function QuantumSelect({ label, children, ...props }: ElementProps<'select'> & { label: string }) {
  return (
    <label className="q-field">
      <span>{label}</span>
      <select {...props}>{children}</select>
    </label>
  )
}

export function QuantumToggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (checked: boolean) => void; hint?: string }) {
  return (
    <label className="q-toggle">
      <span className="q-toggle-copy">
        <strong>{label}</strong>
        {hint ? <small>{hint}</small> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="q-toggle-track" aria-hidden="true"><span /></span>
    </label>
  )
}

export function QuantumNotice({ children, tone = 'default' }: { children: ComponentChildren; tone?: Tone }) {
  return <div className={clsx('q-notice', `q-tone-${tone}`)}>{children}</div>
}

export function QuantumHintBanner({ title = 'Quantum hint', children, brand }: { title?: string; children: ComponentChildren; brand?: BrandDefinition | { accent?: string } }) {
  return (
    <QuantumCard className="q-hint-banner" brand={brand}>
      <p className={qText.overline}>{title}</p>
      <div className={qText.body}>{children}</div>
    </QuantumCard>
  )
}

export function QuantumModalSurface({ children, brand }: { children: ComponentChildren; brand?: BrandDefinition | { accent?: string } }) {
  return <div className="q-modal-surface" style={brandStyle(brand)}>{children}</div>
}

export function QuantumHeader({ eyebrow, title, description, action, brand }: { eyebrow?: string; title: ComponentChildren; description?: ComponentChildren; action?: ComponentChildren; brand?: BrandDefinition | { accent?: string } }) {
  return (
    <header className="q-header" style={brandStyle(brand)}>
      <div className="q-header-copy">
        {eyebrow ? <p className={qText.overline}>{eyebrow}</p> : null}
        <h1 className={qText.h1}>{title}</h1>
        {description ? <p className={qText.body}>{description}</p> : null}
      </div>
      {action ? <div className="q-header-action">{action}</div> : null}
    </header>
  )
}

export function QuantumSubHeader({ eyebrow, title, description, action }: { eyebrow?: ComponentChildren; title: ComponentChildren; description?: ComponentChildren; action?: ComponentChildren }) {
  return (
    <div className="q-subheader">
      <div>
        {eyebrow ? <p className={qText.overline}>{eyebrow}</p> : null}
        <h2 className={qText.h2}>{title}</h2>
        {description ? <p className={qText.caption}>{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function QuantumSectionHeader({ label, action }: { label: ComponentChildren; action?: ComponentChildren }) {
  return (
    <div className="q-section-header">
      <p className={qText.overline}>{label}</p>
      {action}
    </div>
  )
}
