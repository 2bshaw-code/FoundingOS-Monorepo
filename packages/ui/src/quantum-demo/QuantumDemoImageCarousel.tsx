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

export function QuantumDemoImageCarousel({ images }: { images: QuantumDemoImage[] }) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const active = images[index]
  if (!active) return null

  function moveTo(next: number) {
    const bounded = Math.max(0, Math.min(images.length - 1, next))
    setIndex(bounded)
    trackRef.current?.children[bounded]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div className="q-demo-carousel">
      <div className="q-demo-sphere-field" aria-hidden="true" />
      <div
        className="q-demo-image-track"
        aria-label="Demo screenshots"
        ref={trackRef}
        onScroll={(event) => setIndex(Math.round(event.currentTarget.scrollLeft / Math.max(1, event.currentTarget.clientWidth)))}
      >
        {images.map((image, imageIndex) => (
          <figure className="q-demo-image-frame" data-active={String(imageIndex === index)} key={image.src}>
            <img src={image.src} alt={image.alt} />
            {image.caption ? <figcaption>{image.caption}</figcaption> : null}
          </figure>
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
