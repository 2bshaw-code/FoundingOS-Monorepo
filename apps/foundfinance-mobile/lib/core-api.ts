/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { authedFetch } from './api'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

// Points at core-operations/backend's Finance Console API (PaymentMethod,
// Payment, MobileMoneyTransaction, RevenueRecognition, CashFlowPrediction —
// see docs/console-requirements.md). This is separate from GROWTH_CONSOLE_URL
// (the legacy per-brand demo feed in cashflow.ts) — CORE_API_BASE is the real
// FoundingOS Core.Operations backend that now backs mobile money reconciliation,
// DSO tracking, and cash flow prediction.
export const CORE_API_BASE = 'https://core-operations-api.foundingos.com/api/v1'

export type PaymentMethod = { id: string; type: string; provider?: string; label?: string; isDefault: boolean }
export type Payment = { id: string; invoiceId?: string; paymentMethodId?: string; amountPence: number; status: string; reconciledAt?: string }
export type MobileMoneyTransaction = { id: string; paymentId: string; provider: string; reference: string; msisdn?: string; amountPence: number; status: string; reconciledAt?: string }
export type DsoSummary = { averageDaysSalesOutstanding: number; outstandingInvoiceCount: number; totalOutstandingPence: number }
export type CashFlowPrediction = { id: string; predictedAt: string; horizonDays: number; predictedInflowPence: number; predictedOutflowPence: number }

async function coreApiFetch<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  if (IS_DEMO_MODE) return null
  try {
    const response = await authedFetch(`${CORE_API_BASE}${path}`, init)
    if (!response.ok) return null
    const data = await response.json().catch(() => null)
    return (data?.data ?? null) as T | null
  } catch {
    return null
  }
}

export const fetchPaymentMethods = () => coreApiFetch<PaymentMethod[]>('/finance/payment-methods')
export const fetchPayments = () => coreApiFetch<Payment[]>('/finance/payments')
export const fetchMobileMoneyTransactions = () => coreApiFetch<MobileMoneyTransaction[]>('/finance/mobile-money-transactions')
export const fetchDsoSummary = () => coreApiFetch<DsoSummary>('/finance/dso')
export const fetchCashFlowPredictions = () => coreApiFetch<CashFlowPrediction[]>('/finance/cash-flow-predictions')

export const reconcileMobileMoneyPayment = (paymentId: string, input: { provider?: string; reference?: string; msisdn?: string; amountPence?: number }) =>
  coreApiFetch<{ payment: Payment; transaction: MobileMoneyTransaction }>(`/finance/payments/${paymentId}/reconcile-mobile-money`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
