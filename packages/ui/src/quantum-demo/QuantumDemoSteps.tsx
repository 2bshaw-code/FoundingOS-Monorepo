/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { clsx } from 'clsx'
import { QuantumListCard } from '../quantum'

// Each step's instruction is now overlaid directly on its matching screenshot in the
// carousel, so this rail only needs to act as a compact, clickable table of contents
// (highlighting the active step) rather than repeating the full instruction text.
// Any trailing steps with no matching screenshot (e.g. a final "review & submit" step)
// are still shown with their full detail since there's no image to overlay them on.
export function QuantumDemoSteps({
  steps,
  imageCount,
  activeIndex = 0,
  onSelect,
}: {
  steps: string[]
  imageCount: number
  activeIndex?: number
  onSelect?: (index: number) => void
}) {
  const withImage = steps.slice(0, imageCount)
  const trailing = steps.slice(imageCount)

  return (
    <div className="q-demo-steps-rail">
      <p className="q-demo-steps-rail-title">Step-by-step walkthrough</p>
      <ol className="q-demo-steps-chips">
        {withImage.map((step, index) => (
          <li key={step}>
            <button
              type="button"
              className={clsx('q-demo-step-chip', index === activeIndex && 'is-active')}
              aria-current={index === activeIndex}
              onClick={() => onSelect?.(index)}
            >
              <span className="q-demo-step-chip-index">{index + 1}</span>
              <span className="q-demo-step-chip-label">{step}</span>
            </button>
          </li>
        ))}
      </ol>
      {trailing.length ? (
        <QuantumListCard
          subtitle="Final step"
          title="Wrap up"
          items={trailing.map((step, index) => ({
            label: `Step ${imageCount + index + 1}`,
            detail: step,
          }))}
        />
      ) : null}
    </div>
  )
}
