/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// In-memory Demo Mode implementation of IWorkforceService. Owns a mutable
// jobs/candidates/actions state so the Hiring & Pipeline tab works standalone
// without a live Core.Workforce login. Never talks to the network.
import { Candidate, CandidateStage, Job, WorkforceAction } from '../core-workforce-api'
import {
  CreateCandidateInput,
  CreateJobInput,
  IWorkforceService,
  ProposeShortlistInput,
  WorkforceWorkspace,
} from './workforceService'

const HOURS = 60 * 60 * 1000
const isoAgo = (ms: number) => new Date(Date.now() - ms).toISOString()

function seedState(): WorkforceWorkspace {
  return {
    jobs: [
      { id: 'demo-job-1', tenantId: 'demo', title: 'Retail Ops Lead', department: 'Retail Operations', location: 'Manchester, UK', status: 'open', description: 'Own day-to-day store operations across two sites.', createdAt: isoAgo(20 * 24 * HOURS), updatedAt: isoAgo(2 * 24 * HOURS) },
      { id: 'demo-job-2', tenantId: 'demo', title: 'WhatsApp Concierge Associate', department: 'Customer Experience', location: 'Remote', status: 'open', description: 'Handle inbound WhatsApp orders and support during peak hours.', createdAt: isoAgo(12 * 24 * HOURS), updatedAt: isoAgo(1 * 24 * HOURS) },
      { id: 'demo-job-3', tenantId: 'demo', title: 'Warehouse Supervisor', department: 'Logistics', location: 'Leeds, UK', status: 'filled', description: 'Coordinate inbound stock and outbound fulfilment for the Leeds warehouse.', createdAt: isoAgo(60 * 24 * HOURS), updatedAt: isoAgo(10 * 24 * HOURS) },
    ],
    candidates: [
      { id: 'demo-candidate-1', tenantId: 'demo', jobId: 'demo-job-1', name: 'Maya Chen', email: 'maya.chen@example.com', phone: '+44 7700 900111', source: 'Referral', resumeUrl: null, notes: 'Strong retail ops background, 5 years at a similar-sized chain.', stage: 'Interview', createdAt: isoAgo(9 * 24 * HOURS), updatedAt: isoAgo(1 * 24 * HOURS) },
      { id: 'demo-candidate-2', tenantId: 'demo', jobId: 'demo-job-1', name: 'Tom Reyes', email: 'tom.reyes@example.com', phone: null, source: 'Job board', resumeUrl: null, notes: null, stage: 'Applied', createdAt: isoAgo(2 * 24 * HOURS), updatedAt: isoAgo(2 * 24 * HOURS) },
      { id: 'demo-candidate-3', tenantId: 'demo', jobId: 'demo-job-2', name: 'Jordan Blake', email: 'jordan.blake@example.com', phone: '+44 7700 900222', source: 'Referral', resumeUrl: null, notes: 'Ex-customer support lead, fluent in WhatsApp Business workflows.', stage: 'Screening', createdAt: isoAgo(5 * 24 * HOURS), updatedAt: isoAgo(6 * HOURS) },
      { id: 'demo-candidate-4', tenantId: 'demo', jobId: 'demo-job-3', name: 'Sam Okafor', email: 'sam.okafor@example.com', phone: null, source: 'Direct application', resumeUrl: null, notes: 'Hired — started 2 weeks ago.', stage: 'Hired', createdAt: isoAgo(40 * 24 * HOURS), updatedAt: isoAgo(10 * 24 * HOURS) },
    ],
    actions: [
      {
        id: 'demo-wf-action-1', tenantId: 'demo', kind: 'shortlist_candidate', title: 'Advance Maya Chen to Offer',
        summary: 'Maya has cleared two interview rounds with strong feedback — recommend moving to Offer.',
        rationale: 'Interview panel scored 9/10 on role fit; comparable to the last two successful Retail Ops Lead hires.',
        status: 'proposed', requiresApproval: true, sourceCandidateId: 'demo-candidate-1', sourceJobId: 'demo-job-1',
        input: { targetStage: 'Offer' as CandidateStage }, simulationPreview: null, outcomeSummary: null, outcomeAssessment: null,
        trailEventIds: [], proposedBy: 'agent', approvedBy: null, approvedAt: null, executedBy: null, executedAt: null, result: null,
        createdAt: isoAgo(4 * HOURS), updatedAt: isoAgo(4 * HOURS),
      },
      {
        id: 'demo-wf-action-2', tenantId: 'demo', kind: 'shortlist_candidate', title: 'Shortlist Jordan Blake for Interview',
        summary: 'Jordan passed the WhatsApp workflow screening test with a 96% accuracy score.',
        rationale: 'Screening test result exceeds the 90% threshold used for prior concierge hires.',
        status: 'completed', requiresApproval: true, sourceCandidateId: 'demo-candidate-3', sourceJobId: 'demo-job-2',
        input: { targetStage: 'Interview' as CandidateStage }, simulationPreview: null, outcomeSummary: 'Interview scheduled for next week.', outcomeAssessment: null,
        trailEventIds: [], proposedBy: 'agent', approvedBy: 'Alex Founder', approvedAt: isoAgo(30 * HOURS), executedBy: 'Alex Founder', executedAt: isoAgo(28 * HOURS), result: null,
        createdAt: isoAgo(32 * HOURS), updatedAt: isoAgo(28 * HOURS),
      },
    ],
  }
}

export function createDemoWorkforceService(): IWorkforceService {
  let state = seedState()

  return {
    async fetchWorkspace() {
      return state
    },

    async createJob(input: CreateJobInput) {
      const nowIso = new Date().toISOString()
      const job: Job = {
        id: `demo-job-${Date.now()}`, tenantId: 'demo', title: input.title, department: input.department ?? null,
        location: input.location ?? null, status: input.status ?? 'open', description: input.description ?? null,
        createdAt: nowIso, updatedAt: nowIso,
      }
      state = { ...state, jobs: [job, ...state.jobs] }
      return job
    },

    async createCandidate(input: CreateCandidateInput) {
      const nowIso = new Date().toISOString()
      const candidate: Candidate = {
        id: `demo-candidate-${Date.now()}`, tenantId: 'demo', jobId: input.jobId, name: input.name, email: input.email,
        phone: null, source: 'Direct application', resumeUrl: null, notes: null, stage: input.stage ?? 'Applied',
        createdAt: nowIso, updatedAt: nowIso,
      }
      state = { ...state, candidates: [candidate, ...state.candidates] }
      return candidate
    },

    async proposeShortlist(input: ProposeShortlistInput) {
      const nowIso = new Date().toISOString()
      const action: WorkforceAction = {
        id: `demo-wf-action-${Date.now()}`, tenantId: 'demo', kind: 'shortlist_candidate', title: `Advance candidate to ${input.targetStage}`,
        summary: `Move this candidate forward to the ${input.targetStage} stage.`,
        rationale: 'Candidate profile matches the role requirements based on recent screening notes.',
        status: 'proposed', requiresApproval: true, sourceCandidateId: input.candidateId, sourceJobId: input.jobId,
        input: { targetStage: input.targetStage }, simulationPreview: null, outcomeSummary: null, outcomeAssessment: null,
        trailEventIds: [], proposedBy: 'agent', approvedBy: null, approvedAt: null, executedBy: null, executedAt: null, result: null,
        createdAt: nowIso, updatedAt: nowIso,
      }
      state = { ...state, actions: [action, ...state.actions] }
      return action
    },

    async decideAction(id: string, decision: 'approve' | 'reject') {
      const existing = state.actions.find((action) => action.id === id)
      if (!existing) throw new Error('Action not found.')
      const nowIso = new Date().toISOString()
      const updated: WorkforceAction = {
        ...existing,
        status: decision === 'approve' ? 'approved' : 'rejected',
        approvedBy: decision === 'approve' ? 'Alex Founder' : null,
        approvedAt: decision === 'approve' ? nowIso : null,
        updatedAt: nowIso,
      }
      state = { ...state, actions: state.actions.map((action) => (action.id === id ? updated : action)) }
      return updated
    },

    async executeAction(id: string) {
      const existing = state.actions.find((action) => action.id === id)
      if (!existing) throw new Error('Action not found.')
      const nowIso = new Date().toISOString()
      const result: WorkforceAction = { ...existing, status: 'completed', executedBy: 'Alex Founder', executedAt: nowIso, updatedAt: nowIso }
      const actions = state.actions.map((action) => (action.id === id ? result : action))
      const targetStage = (result.input as { targetStage?: CandidateStage }).targetStage
      const candidates = targetStage
        ? state.candidates.map((candidate) => (candidate.id === result.sourceCandidateId ? { ...candidate, stage: targetStage, updatedAt: nowIso } : candidate))
        : state.candidates
      state = { ...state, actions, candidates }
      return result
    },

    async reverseAction(id: string) {
      const existing = state.actions.find((action) => action.id === id)
      if (!existing) throw new Error('Action not found.')
      const updated: WorkforceAction = { ...existing, status: 'reversed', updatedAt: new Date().toISOString() }
      state = { ...state, actions: state.actions.map((action) => (action.id === id ? updated : action)) }
      return updated
    },
  }
}
