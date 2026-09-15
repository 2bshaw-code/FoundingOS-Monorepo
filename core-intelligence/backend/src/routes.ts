import { Router } from 'express'
import { createBobRouter } from '@founder-os/bob'
import { createAuthenticatedServiceProxy, createModuleAccessMiddleware } from '@founder-os/auth'
import { requireMarketplaceAccount } from './auth.js'
import { recordIdentityResolution, recordMappingQuery, recordMessagingRouteSuccess, recordOrchestrationEvent, recordSuiteActivation } from './telemetry.js'

export const apiRouter = Router()
const requireIntelligenceModule = createModuleAccessMiddleware('core_intelligence')
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
