/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'

export type QuantumConsoleOption = {
  label: string
  href: string
  description: string
}

export function QuantumConsoleEntry({
  brandName,
  glyph,
  starterUrl,
  growthUrl,
}: {
  brandName: string
  glyph: string
  starterUrl: string
  growthUrl: string
}) {
  const [open, setOpen] = useState(false)

  const options: QuantumConsoleOption[] = [
    { label: 'Starter Console', href: starterUrl, description: `Get started fast with ${brandName}'s core workflows.` },
    { label: 'Growth Console', href: growthUrl, description: `The full ${brandName} command center for scaling teams.` },
  ]

  return (
    <>
      <button type="button" className="quantum-console-entry quantum-link-glow" onClick={() => setOpen(true)}>
        Brand Console
      </button>
      {open && (
        <div className="quantum-console-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="quantum-console-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="quantum-console-modal-close" onClick={() => setOpen(false)} aria-label="Close">
              &times;
            </button>
            <h3 className="quantum-console-modal-title">
              <span className="quantum-nav-glyph">{glyph}</span> {brandName} Console
            </h3>
            <div className="quantum-console-modal-options">
              {options.map((option) => (
                <a key={option.label} href={option.href} className="quantum-nav-card quantum-btn">
                  <span className="quantum-nav-glyph">{glyph}</span>
                  <span className="quantum-nav-title">{option.label}</span>
                  <span className="quantum-nav-desc">{option.description}</span>
                  <span className="quantum-nav-cta">Enter Intelligence &rarr;</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QuantumConsoleEntry
