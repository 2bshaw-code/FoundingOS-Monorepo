/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BRANDS, FOUNDINGOS_ACCENT } from '../../lib/brands'
import { QuantumCard, QuantumHeader, QuantumScreen, QuantumSectionHeader, QuantumText, quantumSpace } from '../../components/QuantumUI'

// Mirrors the web /about page (packages/ui/src/index.tsx) — same story/mission/how-we-work
// copy, ported here so the mobile app matches the website instead of having no About screen.
export default function AboutScreen() {
  return (
    <QuantumScreen>
      <QuantumHeader
        eyebrow="FoundingOS"
        title="The Operating System for message-based businesses"
        description="One founder-built platform, every brand connected — built so growing teams stop drowning in disconnected tools."
        accent={FOUNDINGOS_ACCENT}
      />

      <QuantumText>
        FoundingOS unifies commerce, finance, talent, logistics, health, and crypto operations behind a single command layer — with FoundAI guiding every user through it.
      </QuantumText>

      <QuantumCard accent={FOUNDINGOS_ACCENT}>
        <QuantumSectionHeader label="Our story" />
        <QuantumText>
          FoundingOS started with a simple observation: growing businesses hit the same wall — too many disconnected tools, no single source of truth, and no time left to actually run the business. We built one platform that connects every brand, every console, and every workflow, so operators can finally see and run their whole business from one place.
        </QuantumText>
      </QuantumCard>

      <QuantumCard accent={FOUNDINGOS_ACCENT}>
        <QuantumSectionHeader label="Our mission" />
        <QuantumText>
          Give every operator — from retail staff to meat suppliers, recruiters, IT teams, crypto traders, and founders — one connected system and one guide who knows exactly what they need.
        </QuantumText>
      </QuantumCard>

      <QuantumCard accent={FOUNDINGOS_ACCENT}>
        <QuantumSectionHeader label="How we work" />
        <QuantumText>
          Every brand console shares the same Quantum shell, the same AI layer, and the same real-time signals — so switching between Retail, Meat, Talent, Finance, Crypto, and more feels like one system, not ten.
        </QuantumText>
      </QuantumCard>

      <QuantumCard accent={FOUNDINGOS_ACCENT}>
        <QuantumSectionHeader label="Built for WhatsApp-first businesses" />
        <QuantumText>
          We designed FoundingOS around how message-based businesses actually operate — offline-friendly, mobile-first, and ready for teams anywhere in the world.
        </QuantumText>
      </QuantumCard>

      <QuantumCard accent={FOUNDINGOS_ACCENT}>
        <QuantumSectionHeader label="Meet FoundAI" />
        <QuantumText>
          FoundAI — The Best Onboarding Bot in the World. It handles onboarding, setup, training, workflows, tasks, and questions instantly, for every brand in the ecosystem.
        </QuantumText>
      </QuantumCard>

      <QuantumSectionHeader label="Every brand in FoundingOS" />
      {BRANDS.filter((brand) => brand.slug !== 'foundingos').map((brand) => (
        <QuantumCard key={brand.slug} accent={brand.accent}>
          <QuantumText variant="h3" color={brand.accent}>{brand.name}</QuantumText>
          <QuantumText variant="caption">{brand.tagline}</QuantumText>
        </QuantumCard>
      ))}
    </QuantumScreen>
  )
}
