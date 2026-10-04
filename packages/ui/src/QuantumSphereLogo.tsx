'use client'

import { FoundingOSBrandMark } from './brand-mark'

// Retain the legacy import/props for older console pages, but never render the retired sphere.
export function QuantumSphereLogo({ size = 48, className = '' }: { size?: number; className?: string; accent?: string }) {
  return <span className={className || undefined}><FoundingOSBrandMark size={size} /></span>
}

export default QuantumSphereLogo
