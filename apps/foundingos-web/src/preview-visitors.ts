import { createHash } from 'node:crypto'
import { getPrismaClient } from '@foundingos/db'

type PreviewVisit = {
  email: string
  returnPath: string
  referrer: string | null
  userAgent: string | null
  clientAddress: string
}

const optionalText = (value: string | null, limit: number) => value?.trim().slice(0, limit) || null

export async function recordPreviewVisit(visit: PreviewVisit) {
  const prisma = getPrismaClient()
  if (!prisma) throw new Error('Preview visitor tracking requires DATABASE_URL')
  const now = new Date()
  const ipSecret = process.env.SITE_ACCESS_SECRET?.trim()
  if (!ipSecret) throw new Error('SITE_ACCESS_SECRET is required for visitor tracking')
  const lastIpHash = createHash('sha256').update(`${ipSecret}:${visit.clientAddress}`).digest('hex')

  await prisma.previewVisitor.upsert({
    where: { email: visit.email },
    create: {
      email: visit.email,
      firstSignedInAt: now,
      lastSignedInAt: now,
      lastReturnPath: visit.returnPath,
      lastReferrer: optionalText(visit.referrer, 500),
      lastUserAgent: optionalText(visit.userAgent, 500),
      lastIpHash,
    },
    update: {
      signInCount: { increment: 1 },
      lastSignedInAt: now,
      lastReturnPath: visit.returnPath,
      lastReferrer: optionalText(visit.referrer, 500),
      lastUserAgent: optionalText(visit.userAgent, 500),
      lastIpHash,
    },
  })
}
