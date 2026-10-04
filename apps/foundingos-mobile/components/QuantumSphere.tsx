import { FoundingOSBrandMark } from './FoundingOSBrandMark'

// Compatibility for older native callers; the retired sphere is no longer rendered.
export function QuantumSphere({ size = 48 }: { size?: number; accent?: string }) {
  return <FoundingOSBrandMark size={size} />
}
