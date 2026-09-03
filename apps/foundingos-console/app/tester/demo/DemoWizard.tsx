/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import type { NarratorStep } from '../tester-data'

// Turns the demo's narrator steps into a real, one-at-a-time step-by-step tutorial (a
// slideshow with Back/Next) instead of dumping every step into one long scrollable list.
// Testers now walk through each real tab by name before ever opening the module, exactly like
// a guided tutorial — same narrator/audio wiring as before (data-narration / data-narrate-btn
// are read via document-level event delegation in NARRATION_PLAYER_SCRIPT, so they still work
// correctly even though only the current step's card is mounted at a time).
export function DemoWizard({ steps }: { steps: NarratorStep[] }) {
  const [index, setIndex] = useState(0)
  if (steps.length === 0) return null
  const step = steps[index]
  const isFirst = index === 0
  const isLast = index === steps.length - 1
  const [badge, title] = step.step.split(' · ')

  return (
    <article className="module-card fo-card quantum-frame" data-narration={step.text}>
      <div className="module-card-top">
        <span className="quantum-step-badge">{badge}</span>
        <strong>{title}</strong>
        <button
          type="button"
          className="quantum-step-narrate-btn"
          data-narrate-btn
          data-idle-label="🔊"
          data-playing-label="⏹"
          aria-label="Play this step's narrator line"
          style={{ marginLeft: 'auto' }}
        >
          🔊
        </button>
      </div>
      <div style={{ display: 'flex', gap: 4, margin: '10px 0' }} aria-label={`Step ${index + 1} of ${steps.length}`}>
        {steps.map((_, i) => (
          <span
            key={i}
            style={{
              height: 6,
              flex: 1,
              borderRadius: 999,
              background: i <= index ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 15%, transparent)',
            }}
          />
        ))}
      </div>
      <p>{step.detail}</p>
      <div className="quantum-narrator-panel">
        <p>{step.text}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, gap: 10 }}>
        <button type="button" className="btn btn-secondary quantum-btn" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={isFirst}>
          ← Back
        </button>
        <small style={{ opacity: 0.7 }}>Step {index + 1} of {steps.length}</small>
        {isLast ? (
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1f9d55' }}>✓ Tutorial complete — try it below</span>
        ) : (
          <button type="button" className="btn btn-primary quantum-btn" onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}>
            Next →
          </button>
        )}
      </div>
    </article>
  )
}
