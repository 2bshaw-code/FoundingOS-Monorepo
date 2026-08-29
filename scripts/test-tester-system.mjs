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

test('module assignment: 12 unique credentials, modules, and surveys', () => {
  const passwords = new Set(CREDENTIALS.map((c) => c.password))
  const modules = new Set(CREDENTIALS.map((c) => c.moduleId))
  const surveys = new Set(CREDENTIALS.map((c) => c.surveyId))
  assert.equal(CREDENTIALS.length, 12)
  assert.equal(passwords.size, 12, 'passwords must be unique')
  assert.equal(modules.size, 12, 'modules must be unique')
  assert.equal(surveys.size, 12, 'surveys must be unique')
})

test('every credential maps to a survey with 3-5 tailored questions', () => {
  for (const credential of CREDENTIALS) {
    const survey = SURVEYS[credential.surveyId]
    assert.ok(survey, `survey ${credential.surveyId} must exist for ${credential.id}`)
    assert.ok(survey.questions.length >= 3 && survey.questions.length <= 5, `${credential.surveyId} must have 3-5 questions`)
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

  let tester = { currentAnswers: [], runs: [], status: 'registered' }
  tester = simulateRun(tester, { k1: 'Xero', k2: 'Weekly', k3: 'Manual reconciliation' })
  assert.equal(tester.runs.length, 1)
  assert.equal(tester.currentAnswers.length, 0, 'buffer resets after a completed run')

  // Redo: the survey is "always available" — a second run starts fresh and archives independently.
  tester = simulateRun(tester, { k1: 'QuickBooks', k2: 'Daily', k3: 'Slow approvals' })
  assert.equal(tester.runs.length, 2, 'a second run is archived alongside the first')
  assert.equal(tester.runs[0].answers.find((a) => a.questionId === 'k1').answer, 'Xero', 'first run history is preserved')
  assert.equal(tester.runs[1].answers.find((a) => a.questionId === 'k1').answer, 'QuickBooks')
})

test('Finance and Crypto module access: reachable through the same catalog as every other module', () => {
  assert.equal(MODULE_OPTIONS.length, 12)
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

test('brand personality layers: 6 brands each have color, pulse, micro-story, 3-5 KPIs, sparkline, and 3 tiles', () => {
  const brands = Object.values(BRAND_PERSONALITIES)
  assert.equal(brands.length, 6)
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

test('brand signal feed: aggregates exactly 6 brands with contribution scores in range', () => {
  const signals = aggregateBrandSignals('2026-01-01T00:00:00.000Z')
  assert.equal(signals.length, 6)
  const brands = new Set(signals.map((s) => s.brand))
  assert.equal(brands.size, 6)
  for (const signal of signals) {
    assert.ok(signal.contributionScore >= 0 && signal.contributionScore <= 100, `${signal.brand} contribution score must be 0-100`)
    assert.equal(signal.timestamp, '2026-01-01T00:00:00.000Z')
  }
})

test('brand signal feed: same brand + timestamp always builds an identical signal (deterministic, no hidden randomness)', () => {
  const a = buildBrandSignal('it', '2026-01-01T00:00:00.000Z')
  const b = buildBrandSignal('it', '2026-01-01T00:00:00.000Z')
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
