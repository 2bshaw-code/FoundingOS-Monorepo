/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import * as Linking from 'expo-linking'
import { enqueueOutboxAction } from './outbox-sync'

export async function openWhatsAppChat(phoneNumber: string, message: string, brandSlug: string = 'retail') {
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '')
  const encodedText = encodeURIComponent(message)
  const url = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedText}`

  // Record action in offline SQLite outbox first
  await enqueueOutboxAction('WHATSAPP_NATIVE_SEND', brandSlug, {
    phoneNumber: cleanPhone,
    message,
    url,
    dispatchedAt: Date.now(),
  })

  // Open native WhatsApp app or web fallback
  const canOpen = await Linking.canOpenURL(url).catch(() => false)
  if (canOpen) {
    await Linking.openURL(url)
  } else {
    // Fallback URL opening
    await Linking.openURL(url).catch((err) => console.warn('Could not open WhatsApp URL:', err))
  }
}

export function generatePaymentWhatsAppMessage(amount: number, currency: string, reference: string): string {
  return `👋 Hi there! Your invoice ${reference} for ${amount} ${currency} is ready. Click to pay securely via M-Pesa, Card, or Stablecoins: https://pay.foundingos.com/${reference}`
}

export function generateOrderConfirmedWhatsAppMessage(orderId: string, itemsCount: number): string {
  return `📦 Order Confirmed! Your order ${orderId} (${itemsCount} items) has been logged in FoundingOS and is being prepared for dispatch.`
}
