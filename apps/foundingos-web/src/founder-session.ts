const encoder = new TextEncoder()
const decoder = new TextDecoder()

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '='))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

export async function verifyFounderSession(token: string | undefined, secret: string | undefined) {
  if (!token || !secret) return false
  const [payloadPart, signaturePart] = token.split('.')
  if (!payloadPart || !signaturePart) return false
  try {
    const payload = decoder.decode(fromBase64Url(payloadPart))
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(signaturePart), encoder.encode(payload))
    if (!valid) return false
    const [scope, id] = payload.split(':')
    return scope === 'admin' && id === 'super-founder-admin'
  } catch {
    return false
  }
}
