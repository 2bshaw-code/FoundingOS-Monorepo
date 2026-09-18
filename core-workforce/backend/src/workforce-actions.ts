/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Prisma } from './generated/prisma/index.js'
import type { CandidateStage, Prisma as PrismaNamespace, WorkforceActionStatus } from './generated/prisma/index.js'
import { prisma } from './auth.js'

export const workforceActionStatuses = ['proposed', 'approved', 'rejected', 'executing', 'completed', 'reversed'] as const

type ActionStatus = typeof workforceActionStatuses[number]
type ShortlistTargetStage = Extract<CandidateStage, 'Screening' | 'Interview'>
type ShortlistingInput = {
  candidateId: string
  jobId: string
  previousStage: CandidateStage
  targetStage: ShortlistTargetStage
  rationale?: string
  interview?: {
    scheduledAt?: string
    interviewer?: string
  }
}
type ShortlistingProposal = {
  kind: 'candidate.shortlist'
  title: string
  summary: string
  rationale: string
  input: ShortlistingInput
  simulationPreview: Record<string, unknown>
}
type ExecutionResult = {
  candidateId: string
  previousStage: CandidateStage
  targetStage: CandidateStage
  actualStage: CandidateStage
  interviewId?: string
}
type CompensationResult = {
  previousStage: CandidateStage
  targetStage: CandidateStage
  cancelledInterviewId?: string
  summary: string
}

const json = (value: unknown): PrismaNamespace.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as PrismaNamespace.InputJsonValue
const record = (value: unknown) => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
const text = (value: unknown) => String(value ?? '').trim()
const stringArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
const requiredText = (value: unknown, label: string, max = 200) => {
  const candidate = text(value)
  if (!candidate) throw Object.assign(new Error(`${label} is required`), { status: 400 })
  return candidate.slice(0, max)
}
const parseTargetStage = (value: unknown): ShortlistTargetStage => {
  const stage = requiredText(value || 'Screening', 'Target stage') as ShortlistTargetStage
  if (stage !== 'Screening' && stage !== 'Interview') throw Object.assign(new Error('Target stage must be Screening or Interview'), { status: 400 })
  return stage
}
const parseOptionalDateString = (value: unknown) => {
  if (value === undefined || value === null || text(value) === '') return undefined
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) throw Object.assign(new Error('Interview scheduledAt must be a valid date'), { status: 400 })
  return date.toISOString()
}
const parseInterviewInput = (value: unknown) => {
  const payload = record(value)
  const scheduledAt = parseOptionalDateString(payload.scheduledAt)
  const interviewer = text(payload.interviewer) || undefined
  if ((scheduledAt && !interviewer) || (!scheduledAt && interviewer)) {
    throw Object.assign(new Error('Interview scheduledAt and interviewer must be supplied together'), { status: 400 })
  }
  return scheduledAt && interviewer ? { scheduledAt, interviewer } : undefined
}
const assertTransition = (status: ActionStatus, operation: 'approve' | 'reject' | 'execute' | 'reverse') => {
  if (operation === 'approve' || operation === 'reject') {
    if (status !== 'proposed') throw Object.assign(new Error(`Only proposed actions can be ${operation}d`), { status: 409 })
    return
  }
  if (operation === 'execute') {
    if (status !== 'approved') throw Object.assign(new Error('Only approved actions can be executed'), { status: 409 })
    return
  }
  if (status !== 'completed') throw Object.assign(new Error('Only completed actions can be reversed'), { status: 409 })
}

async function buildShortlistingProposal(tenantId: string, input: Record<string, unknown>): Promise<ShortlistingProposal> {
  const candidateId = requiredText(input.candidateId, 'Candidate')
  const candidate = await prisma.candidate.findFirst({ where: { id: candidateId, tenantId }, include: { job: true } })
  if (!candidate) throw Object.assign(new Error('Candidate not found'), { status: 404 })
  if (candidate.stage === 'Rejected' || candidate.stage === 'Hired') throw Object.assign(new Error(`Cannot shortlist a candidate already marked ${candidate.stage}`), { status: 409 })
  const targetStage = parseTargetStage(input.targetStage || 'Screening')
  if (candidate.stage === targetStage) throw Object.assign(new Error(`Candidate is already in ${targetStage}`), { status: 409 })
  if (!['Applied', 'Screening'].includes(candidate.stage) && !(candidate.stage === 'Offer' && targetStage === 'Interview')) {
    throw Object.assign(new Error(`Shortlisting from ${candidate.stage} is not supported`), { status: 409 })
  }
  const interview = parseInterviewInput(input.interview)
  const rationale = text(input.rationale) || `Shortlist ${candidate.name} for ${candidate.job.title} and move them into ${targetStage}.`
  return {
    kind: 'candidate.shortlist',
    title: `Shortlist ${candidate.name}`,
    summary: `${candidate.name} will move from ${candidate.stage} to ${targetStage} for ${candidate.job.title}.`,
    rationale,
    input: {
      candidateId: candidate.id,
      jobId: candidate.jobId,
      previousStage: candidate.stage,
      targetStage,
      rationale: text(input.rationale) || undefined,
      interview,
    },
    simulationPreview: {
      generatedAt: new Date().toISOString(),
      disclaimer: 'Read-only projection. No candidate stage or interview record changes until approval and execution.',
      candidate: {
        id: candidate.id,
        name: candidate.name,
        currentStage: candidate.stage,
        targetStage,
        jobTitle: candidate.job.title,
      },
      pipeline: {
        before: `${candidate.name} is currently in ${candidate.stage}.`,
        after: targetStage === 'Interview'
          ? `${candidate.name} would advance to Interview${interview ? ' and a scheduled interview would be created.' : '.'}`
          : `${candidate.name} would advance to Screening for recruiter review.`,
        interviewPlanned: interview || null,
      },
      comparison: {
        approve: [
          `Candidate stage moves to ${targetStage}.`,
          interview ? `Interview gets scheduled with ${interview.interviewer}.` : 'No interview record is created unless interview details are supplied.',
        ],
        reject: [`Candidate remains in ${candidate.stage}.`, 'No pipeline or interview records change.'],
      },
    },
  }
}

export const listWorkforceActions = (tenantId: string, status?: string) => prisma.workforceAction.findMany({
  where: { tenantId, ...(status && workforceActionStatuses.includes(status as ActionStatus) ? { status: status as WorkforceActionStatus } : {}) },
  orderBy: { createdAt: 'desc' },
  take: 100,
})

export async function proposeWorkforceAction(tenantId: string, actorId: string, kind: string, input: Record<string, unknown>, requestId?: string) {
  if (kind !== 'candidate.shortlist') throw Object.assign(new Error('Unsupported workforce action kind'), { status: 400 })
  const proposal = await buildShortlistingProposal(tenantId, input)
  return prisma.$transaction(async (tx) => {
    const sourceEvent = await tx.event.create({
      data: {
        tenantId,
        type: 'candidate.shortlist.requested',
        source: 'workforce',
        payload: json({ candidateId: proposal.input.candidateId, jobId: proposal.input.jobId, targetStage: proposal.input.targetStage }),
      },
    })
    const action = await tx.workforceAction.create({
      data: {
        tenantId,
        kind: proposal.kind,
        title: proposal.title,
        summary: proposal.summary,
        rationale: proposal.rationale,
        sourceCandidateId: proposal.input.candidateId,
        sourceJobId: proposal.input.jobId,
        input: json(proposal.input),
        simulationPreview: json(proposal.simulationPreview),
        proposedBy: actorId,
      },
    })
    const proposalEvent = await tx.event.create({
      data: {
        tenantId,
        type: 'workforce.action.proposed',
        source: 'workforce',
        payload: json({ actionId: action.id, correlationId: action.id, sourceEventId: sourceEvent.id, kind: action.kind, candidateId: proposal.input.candidateId, targetStage: proposal.input.targetStage }),
      },
    })
    const updated = await tx.workforceAction.update({ where: { id: action.id }, data: { trailEventIds: json([sourceEvent.id, proposalEvent.id]) } })
    await tx.workspaceAuditEvent.create({
      data: {
        tenantId,
        actorId,
        action: 'workforce.action.proposed',
        workspace: 'workforce',
        module: 'core_workforce',
        entityId: action.id,
        requestId,
        metadata: json({ kind: action.kind, candidateId: proposal.input.candidateId, targetStage: proposal.input.targetStage }),
      },
    })
    return updated
  })
}

export const proposeApplicantShortlistingAction = (tenantId: string, actorId: string, input: Record<string, unknown>, requestId?: string) =>
  proposeWorkforceAction(tenantId, actorId, 'candidate.shortlist', input, requestId)

export async function decideWorkforceAction(tenantId: string, actorId: string, id: string, decision: unknown, requestId?: string) {
  const operation = text(decision) === 'reject' ? 'reject' : text(decision) === 'approve' ? 'approve' : ''
  if (!operation) throw Object.assign(new Error('Decision must be approve or reject'), { status: 400 })
  return prisma.$transaction(async (tx) => {
    const existing = await tx.workforceAction.findFirst({ where: { id, tenantId } })
    if (!existing) throw Object.assign(new Error('Workforce action not found'), { status: 404 })
    assertTransition(existing.status as ActionStatus, operation)
    const status: WorkforceActionStatus = operation === 'approve' ? 'approved' : 'rejected'
    const event = await tx.event.create({
      data: {
        tenantId,
        type: `workforce.action.${status}`,
        source: 'workforce',
        payload: json({ actionId: id, correlationId: id, kind: existing.kind, decisionBy: actorId }),
      },
    })
    const action = await tx.workforceAction.update({
      where: { id },
      data: {
        status,
        ...(status === 'approved' ? { approvedBy: actorId, approvedAt: new Date() } : {}),
        trailEventIds: json([...stringArray(existing.trailEventIds), event.id]),
      },
    })
    await tx.workspaceAuditEvent.create({
      data: {
        tenantId,
        actorId,
        action: `workforce.action.${status}`,
        workspace: 'workforce',
        module: 'core_workforce',
        entityId: id,
        requestId,
        metadata: json({ kind: action.kind }),
      },
    })
    return action
  })
}

function buildOutcomeAssessment(input: ShortlistingInput, result: ExecutionResult) {
  const matched: string[] = []
  const deviations: Array<{ field: string; expected: string; actual: string }> = []
  if (result.actualStage === input.targetStage) matched.push(`Candidate reached ${input.targetStage}.`)
  else deviations.push({ field: 'candidate.stage', expected: input.targetStage, actual: result.actualStage })
  const expectedInterview = Boolean(input.interview)
  const actualInterview = Boolean(result.interviewId)
  if (expectedInterview === actualInterview) matched.push(expectedInterview ? 'Interview was created as planned.' : 'No interview creation was expected or performed.')
  else deviations.push({ field: 'interview.created', expected: String(expectedInterview), actual: String(actualInterview) })
  return {
    previousStage: input.previousStage,
    targetStage: input.targetStage,
    actualStage: result.actualStage,
    matched,
    deviations,
    summary: deviations.length
      ? `Execution completed with ${deviations.length} deviation(s) from the shortlist simulation.`
      : 'Execution matched the shortlist simulation.',
  }
}

export async function executeWorkforceAction(tenantId: string, actorId: string, id: string, requestId?: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.workforceAction.findFirst({ where: { id, tenantId } })
    if (!existing) throw Object.assign(new Error('Workforce action not found'), { status: 404 })
    assertTransition(existing.status as ActionStatus, 'execute')
    const priorExecution = await tx.workforceActionExecution.findUnique({ where: { actionId: id } })
    if (priorExecution) throw Object.assign(new Error(`Workforce action execution is already ${priorExecution.status}`), { status: 409 })
    const input = record(existing.input) as unknown as ShortlistingInput
    if (existing.kind !== 'candidate.shortlist') throw Object.assign(new Error('Unsupported workforce action kind'), { status: 400 })
    const candidate = await tx.candidate.findFirst({ where: { id: input.candidateId, tenantId } })
    if (!candidate) throw Object.assign(new Error('Candidate not found'), { status: 404 })
    if (candidate.stage !== input.previousStage) throw Object.assign(new Error(`Candidate stage changed since proposal: expected ${input.previousStage}, found ${candidate.stage}`), { status: 409 })
    const claimed = await tx.workforceAction.updateMany({ where: { id, tenantId, status: 'approved' }, data: { status: 'executing' } })
    if (claimed.count !== 1) throw Object.assign(new Error('Workforce action is already being executed'), { status: 409 })

    const updatedCandidate = await tx.candidate.update({ where: { id: candidate.id }, data: { stage: input.targetStage } })
    await tx.pipelineEvent.create({
      data: {
        tenantId,
        candidateId: candidate.id,
        jobId: input.jobId,
        type: 'candidate.stage.changed',
        stageFrom: input.previousStage,
        stageTo: input.targetStage,
        summary: `Candidate ${updatedCandidate.name} moved from ${input.previousStage} to ${input.targetStage} via governed shortlisting.`,
        metadata: json({ actionId: id, governed: true }),
        createdBy: actorId,
      },
    })

    let interviewId: string | undefined
    if (input.interview?.scheduledAt && input.interview.interviewer) {
      const interview = await tx.interview.create({
        data: {
          tenantId,
          candidateId: candidate.id,
          scheduledAt: new Date(input.interview.scheduledAt),
          interviewer: input.interview.interviewer,
          status: 'scheduled',
          createdBy: actorId,
        },
      })
      interviewId = interview.id
      await tx.pipelineEvent.create({
        data: {
          tenantId,
          candidateId: candidate.id,
          jobId: input.jobId,
          type: 'interview.scheduled',
          stageTo: input.targetStage,
          summary: `Interview scheduled for ${updatedCandidate.name} as part of governed shortlisting.`,
          metadata: json({ actionId: id, interviewId, scheduledAt: input.interview.scheduledAt, interviewer: input.interview.interviewer }),
          createdBy: actorId,
        },
      })
    }

    const result: ExecutionResult = {
      candidateId: candidate.id,
      previousStage: input.previousStage,
      targetStage: input.targetStage,
      actualStage: updatedCandidate.stage,
      ...(interviewId ? { interviewId } : {}),
    }
    const outcomeAssessment = buildOutcomeAssessment(input, result)
    const completionEvent = await tx.event.create({
      data: {
        tenantId,
        type: 'workforce.action.completed',
        source: 'workforce',
        payload: json({ actionId: id, correlationId: id, kind: existing.kind, result, outcomeAssessment, executedBy: actorId }),
      },
    })
    const trailEventIds = [...stringArray(existing.trailEventIds), completionEvent.id]
    const action = await tx.workforceAction.update({
      where: { id },
      data: {
        status: 'completed',
        result: json(result),
        outcomeSummary: outcomeAssessment.summary,
        outcomeAssessment: json(outcomeAssessment),
        trailEventIds: json(trailEventIds),
        executedBy: actorId,
        executedAt: new Date(),
      },
    })
    await tx.workforceActionExecution.create({
      data: {
        tenantId,
        actionId: id,
        status: 'completed',
        effects: json(result),
        executedBy: actorId,
        executedAt: new Date(),
      },
    })
    await tx.workspaceAuditEvent.create({
      data: {
        tenantId,
        actorId,
        action: 'workforce.action.completed',
        workspace: 'workforce',
        module: 'core_workforce',
        entityId: id,
        requestId,
        metadata: json({ result, outcomeAssessment }),
      },
    })
    return action
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}

export async function reverseWorkforceActionExecution(tenantId: string, actorId: string, id: string, requestId?: string) {
  return prisma.$transaction(async (tx) => {
    const action = await tx.workforceAction.findFirst({ where: { id, tenantId } })
    if (!action) throw Object.assign(new Error('Workforce action not found'), { status: 404 })
    assertTransition(action.status as ActionStatus, 'reverse')
    const execution = await tx.workforceActionExecution.findFirst({ where: { actionId: id, tenantId } })
    if (!execution) throw Object.assign(new Error('Execution ledger entry not found'), { status: 404 })
    if (execution.status !== 'completed') throw Object.assign(new Error(`Execution is already ${execution.status}`), { status: 409 })
    const claimed = await tx.workforceActionExecution.updateMany({ where: { id: execution.id, status: 'completed' }, data: { status: 'reversing' } })
    if (claimed.count !== 1) throw Object.assign(new Error('Execution reversal is already in progress'), { status: 409 })

    const effects = record(execution.effects) as unknown as ExecutionResult
    const candidate = await tx.candidate.findFirst({ where: { id: effects.candidateId, tenantId } })
    if (!candidate) throw Object.assign(new Error('Candidate not found for reversal'), { status: 404 })
    if (candidate.stage !== effects.targetStage) throw Object.assign(new Error(`Candidate is no longer in ${effects.targetStage}; refusal protects later pipeline work`), { status: 409 })
    await tx.candidate.update({ where: { id: candidate.id }, data: { stage: effects.previousStage } })
    await tx.pipelineEvent.create({
      data: {
        tenantId,
        candidateId: candidate.id,
        jobId: action.sourceJobId,
        type: 'candidate.stage.reverted',
        stageFrom: effects.targetStage,
        stageTo: effects.previousStage,
        summary: `Candidate ${candidate.name} was restored from ${effects.targetStage} to ${effects.previousStage} after governed reversal.`,
        metadata: json({ actionId: id }),
        createdBy: actorId,
      },
    })

    let cancelledInterviewId: string | undefined
    if (effects.interviewId) {
      const updated = await tx.interview.updateMany({
        where: { id: effects.interviewId, tenantId, status: 'scheduled' },
        data: { status: 'cancelled', outcomeNotes: 'Cancelled by governed shortlisting reversal.' },
      })
      if (updated.count !== 1) throw Object.assign(new Error('Interview could not be safely cancelled during reversal'), { status: 409 })
      cancelledInterviewId = effects.interviewId
      await tx.pipelineEvent.create({
        data: {
          tenantId,
          candidateId: candidate.id,
          jobId: action.sourceJobId,
          type: 'interview.cancelled',
          stageTo: effects.previousStage,
          summary: `Interview ${effects.interviewId} was cancelled as part of governed reversal.`,
          metadata: json({ actionId: id, interviewId: effects.interviewId }),
          createdBy: actorId,
        },
      })
    }

    const compensation: CompensationResult = {
      previousStage: effects.previousStage,
      targetStage: effects.targetStage,
      ...(cancelledInterviewId ? { cancelledInterviewId } : {}),
      summary: cancelledInterviewId
        ? `Candidate stage was restored to ${effects.previousStage} and interview ${cancelledInterviewId} was cancelled.`
        : `Candidate stage was restored to ${effects.previousStage}.`,
    }
    const reversalEvent = await tx.event.create({
      data: {
        tenantId,
        type: 'workforce.action.execution.reversed',
        source: 'workforce',
        payload: json({ actionId: id, correlationId: id, compensation, reversedBy: actorId }),
      },
    })
    await tx.workforceActionExecution.update({
      where: { id: execution.id },
      data: { status: 'reversed', compensation: json(compensation), reversedBy: actorId, reversedAt: new Date() },
    })
    const updated = await tx.workforceAction.update({
      where: { id },
      data: { status: 'reversed', trailEventIds: json([...stringArray(action.trailEventIds), reversalEvent.id]) },
    })
    await tx.workspaceAuditEvent.create({
      data: {
        tenantId,
        actorId,
        action: 'workforce.action.execution.reversed',
        workspace: 'workforce',
        module: 'core_workforce',
        entityId: id,
        requestId,
        metadata: json(compensation),
      },
    })
    return updated
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}

export async function getWorkforceActionTrail(tenantId: string, id: string) {
  const action = await prisma.workforceAction.findFirst({ where: { id, tenantId } })
  if (!action) throw Object.assign(new Error('Workforce action not found'), { status: 404 })
  const ids = stringArray(action.trailEventIds)
  if (!ids.length) return []
  return prisma.event.findMany({ where: { id: { in: ids }, tenantId }, orderBy: { createdAt: 'asc' } })
}
