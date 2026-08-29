/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router, type RequestHandler } from 'express'
import { createBobRouter } from '@founder-os/bob'
import { createModuleAccessMiddleware } from '@founder-os/auth'
import { requireMerchantAccess, requireOwnerAccess } from './auth.js'
import { sendWhatsAppText, verifyWebhook, verifyWebhookSignature, whatsappReadiness } from './whatsapp.js'
import { convertLead, createCustomer, createLead, deleteCustomer, getCustomer, listCustomers, pipelineSummary, updateCustomer, updateLeadStage } from './pipeline.js'
import { assignDelivery, createCampaign, createDeliveryOperator, createDeliveryVehicle, createDeliveryZone, createInventoryItem, createInvoice, createOrder, createSocialPost, deleteInventoryItem, detectLocation, generateMedia, operationsSummary, saveLocationProfile, searchInventory, sendInvoice, updateCampaign, updateDeliveryAssignment, updateDeliveryNotification, updateDeliveryOperator, updateDeliveryVehicle, updateDeliveryZone, updateInventoryItem, updateInvoice, updateOrder, updateSocialPost, weatherAt } from './operations.js'
import { addMerchantStaff, merchantWorkspace, ownerMerchantSummary, removeMerchantStaff, resetMerchantPassword, reviewMerchantChange, submitMerchantChange, updateMerchantStaff } from './merchant.js'

const requireTenant: RequestHandler = (_req, res, next) => {
  if (res.locals.auth?.role === 'founder_master') return next()
  if (!res.locals.auth?.tenantId) return res.status(403).json({ success: false, message: 'Tenant context required' })
  next()
}
const requireFoundRetailModule = createModuleAccessMiddleware('foundretail')
const readTenant = (req: { header(name: string): string | undefined }, res: { locals: Record<string, any> }) => res.locals.auth?.role === 'founder_master' ? req.header('x-tenant-id') || undefined : res.locals.auth?.tenantId
const writeTenant = (req: { body?: Record<string, unknown>; header(name: string): string | undefined }, res: { locals: Record<string, any> }) => readTenant(req, res) || String(req.body?.tenantId || '')

export const apiRouter = Router()
apiRouter.get('/status', (_req, res) => res.json({ app: 'foundretail', status: 'operational' }))
apiRouter.get('/whatsapp/webhook', (req, res) => verifyWebhook(req.query['hub.mode'], req.query['hub.verify_token']) ? res.send(String(req.query['hub.challenge'] || '')) : res.status(403).json({ success: false, message: 'Webhook verification failed' }))
apiRouter.post('/whatsapp/webhook', (req, res) => {
  const rawBody = (req as typeof req & { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body || {}))
  if (!verifyWebhookSignature(rawBody, req.get('x-hub-signature-256'))) return res.status(401).json({ success: false, message: 'Invalid webhook signature' })
  res.sendStatus(200)
})
apiRouter.get('/whatsapp/status', requireOwnerAccess, requireTenant, requireFoundRetailModule, (_req, res) => res.json({ success: true, data: whatsappReadiness() }))
apiRouter.post('/whatsapp/messages', requireMerchantAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.status(202).json({ success: true, data: await sendWhatsAppText(req.body?.to, req.body?.text) }) } catch (error) { next(error) }
})
apiRouter.use('/bob', requireMerchantAccess, requireTenant, requireFoundRetailModule, createBobRouter('foundretail'))
apiRouter.get('/console/products', requireMerchantAccess, requireTenant, requireFoundRetailModule, async (_req, res, next) => { try { const data = await merchantWorkspace(res.locals.auth.tenantId, res.locals.auth.id); res.json({ products: data.inventory }) } catch (error) { next(error) } })
apiRouter.get('/console/orders', requireMerchantAccess, requireTenant, requireFoundRetailModule, async (_req, res, next) => { try { const data = await merchantWorkspace(res.locals.auth.tenantId, res.locals.auth.id); res.json({ orders: data.orders }) } catch (error) { next(error) } })
apiRouter.get('/console/customers', requireMerchantAccess, requireTenant, requireFoundRetailModule, async (_req, res, next) => { try { const data = await pipelineSummary(res.locals.auth.tenantId); res.json({ customers: data.customers }) } catch (error) { next(error) } })
apiRouter.get('/console/reports', requireMerchantAccess, requireTenant, requireFoundRetailModule, async (_req, res, next) => { try { const [pipeline, operations] = await Promise.all([pipelineSummary(res.locals.auth.tenantId), operationsSummary(res.locals.auth.tenantId)]); res.json({ reports: { pipeline: pipeline.metrics, operations: operations.metrics } }) } catch (error) { next(error) } })
apiRouter.get('/merchant/workspace', requireMerchantAccess, requireTenant, requireFoundRetailModule, async (_req, res, next) => {
  try { res.json({ success: true, data: await merchantWorkspace(res.locals.auth.tenantId, res.locals.auth.id) }) } catch (error) { next(error) }
})
apiRouter.post('/merchant/changes', requireMerchantAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await submitMerchantChange(res.locals.auth.tenantId, res.locals.auth.id, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.get('/merchants/:id', requireMerchantAccess, requireTenant, requireFoundRetailModule, (req, res) => res.json({ merchant: { id: req.params.id, tenantId: res.locals.auth.tenantId } }))
apiRouter.get('/consoles/:id', requireMerchantAccess, requireTenant, requireFoundRetailModule, (req, res) => res.json({ console: { id: req.params.id, tenantId: res.locals.auth.tenantId } }))
apiRouter.get('/packages/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, (req, res) => res.json({ package: { id: req.params.id, tenantId: res.locals.auth.tenantId } }))
apiRouter.get('/owner/overview', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (_req, res, next) => {
  try { res.json(await pipelineSummary(res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId)) } catch (error) { next(error) }
})
apiRouter.get('/owner/pipeline', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (_req, res, next) => {
  try { res.json({ success: true, data: await pipelineSummary(res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId) }) } catch (error) { next(error) }
})
apiRouter.get('/customers', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await listCustomers(readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.get('/customers/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await getCustomer(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/customers', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createCustomer(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/customers/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateCustomer(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.delete('/customers/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await deleteCustomer(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/leads', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await createLead(req.body || {}, res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId) }) } catch (error) { next(error) }
})
apiRouter.patch('/leads/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateLeadStage(String(req.params.id), req.body?.stage, res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId) }) } catch (error) { next(error) }
})
apiRouter.post('/leads/:id/convert', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await convertLead(String(req.params.id), res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId) }) } catch (error) { next(error) }
})
apiRouter.get('/owner/operations', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await operationsSummary(readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.get('/owner/merchants', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId=readTenant(req,res); if(!tenantId)return res.status(400).json({success:false,message:'Select a company to manage merchants'}); res.json({success:true,data:await ownerMerchantSummary(tenantId)}) } catch(error){next(error)}
})
apiRouter.post('/owner/merchants/staff', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req,res,next)=>{
  try{const tenantId=writeTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.status(201).json({success:true,data:await addMerchantStaff(tenantId,req.body||{})})}catch(error){next(error)}
})
apiRouter.patch('/owner/merchants/staff/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req,res,next)=>{
  try{const tenantId=readTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.json({success:true,data:await updateMerchantStaff(String(req.params.id),tenantId,req.body||{})})}catch(error){next(error)}
})
apiRouter.delete('/owner/merchants/staff/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req,res,next)=>{
  try{const tenantId=readTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.json({success:true,data:await removeMerchantStaff(String(req.params.id),tenantId)})}catch(error){next(error)}
})
apiRouter.post('/owner/merchants/staff/:id/reset-password', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req,res,next)=>{
  try{const tenantId=readTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.json({success:true,data:await resetMerchantPassword(String(req.params.id),tenantId)})}catch(error){next(error)}
})
apiRouter.patch('/owner/merchants/changes/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req,res,next)=>{
  try{const tenantId=readTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.json({success:true,data:await reviewMerchantChange(String(req.params.id),tenantId,res.locals.auth.id,String(req.body?.status||'rejected'),req.body?.note)})}catch(error){next(error)}
})
apiRouter.get('/inventory', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await searchInventory(readTenant(req, res), req.query) }) } catch (error) { next(error) }
})
apiRouter.post('/inventory', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createInventoryItem(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/inventory/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateInventoryItem(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.delete('/inventory/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await deleteInventoryItem(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/orders', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createOrder(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/orders/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateOrder(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/invoices', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createInvoice(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/invoices/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateInvoice(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/invoices/:id/send', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await sendInvoice(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.get('/invoices/:id/download', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = readTenant(req, res); const invoice = await (await import('./auth.js')).prisma.invoice.findFirstOrThrow({ where: { id: String(req.params.id), ...(tenantId ? { tenantId } : {}) } }); res.json({ success: true, data: { filename: `${invoice.number}.txt`, content: `Invoice ${invoice.number}\nStatus: ${invoice.status}\nTotal: GBP ${(invoice.totalPence / 100).toFixed(2)}\n` } }) } catch (error) { next(error) }
})
apiRouter.post('/marketing/campaigns', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createCampaign(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/marketing/campaigns/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateCampaign(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/social/posts', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createSocialPost(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/social/posts/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateSocialPost(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/media/generate', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); const [pipeline, operations] = await Promise.all([pipelineSummary(readTenant(req, res) || tenantId), operationsSummary(readTenant(req, res) || tenantId)]); res.status(201).json({ success: true, data: await generateMedia(tenantId, req.body || {}, { sales: pipeline.metrics, customers: pipeline.customers.slice(0, 20), products: operations.inventory.slice(0, 20), campaigns: operations.campaigns.slice(0, 10), system: { generatedAt: new Date().toISOString() } }) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/operators', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createDeliveryOperator(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/operators/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryOperator(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/vehicles', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createDeliveryVehicle(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/vehicles/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryVehicle(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/zones', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createDeliveryZone(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/zones/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryZone(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/assignments', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await assignDelivery(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/assignments/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryAssignment(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/notifications/:id', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryNotification(String(req.params.id), readTenant(req, res), String(req.body?.status || 'sent')) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/notifications/:id/send', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = readTenant(req, res); const notification = await (await import('./auth.js')).prisma.deliveryNotification.findFirstOrThrow({ where: { id: String(req.params.id), ...(tenantId ? { tenantId } : {}) } }); if (notification.channel === 'whatsapp') await sendWhatsAppText(notification.recipient, notification.message); res.json({ success: true, data: await updateDeliveryNotification(notification.id, tenantId, 'sent') }) } catch (error) { next(error) }
})
apiRouter.post('/location/detect', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { res.json({ success: true, data: await detectLocation(req.body || {}, req.ip) }) } catch (error) { next(error) }
})
apiRouter.put('/location/profile', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.json({ success: true, data: await saveLocationProfile(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.get('/location/weather', requireOwnerAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const location = await detectLocation(req.query, req.ip); res.json({ success: true, data: { location, weather: await weatherAt(location.latitude, location.longitude, location.timezone) } }) } catch (error) { next(error) }
})
apiRouter.get('/owner/staff', requireOwnerAccess, requireTenant, requireFoundRetailModule, (_req, res) => res.json({ staff: [] }))
apiRouter.get('/owner/settings', requireOwnerAccess, requireTenant, requireFoundRetailModule, (_req, res) => res.json({ settings: {} }))
apiRouter.post('/media', requireMerchantAccess, requireTenant, requireFoundRetailModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); const [pipeline, operations] = await Promise.all([pipelineSummary(tenantId), operationsSummary(tenantId)]); res.status(201).json({ success: true, data: await generateMedia(tenantId, req.body || {}, { sales: pipeline.metrics, customers: pipeline.customers.slice(0, 20), products: operations.inventory.slice(0, 20), campaigns: operations.campaigns.slice(0, 10), system: { generatedAt: new Date().toISOString() } }) }) } catch (error) { next(error) }
})
