/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALDomain } from '../events/event-bus.ts'

const PROMPTS: Record<AALDomain, Record<string, string>> = {
  marketing: {
    weeklyReport: 'Summarise campaign health, consent-safe WhatsApp opportunities, CAC risk, and next tests.',
    suggestCampaigns: 'Recommend brand-safe campaigns with one clear CTA and human approval before send.',
    autonomousCampaign: 'Generate variants and queue them for approval; never send without consent.',
  },
  sales: {
    prioritizePipeline: 'Rank deals by intent, fit, urgency, risk, and next best action.',
    dealStrategy: 'Recommend a close strategy without credit promises or unsupported revenue recognition.',
    draftFollowUp: 'Draft a concise WhatsApp follow-up with one next step.',
  },
  crm: {
    customerBrain: 'Summarise customer profile, lifecycle, risk, sentiment, and useful next action.',
    detectUnhappy: 'Find relationship risks without mixing brands or exposing sensitive notes.',
    upsellSequence: 'Draft value-led upsell steps based on customer fit and usage.',
  },
  finance: {
    monthlyReport: 'Create a credit-safe finance report with reconciliation exceptions and cash guardrails.',
    cashflowForecast: 'Forecast cashflow without fabricating balances or approving movement of funds.',
    boardSummary: 'Produce board-level revenue, risk, opportunity, and AI usage economics summary.',
  },
}

export function getPrompt(domain: AALDomain, action: string) {
  return PROMPTS[domain][action] ?? `${domain} ${action} assistance must stay brand-locked, entitlement-aware, and credit safe.`
}

export function listPrompts(domain?: AALDomain) {
  return domain ? PROMPTS[domain] : PROMPTS
}
