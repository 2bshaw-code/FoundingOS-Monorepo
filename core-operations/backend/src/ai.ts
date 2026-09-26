import { prisma } from './auth.js'

const MAX_QUESTION_LENGTH = 2_000
const MAX_RECORDS = 30

type AiCitation = {
  workspace: string
  module: string
  reference: string
  name: string
}

export type FoundAiResponse = {
  answer: string
  citations: AiCitation[]
  suggestedActions: string[]
  // Verbatim snippets of the customer's own WhatsApp messages the model directly quoted in
  // its answer — kept separate from `answer`/`suggestedActions` so the console can render
  // "the customer said" text distinctly from FoundAI's own generated wording. Always empty
  // when `usedConversation` is false, since there's nothing real to quote.
  quotedMessages: string[]
  model: string
  // True only when a customerId was supplied and that customer actually had messaging
  // history to ground the answer in — lets clients show "answered from this conversation"
  // honestly instead of always implying it, e.g. when the thread is empty.
  usedConversation: boolean
  // How many of that customer's messages were actually supplied to the model — lets the
  // console show an honest "Based on N messages" caption instead of a vague claim.
  conversationMessageCount: number
}

function requireAiConfiguration() {
  // Only ANTHROPIC_API_KEY is actually required now — previously this also demanded a
  // separate AI_ENABLED=true, which meant FoundAI could be silently disabled after adding a
  // valid key just because that second variable was forgotten during setup or a redeploy.
  // AI_ENABLED is now only checked as an explicit kill switch (set it to 'false' to disable
  // FoundAI even with a key configured); its absence no longer blocks anything.
  if (process.env.AI_ENABLED === 'false') {
    throw Object.assign(new Error('FoundAI has been turned off for this environment (AI_ENABLED=false).'), { status: 503 })
  }
  const apiKey = String(process.env.ANTHROPIC_API_KEY || '').trim()
  if (!apiKey) {
    throw Object.assign(new Error('FoundAI is not configured. Add ANTHROPIC_API_KEY to the Core.Operations server environment.'), { status: 503 })
  }
  return {
    apiKey,
    model: String(process.env.AI_REASONING_MODEL || 'claude-sonnet-4-5').trim(),
  }
}

// Cheap, side-effect-free capability check clients can call before showing "Ask FoundAI" UI,
// instead of only discovering misconfiguration when a real question fails.
export function isAiConfigured(): boolean {
  return process.env.AI_ENABLED !== 'false' && Boolean(String(process.env.ANTHROPIC_API_KEY || '').trim())
}

// Small, tenant-scoped messaging-ops summary for general/team-level FoundAI questions that
// aren't scoped to one customer's conversation panel — "who's waiting on a reply", the
// average response time, and recent volume. Mirrors the same computation pipelineSummary
// (pipeline.ts) does for the workspace landing page, kept as a separate lightweight query
// here (customer/company names, not full message bodies) rather than importing that heavier
// function which also loads leads/customers/orders this route doesn't need.
type PipelineAiContext = {
  awaitingReply: Array<{ companyName: string; lastMessageAt: string }>
  avgResponseMinutes: number | null
  messagesLast24h: number
  messagesPrior24h: number
}

async function buildPipelineAiContext(tenantId: string): Promise<PipelineAiContext> {
  const messages = await prisma.customerMessage.findMany({
    where: { tenantId, customerId: { not: null } },
    select: { customerId: true, direction: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  const byCustomer = new Map<string, typeof messages>()
  for (const message of messages) {
    if (!message.customerId) continue
    const bucket = byCustomer.get(message.customerId) ?? []
    bucket.push(message)
    byCustomer.set(message.customerId, bucket)
  }
  const awaitingCustomerIds: Array<{ customerId: string; lastMessageAt: Date }> = []
  const responseGapsMs: number[] = []
  for (const [customerId, bucket] of byCustomer.entries()) {
    const ordered = [...bucket].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    const last = ordered[ordered.length - 1]
    if (last?.direction === 'inbound') awaitingCustomerIds.push({ customerId, lastMessageAt: last.createdAt })
    for (let index = 1; index < ordered.length; index += 1) {
      const previous = ordered[index - 1]
      const current = ordered[index]
      if (previous.direction === 'inbound' && current.direction === 'outbound') {
        responseGapsMs.push(current.createdAt.getTime() - previous.createdAt.getTime())
      }
    }
  }
  const avgResponseMinutes = responseGapsMs.length > 0
    ? Math.round(responseGapsMs.reduce((sum, gap) => sum + gap, 0) / responseGapsMs.length / 60_000)
    : null
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000
  let messagesLast24h = 0
  let messagesPrior24h = 0
  for (const message of messages) {
    const ageMs = now - message.createdAt.getTime()
    if (ageMs < oneDayMs) messagesLast24h += 1
    else if (ageMs < oneDayMs * 2) messagesPrior24h += 1
  }
  let awaitingReply: Array<{ companyName: string; lastMessageAt: string }> = []
  if (awaitingCustomerIds.length > 0) {
    const customers = await prisma.customer.findMany({
      where: { tenantId, id: { in: awaitingCustomerIds.map((entry) => entry.customerId) } },
      select: { id: true, companyName: true, contactName: true },
    })
    const nameById = new Map(customers.map((customer) => [customer.id, customer.companyName || customer.contactName || 'Unnamed customer']))
    awaitingReply = awaitingCustomerIds
      .map((entry) => ({ companyName: nameById.get(entry.customerId) ?? 'Unnamed customer', lastMessageAt: entry.lastMessageAt.toISOString() }))
      .slice(0, 20)
  }
  return { awaitingReply, avgResponseMinutes, messagesLast24h, messagesPrior24h }
}

function parseModelResponse(value: unknown): Omit<FoundAiResponse, 'model' | 'usedConversation' | 'conversationMessageCount'> {
  if (!value || typeof value !== 'object') throw new Error('FoundAI returned an invalid response.')
  const candidate = value as Record<string, unknown>
  const answer = String(candidate.answer || '').trim()
  if (!answer) throw new Error('FoundAI returned an empty answer.')
  const citations = Array.isArray(candidate.citations)
    ? candidate.citations
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
        .slice(0, 8)
        .map((item) => ({
          workspace: String(item.workspace || ''),
          module: String(item.module || ''),
          reference: String(item.reference || ''),
          name: String(item.name || ''),
        }))
        .filter((item) => item.workspace && item.module && item.reference && item.name)
    : []
  const suggestedActions = Array.isArray(candidate.suggestedActions)
    ? candidate.suggestedActions.map(String).map((item) => item.trim()).filter(Boolean).slice(0, 4)
    : []
  const quotedMessages = Array.isArray(candidate.quotedMessages)
    ? candidate.quotedMessages.map(String).map((item) => item.trim()).filter(Boolean).slice(0, 5)
    : []
  return { answer, citations, suggestedActions, quotedMessages }
}

function parseJsonResponse(text: string): unknown {
  const trimmed = text.trim()
  if (trimmed.startsWith('```')) {
    const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
    if (!match) throw new Error('FoundAI returned an unreadable response.')
    return JSON.parse(match[1])
  }
  return JSON.parse(trimmed)
}

export async function askFoundAi(input: {
  tenantId: string
  actorId: string
  question: unknown
  workspace?: unknown
  module?: unknown
  customerId?: unknown
  requestId?: string
}): Promise<FoundAiResponse> {
  const { apiKey, model } = requireAiConfiguration()
  const question = String(input.question || '').trim()
  if (!question) throw Object.assign(new Error('Ask FoundAI a question.'), { status: 400 })
  if (question.length > MAX_QUESTION_LENGTH) throw Object.assign(new Error(`Questions must be ${MAX_QUESTION_LENGTH} characters or fewer.`), { status: 400 })

  const workspace = String(input.workspace || '').trim()
  const module = String(input.module || '').trim()
  const customerId = String(input.customerId || '').trim()
  const [records, conversation, pipelineContext] = await Promise.all([
    prisma.workspaceRecord.findMany({
      where: {
        tenantId: input.tenantId,
        deletedAt: null,
        ...(workspace ? { workspace } : {}),
        ...(module ? { module } : {}),
      },
      select: { workspace: true, module: true, reference: true, name: true, status: true, valuePence: true, data: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: MAX_RECORDS,
    }),
    // When FoundAI is asked about a specific lead/customer (e.g. from the Pipeline's
    // conversation panel), ground the answer in that customer's real WhatsApp thread too —
    // this is a messaging-first OS, so "what does this customer want" should be answerable
    // from what they actually said, not just their record's status/value fields.
    customerId
      ? prisma.customerMessage.findMany({
          where: { tenantId: input.tenantId, customerId },
          select: { direction: true, channel: true, body: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 50,
        })
      : Promise.resolve([]),
    // For general/team-level questions (no specific customer open), give FoundAI real
    // visibility into who across the whole pipeline is waiting on a reply — the same
    // "awaiting reply" computation pipelineSummary already does, scoped down here to just
    // the names needed for grounding, so a question like "who needs a reply today?" can be
    // answered honestly instead of only working when a single conversation panel is open.
    customerId ? Promise.resolve(null) : buildPipelineAiContext(input.tenantId),
  ])
  const context = records.map((record) => ({
    workspace: record.workspace,
    module: record.module,
    reference: record.reference,
    name: record.name,
    status: record.status,
    valuePence: record.valuePence,
    data: record.data,
    updatedAt: record.updatedAt.toISOString(),
  }))
  const conversationContext = conversation
    .map((message) => ({ direction: message.direction, channel: message.channel, body: message.body, sentAt: message.createdAt.toISOString() }))
    .reverse()
  // A customer is "awaiting reply" if their own most recent message hasn't had an outbound
  // reply since — reuses the same direction data already fetched above, no extra query.
  // This lets FoundAI proactively flag it instead of only answering what's literally asked.
  const awaitingReply = conversationContext.length > 0 && conversationContext[conversationContext.length - 1].direction === 'inbound'
  const system = [
    'You are FoundAI, a governed business-operations assistant.',
    'Answer only from the supplied tenant records. Never invent data, outcomes, or integrations.',
    'Do not claim to perform an external action. Suggest actions for user review instead.',
    'Return strict JSON with answer, citations, and suggestedActions.',
    'Each citation must exactly match a supplied record workspace, module, reference, and name.',
    conversationContext.length > 0
      ? 'A "conversation" array of the customer\'s real messaging history (oldest first) is also supplied — use it to ground your answer in what the customer actually said, but citations must still only reference the supplied records, never the conversation. If you directly quote or closely paraphrase something the customer said, also return it verbatim (their exact words, not your summary) in a "quotedMessages" array, so it can be shown separately from your own generated wording — omit quotedMessages entirely if you are not quoting them.'
      : '',
    awaitingReply
      ? 'The customer\'s most recent message has not been replied to yet. If relevant to the question, proactively mention that a reply is still owed and suggest a concrete next reply as one of the suggestedActions — but never claim you sent one.'
      : '',
    pipelineContext
      ? 'A "pipelineContext" object is also supplied with real, tenant-wide messaging-operations data: "awaitingReply" (customers whose most recent message is unanswered, most recent first), "avgResponseMinutes" (real recent average reply time, or null if there is not enough recent data — never treat null as zero), and "messagesLast24h"/"messagesPrior24h" (recent message volume). Use this only to answer general/team-level questions (e.g. "who needs a reply", "how is our response time", "are we busier than usual") — do not invent details beyond what is supplied, and do not extrapolate exact percentages from messagesLast24h/messagesPrior24h beyond a simple busier/quieter/same comparison.'
      : '',
  ].filter(Boolean).join(' ')
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 900,
      temperature: 0.2,
      system,
      messages: [{
        role: 'user',
        content: JSON.stringify({
          question,
          records: context,
          ...(conversationContext.length > 0 ? { conversation: conversationContext } : {}),
          ...(pipelineContext ? { pipelineContext } : {}),
        }),
      }],
    }),
    signal: AbortSignal.timeout(25_000),
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { error?: { message?: string } } | null
    throw Object.assign(new Error(payload?.error?.message || `FoundAI provider returned HTTP ${response.status}.`), { status: 502 })
  }
  const payload = await response.json() as { content?: Array<{ type?: string; text?: string }> }
  const text = payload.content?.find((item) => item.type === 'text')?.text
  if (!text) throw Object.assign(new Error('FoundAI provider returned no text response.'), { status: 502 })
  let parsed: Omit<FoundAiResponse, 'model' | 'usedConversation' | 'conversationMessageCount'>
  try {
    parsed = parseModelResponse(parseJsonResponse(text))
  } catch {
    throw Object.assign(new Error('FoundAI returned an unreadable response. Please try again.'), { status: 502 })
  }
  const permittedReferences = new Set(context.map((record) => `${record.workspace}:${record.module}:${record.reference}:${record.name}`))
  const citations = parsed.citations.filter((citation) => permittedReferences.has(`${citation.workspace}:${citation.module}:${citation.reference}:${citation.name}`))
  await prisma.workspaceAuditEvent.create({
    data: {
      tenantId: input.tenantId,
      actorId: input.actorId,
      action: 'ai.asked',
      workspace: workspace || null,
      module: module || null,
      requestId: input.requestId,
      metadata: { model, recordCount: context.length, citationCount: citations.length, conversationMessageCount: conversationContext.length },
    },
  })
  return {
    ...parsed,
    citations,
    model,
    usedConversation: conversationContext.length > 0,
    conversationMessageCount: conversationContext.length,
    // Never show quotes as if grounded in a real conversation when none was supplied — a
    // model that ignores instructions and invents a "quote" anyway must not surface it.
    quotedMessages: conversationContext.length > 0 ? parsed.quotedMessages : [],
  }
}
