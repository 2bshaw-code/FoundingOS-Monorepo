import { coreApiFetch } from './retail-api'

// Finance Console spec models: Invoice, Payment, PaymentMethod,
// MobileMoneyTransaction, RevenueRecognition, CashFlowPrediction.
export type Invoice = { id: string; number: string; status: string; totalPence: number; dueAt?: string | null; createdAt: string }
export type Payment = { id: string; invoiceId?: string | null; paymentMethodId?: string | null; amountPence: number; status: string; createdAt: string }
export type MobileMoneyTransaction = { id: string; provider: string; reference: string; amountPence: number; status: string; createdAt: string }
export type RevenueRecognitionEntry = { id: string; period: string; amountPence: number; createdAt: string }
export type CashFlowPrediction = { id: string; period: string; predictedInflowPence: number; predictedOutflowPence: number; confidence: number; generatedAt: string }
export type DsoSummary = { avgDaysOutstanding: number; unpaidCount: number; atRiskCount: number; atRiskInvoiceIds: string[] }

export const fetchInvoices = (status?: string) => coreApiFetch<Invoice[]>(`/invoices${status ? `?status=${status}` : ''}`)
export const sendInvoice = (id: string) => coreApiFetch<Invoice>(`/invoices/${id}/send`, { method: 'POST' })
export const partialPayment = (invoiceId: string, amountPence: number) =>
  coreApiFetch<Payment>(`/invoices/${invoiceId}/partial-payment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amountPence }) })

export const fetchPayments = () => coreApiFetch<Payment[]>('/finance/payments')
export const reconcileMobileMoney = (paymentId: string, payload: Record<string, unknown>) =>
  coreApiFetch<Payment>(`/finance/payments/${paymentId}/reconcile-mobile-money`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
export const refundPayment = (paymentId: string, amountPence?: number) =>
  coreApiFetch<Payment>(`/finance/payments/${paymentId}/refund`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amountPence }) })

export const fetchMobileMoneyTransactions = () => coreApiFetch<MobileMoneyTransaction[]>('/finance/mobile-money-transactions')
export const fetchRevenueRecognition = (period?: string) => coreApiFetch<RevenueRecognitionEntry[]>(`/finance/revenue-recognition${period ? `?period=${period}` : ''}`)
export const fetchCashFlowPredictions = () => coreApiFetch<CashFlowPrediction[]>('/finance/cash-flow-predictions')
export const generateCashFlowPrediction = (period: string) =>
  coreApiFetch<CashFlowPrediction>('/finance/cash-flow-predictions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ period }) })
export const fetchDsoSummary = () => coreApiFetch<DsoSummary>('/finance/dso')
