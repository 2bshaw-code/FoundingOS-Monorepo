import { getPrismaClient } from '@foundingos/db'
import { expenseInput } from '../../superdashboard/gmail-data'
import { checkOrigin, connection, failure, gmailGet, GmailError, privateJson, requireFounder } from '../../superdashboard/gmail.server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const ownerId = await requireFounder()
    const prisma = getPrismaClient()
    if (!prisma) throw new GmailError('Set up the database to view building expenses.', 503)
    const expenses = await prisma.founderExpense.findMany({ where: { ownerId }, orderBy: [{ invoiceDate: 'desc' }, { createdAt: 'desc' }] })
    const totals: Record<string, string> = {}
    for (const expense of expenses) {
      totals[expense.currency] = expense.amount.plus(totals[expense.currency] ?? '0').toFixed(2)
    }
    return privateJson({
      expenses: expenses.map(({ id, supplier, invoiceNumber, amount, currency, invoiceDate }) => ({
        id, supplier, invoiceNumber, amount: amount.toFixed(2), currency, date: invoiceDate.toISOString().slice(0, 10),
      })),
      totals,
    })
  } catch (error) { return failure(error) }
}

export async function POST(request: Request) {
  try {
    const ownerId = await requireFounder()
    checkOrigin(request)
    const gmail = connection(ownerId)
    let input: ReturnType<typeof expenseInput>
    try { input = expenseInput(await request.json()) } catch (error) {
      throw new GmailError(error instanceof Error ? error.message : 'Check the expense details.')
    }
    // Verify the selected source belongs to this connected mailbox; never store email bodies or attachments.
    await gmailGet(gmail.token, `messages/${input.messageId}?format=minimal`)
    const prisma = getPrismaClient()
    if (!prisma) throw new GmailError('Set up the database before saving building expenses.', 503)
    try {
      const expense = await prisma.founderExpense.create({ data: { ...input, ownerId, gmailAccount: gmail.email } })
      return privateJson({ id: expense.id }, 201)
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') throw new GmailError('This email has already been imported. It has not been added twice.', 409)
      throw error
    }
  } catch (error) { return failure(error) }
}
