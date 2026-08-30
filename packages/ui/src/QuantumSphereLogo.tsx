/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useId } from 'react'
import './QuantumSphereLogo.css'

// FoundingOS keeps the unified multi-brand colour wheel (no `accent`). Passing `accent`
// (a brand's own locked --accent hex, e.g. from BrandConsoleConfig.colors.accent) swaps the
// sphere body/halo to a single-colour radial gradient tinted with that brand's colour, while
// every other layer (inner glow, breathing, halo blur, SVG structure) stays identical.
export function QuantumSphereLogo({ size = 48, className = '', accent }: { size?: number; className?: string; accent?: string }) {
  const uid = useId()
  const sphereGradientId = `qsSphereFill${uid}`
  const innerGlowId = `qsInnerGlow${uid}`
  const haloBlurId = `qsHaloBlur${uid}`

  return (
    <svg
      className={`quantumSphereLogo ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label={accent ? 'Brand Logo' : 'FoundingOS Logo'}
    >
      <defs>
        {accent ? (
          <radialGradient id={sphereGradientId} cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="35%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.85" />
          </radialGradient>
        ) : (
          <linearGradient id={sphereGradientId} gradientUnits="userSpaceOnUse" x1="106" y1="106" x2="406" y2="406">
            <stop offset="0%" stopColor="#00E0FF" />
            <stop offset="25%" stopColor="#9933FF" />
            <stop offset="50%" stopColor="#FF0033" />
            <stop offset="75%" stopColor="#FFDD00" />
            <stop offset="100%" stopColor="#00FF66" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 256 256"
              to="360 256 256"
              dur="18s"
              repeatCount="indefinite"
            />
          </linearGradient>
        )}
        <radialGradient id={innerGlowId} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={haloBlurId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
        </filter>
      </defs>

      {/* Outer soft halo — dual-layer Quantum glow, layer 1 */}
      <circle cx="256" cy="256" r="210" fill={`url(#${sphereGradientId})`} opacity="0.35" filter={`url(#${haloBlurId})`}>
        <animate attributeName="opacity" values="0.25;0.45;0.25" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Sphere body — glass-crystal hybrid material */}
      <circle cx="256" cy="256" r="168" fill={`url(#${sphereGradientId})`} stroke="rgba(255,255,255,0.35)" strokeWidth="2">
        <animate attributeName="r" values="168;172;168" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* Inner pulsing core — dual-layer Quantum glow, layer 2 + specular highlight */}
      <circle cx="256" cy="256" r="168" fill={`url(#${innerGlowId})`}>
        <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export default QuantumSphereLogo
