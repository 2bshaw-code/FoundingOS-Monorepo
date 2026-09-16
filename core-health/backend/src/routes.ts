/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router, type RequestHandler } from 'express'
import { createBobRouter } from '@founder-os/bob'
import { createModuleAccessMiddleware } from '@founder-os/auth'
import { requireClinicAccess, requireOwnerAccess } from './auth.js'
import {
  createAppointment,
  createMedicalInvoice,
  createPatient,
  createRecord,
  createTreatment,
  flagComplianceIssues,
  getPatient,
  listAppointments,
  listComplianceFlags,
  listMedicalInvoices,
  listPatients,
  listRecords,
  predictNoShows,
  sendMedicalInvoice,
  syncMedicalBillingToFinance,
  updateAppointmentStatus,
  updatePatient,
  updateTreatmentStatus,
} from './health.js'

const requireTenant: RequestHandler = (_req, res, next) => {
  if (res.locals.auth?.role === 'founder_master') return next()
  if (!res.locals.auth?.tenantId) return res.status(403).json({ success: false, message: 'Tenant context required' })
  next()
}
const requireCoreHealthModule = createModuleAccessMiddleware('core_health')
const readTenant = (req: { header(name: string): string | undefined }, res: { locals: Record<string, any> }) =>
  res.locals.auth?.role === 'founder_master' ? req.header('x-tenant-id') || undefined : res.locals.auth?.tenantId
const writeTenant = (req: { body?: Record<string, unknown>; header(name: string): string | undefined }, res: { locals: Record<string, any> }) =>
  readTenant(req, res) || String(req.body?.tenantId || '')

export const apiRouter = Router()
apiRouter.get('/status', (_req, res) => res.json({ app: 'core_health', status: 'operational' }))
apiRouter.use('/bob', requireClinicAccess, requireTenant, requireCoreHealthModule, createBobRouter('core_health'))

apiRouter.get('/patients', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await listPatients(readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.get('/patients/:id', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await getPatient(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/patients', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createPatient(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/patients/:id', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updatePatient(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})

apiRouter.get('/appointments', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await listAppointments(readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/appointments', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createAppointment(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/appointments/:id/status', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateAppointmentStatus(String(req.params.id), readTenant(req, res), String(req.body?.status || 'scheduled')) }) } catch (error) { next(error) }
})
apiRouter.get('/appointments/predict-no-shows', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await predictNoShows(readTenant(req, res)) }) } catch (error) { next(error) }
})

apiRouter.get('/records', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await listRecords(readTenant(req, res), req.query.patientId ? String(req.query.patientId) : undefined) }) } catch (error) { next(error) }
})
apiRouter.post('/records', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createRecord(tenantId, req.body || {}) }) } catch (error) { next(error) }
})

apiRouter.post('/treatments', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createTreatment(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/treatments/:id/status', requireClinicAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateTreatmentStatus(String(req.params.id), readTenant(req, res), String(req.body?.status || 'planned')) }) } catch (error) { next(error) }
})

apiRouter.get('/billing', requireOwnerAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await listMedicalInvoices(readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/billing', requireOwnerAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createMedicalInvoice(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/billing/:id/send', requireOwnerAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await sendMedicalInvoice(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/billing/:id/sync-to-finance', requireOwnerAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await syncMedicalBillingToFinance(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})

apiRouter.get('/compliance/flags', requireOwnerAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { res.json({ success: true, data: await listComplianceFlags(readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/compliance/flag-issues', requireOwnerAccess, requireTenant, requireCoreHealthModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.json({ success: true, data: await flagComplianceIssues(tenantId) }) } catch (error) { next(error) }
})
