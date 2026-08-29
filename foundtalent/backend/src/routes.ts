/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router } from 'express'
import { createBobRouter } from '@founder-os/bob'
import { createAuthenticatedServiceProxy } from '@founder-os/auth'

const founderApi = `${process.env.FOUNDER_API_URL || 'http://127.0.0.1:4000/api/v1'}`.replace(/\/+$/, '')
type Job = { id: string; title: string; employer: string; region: string; source: string; salaryRange: string; skills: string[]; updatedAt: string }
type Candidate = { id: string; name: string; role: string; score: number; stage: 'screening' | 'shortlisted' | 'interview' | 'offer'; location: string; notes: string }

const jobs: Job[] = [
  { id: 'job-1', title: 'Retail Operations Lead', employer: 'Northside Grocers', region: 'North West', source: 'Career page', salaryRange: '£42k-£52k', skills: ['operations', 'whatsapp', 'reporting'], updatedAt: '2026-08-20T09:30:00Z' },
  { id: 'job-2', title: 'Customer Success Recruiter', employer: 'ShiftWorks', region: 'London', source: 'Job board', salaryRange: '£36k-£44k', skills: ['screening', 'stakeholder management', 'crm'], updatedAt: '2026-08-20T10:10:00Z' },
  { id: 'job-3', title: 'Regional Talent Partner', employer: 'FoundTalent', region: 'Scotland', source: 'Career page', salaryRange: '£55k-£68k', skills: ['hiring', 'analytics', 'salary benchmarking'], updatedAt: '2026-08-20T11:05:00Z' },
]

const candidates: Candidate[] = [
  { id: 'cand-1', name: 'Ava Thompson', role: 'Retail Operations Lead', score: 94, stage: 'interview', location: 'Manchester', notes: 'Strong ops background and WhatsApp-first communication.' },
  { id: 'cand-2', name: 'Ben Clarke', role: 'Customer Success Recruiter', score: 88, stage: 'shortlisted', location: 'London', notes: 'Good pipeline ownership and structured follow-up.' },
  { id: 'cand-3', name: 'Priya Shah', role: 'Regional Talent Partner', score: 97, stage: 'offer', location: 'Glasgow', notes: 'Excellent hiring analytics and regional market knowledge.' },
]

const analytics = {
  rolesTracked: jobs.length,
  applicantsScored: candidates.length * 12,
  interviewsScheduled: 14,
  averageScore: 93,
  conversionRate: 0.38,
}

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
  route: 'FoundTalent applicant scoring',
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
  if (/job|role|vacancy|scrap/.test(lower)) return 'job-scraping'
  if (/interview|schedule|follow[- ]?up/.test(lower)) return 'interview-workflow'
  if (/trend|shortage|market|region/.test(lower)) return 'labour-market-intelligence'
  return 'talent-ops'
}

const responseFor = (intent: string) => {
  const responses: Record<string, string> = {
  'salary-benchmarking': 'I found salary benchmarks and regional ranges for the requested role.',
  'candidate-screening': 'I scored the candidate and prepared a structured screening summary.',
  'job-scraping': 'I normalised the role and refreshed matching job board sources.',
  'interview-workflow': 'I queued interview scheduling and employer notifications.',
  'labour-market-intelligence': 'I pulled the latest skill shortage and regional market signals.',
  'talent-ops': 'I routed the message to the talent operations workflow.',
  }
  return responses[intent] || 'I routed the message to the talent operations workflow.'
}

export const apiRouter = Router()
apiRouter.use('/auth', createAuthenticatedServiceProxy(`${founderApi}/talent/auth`))
apiRouter.use('/applications', createAuthenticatedServiceProxy(`${founderApi}/applications`))
apiRouter.use('/bob', createBobRouter('foundtalent'))
apiRouter.get('/status', (_req, res) => res.json({ app: 'foundtalent', status: 'operational' }))
apiRouter.get('/dashboard', (_req, res) => res.json({ success: true, data: { jobs, candidates, analytics, intelligence, refreshedAt: new Date().toISOString() } }))
apiRouter.get('/jobs', (_req, res) => res.json({ success: true, data: jobs }))
apiRouter.get('/candidates', (_req, res) => res.json({ success: true, data: candidates }))
apiRouter.get('/analytics', (_req, res) => res.json({ success: true, data: analytics }))
apiRouter.get('/intelligence', (_req, res) => res.json({ success: true, data: intelligence }))
apiRouter.get('/globalisation', (_req, res) => res.json({ success: true, data: globalisation }))
apiRouter.get('/compliance', (_req, res) => res.json({ success: true, data: compliance }))
apiRouter.get('/owner', (_req, res) => res.json({ success: true, data: { jobs, analytics, intelligence, workflow } }))
apiRouter.get('/console/:merchantId', (req, res) => res.json({ success: true, data: { merchantId: req.params.merchantId, candidates, workflow } }))
apiRouter.post('/whatsapp/messages', (req, res) => {
  const text = String(req.body?.text || req.body?.message || '').trim()
  const messageType = detectType(req.body)
  const intent = intentFor(text)
  res.json({
    success: true,
    data: {
      brand: 'foundtalent',
      messageType,
      intent,
      route: intent === 'candidate-screening' ? 'Applicant Scoring Engine' : intent === 'job-scraping' ? 'Job Scraping Engine' : intent === 'salary-benchmarking' ? 'Hiring Analytics' : 'Labour Market Intelligence',
      reply: responseFor(intent),
      consoleUpdates: intent === 'candidate-screening' ? ['Score candidate', 'Generate report', 'Notify employer'] : intent === 'job-scraping' ? ['Normalize role', 'Store salary range', 'Update posting'] : intent === 'salary-benchmarking' ? ['Compare salary bands', 'Refresh benchmarks', 'Publish summary'] : ['Review market signals', 'Update dashboard', 'Alert recruiters'],
    },
  })
})
