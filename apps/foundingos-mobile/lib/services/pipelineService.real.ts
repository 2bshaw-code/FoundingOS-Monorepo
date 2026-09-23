/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Live Core.Operations implementation of IPipelineService.
import { createPipelineLead, fetchPipelineLeads, updatePipelineLeadStage } from '../core-operations-api'
import { IPipelineService } from './pipelineService'

export function createRealPipelineService(): IPipelineService {
  return {
    fetchLeads: () => fetchPipelineLeads(),
    createLead: (input) => createPipelineLead(input),
    updateLeadStage: (id, stage) => updatePipelineLeadStage(id, stage),
  }
}
