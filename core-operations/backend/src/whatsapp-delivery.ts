export type WhatsAppDelivery = { phoneNumberId: string; id: string; status: 'sent' | 'delivered' | 'read' | 'failed' }
export function extractWhatsAppDeliveries(payload: unknown): WhatsAppDelivery[] {
  if (!payload || typeof payload !== 'object' || !('entry' in payload) || !Array.isArray(payload.entry)) return []
  const result: WhatsAppDelivery[] = []
  for (const entry of payload.entry) {
    if (!Array.isArray(entry?.changes)) continue
    for (const change of entry.changes) {
      const value = change?.value
      const phoneNumberId = value?.metadata?.phone_number_id
      if (typeof phoneNumberId !== 'string' || !Array.isArray(value?.statuses)) continue
      for (const item of value.statuses) {
        if (typeof item?.id === 'string' && ['sent', 'delivered', 'read', 'failed'].includes(item.status)) result.push({ phoneNumberId, id: item.id, status: item.status })
      }
    }
  }
  return result
}

export function assertWebhookPhone(expected: string | undefined, actual: string) {
  if (expected && expected !== actual) throw Object.assign(new Error('Webhook phone number does not match this company.'), { status: 403 })
}

export function statusesNotToDowngrade(status: WhatsAppDelivery['status']) {
  switch (status) {
    case 'sent': return ['sent', 'delivered', 'read']
    case 'delivered': return ['delivered', 'read']
    case 'read': return ['read']
    case 'failed': return ['delivered', 'read']
  }
}
