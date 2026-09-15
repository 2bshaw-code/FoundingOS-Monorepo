/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { dayIndex, pickDaily } from './daily'

// Real preview content for the pre-login landing screen — pulled from this brand's own real
// console dashboard sample data (apps/logistics-console/app/brand-config.ts), reframed as
// "why sign up" highlights so a visitor can see what FoundLogistics actually does before
// creating an account. Tailored to this brand's specific business, not a generic template.
export const PREVIEW = {
  heroLabel: "Live across your fleet",
  sectionLabel: "Today's top routes",
  items:   [
    {
      "title": "North Loop",
      "meta": "On schedule \u00b7 14:20 ETA",
      "tag": "Monitor"
    },
    {
      "title": "City Express",
      "meta": "Delayed \u00b7 16:05 ETA",
      "tag": "Review"
    },
    {
      "title": "63 active deliveries",
      "meta": "94% on-time today",
      "tag": "On track"
    }
  ],
  leaderboard:   [
    {
      "rank": 1,
      "name": "Coastal Run",
      "region": "South Coast",
      "metric": "18:40 ETA",
      "trend": "On schedule"
    },
    {
      "rank": 2,
      "name": "North Loop",
      "region": "North England",
      "metric": "14:20 ETA",
      "trend": "On schedule"
    },
    {
      "rank": 3,
      "name": "City Express",
      "region": "City centre",
      "metric": "16:05 ETA",
      "trend": "Delayed"
    }
  ],
  hooks:   [
    "1 route delayed today — sign in to reroute it.",
    "63 active deliveries running at 94% on-time — sign in to see the live map.",
    "City Express has slipped its ETA twice this week — sign in to review its route."
  ],
  insights:   [
    "AI insight: Coastal Run has stayed on schedule all week while City Express has slipped twice — AI suggests reviewing City Express' route timing.",
    "AI insight: fleet utilisation is up 4% this week — AI attributes it to better load balancing on North Loop.",
    "AI insight: on-time delivery rate is highest on routes dispatched before 8am — worth shifting City Express' start time earlier."
  ],
}

// Rotates daily so repeat visitors see something new: same real hook/insight pool and same
// real items/leaderboard data as above, but the featured hook+insight and the item/leaderboard
// display order change once every day (deterministic per day, not random per load).
function rotate<T>(list: T[], amount: number): T[] {
  const n = list.length
  if (n === 0) return list
  const shift = ((amount % n) + n) % n
  return [...list.slice(shift), ...list.slice(0, shift)]
}

export const PREVIEW_TODAY = {
  ...PREVIEW,
  hook: pickDaily(PREVIEW.hooks),
  insight: pickDaily(PREVIEW.insights, 1),
  items: rotate(PREVIEW.items, dayIndex(PREVIEW.items.length)),
  leaderboard: rotate(PREVIEW.leaderboard, dayIndex(PREVIEW.leaderboard.length)),
}
