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

const CRYPTO_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', basePriceUsd: 64000 },
  { symbol: 'ETH', name: 'Ethereum', basePriceUsd: 3400 },
  { symbol: 'SOL', name: 'Solana', basePriceUsd: 145 },
] as const

// Full Demo Mode: read-only, deterministic crypto price snapshot (BTC/ETH/SOL). No trading,
// no wallets, no external network calls, no secrets — safe to call from a Vercel cron every
// 3 minutes.
export async function GET() {
  const windowMs = 3 * 60 * 1000
  const assets = CRYPTO_ASSETS.map((asset) => {
    const priceUsd = seededValue(`crypto:${asset.symbol}`, windowMs, asset.basePriceUsd, 0.02)
    const change24hPct = seededSigned(`crypto:${asset.symbol}:change`, windowMs, 6)
    return { symbol: asset.symbol, name: asset.name, priceUsd, change24hPct }
  })
  return NextResponse.json({
    mode: 'demo' as const,
    source: 'demo-generator',
    generatedAt: new Date().toISOString(),
    refreshIntervalMinutes: 3,
    assets,
  })
}
