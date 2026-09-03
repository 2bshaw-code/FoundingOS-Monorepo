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

const CATALOGUE = ['Wireless Earbuds', 'Ceramic Mug Set', 'Canvas Tote Bag', 'Desk Lamp', 'Running Socks (3-pack)']

// Full Demo Mode: read-only, deterministic mock product feed for Retail. No paid APIs, no
// DB writes — safe to call from a Vercel cron every 20 minutes.
export async function GET() {
  const windowMs = 20 * 60 * 1000
  const bucket = timeBucket(windowMs)
  const products = CATALOGUE.map((name, i) => {
    const id = `retail-feed-${i + 1}`
    const priceUsd = seededValue(`${id}:price`, windowMs, 10 + i * 4, 0.15)
    const stock = Math.floor(hashSeed(`${id}:stock:${bucket}`) * 120)
    return { id, name, priceUsd, stock }
  })
  return NextResponse.json({
    mode: 'demo' as const,
    source: 'demo-generator',
    brand: 'retail',
    generatedAt: new Date().toISOString(),
    refreshIntervalMinutes: 20,
    products,
  })
}
