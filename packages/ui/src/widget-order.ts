/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Per-user dashboard card order, shared by web and mobile. Unknown ids are dropped and
// newly added cards are appended, so a saved layout never hides a card.
export function applyWidgetOrder(defaults: readonly string[], saved: unknown): string[] {
  const known = new Set(defaults)
  const kept = Array.isArray(saved) ? saved.filter((id, index): id is string => typeof id === 'string' && known.has(id) && saved.indexOf(id) === index) : []
  return [...kept, ...defaults.filter((id) => !kept.includes(id))]
}

export function moveWidget(order: readonly string[], id: string, delta: -1 | 1): string[] {
  const from = order.indexOf(id)
  const to = from + delta
  if (from < 0 || to < 0 || to >= order.length) return [...order]
  const next = [...order]
  ;[next[from], next[to]] = [next[to], next[from]]
  return next
}

export const widgetOrderKey = (surface: string, user: string | null | undefined) =>
  `foundingos-layout-${surface}-${(user || 'guest').toLowerCase().replace(/[^a-z0-9._-]/g, '_')}`
