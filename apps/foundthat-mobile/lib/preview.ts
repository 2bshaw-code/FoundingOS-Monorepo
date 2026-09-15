/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { dayIndex, pickDaily } from './daily'

// Real preview content for the pre-login landing screen — pulled from this brand's own real
// console dashboard sample data (apps/foundthat-console/app/brand-config.ts), reframed as
// "why sign up" highlights so a visitor can see what FoundThat actually does before
// creating an account. Tailored to this brand's specific business, not a generic template.
export const PREVIEW = {
  heroLabel: "Live across your systems",
  sectionLabel: "Today's platform highlights",
  items:   [
    {
      "title": "API Gateway",
      "meta": "99.99% uptime \u00b7 Platform",
      "tag": "Healthy"
    },
    {
      "title": "CRM Sync",
      "meta": "99.91% uptime \u00b7 3 alerts",
      "tag": "Watch"
    },
    {
      "title": "Data Jobs",
      "meta": "99.95% uptime \u00b7 Engineering",
      "tag": "Healthy"
    }
  ],
  leaderboard:   [
    {
      "rank": 1,
      "name": "API Gateway",
      "region": "Platform",
      "metric": "99.99% uptime",
      "trend": "Healthy"
    },
    {
      "rank": 2,
      "name": "Data Jobs",
      "region": "Engineering",
      "metric": "99.95% uptime",
      "trend": "Healthy"
    },
    {
      "rank": 3,
      "name": "CRM Sync",
      "region": "Ops",
      "metric": "99.91% uptime",
      "trend": "Watch"
    }
  ],
  hooks:   [
    "2 critical alerts today — sign in to see what's flagged.",
    "CRM Sync uptime dipped below 99.9% overnight — sign in to see the incident.",
    "Data Jobs processed 1.8M events today, a new high — sign in for the breakdown."
  ],
  insights:   [
    "AI insight: CRM Sync has the most active alerts of any system this week — AI suggests checking its retry queue before it affects Data Jobs downstream.",
    "AI insight: API Gateway has held 99.99% uptime for 30 straight days — the most stable system on your platform.",
    "AI insight: alert volume tends to spike on Mondays — AI suggests scheduling maintenance windows on Wednesdays instead."
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
