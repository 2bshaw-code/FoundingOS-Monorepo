/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Finance Console persistence layer — PaymentMethod, Payment,
// MobileMoneyTransaction, RevenueRecognition, CashFlowPrediction.
// See docs/console-requirements.md (Finance Console section).
import { prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'

const text = (value: unknown) => String(value || '').trim()
const number = (value: unknown) => Math.max(0, Number(value || 0))
const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue

export const listPaymentMethods = (tenantId?: string, customerId?: string) =>
  prisma.paymentMethod.findMany({ where: { ...(tenantId ? { tenantId } : {}), ...(customerId ? { customerId } : {}) }, orderBy: { createdAt: 'desc' } })

export const createPaymentMethod = (tenantId: string, input: Record<string, unknown>) =>
  prisma.paymentMethod.create({
    data: {
      tenantId,
      customerId: text(input.customerId) || undefined,
      type: text(input.type) || 'card',
      provider: text(input.provider) || undefined,
      label: text(input.label) || undefined,
      isDefault: Boolean(input.isDefault),
    },
  })

export const listPayments = (tenantId?: string) =>
  prisma.payment.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 200 })

export const createPayment = (tenantId: string, input: Record<string, unknown>) =>
  prisma.payment.create({
    data: {
      tenantId,
      invoiceId: text(input.invoiceId) || undefined,
      paymentMethodId: text(input.paymentMethodId) || undefined,
      amountPence: number(input.amountPence),
      status: text(input.status) || 'pending',
    },
  })

// Reconciles a payment via mobile money rails (M-Pesa, MTN MoMo, Paystack,
// Flutterwave) or UPI. Creates/links the MobileMoneyTransaction and marks
// both the payment and invoice as reconciled/paid.
export const reconcileMobileMoneyPayment = async (tenantId: string, paymentId: string, input: Record<string, unknown>) => {
  const transaction = await prisma.mobileMoneyTransaction.create({
    data: {
      tenantId,
      paymentId,
      provider: text(input.provider) || 'm_pesa',
      reference: text(input.reference) || `MM-${Date.now()}`,
      msisdn: text(input.msisdn) || undefined,
      amountPence: number(input.amountPence),
      status: 'reconciled',
      rawPayload: json(input.rawPayload || {}),
      reconciledAt: new Date(),
    },
  })
  const payment = await prisma.payment.update({ where: { id: paymentId, tenantId }, data: { status: 'reconciled', reconciledAt: new Date() } })
  if (payment.invoiceId) {
    await prisma.invoice.update({ where: { id: payment.invoiceId, tenantId }, data: { status: 'paid', paidAt: new Date() } })
  }
  return { payment, transaction }
}

export const listMobileMoneyTransactions = (tenantId?: string) =>
  prisma.mobileMoneyTransaction.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { createdAt: 'desc' }, take: 200 })

export const recognizeRevenue = (tenantId: string, input: Record<string, unknown>) =>
  prisma.revenueRecognition.create({
    data: {
      tenantId,
      invoiceId: text(input.invoiceId) || undefined,
      recognizedPence: number(input.recognizedPence),
      period: text(input.period) || new Date().toISOString().slice(0, 7),
    },
  })

export const listRevenueRecognition = (tenantId?: string, period?: string) =>
  prisma.revenueRecognition.findMany({ where: { ...(tenantId ? { tenantId } : {}), ...(period ? { period } : {}) }, orderBy: { recognizedAt: 'desc' } })

// DSO (Days Sales Outstanding) computed from unpaid invoices — used by the
// Cash Flow Forecast screen and predict-payment-dates automation.
export const dsoSummary = async (tenantId?: string) => {
  const where = tenantId ? { tenantId } : {}
  const invoices = await prisma.invoice.findMany({ where })
  const unpaid = invoices.filter((invoice) => invoice.status !== 'paid' && invoice.dueAt)
  const now = Date.now()
  const avgDaysOutstanding = unpaid.length
    ? Math.round(unpaid.reduce((sum, invoice) => sum + Math.max(0, (now - new Date(invoice.dueAt as Date).getTime()) / 86_400_000), 0) / unpaid.length)
    : 0
  const atRiskInvoices = unpaid.filter((invoice) => invoice.dueAt && new Date(invoice.dueAt).getTime() < now)
  return { avgDaysOutstanding, unpaidCount: unpaid.length, atRiskCount: atRiskInvoices.length, atRiskInvoiceIds: atRiskInvoices.map((invoice) => invoice.id) }
}

export const generateCashFlowPrediction = async (tenantId: string, period: string) => {
  const where = { tenantId, ...(period ? {} : {}) }
  const invoices = await prisma.invoice.findMany({ where })
  const predictedInflowPence = invoices.filter((invoice) => invoice.status !== 'paid').reduce((sum, invoice) => sum + invoice.totalPence, 0)
  const payments = await prisma.payment.findMany({ where: { tenantId, status: 'pending' } })
  const predictedOutflowPence = payments.reduce((sum, payment) => sum + payment.amountPence, 0)
  return prisma.cashFlowPrediction.create({
    data: { tenantId, period, predictedInflowPence, predictedOutflowPence, confidence: invoices.length ? 0.75 : 0.4 },
  })
}

export const listCashFlowPredictions = (tenantId?: string) =>
  prisma.cashFlowPrediction.findMany({ where: tenantId ? { tenantId } : {}, orderBy: { generatedAt: 'desc' }, take: 24 })
