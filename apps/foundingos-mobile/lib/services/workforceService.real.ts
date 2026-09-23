/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Live Core.Workforce implementation of IWorkforceService. Thin adapter over
// the Core.Workforce REST client — the seam where a future owner plugs in a
// real ATS/hiring engine without touching workforce.tsx.
import {
  createCandidate,
  createJob,
  decideWorkforceAction,
  executeWorkforceAction,
  listCandidates,
  listJobs,
  listWorkforceActions,
  proposeShortlistingAction,
  reverseWorkforceActionExecution,
} from '../core-workforce-api'
import { IWorkforceService } from './workforceService'

export function createRealWorkforceService(): IWorkforceService {
  return {
    async fetchWorkspace() {
      const [jobs, candidates, actions] = await Promise.all([listJobs(), listCandidates(), listWorkforceActions()])
      return { jobs, candidates, actions }
    },
    createJob: (input) => createJob(input),
    createCandidate: (input) => createCandidate(input),
    proposeShortlist: (input) => proposeShortlistingAction(input),
    decideAction: (id, decision) => decideWorkforceAction(id, decision),
    executeAction: (id) => executeWorkforceAction(id),
    reverseAction: (id) => reverseWorkforceActionExecution(id),
  }
}
