/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { dayIndex, pickDaily } from './daily'

// Real preview content for the pre-login landing screen — pulled from this brand's own real
// console dashboard sample data (apps/finance-console/app/brand-config.ts), reframed as
// "why sign up" highlights so a visitor can see what FoundFinance actually does before
// creating an account. Tailored to this brand's specific business, not a generic template.
export const PREVIEW = {
  heroLabel: "Live across your accounts",
  sectionLabel: "Today's cash highlights",
  items:   [
    {
      "title": "Operating account",
      "meta": "\u00a3142k \u00b7 Healthy",
      "tag": "Healthy"
    },
    {
      "title": "Payroll account",
      "meta": "\u00a338k \u00b7 Due soon",
      "tag": "Approve"
    },
    {
      "title": "Reserve account",
      "meta": "Strong \u00b7 Reviewed",
      "tag": "Healthy"
    }
  ],
  leaderboard:   [
    {
      "rank": 1,
      "name": "Reserve account",
      "region": "Treasury",
      "metric": "\u00a3210k",
      "trend": "Stable"
    },
    {
      "rank": 2,
      "name": "Operating account",
      "region": "Treasury",
      "metric": "\u00a3142k",
      "trend": "Healthy"
    },
    {
      "rank": 3,
      "name": "Payroll account",
      "region": "Treasury",
      "metric": "\u00a338k",
      "trend": "Due soon"
    }
  ],
  hooks:   [
    "7 overdue invoices need action — sign in to approve them.",
    "Payroll is due soon and sitting at £38k — sign in to confirm it's covered.",
    "Your Reserve account just crossed £210k — sign in to see the full breakdown."
  ],
  insights:   [
    "AI insight: your Reserve account has grown steadily for 3 months straight — AI suggests this is a good time to review whether Payroll's buffer needs topping up before it's due.",
    "AI insight: overdue invoices are concentrated in one supplier this month — AI suggests a direct follow-up rather than a general reminder.",
    "AI insight: reconciliation rate is at 94% this month, the highest in your history — AI attributes it to fewer manual entries."
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
