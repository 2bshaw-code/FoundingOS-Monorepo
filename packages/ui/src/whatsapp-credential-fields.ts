export const whatsAppCredentialFields: Record<string, { label: string; hint: string }> = {
  accessToken: { label: 'Access token', hint: 'Meta API Setup for testing; a system-user token with assigned business assets for production.' },
  phoneNumberId: { label: 'Phone number ID', hint: 'Copy the Phone number ID from Meta API Setup. This is not the displayed phone number.' },
  verifyToken: { label: 'Verify token', hint: 'Choose your own random value. Use this exact value again when verifying the callback in Meta.' },
  appSecret: { label: 'App secret', hint: 'Meta app settings → Basic → App secret. Used to validate signed incoming webhooks.' },
  businessAccountId: { label: 'WhatsApp Business Account ID (optional)', hint: 'Shown in Meta API Setup. This is different from the Phone number ID.' },
}
