/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Health Console persistence layer — Patient, Appointment, Record,
// Treatment, MedicalInvoice. See docs/console-requirements.md (Health
// Console section).
import { emitOsEvent, OS_EVENTS } from '@foundingos/config/events'
import { prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'

const text = (value: unknown) => String(value || '').trim()
const number = (value: unknown) => Math.max(0, Number(value || 0))
const date = (value: unknown) => (value ? new Date(String(value)) : undefined)
const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue

export const listPatients = (tenantId?: string) =>
  prisma.patient.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 200 })

export const getPatient = (id: string, tenantId?: string) =>
  prisma.patient.findFirstOrThrow({ where: { id, ...(tenantId ? { tenantId } : {}) }, include: { appointments: true, records: true, invoices: true } })

export const createPatient = (tenantId: string, input: Record<string, unknown>) =>
  prisma.patient.create({
    data: {
      tenantId,
      name: text(input.name),
      dateOfBirth: date(input.dateOfBirth),
      phone: text(input.phone) || undefined,
      email: text(input.email) || undefined,
      notes: text(input.notes) || undefined,
    },
  })

export const updatePatient = (id: string, tenantId: string | undefined, input: Record<string, unknown>) =>
  prisma.patient.update({
    where: { id, ...(tenantId ? { tenantId } : {}) },
    data: {
      ...(input.name !== undefined ? { name: text(input.name) } : {}),
      ...(input.phone !== undefined ? { phone: text(input.phone) || undefined } : {}),
      ...(input.email !== undefined ? { email: text(input.email) || undefined } : {}),
      ...(input.notes !== undefined ? { notes: text(input.notes) || undefined } : {}),
    },
  })

export const listAppointments = (tenantId?: string) =>
  prisma.appointment.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { scheduledAt: 'asc' }, take: 200 })

export const createAppointment = (tenantId: string, input: Record<string, unknown>) =>
  prisma.appointment.create({
    data: {
      tenantId,
      patientId: text(input.patientId),
      clinician: text(input.clinician) || undefined,
      reason: text(input.reason) || undefined,
      scheduledAt: date(input.scheduledAt) || new Date(),
    },
  })

export const updateAppointmentStatus = (id: string, tenantId: string | undefined, status: string) =>
  prisma.appointment.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { status } })

// Predict no-shows: flags appointments with a history of no_show status
// for the same patient as at-risk. A lightweight heuristic placeholder
// for the Core Intelligence "predict no-shows" automation.
export const predictNoShows = async (tenantId?: string) => {
  const where = tenantId ? { tenantId } : {}
  const [upcoming, patients] = await Promise.all([
    prisma.appointment.findMany({ where: { ...where, status: { in: ['scheduled', 'confirmed'] } }, orderBy: { scheduledAt: 'asc' } }),
    prisma.appointment.findMany({ where: { ...where, status: 'no_show' } }),
  ])
  const noShowCountByPatient = patients.reduce<Record<string, number>>((acc, appt) => {
    acc[appt.patientId] = (acc[appt.patientId] || 0) + 1
    return acc
  }, {})
  const atRisk = upcoming.filter((appt) => (noShowCountByPatient[appt.patientId] || 0) >= 1)
  return { atRiskAppointmentIds: atRisk.map((appt) => appt.id), atRiskCount: atRisk.length }
}

export const createRecord = (tenantId: string, input: Record<string, unknown>) =>
  prisma.record.create({
    data: {
      tenantId,
      patientId: text(input.patientId),
      type: text(input.type) || 'note',
      content: json(input.content || {}),
      recordedBy: text(input.recordedBy) || undefined,
    },
  })

export const listRecords = (tenantId: string | undefined, patientId?: string) =>
  prisma.record.findMany({ where: { ...(tenantId ? { tenantId } : {}), ...(patientId ? { patientId } : {}) }, orderBy: { createdAt: 'desc' }, take: 200 })

export const createTreatment = (tenantId: string, input: Record<string, unknown>) =>
  prisma.treatment.create({
    data: {
      tenantId,
      appointmentId: text(input.appointmentId),
      description: text(input.description),
      costPence: number(input.costPence),
    },
  })

export const updateTreatmentStatus = (id: string, tenantId: string | undefined, status: string) =>
  prisma.treatment.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { status } })

export const createMedicalInvoice = (tenantId: string, input: Record<string, unknown>) => {
  const subtotalPence = number(input.subtotalPence)
  const taxPence = number(input.taxPence)
  return prisma.medicalInvoice.create({
    data: {
      tenantId,
      patientId: text(input.patientId),
      number: text(input.number) || `MED-${Date.now()}`,
      subtotalPence,
      taxPence,
      totalPence: subtotalPence + taxPence,
      dueAt: date(input.dueAt),
      items: json(input.items || []),
    },
  })
}

export const sendMedicalInvoice = (id: string, tenantId?: string) =>
  prisma.medicalInvoice.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { status: 'sent', sentAt: new Date() } })

// Sync billing → Finance: marks the medical invoice paid locally and
// emits `billing.synced` so a real cross-service settlement with
// core-operations/backend's Finance module can be built on top without
// this backend needing a direct dependency on it.
export const syncMedicalBillingToFinance = async (id: string, tenantId?: string) => {
  const invoice = await prisma.medicalInvoice.update({ where: { id, ...(tenantId ? { tenantId } : {}) }, data: { status: 'paid', paidAt: new Date() } })
  await emitOsEvent(OS_EVENTS.BILLING_SYNCED, { invoiceId: invoice.id, organisationId: invoice.tenantId, totalPence: invoice.totalPence })
  return invoice
}

export const listMedicalInvoices = (tenantId?: string) =>
  prisma.medicalInvoice.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 200 })

// Auto-flag compliance issues: e.g. appointments left unresolved for over
// 30 days, or invoices unpaid past due date. A lightweight heuristic
// placeholder for the Core Intelligence "auto-flag compliance issues"
// automation.
export const flagComplianceIssues = async (tenantId: string) => {
  const now = Date.now()
  const overdueInvoices = await prisma.medicalInvoice.findMany({ where: { tenantId, status: { not: 'paid' }, dueAt: { lt: new Date() } } })
  const flags = await Promise.all(
    overdueInvoices.map((invoice) =>
      prisma.complianceFlag.create({
        data: { tenantId, entityType: 'invoice', entityId: invoice.id, reason: 'Invoice overdue', severity: 'medium' },
      }),
    ),
  )
  return { flagged: flags.length, generatedAt: new Date(now).toISOString() }
}

export const listComplianceFlags = (tenantId?: string) =>
  prisma.complianceFlag.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 200 })
