/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Prisma } from './generated/prisma/index.js'
import type { CandidateStage, InterviewStatus, JobStatus, Prisma as PrismaNamespace } from './generated/prisma/index.js'
import { prisma } from './auth.js'

const json = (value: unknown): PrismaNamespace.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as PrismaNamespace.InputJsonValue
const text = (value: unknown) => String(value ?? '').trim()
const optionalText = (value: unknown) => {
  const candidate = text(value)
  return candidate ? candidate : null
}
const requiredText = (value: unknown, label: string, max = 200) => {
  const candidate = text(value)
  if (!candidate) throw Object.assign(new Error(`${label} is required`), { status: 400 })
  return candidate.slice(0, max)
}
const requireEmail = (value: unknown) => {
  const candidate = requiredText(value, 'Email', 320).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) throw Object.assign(new Error('Email must be valid'), { status: 400 })
  return candidate
}
const parseDate = (value: unknown, label: string) => {
  const candidate = new Date(String(value || ''))
  if (Number.isNaN(candidate.getTime())) throw Object.assign(new Error(`${label} must be a valid date`), { status: 400 })
  return candidate
}
const jobStatuses = new Set<JobStatus>(['open', 'closed', 'filled'])
const candidateStages = new Set<CandidateStage>(['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'])
const interviewStatuses = new Set<InterviewStatus>(['scheduled', 'completed', 'cancelled', 'no_show'])
const parseJobStatus = (value: unknown): JobStatus => {
  const status = text(value) as JobStatus
  if (!jobStatuses.has(status)) throw Object.assign(new Error('Job status must be open, closed, or filled'), { status: 400 })
  return status
}
const parseCandidateStage = (value: unknown): CandidateStage => {
  const stage = text(value) as CandidateStage
  if (!candidateStages.has(stage)) throw Object.assign(new Error('Candidate stage must be Applied, Screening, Interview, Offer, Hired, or Rejected'), { status: 400 })
  return stage
}
const parseInterviewStatus = (value: unknown): InterviewStatus => {
  const status = text(value) as InterviewStatus
  if (!interviewStatuses.has(status)) throw Object.assign(new Error('Interview status must be scheduled, completed, cancelled, or no_show'), { status: 400 })
  return status
}

const candidateInclude = {
  job: true,
  interviews: { orderBy: { scheduledAt: 'asc' as const } },
  pipelineEvents: { orderBy: { createdAt: 'desc' as const }, take: 25 },
} satisfies Prisma.CandidateInclude

const interviewInclude = {
  candidate: { include: { job: true } },
} satisfies Prisma.InterviewInclude

export const listJobs = (tenantId: string, status?: string) => prisma.job.findMany({
  where: { tenantId, ...(status && jobStatuses.has(status as JobStatus) ? { status: status as JobStatus } : {}) },
  orderBy: { createdAt: 'desc' },
  include: { _count: { select: { candidates: true } } },
})

export const getJob = async (tenantId: string, id: string) => {
  const job = await prisma.job.findFirst({
    where: { id, tenantId },
    include: {
      candidates: { orderBy: { createdAt: 'desc' }, take: 25 },
      _count: { select: { candidates: true } },
    },
  })
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 })
  return job
}

export const createJob = async (tenantId: string, input: Record<string, unknown>) => prisma.job.create({
  data: {
    tenantId,
    title: requiredText(input.title, 'Title'),
    department: optionalText(input.department),
    location: optionalText(input.location),
    status: input.status ? parseJobStatus(input.status) : 'open',
    description: optionalText(input.description),
  },
})

export const updateJob = async (tenantId: string, id: string, input: Record<string, unknown>) => {
  const existing = await prisma.job.findFirst({ where: { id, tenantId } })
  if (!existing) throw Object.assign(new Error('Job not found'), { status: 404 })
  return prisma.job.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: requiredText(input.title, 'Title') } : {}),
      ...(input.department !== undefined ? { department: optionalText(input.department) } : {}),
      ...(input.location !== undefined ? { location: optionalText(input.location) } : {}),
      ...(input.status !== undefined ? { status: parseJobStatus(input.status) } : {}),
      ...(input.description !== undefined ? { description: optionalText(input.description) } : {}),
    },
  })
}

export const deleteJob = async (tenantId: string, id: string) => {
  const existing = await prisma.job.findFirst({ where: { id, tenantId }, include: { _count: { select: { candidates: true } } } })
  if (!existing) throw Object.assign(new Error('Job not found'), { status: 404 })
  if (existing._count.candidates > 0) throw Object.assign(new Error('Cannot delete a job with linked candidates'), { status: 409 })
  await prisma.job.delete({ where: { id } })
  return { id, deleted: true }
}

export const listCandidates = (tenantId: string, filters: { jobId?: string; stage?: string }) => prisma.candidate.findMany({
  where: {
    tenantId,
    ...(filters.jobId ? { jobId: filters.jobId } : {}),
    ...(filters.stage && candidateStages.has(filters.stage as CandidateStage) ? { stage: filters.stage as CandidateStage } : {}),
  },
  orderBy: { createdAt: 'desc' },
  include: { job: true, _count: { select: { interviews: true, pipelineEvents: true } } },
})

export const getCandidate = async (tenantId: string, id: string) => {
  const candidate = await prisma.candidate.findFirst({ where: { id, tenantId }, include: candidateInclude })
  if (!candidate) throw Object.assign(new Error('Candidate not found'), { status: 404 })
  return candidate
}

export const createCandidate = async (tenantId: string, actorId: string, input: Record<string, unknown>) => {
  const jobId = requiredText(input.jobId, 'Job')
  const job = await prisma.job.findFirst({ where: { id: jobId, tenantId } })
  if (!job) throw Object.assign(new Error('Job not found'), { status: 404 })
  const stage = input.stage ? parseCandidateStage(input.stage) : 'Applied'
  return prisma.$transaction(async (tx) => {
    const candidate = await tx.candidate.create({
      data: {
        tenantId,
        jobId,
        name: requiredText(input.name, 'Name'),
        email: requireEmail(input.email),
        phone: optionalText(input.phone),
        source: optionalText(input.source),
        resumeUrl: optionalText(input.resumeUrl),
        notes: optionalText(input.notes),
        stage,
      },
      include: candidateInclude,
    })
    await tx.pipelineEvent.create({
      data: {
        tenantId,
        candidateId: candidate.id,
        jobId,
        type: 'candidate.application.received',
        stageTo: stage,
        summary: `Candidate ${candidate.name} entered the pipeline for ${job.title}.`,
        metadata: json({ source: candidate.source, resumeUrl: candidate.resumeUrl }),
        createdBy: actorId,
      },
    })
    return candidate
  })
}

export const updateCandidate = async (tenantId: string, actorId: string, id: string, input: Record<string, unknown>) => {
  const existing = await prisma.candidate.findFirst({ where: { id, tenantId }, include: { job: true } })
  if (!existing) throw Object.assign(new Error('Candidate not found'), { status: 404 })
  const jobId = input.jobId !== undefined ? requiredText(input.jobId, 'Job') : existing.jobId
  if (jobId !== existing.jobId) {
    const nextJob = await prisma.job.findFirst({ where: { id: jobId, tenantId } })
    if (!nextJob) throw Object.assign(new Error('Job not found'), { status: 404 })
  }
  const nextStage = input.stage !== undefined ? parseCandidateStage(input.stage) : existing.stage
  return prisma.$transaction(async (tx) => {
    const candidate = await tx.candidate.update({
      where: { id },
      data: {
        jobId,
        ...(input.name !== undefined ? { name: requiredText(input.name, 'Name') } : {}),
        ...(input.email !== undefined ? { email: requireEmail(input.email) } : {}),
        ...(input.phone !== undefined ? { phone: optionalText(input.phone) } : {}),
        ...(input.source !== undefined ? { source: optionalText(input.source) } : {}),
        ...(input.resumeUrl !== undefined ? { resumeUrl: optionalText(input.resumeUrl) } : {}),
        ...(input.notes !== undefined ? { notes: optionalText(input.notes) } : {}),
        stage: nextStage,
      },
      include: candidateInclude,
    })
    if (nextStage !== existing.stage) {
      await tx.pipelineEvent.create({
        data: {
          tenantId,
          candidateId: id,
          jobId,
          type: 'candidate.stage.changed',
          stageFrom: existing.stage,
          stageTo: nextStage,
          summary: `Candidate ${candidate.name} moved from ${existing.stage} to ${nextStage}.`,
          metadata: json({ reason: optionalText(input.stageReason), source: 'manual' }),
          createdBy: actorId,
        },
      })
    }
    if (jobId !== existing.jobId) {
      await tx.pipelineEvent.create({
        data: {
          tenantId,
          candidateId: id,
          jobId,
          type: 'candidate.job.reassigned',
          summary: `Candidate ${candidate.name} was reassigned to a different job.`,
          metadata: json({ fromJobId: existing.jobId, toJobId: jobId }),
          createdBy: actorId,
        },
      })
    }
    return candidate
  })
}

export const deleteCandidate = async (tenantId: string, id: string) => {
  const existing = await prisma.candidate.findFirst({ where: { id, tenantId } })
  if (!existing) throw Object.assign(new Error('Candidate not found'), { status: 404 })
  await prisma.candidate.delete({ where: { id } })
  return { id, deleted: true }
}

export const listInterviews = (tenantId: string, filters: { candidateId?: string; status?: string }) => prisma.interview.findMany({
  where: {
    tenantId,
    ...(filters.candidateId ? { candidateId: filters.candidateId } : {}),
    ...(filters.status && interviewStatuses.has(filters.status as InterviewStatus) ? { status: filters.status as InterviewStatus } : {}),
  },
  orderBy: { scheduledAt: 'asc' },
  include: interviewInclude,
})

export const getInterview = async (tenantId: string, id: string) => {
  const interview = await prisma.interview.findFirst({ where: { id, tenantId }, include: interviewInclude })
  if (!interview) throw Object.assign(new Error('Interview not found'), { status: 404 })
  return interview
}

export const createInterview = async (tenantId: string, actorId: string, input: Record<string, unknown>) => {
  const candidateId = requiredText(input.candidateId, 'Candidate')
  const candidate = await prisma.candidate.findFirst({ where: { id: candidateId, tenantId }, include: { job: true } })
  if (!candidate) throw Object.assign(new Error('Candidate not found'), { status: 404 })
  return prisma.$transaction(async (tx) => {
    const interview = await tx.interview.create({
      data: {
        tenantId,
        candidateId,
        scheduledAt: parseDate(input.scheduledAt, 'Scheduled time'),
        interviewer: requiredText(input.interviewer, 'Interviewer'),
        status: input.status ? parseInterviewStatus(input.status) : 'scheduled',
        outcomeNotes: optionalText(input.outcomeNotes),
        createdBy: actorId,
      },
      include: interviewInclude,
    })
    await tx.pipelineEvent.create({
      data: {
        tenantId,
        candidateId,
        jobId: candidate.jobId,
        type: 'interview.scheduled',
        stageTo: candidate.stage,
        summary: `Interview scheduled for ${candidate.name}.`,
        metadata: json({ interviewId: interview.id, scheduledAt: interview.scheduledAt.toISOString(), interviewer: interview.interviewer, status: interview.status }),
        createdBy: actorId,
      },
    })
    return interview
  })
}

export const updateInterview = async (tenantId: string, actorId: string, id: string, input: Record<string, unknown>) => {
  const existing = await prisma.interview.findFirst({ where: { id, tenantId }, include: { candidate: true } })
  if (!existing) throw Object.assign(new Error('Interview not found'), { status: 404 })
  const nextStatus = input.status !== undefined ? parseInterviewStatus(input.status) : existing.status
  return prisma.$transaction(async (tx) => {
    const interview = await tx.interview.update({
      where: { id },
      data: {
        ...(input.scheduledAt !== undefined ? { scheduledAt: parseDate(input.scheduledAt, 'Scheduled time') } : {}),
        ...(input.interviewer !== undefined ? { interviewer: requiredText(input.interviewer, 'Interviewer') } : {}),
        ...(input.status !== undefined ? { status: nextStatus } : {}),
        ...(input.outcomeNotes !== undefined ? { outcomeNotes: optionalText(input.outcomeNotes) } : {}),
      },
      include: interviewInclude,
    })
    if (nextStatus !== existing.status) {
      await tx.pipelineEvent.create({
        data: {
          tenantId,
          candidateId: existing.candidateId,
          jobId: existing.candidate.jobId,
          type: 'interview.status.changed',
          stageTo: existing.candidate.stage,
          summary: `Interview for ${existing.candidate.name} changed from ${existing.status} to ${nextStatus}.`,
          metadata: json({ interviewId: id, fromStatus: existing.status, toStatus: nextStatus, outcomeNotes: optionalText(input.outcomeNotes) }),
          createdBy: actorId,
        },
      })
    }
    return interview
  })
}

export const deleteInterview = async (tenantId: string, id: string) => {
  const existing = await prisma.interview.findFirst({ where: { id, tenantId } })
  if (!existing) throw Object.assign(new Error('Interview not found'), { status: 404 })
  await prisma.interview.delete({ where: { id } })
  return { id, deleted: true }
}
