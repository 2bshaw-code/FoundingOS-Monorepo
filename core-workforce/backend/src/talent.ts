/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Talent Console persistence layer — Job/Applicant/Worker/Timesheet/PayrollRun,
// replacing the previous in-memory demo data with real Prisma-backed models.
// See docs/console-requirements.md (Talent Console section).
import { emitOsEvent, OS_EVENTS } from '@foundingos/config/events'
import { prisma } from './prisma.js'

const jsonSkills = (skills: unknown) => (Array.isArray(skills) ? skills.filter((s): s is string => typeof s === 'string') : [])

export const listJobs = (tenantId?: string) =>
  prisma.job.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 100 })

export const createJob = (tenantId: string, input: Record<string, unknown>) =>
  prisma.job.create({
    data: {
      tenantId,
      title: String(input.title || ''),
      employer: String(input.employer || ''),
      region: String(input.region || ''),
      source: String(input.source || 'Career page'),
      salaryRange: String(input.salaryRange || ''),
      skills: jsonSkills(input.skills),
    },
  })

export const listApplicants = (tenantId?: string) =>
  prisma.applicant.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 100 })

export const createApplicant = (tenantId: string, input: Record<string, unknown>) =>
  prisma.applicant.create({
    data: {
      tenantId,
      jobId: String(input.jobId || ''),
      name: String(input.name || ''),
      role: String(input.role || ''),
      score: Number(input.score || 0),
      stage: String(input.stage || 'screening'),
      location: input.location ? String(input.location) : undefined,
      notes: input.notes ? String(input.notes) : undefined,
    },
  })

export const updateApplicantStage = (id: string, tenantId: string | undefined, stage: string) =>
  prisma.applicant.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { stage } })

export const listWorkers = (tenantId?: string) =>
  prisma.worker.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 200 })

export const createWorker = (tenantId: string, input: Record<string, unknown>) =>
  prisma.worker.create({
    data: {
      tenantId,
      name: String(input.name || ''),
      role: String(input.role || ''),
      region: input.region ? String(input.region) : undefined,
      employmentType: String(input.employmentType || 'full_time'),
    },
  })

export const listTimesheets = (tenantId?: string) =>
  prisma.timesheet.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 200 })

export const submitTimesheet = (tenantId: string, input: Record<string, unknown>) =>
  prisma.timesheet.create({
    data: {
      tenantId,
      workerId: String(input.workerId || ''),
      periodStart: new Date(String(input.periodStart)),
      periodEnd: new Date(String(input.periodEnd)),
      hours: Number(input.hours || 0),
    },
  })

export const approveTimesheet = (id: string, tenantId: string | undefined) =>
  prisma.timesheet.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { status: 'approved', approvedAt: new Date() } })

export const listPayrollRuns = (tenantId?: string) =>
  prisma.payrollRun.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 50 })

export const triggerPayrollRun = (tenantId: string, input: Record<string, unknown>) =>
  prisma.payrollRun.create({
    data: {
      tenantId,
      periodStart: new Date(String(input.periodStart)),
      periodEnd: new Date(String(input.periodEnd)),
      totalPence: Number(input.totalPence || 0),
    },
  })

// Sync payroll → Finance: marks the run synced and emits `payroll.synced`
// so a real cross-service Finance integration (or Core Intelligence
// automation) can react without this backend needing to know about
// core-operations/backend directly.
export const syncPayrollToFinance = async (id: string, tenantId: string | undefined) => {
  const run = await prisma.payrollRun.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { status: 'synced', syncedToFinanceAt: new Date() } })
  await emitOsEvent(OS_EVENTS.PAYROLL_SYNCED, { payrollRunId: run.id, organisationId: run.tenantId, totalPence: run.totalPence })
  return run
}

export const talentAnalytics = async (tenantId?: string) => {
  const where = tenantId ? { tenantId } : {}
  const [jobs, applicants] = await Promise.all([
    prisma.job.findMany({ where }),
    prisma.applicant.findMany({ where }),
  ])
  const interviewing = applicants.filter((a) => a.stage === 'interview' || a.stage === 'offer').length
  const averageScore = applicants.length ? Math.round(applicants.reduce((sum, a) => sum + a.score, 0) / applicants.length) : 0
  return {
    rolesTracked: jobs.length,
    applicantsScored: applicants.length,
    interviewsScheduled: interviewing,
    averageScore,
    conversionRate: applicants.length ? Number((applicants.filter((a) => a.stage === 'offer').length / applicants.length).toFixed(2)) : 0,
  }
}
