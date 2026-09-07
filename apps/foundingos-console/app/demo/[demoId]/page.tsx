/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { brands } from '@foundingos/config'
import { DEMO_BRAND_CARDS, getQuantumBrandUplift } from '@foundingos/config/quantum-brand-uplift'
import { QuantumDemoViewer } from '@foundingos/ui/quantum-demo'
import { QuantumCard, QuantumHeader, QuantumNotice } from '@foundingos/ui/quantum'
import { NARRATION_PLAYER_SCRIPT } from '../../tester/tester-data'

export default async function DemoAliasPage({ params }: { params: Promise<{ demoId: string }> }) {
  const { demoId } = await params
  const demo = DEMO_BRAND_CARDS.find((item) => item.id === demoId)

  if (!demo) {
    redirect(`/tester/demo/${demoId}`)
  }

  const brand = brands[demo.sourceBrandSlug]
  const uplift = getQuantumBrandUplift(demo.sourceBrandSlug)
  const images = uplift.demoImageRequirements.map((image, index) => ({
    ...image,
    src: uplift.demo.images[index] ?? image.src,
  }))

  return (
    <section className="stack">
      <QuantumHeader
        brand={brand}
        eyebrow="FoundingOS Demo"
        title={demo.title}
        description={demo.description}
      />
      {/* Real narrate-per-step control, same wiring as the logged-in tester demo page —
          previously this public preview had no audio toggle at all, so NARRATION_PLAYER_SCRIPT's
          default-ON auto-play (2.5s after load) would speak with no visible way to silence it. */}
      <div className="quantum-audio-bar">
        <button type="button" data-audio-toggle suppressHydrationWarning>🔊 Audio: ON</button>
      </div>
      <QuantumDemoViewer
        title={demo.title}
        images={images}
        steps={uplift.demoSteps}
        story={uplift.story}
        setupHighlight={uplift.setupHighlight}
        icon={uplift.icon}
        sphereVariant={uplift.sphereVariant}
        brand={brand}
      />
      <QuantumCard brand={brand}>
        <QuantumNotice>
          Demo preview complete. Sign in to continue into the gated tester survey flow.
        </QuantumNotice>
        <Link className="btn btn-primary quantum-btn" href="/tester/login">Continue to tester access</Link>
      </QuantumCard>
      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
    </section>
  )
}
