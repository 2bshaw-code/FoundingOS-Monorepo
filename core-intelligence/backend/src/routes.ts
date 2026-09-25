import { Router, type RequestHandler } from 'express'
import { createBobRouter } from '@foundingos/bob'
import { createAuthenticatedServiceProxy, createModuleAccessMiddleware } from '@foundingos/service-auth'
import { requireMarketplaceAccount, requireMarketplaceOwner } from './auth.js'
import { recordIdentityResolution, recordIntelligenceEvent, recordMappingQuery, recordMessagingRouteSuccess, recordOrchestrationEvent, recordSuiteActivation } from './telemetry.js'
import { listAnomalies, listRisks, listSignals } from './signals.js'
import { decideRecommendation, executeRecommendation, getRecommendationTrail, listOutcomes, listRecommendations, reverseRecommendation } from './recommendations.js'
import { getCommandCentreSummary } from './command-centre.js'
import { computeAndStoreForecasts, listForecasts } from './forecasts.js'
import { createScenario, listScenarios } from './scenarios.js'
import { CoreOperationsError } from './core-operations-client.js'

export const apiRouter = Router()
const requireIntelligenceModule = createModuleAccessMiddleware('core_intelligence')
const requireTenant: RequestHandler = (_req, res, next) => {
  if (!res.locals.auth?.tenantId) return res.status(403).json({ success: false, message: 'Tenant context required' })
  next()
}
const tenantOf = (res: { locals: Record<string, any> }) => String(res.locals.auth?.tenantId || '')
const actorOf = (res: { locals: Record<string, any> }) => String(res.locals.auth?.id || res.locals.auth?.email || 'core_intelligence')

apiRouter.use((req, _res, next) => {
  recordOrchestrationEvent({ method: req.method, path: req.path })
  if (req.path.includes('mapping')) recordMappingQuery({ method: req.method, path: req.path })
  if (req.path.includes('message')) recordMessagingRouteSuccess({ method: req.method, path: req.path })
  next()
})

apiRouter.get('/status', (_req, res) => {
  recordSuiteActivation({ enabled: true })
  res.json({ app: 'core_intelligence', suite: 'core_intelligence', status: 'operational' })
})

apiRouter.get('/account', requireMarketplaceAccount, (_req, res) => {
  recordIdentityResolution({ authenticated: true })
  res.json({ account: res.locals.auth })
})

// All governed-AI routes below require both a real authenticated identity and a real,
// active TenantSuiteLicense for core_intelligence (enforced by requireIntelligenceModule).
const governed = Router()
governed.use(requireMarketplaceAccount, requireTenant, requireIntelligenceModule)

const forward = (handler: (req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) => Promise<unknown>): RequestHandler => async (req, res, next) => {
  try { res.json({ success: true, data: await handler(req, res) }) }
  catch (error) {
    if (error instanceof CoreOperationsError) return res.status(error.status).json({ success: false, message: error.message })
    next(error)
  }
}

governed.get('/command-centre', forward((req) => getCommandCentreSummary(req)))

governed.get('/signals', forward((req) => listSignals(req)))
governed.get('/risks', forward((req) => listRisks(req)))
governed.get('/anomalies', forward((req) => listAnomalies(req)))

governed.get('/recommendations', forward((req) => listRecommendations(req, typeof req.query.status === 'string' ? req.query.status : undefined)))
governed.get('/recommendations/:id/trail', forward((req) => getRecommendationTrail(req, String(req.params.id))))
governed.post('/recommendations/:id/decision', requireMarketplaceOwner, forward((req, res) => {
  const decision = req.body?.decision === 'reject' ? 'reject' : 'approve'
  return decideRecommendation(req, String(req.params.id), decision).then((data) => {
    recordIntelligenceEvent('orchestration.event', { action: 'recommendation.decision', recommendationId: req.params.id, decision }, tenantOf(res))
    return data
  })
}))
governed.post('/recommendations/:id/execute', requireMarketplaceOwner, forward((req) => executeRecommendation(req, String(req.params.id))))
governed.post('/recommendations/:id/reverse', requireMarketplaceOwner, forward((req) => reverseRecommendation(req, String(req.params.id))))

governed.get('/outcomes', forward((req) => listOutcomes(req)))

governed.get('/forecasts', forward(async (req, res) => listForecasts(tenantOf(res), typeof req.query.metric === 'string' ? req.query.metric : undefined)))
governed.post('/forecasts/refresh', forward((req, res) => computeAndStoreForecasts(req, tenantOf(res), actorOf(res))))

governed.get('/scenarios', forward(async (_req, res) => listScenarios(tenantOf(res))))
governed.post('/scenarios', forward((req, res) => {
  const name = typeof req.body?.name === 'string' && req.body.name.trim() ? req.body.name.trim() : 'Untitled scenario'
  const assumptions = req.body?.assumptions && typeof req.body.assumptions === 'object' ? req.body.assumptions : {}
  return createScenario(req, tenantOf(res), actorOf(res), name, assumptions)
}))

apiRouter.use('/', governed)

apiRouter.use(
  '/bob',
  requireMarketplaceAccount,
  requireIntelligenceModule,
  createBobRouter('core_intelligence'),
)

apiRouter.use(
  '/core/operations',
  requireMarketplaceAccount,
  requireIntelligenceModule,
  createAuthenticatedServiceProxy(
    process.env.CORE_OPERATIONS_API_URL || 'http://127.0.0.1:4001/api/v1/ops',
  ),
)
