/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { FOUNDINGOS_ACCENT } from '../../../lib/brands'
import { searchCatalogue } from '../../../lib/nav-directory'
import { QuantumHeader, QuantumListItem, QuantumNotice, QuantumScreen, QuantumSectionHeader, QuantumTextInput, quantumColors } from '../../../components/QuantumUI'

// Real, live search over every suite dashboard and every one of the 7 workspaces'
// 120+ modules (see lib/nav-directory.ts) — replaces the old Command Bar modal,
// which only matched 4 hardcoded legacy brand entries and their fake module
// labels, and routed to a "brand-detail" screen that no longer exists.
export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchCatalogue(query), [query])

  const goToPhotoIntake = () => router.push('/workspace/retail/inventory')

  const quickActions = [
    { id: 'photo_intake', label: 'Photo inventory intake', subtitle: 'Add a stock photo in Retail Inventory.', action: goToPhotoIntake },
  ]

  return (
    <QuantumScreen>
      <QuantumHeader
        eyebrow="Find anything"
        title="Search"
        description="Search every workspace, module, and suite dashboard in the app — this is the fastest way to reach anything more than 2 taps deep."
        accent={FOUNDINGOS_ACCENT}
      />

      <QuantumTextInput
        placeholder="Search workspaces, modules, or actions..."
        value={query}
        onChangeText={setQuery}
      />

      {!query.trim() ? (
        <>
          <QuantumSectionHeader label="Quick actions" />
          {quickActions.map((action) => (
            <QuantumListItem key={action.id} title={action.label} subtitle={action.subtitle} onPress={action.action} accent={quantumColors.neutral200} />
          ))}
          <QuantumNotice tone="info">Start typing above to search every module across all 7 workspaces.</QuantumNotice>
        </>
      ) : results.length === 0 ? (
        <QuantumNotice tone="warning">No matches for "{query}".</QuantumNotice>
      ) : (
        <>
          <QuantumSectionHeader label={`${results.length} result${results.length === 1 ? '' : 's'}`} />
          {results.map((result) => (
            <QuantumListItem
              key={result.id}
              title={result.title}
              subtitle={result.subtitle}
              accent={result.accent}
              onPress={() => router.push(result.route as never)}
            />
          ))}
        </>
      )}
    </QuantumScreen>
  )
}
