import type { FoundAiAnswer } from './core-operations-api'

export type AskTurn = { id: string; question: string; answer: FoundAiAnswer | null; error?: string }

// SecureStore rejects values much larger than 2048 bytes, so a saved conversation has to fit
// a budget. We keep the newest turns and drop the oldest rather than truncating mid-answer,
// so what comes back always reads as complete sentences.
const BUDGET_BYTES = 1800
const MAX_TURNS = 8
const MAX_ANSWER_CHARS = 700

const byteLength = (value: string) => {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(value).length
  return value.length
}

// Keys may only contain alphanumerics, ".", "-" and "_", and each workspace keeps its own
// conversation so finance questions never surface under sales.
export const threadStorageKey = (workspace?: string) =>
  `foundingos-ai-thread-${(workspace || 'home').replace(/[^A-Za-z0-9.\-_]/g, '-')}`

// A turn is only worth storing once it has an answer; in-flight and failed turns would
// restore as permanent spinners or stale errors.
const storable = (turn: AskTurn) =>
  turn.answer
    ? {
        id: turn.id,
        question: turn.question,
        answer: {
          ...turn.answer,
          answer:
            turn.answer.answer.length > MAX_ANSWER_CHARS
              ? `${turn.answer.answer.slice(0, MAX_ANSWER_CHARS).trimEnd()}…`
              : turn.answer.answer,
          webSources: turn.answer.webSources?.slice(0, 4),
        },
      }
    : null

export function packThread(thread: AskTurn[]): string {
  const kept: unknown[] = []
  for (const turn of thread.slice(-MAX_TURNS).reverse()) {
    const entry = storable(turn)
    if (!entry) continue
    const candidate = [entry, ...kept]
    if (byteLength(JSON.stringify(candidate)) > BUDGET_BYTES) break
    kept.unshift(entry)
  }
  return JSON.stringify(kept)
}

export function unpackThread(raw: string | null): AskTurn[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((entry: any) =>
      entry && typeof entry.question === 'string' && entry.answer && typeof entry.answer.answer === 'string'
        ? [
            {
              id: typeof entry.id === 'string' ? entry.id : `restored-${Math.random().toString(36).slice(2, 8)}`,
              question: entry.question,
              answer: {
                answer: entry.answer.answer,
                suggestedActions: Array.isArray(entry.answer.suggestedActions) ? entry.answer.suggestedActions : [],
                citations: Array.isArray(entry.answer.citations) ? entry.answer.citations : [],
                webSources: Array.isArray(entry.answer.webSources) ? entry.answer.webSources : undefined,
                researchEnabled: entry.answer.researchEnabled,
                model: typeof entry.answer.model === 'string' ? entry.answer.model : '',
              },
            } satisfies AskTurn,
          ]
        : [],
    )
  } catch {
    return []
  }
}
