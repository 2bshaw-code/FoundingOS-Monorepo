/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ReactNode } from 'react'

type BobIntroCardProps = {
  eyebrow: string
  title: string
  paragraphs: ReactNode[]
  id?: string
  className?: string
}

export function BobIntroCard({ eyebrow, title, paragraphs, id, className }: BobIntroCardProps) {
  return (
    <article className={['ecosystem-card', 'bob-intro-card', className].filter(Boolean).join(' ')}>
      <div className="bob-intro-avatar bob-ai-circle" aria-hidden="true">
        <span />
      </div>
      <div className="bob-intro-copy">
        <div className="section-badge">{eyebrow}</div>
        <h2 id={id}>{title}</h2>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
