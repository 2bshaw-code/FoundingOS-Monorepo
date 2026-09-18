import { getPrismaClient } from '@foundingos/db'

export const visitorRoles = ['Founder / owner', 'Operator / team leader', 'Potential buyer', 'Investor', 'Advisor', 'Friend or family'] as const
export const teamSizes = ['Just me', '2–10', '11–50', '51–250', '251+'] as const
export const workspaceOptions = ['Retail', 'Logistics', 'Finance', 'Marketing', 'Talent', 'Health', 'Intelligence'] as const
export const purchaseOptions = ['Ready to discuss a pilot', 'Interested within 3 months', 'Interested within 6–12 months', 'Interested, but not yet', 'Not a fit for me'] as const

type FeedbackInput = {
  role: string
  teamSize: string
  workspaces: string[]
  valueScore: number
  easeScore: number
  purchaseIntent: string
  mostValuable: string
  improvement: string
  followUp: boolean
}

const includes = (values: readonly string[], candidate: string) => values.includes(candidate)
const boundedText = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : ''
const score = (value: unknown) => Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5 ? Number(value) : null

export function parsePreviewFeedback(value: unknown): FeedbackInput | null {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>
  const role = boundedText(input.role, 80)
  const teamSize = boundedText(input.teamSize, 30)
  const purchaseIntent = boundedText(input.purchaseIntent, 80)
  const workspaces = Array.isArray(input.workspaces)
    ? [...new Set(input.workspaces.filter((item): item is string => typeof item === 'string' && includes(workspaceOptions, item)))].slice(0, workspaceOptions.length)
    : []
  const valueScore = score(input.valueScore)
  const easeScore = score(input.easeScore)
  const mostValuable = boundedText(input.mostValuable, 1200)
  const improvement = boundedText(input.improvement, 1200)
  if (!includes(visitorRoles, role) || !includes(teamSizes, teamSize) || !includes(purchaseOptions, purchaseIntent)
    || workspaces.length === 0 || valueScore === null || easeScore === null || mostValuable.length < 3) return null
  return { role, teamSize, workspaces, valueScore, easeScore, purchaseIntent, mostValuable, improvement, followUp: input.followUp === true }
}

export async function savePreviewFeedback(email: string, feedback: FeedbackInput) {
  const prisma = getPrismaClient()
  if (!prisma) throw new Error('Preview feedback requires DATABASE_URL')
  return prisma.surveyEntry.create({
    data: {
      brand: 'FoundingOS',
      category: 'preview-feedback',
      tester: email,
      responses: feedback,
      timestamp: BigInt(Date.now()),
    },
  })
}
