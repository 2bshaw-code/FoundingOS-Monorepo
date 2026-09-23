/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// In-memory Demo Mode implementation of IPipelineService.
import { PipelineLead } from '../core-operations-api'
import { CreateLeadInput, IPipelineService } from './pipelineService'

const HOURS = 60 * 60 * 1000
const isoAgo = (ms: number) => new Date(Date.now() - ms).toISOString()

function seedLeads(): PipelineLead[] {
  return [
    { id: 'demo-lead-1', companyName: 'Meridian Wholesale', contactName: 'Dana Meridian', stage: 'Proposal', valuePence: 480000, createdAt: isoAgo(9 * 24 * HOURS), updatedAt: isoAgo(1 * HOURS) },
    { id: 'demo-lead-2', companyName: 'Northside Boutiques', contactName: 'Kim Ellis', stage: 'Won', valuePence: 920000, createdAt: isoAgo(21 * 24 * HOURS), updatedAt: isoAgo(9 * HOURS) },
    { id: 'demo-lead-3', companyName: 'Bright Harbor Co', contactName: 'Theo Bright', stage: 'Qualified', valuePence: 210000, createdAt: isoAgo(4 * 24 * HOURS), updatedAt: isoAgo(5 * HOURS) },
    { id: 'demo-lead-4', companyName: 'Alderwood Retail Group', contactName: null, stage: 'Lead', valuePence: 150000, createdAt: isoAgo(1 * 24 * HOURS), updatedAt: isoAgo(1 * 24 * HOURS) },
    { id: 'demo-lead-5', companyName: 'Solace & Co', contactName: 'Priya Solace', stage: 'Proposal', valuePence: 330000, createdAt: isoAgo(6 * 24 * HOURS), updatedAt: isoAgo(20 * HOURS) },
  ]
}

export function createDemoPipelineService(): IPipelineService {
  let leads = seedLeads()

  return {
    async fetchLeads() {
      return leads
    },

    async createLead(input: CreateLeadInput) {
      const nowIso = new Date().toISOString()
      const lead: PipelineLead = {
        id: `demo-lead-${Date.now()}`, companyName: input.companyName, contactName: null, stage: input.stage,
        valuePence: input.valuePence, createdAt: nowIso, updatedAt: nowIso,
      }
      leads = [lead, ...leads]
      return lead
    },

    async updateLeadStage(id: string, stage: string) {
      const existing = leads.find((lead) => lead.id === id)
      if (!existing) throw new Error('Lead not found.')
      const updated: PipelineLead = { ...existing, stage, updatedAt: new Date().toISOString() }
      leads = leads.map((lead) => (lead.id === id ? updated : lead))
      return updated
    },
  }
}
