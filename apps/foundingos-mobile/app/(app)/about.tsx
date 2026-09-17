/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View } from 'react-native'
import { BRANDS, FOUNDINGOS_ACCENT } from '../../lib/brands'
import { QuantumCard, QuantumHeader, QuantumScreen, QuantumSectionHeader, QuantumText, quantumSpace } from '../../components/QuantumUI'
import { QuantumSphere } from '../../components/QuantumSphere'

// Mirrors the web /about page (packages/ui/src/index.tsx) — same story/mission/how-we-work
// copy, ported here so the mobile app matches the website instead of having no About screen.
export default function AboutScreen() {
  return (
    <QuantumScreen>
      <View style={{ alignItems: 'center', marginBottom: quantumSpace.sm }}>
        <QuantumSphere size={80} />
      </View>

      <QuantumHeader
        eyebrow="FoundingOS"
        title="The Operating System for message-based businesses"
        description="One founder-built platform with modular workspaces, built so growing teams stop drowning in disconnected tools."
        accent={FOUNDINGOS_ACCENT}
      />

      <QuantumText>
        FoundingOS unifies operations, workforce, and intelligence behind a single command layer — starting where teams already work: WhatsApp.
      </QuantumText>

      <QuantumCard accent={FOUNDINGOS_ACCENT}>
        <QuantumSectionHeader label="Our story" />
        <QuantumText>
          FoundingOS started with a simple observation: growing businesses hit the same wall — too many disconnected tools, no single source of truth, and no time left to actually run the business. We built one platform that connects every workspace and workflow so operators can run the business from one place.
        </QuantumText>
      </QuantumCard>

      <QuantumCard accent={FOUNDINGOS_ACCENT}>
        <QuantumSectionHeader label="Our mission" />
        <QuantumText>
          Give founders and their teams one connected system for selling, delivering, hiring, collecting payment, marketing, and making informed decisions.
        </QuantumText>
      </QuantumCard>

      <QuantumCard accent={FOUNDINGOS_ACCENT}>
        <QuantumSectionHeader label="How we work" />
        <QuantumText>
          Every enabled workspace shares the same FoundingOS shell, Messaging Core, Event Feed, and Intelligence layer, so Retail, Logistics, Finance, Marketing, Talent, and Health operate as one system.
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
          FoundAI supports onboarding, setup, training, workflows, tasks, and questions within the user&apos;s permitted workspace context.
        </QuantumText>
      </QuantumCard>

      <QuantumSectionHeader label="Modular FoundingOS workspaces" />
      {BRANDS.filter((brand) => brand.slug !== 'foundingos').map((brand) => (
        <QuantumCard key={brand.slug} accent={brand.accent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm }}>
            <QuantumSphere size={36} accent={brand.accent} />
            <View style={{ flex: 1 }}>
              <QuantumText variant="h3" color={brand.accent}>{brand.name}</QuantumText>
              <QuantumText variant="caption">{brand.tagline}</QuantumText>
            </View>
          </View>
        </QuantumCard>
      ))}
    </QuantumScreen>
  )
}
