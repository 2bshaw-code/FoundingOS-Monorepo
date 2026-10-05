import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

export type GmailPart = {
  mimeType?: string
  filename?: string
  body?: { data?: string; attachmentId?: string; size?: number }
  parts?: GmailPart[]
}

export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Unexpected response')
  return value as Record<string, unknown>
}

export function seal(value: unknown, key: Buffer): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url')
}

export function unseal(value: string, key: Buffer): unknown {
  const data = Buffer.from(value, 'base64url')
  if (data.length < 29) throw new Error('Invalid connection')
  const decipher = createDecipheriv('aes-256-gcm', key, data.subarray(0, 12))
  decipher.setAuthTag(data.subarray(12, 28))
  return JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString('utf8'))
}

export function readPart(value: unknown, depth = 0): GmailPart {
  if (depth > 20) throw new Error('This email has too many nested parts')
  const part = object(value)
  const body = part.body ? object(part.body) : {}
  return {
    mimeType: typeof part.mimeType === 'string' ? part.mimeType : undefined,
    filename: typeof part.filename === 'string' ? part.filename : undefined,
    body: {
      data: typeof body.data === 'string' ? body.data : undefined,
      attachmentId: typeof body.attachmentId === 'string' ? body.attachmentId : undefined,
      size: typeof body.size === 'number' ? body.size : undefined,
    },
    parts: Array.isArray(part.parts) ? part.parts.map((child) => readPart(child, depth + 1)) : [],
  }
}

export function emailContent(part: GmailPart): { text: string; attachments: { id: string; filename: string; size: number }[] } {
  const text: string[] = []
  const attachments: { id: string; filename: string; size: number }[] = []
  function visit(node: GmailPart) {
    if (node.filename && node.body?.attachmentId) {
      attachments.push({ id: node.body.attachmentId, filename: node.filename, size: node.body.size ?? 0 })
    } else if (node.mimeType === 'text/plain' && node.body?.data) {
      text.push(Buffer.from(node.body.data, 'base64url').toString('utf8'))
    }
    node.parts?.forEach(visit)
  }
  visit(part)
  return { text: text.join('\n').slice(0, 30000), attachments }
}

export function expenseInput(value: unknown) {
  const body = object(value)
  const text = (key: string, max: number) => {
    const field = body[key]
    if (typeof field !== 'string' || !field.trim() || field.trim().length > max) throw new Error(`Check ${key}`)
    return field.trim()
  }
  const messageId = text('messageId', 100)
  if (!/^[a-zA-Z0-9_-]+$/.test(messageId)) throw new Error('Check the selected email')
  const supplier = text('supplier', 200)
  const invoiceNumber = text('invoiceNumber', 200)
  const amount = text('amount', 20)
  if (!/^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) throw new Error('Enter a positive amount with up to two decimal places')
  const currency = text('currency', 3).toUpperCase()
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('Enter a three-letter currency code')
  try {
    new Intl.NumberFormat('en', { style: 'currency', currency })
  } catch {
    throw new Error('Check the currency code')
  }
  const date = text('date', 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Enter the invoice date')
  const invoiceDate = new Date(`${date}T00:00:00.000Z`)
  if (!Number.isFinite(invoiceDate.getTime()) || invoiceDate.toISOString().slice(0, 10) !== date) throw new Error('Check the invoice date')
  return { messageId, supplier, invoiceNumber, amount, currency, invoiceDate }
}
