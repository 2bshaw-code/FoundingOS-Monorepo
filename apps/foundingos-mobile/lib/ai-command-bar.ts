/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// The command bar's "ask a question" layer, layered on top of the existing
// searchCatalogue() navigation search (lib/nav-directory.ts). This is
// intentionally a small, deterministic intent matcher over the *real* live
// approvals queue — not a claim of general-purpose natural-language
// understanding, and not backed by any LLM API (there's no key/backend for
// one configured anywhere in this repo). It answers the small set of
// questions that matter most for a daily ops app ("what needs my
// attention", "how many approvals", "anything overdue") honestly, using
// real data, and is a clean seam to swap in a real LLM-backed assistant
// later without touching any call site.
import { fetchApprovalsQueue, type ApprovalsQueueItem } from './approvals-queue'

export type CommandBarAnswer = {
  headline: string
  detail: string
  items: ApprovalsQueueItem[]
}

type Intent = 'attention' | 'count' | 'overdue' | 'greeting' | null

function detectIntent(query: string): Intent {
  const q = query.trim().toLowerCase()
  if (!q) return null
  if (/\b(hi|hello|hey)\b/.test(q) && q.length < 20) return 'greeting'
  if (/(overdue|late|behind)/.test(q)) return 'overdue'
  if (/(how many|count of|number of)/.test(q)) return 'count'
  if (/(need|attention|waiting|pending|today|what should|priorit)/.test(q)) return 'attention'
  return null
}

export function isAskableQuery(query: string): boolean {
  return detectIntent(query) !== null
}

export async function answerCommandBarQuery(query: string): Promise<CommandBarAnswer | null> {
  const intent = detectIntent(query)
  if (!intent) return null

  if (intent === 'greeting') {
    return { headline: 'Hi 👋', detail: 'Ask me things like "what needs my attention" or "anything overdue".', items: [] }
  }

  const { items } = await fetchApprovalsQueue()
  const awaiting = items.filter((item) => item.status === 'proposed' && item.requiresApproval)
  const overdueLike = items.filter((item) => /overdue|delayed|late/i.test(`${item.title} ${item.summary}`))

  if (intent === 'overdue') {
    if (overdueLike.length === 0) return { headline: 'Nothing overdue right now', detail: 'No approvals in the queue mention being overdue or delayed.', items: [] }
    return {
      headline: `${overdueLike.length} item${overdueLike.length === 1 ? '' : 's'} flagged overdue`,
      detail: overdueLike.map((item) => item.title).slice(0, 3).join(' · '),
      items: overdueLike,
    }
  }

  if (intent === 'count') {
    return {
      headline: `${awaiting.length} awaiting your decision`,
      detail: `${items.length} total in the queue across every workspace.`,
      items: awaiting,
    }
  }

  // 'attention'
  if (awaiting.length === 0) {
    return { headline: "You're all caught up", detail: 'Nothing in the queue needs a decision right now.', items: [] }
  }
  return {
    headline: `${awaiting.length} item${awaiting.length === 1 ? '' : 's'} need${awaiting.length === 1 ? 's' : ''} your attention`,
    detail: awaiting.map((item) => item.title).slice(0, 3).join(' · '),
    items: awaiting.slice(0, 5),
  }
}
