/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'

// Deterministic, read-only "Full Demo Mode" data generator — self-contained in this file
// (no shared workspace package import) so it deploys cleanly under this app's own Vercel
// Root Directory, with zero network calls, paid APIs, env vars, secrets, or DB writes.
function hashSeed(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

function timeBucket(windowMs: number): number {
  return Math.floor(Date.now() / windowMs)
}

// Value oscillates smoothly within +/- amplitudePct of base, reseeding every windowMs.
function seededValue(key: string, windowMs: number, base: number, amplitudePct: number): number {
  const bucket = timeBucket(windowMs)
  const wobble = hashSeed(`${key}:${bucket}`) * 2 - 1 // -1..1
  return Number((base * (1 + wobble * amplitudePct)).toFixed(2))
}

// Signed value in [-range, range], reseeding every windowMs. Used where there's no
// meaningful "base" to scale from (e.g. a percentage change around zero).
function seededSigned(key: string, windowMs: number, range: number): number {
  const bucket = timeBucket(windowMs)
  const wobble = hashSeed(`${key}:${bucket}`) * 2 - 1 // -1..1
  return Number((wobble * range).toFixed(2))
}

// Full Demo Mode: read-only, deterministic combined dashboard metrics for Crypto. No DB
// writes, no external network calls, no secrets — safe to call from a Vercel cron every
// 5 minutes.
export async function GET() {
  const windowMs = 5 * 60 * 1000
  const activeUsers = Math.floor(seededValue('crypto:activeUsers', windowMs, 40, 0.5))
  const ordersToday = Math.floor(seededValue('crypto:ordersToday', windowMs, 120, 0.4))
  const revenueTodayUsd = Number(seededValue('crypto:revenueToday', windowMs, 4800, 0.35).toFixed(2))
  const openAlerts = Math.floor(hashSeed(`crypto:alerts:${timeBucket(windowMs)}`) * 5)
  return NextResponse.json({
    mode: 'demo' as const,
    source: 'demo-generator',
    brand: 'crypto',
    generatedAt: new Date().toISOString(),
    refreshIntervalMinutes: 5,
    metrics: { activeUsers, ordersToday, revenueTodayUsd, openAlerts },
  })
}
