#!/usr/bin/env node
// Logic-level tests for the FounderOS tester program (session tokens, credential
// mapping, survey completion state machine). Imports the real source modules
// directly via Node's built-in TypeScript support — no server needs to run.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { signToken, verifyToken } from '../apps/foundingos-console/app/tester/session.ts'
import { CREDENTIALS, SURVEYS, MODULE_OPTIONS, findCredentialByPassword, findModuleOption } from '../apps/foundingos-console/app/tester/tester-data.ts'
import { BRAND_PERSONALITIES } from '../packages/config/src/brand-intelligence.ts'
import { generateBrandAIOutput } from '../packages/config/src/brand-ai-engine.ts'
import { aggregateBrandSignals, buildBrandSignal, buildSignalFromSurveyRun } from '../packages/config/src/brandSignalFeed.ts'
import { buildQuantumIdentity, buildQuantumDemoSteps, buildQuantumOverlayConfig, buildQuantumWebsiteSection, buildQuantumConsoleSection, buildQuantumInsightSentence } from '../packages/config/src/quantum/quantum-defined-engine.ts'
import { buildUnifiedQuantumPayload, enrichBrandSignalWithQuantum as qolEnrich } from '../packages/config/src/quantum/quantum-orchestration-layer.ts'

test('module assignment: every credential has a unique password/id, and resolves to a real module + survey', () => {
  // Real invariant, resilient to growth: this pool has legitimately grown from 12 to 46+
  // credentials across several batches (each batch intentionally REUSES existing
  // module/survey pairs rather than creating new ones — see the comments in tester-data.ts) —
  // so "modules/surveys must be unique" was never actually the right invariant to assert; it
  // broke the moment batch 2 was added, and was simply never re-run since this suite wasn't
  // wired into CI. What must always hold, regardless of how many credentials exist: no two
  // credentials share a password or an id, and every credential's moduleId/surveyId actually
  // resolves to something real (catches typos/orphaned references, which a hardcoded count
  // never would).
  const passwords = new Set(CREDENTIALS.map((c) => c.password))
  const ids = new Set(CREDENTIALS.map((c) => c.id))
  assert.ok(CREDENTIALS.length >= 12, 'credential pool should only grow, never shrink below its original size')
  assert.equal(passwords.size, CREDENTIALS.length, 'every password must be unique')
  assert.equal(ids.size, CREDENTIALS.length, 'every credential id must be unique')
  for (const credential of CREDENTIALS) {
    assert.ok(findModuleOption(credential.moduleId), `${credential.id} references a real module (${credential.moduleId})`)
    assert.ok(SURVEYS[credential.surveyId], `${credential.id} references a real survey (${credential.surveyId})`)
  }
})

test('every credential maps to a survey with at least 3 tailored questions', () => {
  // Real invariant update: surveys legitimately grew well past 5 questions once shared
  // BUSINESS_PLAN_QUESTIONS/ECOSYSTEM_VALIDATION_QUESTIONS blocks were folded into every
  // survey (a deliberate design change, not a regression) — "3-5" was the ORIGINAL shape
  // before that; the real, still-meaningful floor is "at least 3", which every survey must
  // keep regardless of how many shared questions get appended on top.
  for (const credential of CREDENTIALS) {
    const survey = SURVEYS[credential.surveyId]
    assert.ok(survey, `survey ${credential.surveyId} must exist for ${credential.id}`)
    assert.ok(survey.questions.length >= 3, `${credential.surveyId} must have at least 3 questions`)
  }
})

test('finance and crypto credentials are wired correctly', () => {
  const finance = findCredentialByPassword('finance-5511')
  const crypto = findCredentialByPassword('crypto-6622')
  assert.equal(finance?.moduleId, 'finance')
  assert.equal(finance?.surveyId, 'survey-k')
  assert.equal(crypto?.moduleId, 'crypto')
  assert.equal(crypto?.surveyId, 'survey-l')
})

test('auth flow: unknown password is rejected', () => {
  assert.equal(findCredentialByPassword('not-a-real-code'), null)
})

test('session tokens: sign/verify round-trip per scope', async () => {
  const testerToken = await signToken('tester', 'alpha')
  const adminToken = await signToken('admin', 'admin')
  assert.equal(await verifyToken('tester', testerToken), 'alpha')
  assert.equal(await verifyToken('admin', adminToken), 'admin')
})

test('session tokens: cannot be replayed across scopes (tester token used as admin)', async () => {
  const testerToken = await signToken('tester', 'alpha')
  assert.equal(await verifyToken('admin', testerToken), null)
})

test('session tokens: tampering invalidates the signature', async () => {
  const token = await signToken('tester', 'alpha')
  const [payload] = token.split('.')
  const tampered = `${payload}.not-a-real-signature`
  assert.equal(await verifyToken('tester', tampered), null)
})

test('survey completion state machine: complete only when all base questions answered', () => {
  const survey = SURVEYS['survey-k']
  function computeStatus(answeredIds) {
    const answeredBaseCount = survey.questions.filter((q) => answeredIds.includes(q.id)).length
    return answeredBaseCount >= survey.questions.length ? 'complete' : 'in-progress'
  }
  assert.equal(computeStatus([]), 'in-progress')
  assert.equal(computeStatus(survey.questions.slice(0, 1).map((q) => q.id)), 'in-progress')
  assert.equal(computeStatus(survey.questions.map((q) => q.id)), 'complete')
})

test('survey replay: completing a run archives it and resets the working buffer', () => {
  const survey = SURVEYS['survey-k']
  function simulateRun(tester, answers) {
    let currentAnswers = tester.currentAnswers
    for (const [questionId, answer] of Object.entries(answers)) {
      currentAnswers = currentAnswers.filter((a) => a.questionId !== questionId)
      currentAnswers.push({ questionId, answer })
    }
    const answeredBaseCount = survey.questions.filter((q) => currentAnswers.some((a) => a.questionId === q.id)).length
    if (answeredBaseCount >= survey.questions.length) {
      const run = { id: `run-${tester.runs.length + 1}`, answers: currentAnswers, completedAt: new Date().toISOString() }
      return { ...tester, currentAnswers: [], runs: [...tester.runs, run], status: 'complete' }
    }
    return { ...tester, currentAnswers, status: tester.status === 'complete' ? 'complete' : 'in-progress' }
  }

  // Answer every real question in the survey (not a hardcoded k1/k2/k3 subset) — survey-k now
  // carries far more than 3 questions since the shared BUSINESS_PLAN_QUESTIONS/
  // ECOSYSTEM_VALIDATION_QUESTIONS blocks were folded in; a completed run must always mean
  // every real question was answered, whatever that count happens to be today.
  const allAnswers = (value) => Object.fromEntries(survey.questions.map((q) => [q.id, value]))

  let tester = { currentAnswers: [], runs: [], status: 'registered' }
  tester = simulateRun(tester, allAnswers('Xero'))
  assert.equal(tester.runs.length, 1)
  assert.equal(tester.currentAnswers.length, 0, 'buffer resets after a completed run')

  // Redo: the survey is "always available" — a second run starts fresh and archives independently.
  tester = simulateRun(tester, allAnswers('QuickBooks'))
  assert.equal(tester.runs.length, 2, 'a second run is archived alongside the first')
  assert.equal(tester.runs[0].answers.find((a) => a.questionId === 'k1').answer, 'Xero', 'first run history is preserved')
  assert.equal(tester.runs[1].answers.find((a) => a.questionId === 'k1').answer, 'QuickBooks')
})

test('Finance and Crypto module access: reachable through the same catalog as every other module', () => {
  // Real invariant update: MODULE_OPTIONS legitimately grew from 12 to 18 as new modules
  // (CRM, the whole-ecosystem tour, admin ops tour, buyer/customer overview, etc.) were added
  // this session — a floor rather than an exact count keeps this meaningful as it keeps growing.
  assert.ok(MODULE_OPTIONS.length >= 12, 'module catalog should only grow, never shrink below its original size')
  const finance = findModuleOption('finance')
  const crypto = findModuleOption('crypto')
  assert.equal(finance?.surveyId, 'survey-k')
  assert.equal(crypto?.surveyId, 'survey-l')
  assert.equal(findModuleOption('not-a-real-module'), null)
})

test('module reassignment: moving a tester to a new module resets the working buffer, keeps run history', () => {
  function reassign(tester, moduleId) {
    const option = findModuleOption(moduleId)
    if (!option) throw new Error('unknown module')
    return { ...tester, moduleId: option.moduleId, moduleLabel: option.moduleLabel, surveyId: option.surveyId, currentAnswers: [] }
  }

  let tester = {
    moduleId: 'marketing-suite',
    moduleLabel: 'Marketing Suite',
    surveyId: 'survey-a',
    currentAnswers: [{ questionId: 'a1', answer: 'draft' }],
    runs: [{ id: 'run-1', answers: [{ questionId: 'a1', answer: 'done' }], completedAt: new Date().toISOString() }],
  }

  tester = reassign(tester, 'finance')
  assert.equal(tester.moduleId, 'finance')
  assert.equal(tester.surveyId, 'survey-k')
  assert.equal(tester.currentAnswers.length, 0, 'reassignment clears the in-progress draft for the old survey')
  assert.equal(tester.runs.length, 1, 'prior completed run history is preserved across reassignment')
})

test('brand personality layers: every real brand has color, pulse, micro-story, 3-5 KPIs, sparkline, and 3 tiles', () => {
  // Real invariant update: the ecosystem grew from 6 to 8 real brands this session (Health,
  // Logistics added) and the 'it' brand was removed entirely (see IT removal history) — an
  // exact "6" would need editing every time a brand is added or removed, so assert the shape
  // of whatever brands are real today plus a sane floor, rather than a brittle exact count.
  const brands = Object.values(BRAND_PERSONALITIES)
  assert.ok(brands.length >= 6, 'brand roster should only grow, never shrink below its original size')
  for (const layer of brands) {
    assert.match(layer.color, /^#[0-9A-Fa-f]{6}$/, `${layer.brand} must have a valid hex color`)
    assert.ok(layer.basePulse >= 0 && layer.basePulse <= 100, `${layer.brand} pulse must be 0-100`)
    assert.ok(layer.microStory.length > 0, `${layer.brand} must have a micro-story`)
    assert.ok(layer.kpis.length >= 3 && layer.kpis.length <= 5, `${layer.brand} must have 3-5 KPIs`)
    assert.ok(layer.sparkline.length > 0, `${layer.brand} must have a sparkline`)
    assert.ok(layer.insightTile && layer.riskTile && layer.opportunityTile, `${layer.brand} must have all 3 tiles`)
  }
})

test('brand AI engine: output is isolated to a single brand (no cross-brand leakage)', () => {
  const retail = generateBrandAIOutput('retail')
  const crypto = generateBrandAIOutput('crypto')
  assert.notEqual(retail.insight, crypto.insight)
  assert.notEqual(retail.microStory, crypto.microStory)
  assert.equal(retail.recommendation.includes('Prioritise:'), true)
})

test('brand signal feed: aggregates every real brand with contribution scores in range', () => {
  // Real invariant update: same reasoning as the brand personality test above — assert against
  // the real, current brand roster (via BRAND_PERSONALITIES) rather than a hardcoded count.
  const realBrandCount = Object.keys(BRAND_PERSONALITIES).length
  const signals = aggregateBrandSignals('2026-01-01T00:00:00.000Z')
  assert.equal(signals.length, realBrandCount)
  const brands = new Set(signals.map((s) => s.brand))
  assert.equal(brands.size, realBrandCount)
  for (const signal of signals) {
    assert.ok(signal.contributionScore >= 0 && signal.contributionScore <= 100, `${signal.brand} contribution score must be 0-100`)
    assert.equal(signal.timestamp, '2026-01-01T00:00:00.000Z')
  }
})

test('brand signal feed: same brand + timestamp always builds an identical signal (deterministic, no hidden randomness)', () => {
  // 'it' was the original fixture brand here — it was removed from the ecosystem entirely
  // (see IT removal history), so generateBrandAIOutput('it') now correctly returns undefined;
  // 'retail' is a real, currently-live brand and exercises the exact same code path.
  const a = buildBrandSignal('retail', '2026-01-01T00:00:00.000Z')
  const b = buildBrandSignal('retail', '2026-01-01T00:00:00.000Z')
  assert.deepEqual(a, b)
})

test('survey -> brand signal integration: tester feedback text is folded into the signal insight', () => {
  const signal = buildSignalFromSurveyRun('finance', [{ questionId: 'k1', answer: 'Xero' }], '2026-01-01T00:00:00.000Z')
  assert.equal(signal.brand, 'finance')
  assert.match(signal.insight, /Xero/)
})

test('QDE: identity, demo steps, overlay config, and section builders are deterministic and brand-agnostic', () => {
  assert.deepEqual(buildQuantumIdentity(), buildQuantumIdentity())
  const steps = buildQuantumDemoSteps()
  assert.equal(steps.length, 5, 'demo flow must have 5 steps (baseline, anomaly, forecast, opportunity, insight)')

  const offlineOverlay = buildQuantumOverlayConfig(false)
  assert.equal(offlineOverlay.degraded, true)
  assert.equal(offlineOverlay.components.length, 0, 'overlay must be empty (graceful degrade) when Quantum is unavailable')

  const onlineOverlay = buildQuantumOverlayConfig(true)
  assert.equal(onlineOverlay.degraded, false)
  assert.ok(onlineOverlay.components.length > 0)

  const websiteSection = buildQuantumWebsiteSection()
  const consoleSection = buildQuantumConsoleSection()
  assert.ok(websiteSection.ctaLabel.length > 0)
  assert.ok(consoleSection.components.includes('demo-cta'))
})

test('QDE: insight sentence is deterministic and brand-agnostic (same shape for every brand)', () => {
  const retail = buildQuantumInsightSentence({ brand: 'retail', kpi: 'Basket size', forecastDirection: 'up' })
  const meat = buildQuantumInsightSentence({ brand: 'meat', kpi: 'Spoilage rate', forecastDirection: 'down' })
  assert.match(retail, /Quantum projects Basket size for retail is trending up/)
  assert.match(meat, /Quantum projects Spoilage rate for meat is trending down/)
})

test('QOL: enrichBrandSignalWithQuantum never overrides deterministic brand-ai-engine fields', async () => {
  const base = buildBrandSignal('retail', '2026-01-01T00:00:00.000Z')
  const enriched = await qolEnrich(base)
  assert.equal(enriched.insight, base.insight, 'deterministic insight must be untouched')
  assert.equal(enriched.risk, base.risk, 'deterministic risk must be untouched')
  assert.equal(enriched.opportunity, base.opportunity, 'deterministic opportunity must be untouched')
  assert.equal(enriched.microStory, base.microStory, 'deterministic micro-story must be untouched')
  assert.ok(typeof enriched.quantumInsightSentence === 'string' && enriched.quantumInsightSentence.length > 0)
})

test('QOL: buildUnifiedQuantumPayload degrades gracefully with no live Quantum backend configured', async () => {
  const payload = await buildUnifiedQuantumPayload('crypto', 'Active traders')
  assert.equal(payload.degraded, true, 'with no QUANTUM_API_BASE_URL configured, payload must report degraded')
  assert.equal(payload.brand, 'crypto')
  assert.ok(payload.forecast.length > 0)
  assert.ok(payload.opportunity.length > 0)
  assert.ok(payload.insightSentence.length > 0)
  assert.equal(payload.pulse, null)
})
