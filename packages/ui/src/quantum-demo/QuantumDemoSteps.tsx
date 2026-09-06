/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { QuantumListCard } from '../quantum'

export function QuantumDemoSteps({ steps }: { steps: string[] }) {
  return (
    <QuantumListCard
      title="Step-by-step walkthrough"
      subtitle="Demo flow"
      items={steps.map((step, index) => ({
        label: `Step ${index + 1}`,
        detail: step,
      }))}
    />
  )
}
