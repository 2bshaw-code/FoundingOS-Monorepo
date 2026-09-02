/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, ADMIN_COOKIE, verifyToken } from '../../../tester/session'
import { getTester, upsertTester, getOrCreateAdminTester, type SurveyRun } from '../../../tester/store.server'
import { SURVEYS, categorizeCredential, adminTesterId, exploreTesterId, findModuleOption, SUPER_FOUNDER_ADMIN_EMAIL, type CredentialCategory, type SurveyId } from '../../../tester/tester-data'
import { buildSignalFromSurveyRun, type IntelBrandSlug } from '@foundingos/config/brandSignalFeed'
import { enrichBrandSignalWithQuantum } from '@foundingos/config/quantum-orchestration-layer'

// Only modules that correspond to a real brand personality layer generate a signal today.
const MODULE_TO_INTEL_BRAND: Partial<Record<string, IntelBrandSlug>> = { finance: 'finance', crypto: 'crypto' }

// Lightweight FoundAI-style heuristic: short answers get one optional follow-up question.
function buildFollowUp(questionId: string, answer: string) {
  if (answer.trim().length >= 15) return null
  return { id: `${questionId}-followup`, prompt: 'Can you add a bit more detail on your previous answer?' }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.questionId !== 'string' || typeof body.answer !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Real Super Founder Admin only (see tester-data.ts's adminTesterId doc comment) — never the
  // separate passcode-only /tester/admin reviewer (id === 'admin'), whose access is unchanged.
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  const isSuperFounderAdminSession = adminId === 'super-founder-admin'

  let testerId: string
  let tester: Awaited<ReturnType<typeof getTester>>
  let category: CredentialCategory
  if (isSuperFounderAdminSession) {
    const moduleOption = typeof body.moduleId === 'string' ? findModuleOption(body.moduleId) : null
    if (!moduleOption) return NextResponse.json({ error: 'A valid moduleId is required for admin survey submissions.' }, { status: 400 })
    testerId = adminTesterId(moduleOption.moduleId)
    tester = await getOrCreateAdminTester(testerId, moduleOption.moduleId, moduleOption.moduleLabel, moduleOption.surveyId, SUPER_FOUNDER_ADMIN_EMAIL)
    category = 'admin'
  } else {
    const token = cookies().get(SESSION_COOKIE)?.value
    const realTesterId = token ? await verifyToken('tester', token) : null
    if (!realTesterId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const ownTester = await getTester(realTesterId)
    if (!ownTester) return NextResponse.json({ error: 'Tester not found' }, { status: 404 })
    category = categorizeCredential(realTesterId)

    // Every real session can now take any real module's survey — not just the one they were
    // originally assigned — exactly like admin already could (see /tester/survey/page.tsx and
    // /tester/demo/[moduleId]/page.tsx, which both use this same explore mechanism). Must be
    // checked here too: this API independently resolves the tester record from cookies, so
    // without this, answers submitted while exploring a non-primary module would silently save
    // to this tester's real, primary record under the wrong surveyId instead.
    const requestedModuleId = typeof body.moduleId === 'string' ? body.moduleId : null
    if (requestedModuleId && requestedModuleId !== ownTester.moduleId) {
      const moduleOption = findModuleOption(requestedModuleId)
      if (!moduleOption) return NextResponse.json({ error: 'Unknown moduleId' }, { status: 400 })
      testerId = exploreTesterId(realTesterId, requestedModuleId)
      tester = await getOrCreateAdminTester(testerId, moduleOption.moduleId, moduleOption.moduleLabel, moduleOption.surveyId, ownTester.email)
    } else {
      testerId = realTesterId
      tester = ownTester
    }
  }

  // Demo must always come before the survey for real testers/survey-takers/investors/buyers/
  // customers/admin — block a direct API call attempting to bypass the page-level redirect in
  // survey/page.tsx. Free roam / lawyer sessions never take a survey, so they're exempt. For
  // investors, still being mid-briefing ('briefing-viewed') also counts as not having reached
  // the demo step yet.
  const isSurveyTaker = category === 'tester' || category === 'survey' || category === 'investor' || category === 'buyer' || category === 'customer' || category === 'admin'
  const demoPath = category === 'investor' ? '/investor' : `/tester/demo/${tester.moduleId}`
  const demoNotYetViewed = tester.status === 'registered' || tester.status === 'briefing-viewed'
  if (isSurveyTaker && demoNotYetViewed) {
    return NextResponse.json({ error: 'Complete the module demo before starting the survey.', redirect: demoPath }, { status: 403 })
  }

  const survey = SURVEYS[tester.surveyId as SurveyId]
  if (!survey) return NextResponse.json({ error: 'Survey not found' }, { status: 404 })

  const isBaseQuestion = survey.questions.some((question) => question.id === body.questionId)
  const isDraft = body.autosave === true

  const currentAnswers = tester.currentAnswers.filter((existing) => existing.questionId !== body.questionId)
  currentAnswers.push({ questionId: body.questionId, answer: body.answer, autoGenerated: !isBaseQuestion })

  if (isDraft) {
    await upsertTester(testerId, { currentAnswers })
    return NextResponse.json({ ok: true })
  }

  const answeredBaseCount = survey.questions.filter((question) => currentAnswers.some((answer) => answer.questionId === question.id)).length

  // A run is complete once every base question is answered — it's archived to history and the
  // working buffer resets to empty, which is what makes the survey "always available" to redo.
  if (answeredBaseCount >= survey.questions.length) {
    const completedAt = new Date().toISOString()
    const intelBrand = MODULE_TO_INTEL_BRAND[tester.moduleId]
    const baseSignal = intelBrand ? buildSignalFromSurveyRun(intelBrand, currentAnswers, completedAt) : undefined
    const run: SurveyRun = {
      id: `run-${tester.runs.length + 1}`,
      answers: currentAnswers,
      completedAt,
      signal: baseSignal ? await enrichBrandSignalWithQuantum(baseSignal) : undefined,
    }
    await upsertTester(testerId, { currentAnswers: [], runs: [...tester.runs, run], status: 'complete' })
    return NextResponse.json({ done: true, redirect: demoPath })
  }

  await upsertTester(testerId, { currentAnswers, status: tester.status === 'complete' ? 'complete' : 'in-progress' })

  if (isBaseQuestion) {
    const followUp = buildFollowUp(body.questionId, body.answer)
    if (followUp) return NextResponse.json({ done: false, followUp })
  }

  return NextResponse.json({ done: false })
}
