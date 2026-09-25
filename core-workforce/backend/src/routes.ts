/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router, type RequestHandler } from 'express'
import { createModuleAccessMiddleware } from '@foundingos/service-auth'
import { requireDecisionApprovalAccess, requireExecutionAccess, requireWorkforceAccess } from './auth.js'
import { createCandidate, createInterview, createJob, deleteCandidate, deleteInterview, deleteJob, getCandidate, getInterview, getJob, listCandidates, listInterviews, listJobs, updateCandidate, updateInterview, updateJob } from './workforce.js'
import { decideWorkforceAction, executeWorkforceAction, getWorkforceActionTrail, listWorkforceActions, proposeApplicantShortlistingAction, proposeWorkforceAction, reverseWorkforceActionExecution } from './workforce-actions.js'
import { emitTelemetry } from './telemetry-emitter.js'

const requireTenant: RequestHandler = (_req, res, next) => {
  if (res.locals.auth?.role === 'founder_master') return next()
  if (!res.locals.auth?.tenantId) return res.status(403).json({ success: false, message: 'Tenant context required' })
  next()
}
const requireCoreWorkforceModule = createModuleAccessMiddleware('core_workforce')
const readTenant = (req: { header(name: string): string | undefined }, res: { locals: Record<string, any> }) =>
  res.locals.auth?.role === 'founder_master' ? req.header('x-tenant-id') || undefined : res.locals.auth?.tenantId
const writeTenant = (req: { body?: Record<string, unknown>; header(name: string): string | undefined }, res: { locals: Record<string, any> }) =>
  readTenant(req, res) || String(req.body?.tenantId || '')

export const apiRouter = Router()
apiRouter.get('/status', (_req, res) => res.json({ app: 'core_workforce', status: 'operational' }))

apiRouter.get('/jobs', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listJobs(tenantId, typeof req.query.status === 'string' ? req.query.status : undefined) })
  } catch (error) { next(error) }
})
apiRouter.post('/jobs', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const data = await createJob(tenantId, req.body || {})
    emitTelemetry(tenantId, 'record.created', { module: 'jobs' })
    res.status(201).json({ success: true, data })
  } catch (error) { next(error) }
})
apiRouter.get('/jobs/:id', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await getJob(tenantId, String(req.params.id)) })
  } catch (error) { next(error) }
})
apiRouter.patch('/jobs/:id', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await updateJob(tenantId, String(req.params.id), req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.delete('/jobs/:id', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await deleteJob(tenantId, String(req.params.id)) })
  } catch (error) { next(error) }
})

apiRouter.get('/candidates', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({
      success: true,
      data: await listCandidates(tenantId, {
        jobId: typeof req.query.jobId === 'string' ? req.query.jobId : undefined,
        stage: typeof req.query.stage === 'string' ? req.query.stage : undefined,
      }),
    })
  } catch (error) { next(error) }
})
apiRouter.post('/candidates', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await createCandidate(tenantId, res.locals.auth.id, req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.get('/candidates/:id', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await getCandidate(tenantId, String(req.params.id)) })
  } catch (error) { next(error) }
})
apiRouter.patch('/candidates/:id', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await updateCandidate(tenantId, res.locals.auth.id, String(req.params.id), req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.delete('/candidates/:id', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await deleteCandidate(tenantId, String(req.params.id)) })
  } catch (error) { next(error) }
})

apiRouter.get('/interviews', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({
      success: true,
      data: await listInterviews(tenantId, {
        candidateId: typeof req.query.candidateId === 'string' ? req.query.candidateId : undefined,
        status: typeof req.query.status === 'string' ? req.query.status : undefined,
      }),
    })
  } catch (error) { next(error) }
})
apiRouter.post('/interviews', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await createInterview(tenantId, res.locals.auth.id, req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.get('/interviews/:id', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await getInterview(tenantId, String(req.params.id)) })
  } catch (error) { next(error) }
})
apiRouter.patch('/interviews/:id', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await updateInterview(tenantId, res.locals.auth.id, String(req.params.id), req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.delete('/interviews/:id', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await deleteInterview(tenantId, String(req.params.id)) })
  } catch (error) { next(error) }
})

apiRouter.get('/platform/workforce-actions', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listWorkforceActions(tenantId, typeof req.query.status === 'string' ? req.query.status : undefined) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/workforce-actions/shortlisting', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await proposeApplicantShortlistingAction(tenantId, res.locals.auth.id, req.body || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/workforce-actions/proposals', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await proposeWorkforceAction(tenantId, res.locals.auth.id, String(req.body?.kind || ''), (req.body?.input || {}) as Record<string, unknown>, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/workforce-actions/:id/decision', requireDecisionApprovalAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const data = await decideWorkforceAction(tenantId, res.locals.auth.id, String(req.params.id), req.body?.decision, res.locals.requestId)
    emitTelemetry(tenantId, 'workforce_action.decision', { actionId: String(req.params.id), decision: String(req.body?.decision || '') })
    res.json({ success: true, data })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/workforce-actions/:id/execute', requireExecutionAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await executeWorkforceAction(tenantId, res.locals.auth.id, String(req.params.id), res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/workforce-actions/:id/reverse', requireExecutionAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await reverseWorkforceActionExecution(tenantId, res.locals.auth.id, String(req.params.id), res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/workforce-actions/:id/trail', requireWorkforceAccess, requireTenant, requireCoreWorkforceModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await getWorkforceActionTrail(tenantId, String(req.params.id)) })
  } catch (error) { next(error) }
})
