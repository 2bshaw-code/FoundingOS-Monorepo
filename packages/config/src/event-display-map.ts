/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type InsightType = 'prediction' | 'risk' | 'anomaly' | 'suggestion'

export const EVENT_DISPLAY_MAP: Record<string, { title: string; icon: string }> = {
  'order.confirmed': { title: 'Order Confirmed', icon: '🛒' },
  'inventory.low': { title: 'Inventory Low', icon: '📉' },
  'shipment.created': { title: 'Shipment Created', icon: '🚚' },
  'delivery.completed': { title: 'Delivery Completed', icon: '✅' },
  'invoice.generated': { title: 'Invoice Generated', icon: '🧾' },
  'payment.received': { title: 'Payment Received', icon: '💰' },
  'payroll.run': { title: 'Payroll Run', icon: '👥' },
  'timesheet.approved': { title: 'Timesheet Approved', icon: '⏱️' },
  'appointment.created': { title: 'Appointment Created', icon: '📅' },
  'medical.billing.generated': { title: 'Medical Billing Generated', icon: '🏥' },
}

export const INSIGHT_DISPLAY_MAP: Record<InsightType, { title: string; icon: string; color: string }> = {
  prediction: { title: 'Predictions', icon: '🔮', color: '#60a5fa' },
  risk: { title: 'Risk Flags', icon: '⚠️', color: '#f97316' },
  anomaly: { title: 'Anomalies', icon: '🧭', color: '#f43f5e' },
  suggestion: { title: 'Suggestions', icon: '💡', color: '#22c55e' },
}

export const eventDisplayTitle = (type: string) => EVENT_DISPLAY_MAP[type]?.title ?? type
export const eventDisplayIcon = (type: string) => EVENT_DISPLAY_MAP[type]?.icon ?? '•'
