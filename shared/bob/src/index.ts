/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router } from 'express'

export interface IntelligenceAIContext {
  app: 'founding-os' | 'founder-os' | 'core_operations' | 'core_intelligence' | 'core_workforce'
  role?: string
  tenantId?: string
}

export type BobContext = IntelligenceAIContext

export const answerIntelligenceAI = (prompt: string, context: IntelligenceAIContext) => {
  const cleaned = prompt.trim()
  if (!cleaned) return 'Ask IntelligenceAI about operations, customers, listings, stock, or system health.'
  const scope = context.tenantId ? ` tenant ${context.tenantId}` : ''
  return `IntelligenceAI is ready in ${context.app}${scope}. Your request was received: ${cleaned}`
}

export const answerBob = answerIntelligenceAI

export const createIntelligenceAIRouter = (app: IntelligenceAIContext['app']) => {
  const router = Router()
  router.get('/status', (_req, res) => res.json({ success: true, data: { app, status: 'ready' } }))
  router.post('/chat', (req, res) => {
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : ''
    if (!prompt.trim()) return res.status(400).json({ success: false, message: 'Prompt is required' })
    const auth = res.locals.auth || {}
    return res.json({ success: true, data: { reply: answerIntelligenceAI(prompt, { app, role: auth.role, tenantId: auth.tenantId }) } })
  })
  return router
}

export const createBobRouter = createIntelligenceAIRouter
