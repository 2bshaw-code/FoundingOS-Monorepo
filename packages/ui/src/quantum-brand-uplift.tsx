/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getQuantumBrandUplift, type BrandDefinition } from '@foundingos/config'
import { QuantumCard, QuantumMetricCard, QuantumSectionHeader } from './quantum'

export function QuantumBrandUpliftPanel({ brand }: { brand: BrandDefinition }) {
  const uplift = getQuantumBrandUplift(brand.slug)
  return (
    <section className={`q-brand-uplift-panel q-demo-sphere-${uplift.sphereVariant}`} aria-label={`${brand.name} Quantum brand uplift`}>
      <QuantumCard brand={brand} className="q-brand-uplift-story">
        <QuantumSectionHeader label={`${uplift.icon} What ${brand.name} does`} />
        <p className="q-text-body">{uplift.story}</p>
      </QuantumCard>
      <div className="q-brand-uplift-grid">
        <QuantumMetricCard brand={brand} label="QuantumSphere" value={uplift.sphereVariant} detail="Brand-locked motion and depth variant" />
        <QuantumMetricCard brand={brand} label="Demo imagery" value={`${uplift.demoImageRequirements.length} frames`} detail={uplift.demoImageRequirements[0]?.caption} />
        <QuantumMetricCard brand={brand} label="Survey focus" value={`${uplift.surveyRefinements.length} checks`} detail={uplift.surveyRefinements[0]} />
      </div>
    </section>
  )
}
