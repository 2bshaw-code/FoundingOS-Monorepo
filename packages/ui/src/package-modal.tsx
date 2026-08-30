/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'

export type PackageTier = {
  name: string
  price: string
  blurb: string
  features: readonly string[]
}

const AI_PROMPTS = [
  { label: 'What do I get with this package?', answer: 'You get every feature listed below, plus onboarding support and access to your brand console.' },
  { label: 'Can I upgrade later?', answer: 'Yes — you can move to a higher tier at any time without losing your existing setup or data.' },
  { label: 'Is there a contract?', answer: 'No long-term contract is required. You can cancel or change your package at any time.' },
]

export function PackageModal({ tier, packageUrl, accent, buttonLabel = 'Choose your package', buttonStyle }: {
  tier: PackageTier
  packageUrl: string
  accent?: string
  buttonLabel?: string
  buttonStyle?: React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState('')

  return (
    <>
      <button type="button" className="quantum-btn package-modal-trigger" style={buttonStyle} onClick={() => setOpen(true)}>
        {buttonLabel}
      </button>
      {open && (
        <div className="quantum-console-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="quantum-console-modal package-modal" style={accent ? ({ '--accent': accent } as React.CSSProperties) : undefined} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="quantum-console-modal-close" onClick={() => setOpen(false)} aria-label="Close">&times;</button>
            <p className="quantum-nav-desc">{tier.name}</p>
            <h3 className="quantum-console-modal-title">{tier.price}</h3>
            <p>{tier.blurb}</p>
            <ul className="checklist-list">
              {tier.features.map((feature) => (
                <li key={feature} className="checklist-item"><span>{feature}</span></li>
              ))}
            </ul>

            <div className="package-modal-ai">
              <p className="quantum-nav-desc"><strong>Ask FoundAI about this package</strong></p>
              <div className="package-modal-ai-chips">
                {AI_PROMPTS.map((prompt) => (
                  <button key={prompt.label} type="button" className="found-ai-chip" onClick={() => setAnswer(prompt.answer)}>{prompt.label}</button>
                ))}
              </div>
              {answer && <p className="package-modal-ai-answer">{answer}</p>}
            </div>

            <a className="btn btn-primary quantum-btn" href={packageUrl}>Proceed to Console</a>
          </div>
        </div>
      )}
    </>
  )
}

export default PackageModal
