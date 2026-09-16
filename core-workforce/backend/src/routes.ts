/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router } from 'express'
import { createBobRouter } from '@founder-os/bob'
import { createAuthenticatedServiceProxy } from '@founder-os/auth'
import { approveTimesheet, createApplicant, createJob, createWorker, listApplicants, listJobs, listPayrollRuns, listTimesheets, listWorkers, submitTimesheet, syncPayrollToFinance, talentAnalytics, triggerPayrollRun, updateApplicantStage } from './talent.js'

const founderApi = `${process.env.FOUNDER_API_URL || 'http://127.0.0.1:4000/api/v1'}`.replace(/\/+$/, '')
const tenantOf = (req: { header(name: string): string | undefined }) => req.header('x-tenant-id') || undefined

const intelligence = {
  region: 'UK and Ireland',
  skillShortages: ['retail ops', 'talent analytics', 'screening automation'],
  salaryBenchmarks: [
    { role: 'Retail Operations Lead', p25: '£40k', median: '£48k', p75: '£55k' },
    { role: 'Customer Success Recruiter', p25: '£34k', median: '£41k', p75: '£47k' },
    { role: 'Regional Talent Partner', p25: '£52k', median: '£61k', p75: '£72k' },
  ],
}

const workflow = {
  messageType: 'text',
  intent: 'candidate-screening',
  route: 'CoreWorkforce applicant scoring',
  reply: 'I can screen the candidate, score the CV, and prepare a hiring summary for WhatsApp follow-up.',
  consoleUpdates: ['Score candidate', 'Schedule interview', 'Notify employer'],
}

const globalisation = {
  hosting: ['Europe (primary)', 'UK and Ireland', 'Latin America', 'Asia Pacific'],
  locales: ['en-GB', 'en-US', 'es-ES', 'pt-BR', 'pt-PT', 'fr-FR', 'de-DE', 'ms-MY', 'id-ID', 'ta-IN'],
  partnerDashboards: ['Recruiting partner dashboard', 'Regional onboarding dashboard', 'Compliance dashboard'],
  onboardingScripts: ['Local market setup', 'Tenant verification', 'Role localisation', 'WhatsApp template approval'],
  operatorPrompts: ['English', 'Spanish', 'Portuguese', 'French'],
}

const compliance = {
  privacyByDesign: true,
  encryptedPipelines: true,
  subprocessors: ['Hosting provider', 'Email provider', 'WhatsApp Cloud API', 'Analytics provider'],
  retentionPolicies: ['Applicant records: 180 days', 'Hiring logs: 1 year', 'Audit logs: 2 years'],
  brandCompliance: ['Orange brand colour enforced', 'No AI-looking graphics', 'Fingerprint login required'],
  publicationControl: ['Draft review', 'Approved publication', 'Regional sign-off'],
  regulations: ['GDPR', 'LGPD', 'PDPA'],
}

const detectType = (payload: unknown) => {
  const type = String((payload as { type?: string } | null)?.type || '').toLowerCase()
  if (['media', 'image', 'video', 'audio', 'document'].includes(type)) return 'media'
  if (type === 'template') return 'template'
  if (type === 'interactive') return 'interactive'
  if (type === 'system') return 'system'
  return 'text'
}

const intentFor = (text: string) => {
  const lower = text.toLowerCase()
  if (/salary|benchmark|pay/.test(lower)) return 'salary-benchmarking'
  if (/cv|resume|candidate|shortlist/.test(lower)) return 'candidate-screening'
  if (/job|role|vacancy|posting/.test(lower)) return 'job-intelligence'
  if (/interview|schedule|follow[- ]?up/.test(lower)) return 'interview-workflow'
  if (/trend|shortage|market|region/.test(lower)) return 'labour-market-intelligence'
  return 'talent-ops'
}

const responseFor = (intent: string) => {
  const responses: Record<string, string> = {
  'salary-benchmarking': 'I found salary benchmarks and regional ranges for the requested role.',
  'candidate-screening': 'I scored the candidate and prepared a structured screening summary.',
  'job-intelligence': 'I normalised the role and refreshed matching job intelligence.',
  'interview-workflow': 'I queued interview scheduling and employer notifications.',
  'labour-market-intelligence': 'I pulled the latest skill shortage and regional market signals.',
  'talent-ops': 'I routed the message to the talent operations workflow.',
  }
  return responses[intent] || 'I routed the message to the talent operations workflow.'
}

export const apiRouter = Router()
apiRouter.use('/auth', createAuthenticatedServiceProxy(`${founderApi}/talent/auth`))
apiRouter.use('/applications', createAuthenticatedServiceProxy(`${founderApi}/applications`))
apiRouter.use('/bob', createBobRouter('core_workforce'))
apiRouter.get('/status', (_req, res) => res.json({ app: 'core_workforce', status: 'operational' }))
apiRouter.get('/dashboard', async (req, res, next) => {
  try {
    const tenantId = tenantOf(req)
    const [jobs, applicants, analytics] = await Promise.all([listJobs(tenantId), listApplicants(tenantId), talentAnalytics(tenantId)])
    res.json({ success: true, data: { jobs, candidates: applicants, analytics, intelligence, refreshedAt: new Date().toISOString() } })
  } catch (error) { next(error) }
})
apiRouter.get('/jobs', async (req, res, next) => { try { res.json({ success: true, data: await listJobs(tenantOf(req)) }) } catch (error) { next(error) } })
apiRouter.post('/jobs', async (req, res, next) => {
  try {
    const tenantId = tenantOf(req) || String(req.body?.tenantId || '')
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await createJob(tenantId, req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.get('/candidates', async (req, res, next) => { try { res.json({ success: true, data: await listApplicants(tenantOf(req)) }) } catch (error) { next(error) } })
apiRouter.post('/candidates', async (req, res, next) => {
  try {
    const tenantId = tenantOf(req) || String(req.body?.tenantId || '')
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await createApplicant(tenantId, req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.patch('/candidates/:id/stage', async (req, res, next) => {
  try { res.json({ success: true, data: await updateApplicantStage(req.params.id, tenantOf(req), String(req.body?.stage || 'screening')) }) } catch (error) { next(error) }
})
apiRouter.get('/workers', async (req, res, next) => { try { res.json({ success: true, data: await listWorkers(tenantOf(req)) }) } catch (error) { next(error) } })
apiRouter.post('/workers', async (req, res, next) => {
  try {
    const tenantId = tenantOf(req) || String(req.body?.tenantId || '')
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await createWorker(tenantId, req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.get('/timesheets', async (req, res, next) => { try { res.json({ success: true, data: await listTimesheets(tenantOf(req)) }) } catch (error) { next(error) } })
apiRouter.post('/timesheets', async (req, res, next) => {
  try {
    const tenantId = tenantOf(req) || String(req.body?.tenantId || '')
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await submitTimesheet(tenantId, req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.post('/timesheets/:id/approve', async (req, res, next) => {
  try { res.json({ success: true, data: await approveTimesheet(req.params.id, tenantOf(req)) }) } catch (error) { next(error) }
})
apiRouter.get('/payroll', async (req, res, next) => { try { res.json({ success: true, data: await listPayrollRuns(tenantOf(req)) }) } catch (error) { next(error) } })
apiRouter.post('/payroll', async (req, res, next) => {
  try {
    const tenantId = tenantOf(req) || String(req.body?.tenantId || '')
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await triggerPayrollRun(tenantId, req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.post('/payroll/:id/sync-to-finance', async (req, res, next) => {
  try { res.json({ success: true, data: await syncPayrollToFinance(req.params.id, tenantOf(req)) }) } catch (error) { next(error) }
})
apiRouter.get('/analytics', async (req, res, next) => { try { res.json({ success: true, data: await talentAnalytics(tenantOf(req)) }) } catch (error) { next(error) } })
apiRouter.get('/intelligence', (_req, res) => res.json({ success: true, data: intelligence }))
apiRouter.get('/globalisation', (_req, res) => res.json({ success: true, data: globalisation }))
apiRouter.get('/compliance', (_req, res) => res.json({ success: true, data: compliance }))
apiRouter.get('/owner', async (req, res, next) => {
  try {
    const tenantId = tenantOf(req)
    const [jobs, analytics] = await Promise.all([listJobs(tenantId), talentAnalytics(tenantId)])
    res.json({ success: true, data: { jobs, analytics, intelligence, workflow } })
  } catch (error) { next(error) }
})
apiRouter.get('/console/:merchantId', async (req, res, next) => {
  try {
    const candidates = await listApplicants(tenantOf(req))
    res.json({ success: true, data: { merchantId: req.params.merchantId, candidates, workflow } })
  } catch (error) { next(error) }
})
apiRouter.post('/whatsapp/messages', (req, res) => {
  const text = String(req.body?.text || req.body?.message || '').trim()
  const messageType = detectType(req.body)
  const intent = intentFor(text)
  res.json({
    success: true,
    data: {
      brand: 'core_workforce',
      messageType,
      intent,
      route: intent === 'candidate-screening' ? 'Applicant Scoring Engine' : intent === 'job-intelligence' ? 'Job Intelligence' : intent === 'salary-benchmarking' ? 'Hiring Analytics' : 'Labour Market Intelligence',
      reply: responseFor(intent),
      consoleUpdates: intent === 'candidate-screening' ? ['Score candidate', 'Generate report', 'Notify employer'] : intent === 'job-intelligence' ? ['Normalize role', 'Store salary range', 'Update posting'] : intent === 'salary-benchmarking' ? ['Compare salary bands', 'Refresh benchmarks', 'Publish summary'] : ['Review market signals', 'Update dashboard', 'Alert recruiters'],
    },
  })
})
