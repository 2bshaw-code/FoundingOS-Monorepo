/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useMemo, useState } from 'react'
import { router } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { FOUNDINGOS_ACCENT } from '../../../lib/brands'
import { answerCommandBarQuery, askFoundAiQuestion, isAskableQuery, type CommandBarAnswer, type FoundAiAnswer } from '../../../lib/ai-command-bar'
import { fetchFoundAiStatus } from '../../../lib/core-operations-api'
import { searchCatalogue } from '../../../lib/nav-directory'
import { ENTRANCE_DURATION_MS, staggerDelay, useReducedMotionPreference } from '../../../lib/motion'
import {
  QuantumButton,
  QuantumCard,
  QuantumEmptyState,
  QuantumHeader,
  QuantumListItem,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  QuantumTextInput,
  getSemanticColor,
  quantumColors,
} from '../../../components/QuantumUI'

// Real, live search over every suite dashboard and every one of the 7 workspaces'
// 120+ modules (see lib/nav-directory.ts) — replaces the old Command Bar modal,
// which only matched 4 hardcoded legacy brand entries and their fake module
// labels, and routed to a "brand-detail" screen that no longer exists.
//
// On top of that plain catalogue search, this screen also recognises a small
// set of real questions ("what needs my attention", "anything overdue") and
// answers them from the live approvals queue (lib/ai-command-bar.ts) — a
// deterministic, honest first step toward a full AI command bar, not a
// simulated one.
export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchCatalogue(query), [query])
  const reduceMotion = useReducedMotionPreference()
  const [answer, setAnswer] = useState<CommandBarAnswer | null>(null)
  const [answerLoading, setAnswerLoading] = useState(false)
  const [aiAnswer, setAiAnswer] = useState<FoundAiAnswer | null>(null)
  const [aiError, setAiError] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  // Checked once up front so the button can say "not set up yet" instead of only failing
  // after the user asks a question — this used to require a manual, easy-to-forget
  // AI_ENABLED=true alongside ANTHROPIC_API_KEY on the backend; now it's just the key.
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchFoundAiStatus().then((status) => {
      if (!cancelled) setAiEnabled(status.enabled)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isAskableQuery(query)) {
      setAnswer(null)
      return
    }
    let cancelled = false
    setAnswerLoading(true)
    answerCommandBarQuery(query).then((result) => {
      if (!cancelled) {
        setAnswer(result)
        setAnswerLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [query])

  const askFoundAi = async () => {
    const question = query.trim()
    if (!question) return
    setAiLoading(true)
    setAiError('')
    try {
      setAiAnswer(await askFoundAiQuestion(question))
    } catch (error: any) {
      setAiAnswer(null)
      setAiError(error?.message || 'FoundAI could not answer that question.')
    } finally {
      setAiLoading(false)
    }
  }

  const goToPhotoIntake = () => router.push('/workspace/retail/inventory')

  const quickActions = [
    { id: 'photo_intake', label: 'Photo inventory intake', subtitle: 'Add a stock photo in Retail Inventory.', action: goToPhotoIntake },
  ]

  return (
    <QuantumScreen>
      <QuantumHeader
        eyebrow="Find anything, ask anything"
        title="Search"
        description={'Search every workspace, module, and suite dashboard, or ask a question like "what needs my attention today".'}
        accent={FOUNDINGOS_ACCENT}
      />

      <QuantumTextInput
        placeholder="Search, or ask what needs attention..."
        value={query}
        onChangeText={setQuery}
        autoFocus
      />

      {query.trim() ? (
        <QuantumCard accent={FOUNDINGOS_ACCENT}>
          <QuantumText variant="h3">Ask FoundAI</QuantumText>
          <QuantumText variant="caption">Uses your permitted workspace records, returns cited guidance, and never takes an external action without review.</QuantumText>
          {aiEnabled === false ? (
            <QuantumText variant="caption" color={quantumColors.warning}>FoundAI isn&apos;t set up for this account yet — ask your admin to add an Anthropic API key.</QuantumText>
          ) : (
            <QuantumButton onPress={askFoundAi} disabled={aiLoading || aiEnabled === null}>
              {aiLoading ? 'Thinking…' : 'Ask FoundAI'}
            </QuantumButton>
          )}
          {aiError ? <QuantumText variant="caption" color={quantumColors.warning}>{aiError}</QuantumText> : null}
          {aiAnswer ? (
            <>
              <QuantumText>{aiAnswer.answer}</QuantumText>
              {aiAnswer.citations.length ? <QuantumText variant="caption">Sources: {aiAnswer.citations.map((citation) => `${citation.workspace} · ${citation.module} · ${citation.reference}`).join(' • ')}</QuantumText> : null}
              {aiAnswer.suggestedActions.map((action) => <QuantumText key={action} variant="caption">• {action}</QuantumText>)}
            </>
          ) : null}
        </QuantumCard>
      ) : null}

      {answerLoading ? (
        <QuantumCard>
          <QuantumText variant="caption">Checking the live queue…</QuantumText>
        </QuantumCard>
      ) : answer ? (
        <QuantumCard accent={getSemanticColor(answer.items.length > 0 ? 'watch' : 'good')}>
          <QuantumText variant="label">{answer.headline}</QuantumText>
          <QuantumText variant="caption">{answer.detail}</QuantumText>
          {answer.items.length > 0 ? (
            <QuantumListItem
              title="Open Approvals"
              subtitle="See the full queue and act on each item"
              accent={quantumColors.neutral200}
              onPress={() => router.push('/workflows')}
            />
          ) : null}
        </QuantumCard>
      ) : null}

      {!query.trim() ? (
        <>
          <QuantumSectionHeader label="Quick actions" />
          {quickActions.map((action, i) => (
            <Animated.View key={action.id} entering={reduceMotion ? undefined : FadeInDown.delay(staggerDelay(i)).duration(ENTRANCE_DURATION_MS).springify().damping(18)}>
              <QuantumListItem title={action.label} subtitle={action.subtitle} onPress={action.action} accent={quantumColors.neutral200} />
            </Animated.View>
          ))}
          <QuantumEmptyState glyph="⌕" title="Search everything" subtitle="Start typing above to search every module across all 7 workspaces, or ask a question." />
        </>
      ) : results.length === 0 && !answer ? (
        <QuantumEmptyState glyph="⌕" title="No matches" subtitle={`Nothing found for "${query}". Try a different word, or browse Workspaces instead.`} />
      ) : (
        <>
          {results.length > 0 ? <QuantumSectionHeader label={`${results.length} result${results.length === 1 ? '' : 's'}`} /> : null}
          {results.map((result, i) => (
            <Animated.View key={result.id} entering={reduceMotion ? undefined : FadeInDown.delay(staggerDelay(i)).duration(ENTRANCE_DURATION_MS).springify().damping(18)}>
              <QuantumListItem
                title={result.title}
                subtitle={result.subtitle}
                accent={result.accent}
                onPress={() => router.push(result.route as never)}
              />
            </Animated.View>
          ))}
        </>
      )}
    </QuantumScreen>
  )
}
