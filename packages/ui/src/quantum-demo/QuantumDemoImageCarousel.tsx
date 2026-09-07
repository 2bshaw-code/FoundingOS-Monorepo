/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useRef, useState } from 'react'
import { QuantumButtonGhost } from '../quantum'

export type QuantumDemoImage = {
  src: string
  alt: string
  caption?: string
}

// The step text for the currently active screenshot, overlaid directly on the image
// itself (rather than in a separate list beside/below it) so testers see exactly what
// to look for without splitting attention between two panels. `stepIndex` starts at 1.
export function QuantumDemoImageCarousel({
  images,
  steps,
  onStepChange,
}: {
  images: QuantumDemoImage[]
  steps?: string[]
  onStepChange?: (index: number) => void
}) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const active = images[index]
  if (!active) return null

  function moveTo(next: number) {
    const bounded = Math.max(0, Math.min(images.length - 1, next))
    setIndex(bounded)
    onStepChange?.(bounded)
    trackRef.current?.children[bounded]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  const activeStep = steps?.[index]

  return (
    <div className="q-demo-carousel">
      <div className="q-demo-sphere-field" aria-hidden="true" />
      <div
        className="q-demo-image-track"
        aria-label="Demo screenshots"
        ref={trackRef}
        onScroll={(event) => {
          const next = Math.round(event.currentTarget.scrollLeft / Math.max(1, event.currentTarget.clientWidth))
          setIndex(next)
          onStepChange?.(next)
        }}
      >
        {images.map((image, imageIndex) => (
          <figure className="q-demo-image-frame" data-active={String(imageIndex === index)} key={image.src}>
            <img src={image.src} alt={image.alt} loading={imageIndex === 0 ? 'eager' : 'lazy'} />
            {steps?.[imageIndex] ? (
              <div className="q-demo-image-step-overlay">
                <span className="q-demo-image-step-badge">Step {imageIndex + 1}</span>
                <p>{steps[imageIndex]}</p>
              </div>
            ) : null}
            {image.caption ? <figcaption>{image.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
      <div className="q-demo-carousel-dots" role="tablist" aria-label="Jump to screenshot">
        {images.map((image, imageIndex) => (
          <button
            key={image.src}
            type="button"
            role="tab"
            aria-selected={imageIndex === index}
            aria-label={`Screenshot ${imageIndex + 1} of ${images.length}`}
            className={imageIndex === index ? 'q-demo-carousel-dot is-active' : 'q-demo-carousel-dot'}
            onClick={() => moveTo(imageIndex)}
          />
        ))}
      </div>
      <div className="q-demo-carousel-controls">
        <QuantumButtonGhost type="button" onClick={() => moveTo(index - 1)} disabled={index === 0}>
          Back
        </QuantumButtonGhost>
        <span>{index + 1} / {images.length}</span>
        <QuantumButtonGhost type="button" onClick={() => moveTo(index + 1)} disabled={index === images.length - 1}>
          Next
        </QuantumButtonGhost>
      </div>
    </div>
  )
}
