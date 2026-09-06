/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { OnboardingForm } from '@foundingos/ui/onboarding/OnboardingForm'
import { OnboardingGate } from '@foundingos/ui/onboarding/OnboardingGate'
import { isCommercialMode } from '@foundingos/config/commercial-mode'
import { brands } from '@foundingos/config'
import { QuantumHeader } from '@foundingos/ui/quantum'

export default function OnboardingPage() {
  // Server-computed once per request — the client form never reads process.env directly.
  const commercialMode = isCommercialMode() ? 'commercial' : 'demo'

  return (
    <section className="q-shell">
      <QuantumHeader
        brand={brands.foundingos}
        eyebrow="FoundingOS · Package activation"
        title="Activate your ecosystem"
        description="Choose your SystemOS tier, industry pack, and add-ons — your Owner Console unlocks the moment you activate."
      />
      <OnboardingGate commercialMode={commercialMode}>
        <OnboardingForm commercialMode={commercialMode} />
      </OnboardingGate>
    </section>
  )
}
