/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Workforce service contract. Core.Workforce is a separate backend/auth
// domain from Core.Operations — screens should depend only on
// `IWorkforceService` via `getWorkforceService()`, never on the demo/real
// implementation or the raw API client directly.
import { Candidate, CandidateStage, Job, WorkforceAction } from '../core-workforce-api'
import { useQuantumStore } from '../store'
import { createDemoWorkforceService } from './workforceService.demo'
import { createRealWorkforceService } from './workforceService.real'

export type WorkforceWorkspace = { jobs: Job[]; candidates: Candidate[]; actions: WorkforceAction[] }

export type CreateJobInput = { title: string; department?: string; location?: string; status?: Job['status']; description?: string }
export type CreateCandidateInput = { jobId: string; name: string; email: string; stage?: CandidateStage }
export type ProposeShortlistInput = { jobId: string; candidateId: string; targetStage: CandidateStage }

export interface IWorkforceService {
  fetchWorkspace(): Promise<WorkforceWorkspace>
  createJob(input: CreateJobInput): Promise<Job>
  createCandidate(input: CreateCandidateInput): Promise<Candidate>
  proposeShortlist(input: ProposeShortlistInput): Promise<WorkforceAction>
  decideAction(id: string, decision: 'approve' | 'reject'): Promise<WorkforceAction>
  executeAction(id: string): Promise<WorkforceAction>
  reverseAction(id: string): Promise<WorkforceAction>
}

let demoService: IWorkforceService | null = null
let realService: IWorkforceService | null = null

export function getWorkforceService(): IWorkforceService {
  if (useQuantumStore.getState().demoMode) {
    if (!demoService) demoService = createDemoWorkforceService()
    return demoService
  }
  if (!realService) realService = createRealWorkforceService()
  return realService
}
