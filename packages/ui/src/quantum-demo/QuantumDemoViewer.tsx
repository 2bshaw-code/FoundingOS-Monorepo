/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandDefinition } from '@foundingos/config'
import { brands } from '@foundingos/config'
import { QuantumButtonPrimary, QuantumCard, QuantumSectionHeader } from '../quantum'
import { QuantumDemoImageCarousel, type QuantumDemoImage } from './QuantumDemoImageCarousel'
import { QuantumDemoSteps } from './QuantumDemoSteps'

export function QuantumDemoViewer({
  title,
  images,
  steps,
  story,
  icon,
  sphereVariant = 'core-orbit',
  brand = brands.foundingos,
  onCompleteDemo,
}: {
  title: string
  images: QuantumDemoImage[]
  steps: string[]
  story?: string
  icon?: string
  sphereVariant?: string
  brand?: BrandDefinition
  onCompleteDemo?: () => void | Promise<void>
}) {
  return (
    <QuantumCard className={`q-demo-viewer q-demo-sphere-${sphereVariant}`} brand={brand}>
      <QuantumSectionHeader label={title} action={icon ? <span className="q-demo-icon">{icon}</span> : null} />
      {story ? <div className="q-demo-story">{story}</div> : null}
      <div className="q-demo-viewer-grid">
        <QuantumDemoImageCarousel images={images} />
        <div className="q-demo-instructions">
          <QuantumDemoSteps steps={steps} />
          {onCompleteDemo ? (
            <form action={onCompleteDemo}>
              <QuantumButtonPrimary type="submit" className="q-button-large">Continue to Survey</QuantumButtonPrimary>
            </form>
          ) : null}
        </div>
      </div>
    </QuantumCard>
  )
}

export { QuantumDemoImageCarousel } from './QuantumDemoImageCarousel'
export type { QuantumDemoImage } from './QuantumDemoImageCarousel'
export { QuantumDemoSteps } from './QuantumDemoSteps'
