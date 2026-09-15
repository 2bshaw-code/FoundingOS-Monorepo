/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { dayIndex, pickDaily } from './daily'

// Real preview content for the pre-login landing screen — pulled from this brand's own real
// console dashboard sample data (apps/retail-console/app/brand-config.ts), reframed as
// "why sign up" highlights so a visitor can see what FoundRetail actually does before
// creating an account. Tailored to this brand's specific business, not a generic template.
export const PREVIEW = {
  heroLabel: "Live in your stores right now",
  sectionLabel: "Today's best sellers",
  items:   [
    {
      "title": "Organic Milk 1L",
      "meta": "Manchester \u00b7 142 sold today",
      "tag": "Best seller"
    },
    {
      "title": "Whole Wheat Bread",
      "meta": "Low stock \u2014 4 left",
      "tag": "Restock alert"
    },
    {
      "title": "Weekend Bundle Deal",
      "meta": "3-for-2 \u00b7 Leeds & Bristol",
      "tag": "Best deal"
    }
  ],
  leaderboard:   [
    {
      "rank": 1,
      "name": "Manchester store",
      "region": "Manchester, UK",
      "metric": "\u00a34.2k sales",
      "trend": "Healthy"
    },
    {
      "rank": 2,
      "name": "Leeds store",
      "region": "Leeds, UK",
      "metric": "\u00a33.1k sales",
      "trend": "Low dairy"
    },
    {
      "rank": 3,
      "name": "Bristol store",
      "region": "Bristol, UK",
      "metric": "\u00a32.8k sales",
      "trend": "Healthy"
    }
  ],
  hooks:   [
    "3 new stock alerts and 1 deal ending today — sign in to act on them.",
    "Manchester's Weekend Bundle Deal is 60% claimed already — sign in to see live stock.",
    "Leeds is running low on dairy right now — sign in to approve a restock."
  ],
  insights:   [
    "AI insight: stock turnover in Manchester is running 22% faster than Leeds this week — consider matching Leeds' dairy restock cadence to Manchester's.",
    "AI insight: Bristol's stock levels have stayed ‘Healthy’ for 12 days straight — AI suggests using its restock timing as the template for other stores.",
    "AI insight: Weekend Bundle Deals are outperforming single-item deals 2:1 across all three stores this month."
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
