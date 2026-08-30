/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { OnboardingForm } from '@foundingos/ui/onboarding/OnboardingForm'
import { OnboardingGate } from '@foundingos/ui/onboarding/OnboardingGate'
import { isCommercialMode } from '@foundingos/config/commercial-mode'

export default function OnboardingPage() {
  // Server-computed once per request — the client form never reads process.env directly.
  const commercialMode = isCommercialMode() ? 'commercial' : 'demo'

  return (
    <section className="stack quantum-ambient-grid" style={{ padding: '48px 24px' }}>
      <header className="module-header header-premium">
        <p>FoundingOS · Package activation</p>
        <h1>Activate your ecosystem</h1>
        <span>Choose your SystemOS tier, industry pack, and add-ons — your Owner Console unlocks the moment you activate.</span>
      </header>
      <OnboardingGate commercialMode={commercialMode}>
        <OnboardingForm commercialMode={commercialMode} />
      </OnboardingGate>
    </section>
  )
}
