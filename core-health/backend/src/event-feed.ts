/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Fire-and-forget publisher for the shared cross-suite Event Feed, which
// is stored centrally by core-operations (POST /events/publish). Health
// runs as its own process/service, so — unlike Retail/Logistics/Finance,
// which live inside core-operations and can bridge in-process — it
// publishes over HTTP. Never throws: a feed-publish failure must not
// block the actual Health workflow (booking an appointment, billing).
const EVENT_FEED_URL = process.env.CORE_OPERATIONS_EVENTS_URL || 'http://127.0.0.1:4001/api/v1/ops/events/publish'

export const publishFeedEvent = (type: string, payload: Record<string, unknown>) => {
  fetch(EVENT_FEED_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, source: 'health', payload }),
  }).catch(() => {})
}
