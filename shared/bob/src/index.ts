/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router } from 'express'

export interface FoundAIContext {
  app: 'founding-os' | 'founder-os' | 'foundretail' | 'foundcrypto' | 'foundthis' | 'foundit' | 'foundmeat' | 'foundtalent'
  role?: string
  tenantId?: string
}

export type BobContext = FoundAIContext

export const answerFoundAI = (prompt: string, context: FoundAIContext) => {
  const cleaned = prompt.trim()
  if (!cleaned) return 'Ask FoundAI about operations, customers, listings, stock, or system health.'
  const scope = context.tenantId ? ` tenant ${context.tenantId}` : ''
  return `FoundAI is ready in ${context.app}${scope}. Your request was received: ${cleaned}`
}

export const answerBob = answerFoundAI

export const createFoundAIRouter = (app: FoundAIContext['app']) => {
  const router = Router()
  router.get('/status', (_req, res) => res.json({ success: true, data: { app, status: 'ready' } }))
  router.post('/chat', (req, res) => {
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : ''
    if (!prompt.trim()) return res.status(400).json({ success: false, message: 'Prompt is required' })
    const auth = res.locals.auth || {}
    return res.json({ success: true, data: { reply: answerFoundAI(prompt, { app, role: auth.role, tenantId: auth.tenantId }) } })
  })
  return router
}

export const createBobRouter = createFoundAIRouter
