/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Pipeline (CRM/Sales) service contract. Screens depend only on
// `IPipelineService` via `getPipelineService()`.
import { PipelineLead } from '../core-operations-api'
import { useQuantumStore } from '../store'
import { createDemoPipelineService } from './pipelineService.demo'
import { createRealPipelineService } from './pipelineService.real'

export type CreateLeadInput = { companyName: string; stage: string; valuePence: number }

export interface IPipelineService {
  fetchLeads(): Promise<PipelineLead[]>
  createLead(input: CreateLeadInput): Promise<PipelineLead>
  updateLeadStage(id: string, stage: string): Promise<PipelineLead>
}

let demoService: IPipelineService | null = null
let realService: IPipelineService | null = null

export function getPipelineService(): IPipelineService {
  if (useQuantumStore.getState().demoMode) {
    if (!demoService) demoService = createDemoPipelineService()
    return demoService
  }
  if (!realService) realService = createRealPipelineService()
  return realService
}
