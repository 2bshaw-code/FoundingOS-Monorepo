/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'

// Hydration-safe ticking clock so the sync timestamp never mismatches server/client render.
export function QuantumSyncStatus({ nodes, pulseStrength = 72 }: { nodes: number; pulseStrength?: number }) {
  const [seconds, setSeconds] = useState<number | null>(null)
  const [lastEvent, setLastEvent] = useState('')

  useEffect(() => {
    setSeconds(0)
    setLastEvent(new Date().toLocaleTimeString())
    const id = setInterval(() => {
      setSeconds((current) => (current === null ? 0 : current + 1))
      setLastEvent(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="quantum-sync-status">
      <span className="quantum-sync-dot" aria-hidden="true" />
      <div>
        <strong>Synchronized</strong>
        <small>{nodes} brand nodes · last pulse {seconds === null ? '—' : `${seconds}s ago`}</small>
        <div className="quantum-sync-meter" role="meter" aria-valuenow={pulseStrength} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${pulseStrength}%` }} />
        </div>
        <small>Last event: {lastEvent || '—'} · pulse strength {pulseStrength}%</small>
      </div>
    </div>
  )
}
