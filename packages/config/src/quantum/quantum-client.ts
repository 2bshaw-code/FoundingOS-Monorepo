/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Safe client for the live Quantum backend. No Quantum backend exists in this
// repo today, so every call here degrades gracefully — this module NEVER throws
// and never blocks a caller; it resolves to `null` on any failure, timeout, or
// missing endpoint, which is what makes Quantum enrichment fully optional.
export type QuantumForecast = { direction: 'up' | 'down' | 'flat'; summary: string }
export type QuantumAnomaly = { detected: boolean; summary: string | null }
export type QuantumOpportunity = { summary: string }
export type QuantumPulseReading = { pulse: number }

const QUANTUM_FETCH_TIMEOUT_MS = 1500

async function safeQuantumFetch<T>(path: string): Promise<T | null> {
  const base = process.env.QUANTUM_API_BASE_URL
  if (!base) return null // No Quantum backend configured — degrade silently.

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), QUANTUM_FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(`${base}${path}`, { signal: controller.signal })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export function fetchQuantumForecast(subject: string): Promise<QuantumForecast | null> {
  return safeQuantumFetch<QuantumForecast>(`/api/v1/quantum/${subject}/forecast`)
}

export function fetchQuantumAnomalies(subject: string): Promise<QuantumAnomaly | null> {
  return safeQuantumFetch<QuantumAnomaly>(`/api/v1/quantum/${subject}/anomalies`)
}

export function fetchQuantumOpportunities(subject: string): Promise<QuantumOpportunity | null> {
  return safeQuantumFetch<QuantumOpportunity>(`/api/v1/quantum/${subject}/opportunities`)
}

export function fetchQuantumPulse(subject: string): Promise<QuantumPulseReading | null> {
  return safeQuantumFetch<QuantumPulseReading>(`/api/v1/quantum/${subject}/pulse`)
}
