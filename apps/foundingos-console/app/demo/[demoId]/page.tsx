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
      <QuantumDemoViewer
        title={demo.title}
        images={images}
        steps={uplift.demoSteps}
        story={uplift.story}
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
    </section>
  )
}
