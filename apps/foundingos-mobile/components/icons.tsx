/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Svg, { Path, Circle, Rect } from 'react-native-svg'

// Real vector line icons (react-native-svg, already a dependency) replacing emoji tab icons —
// crisp at any size/density, tintable to match active/inactive tab colour, and consistent
// with a premium native app rather than relying on emoji glyph rendering per-OS.
type IconProps = { color: string; size?: number }

export function HomeIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11.5 12 4l8 7.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 10v9a1 1 0 0 0 1 1h3v-5.5a2 2 0 0 1 2-2 2 2 0 0 1 2 2V20h3a1 1 0 0 0 1-1v-9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function BoxIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M4 7l8 4 8-4M12 11v10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function TruckIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="12" height="9" rx="1.2" stroke={color} strokeWidth={2} />
      <Path d="M14 10h4l3 3v3h-7v-6Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Circle cx="7" cy="18" r="1.8" stroke={color} strokeWidth={2} />
      <Circle cx="17.5" cy="18" r="1.8" stroke={color} strokeWidth={2} />
    </Svg>
  )
}

export function SparkleIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.5 10.4 12.2 5 10.6l5.4-1.6L12 3.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.12}
      />
    </Svg>
  )
}

export function PulseIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12h4l2-7 4 14 2-7h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function MoreIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="5" cy="12" r="1.7" fill={color} />
      <Circle cx="12" cy="12" r="1.7" fill={color} />
      <Circle cx="19" cy="12" r="1.7" fill={color} />
    </Svg>
  )
}

export function ChartIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function LayersIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3 3 8l9 5 9-5-9-5Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="m3 12 9 5 9-5M3 16l9 5 9-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function TagIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12.5 3H5v7.5L14 20l7-7-8.5-10Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Circle cx="8.7" cy="7.7" r="1.4" fill={color} />
    </Svg>
  )
}

export function CompassIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Path d="m15 9-4.5 1.5L9 15l4.5-1.5L15 9Z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" fill={color} fillOpacity={0.12} />
    </Svg>
  )
}

export function UsersIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="8" r="3" stroke={color} strokeWidth={2} />
      <Path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="17.5" cy="9" r="2.3" stroke={color} strokeWidth={2} />
      <Path d="M21 20c0-2.6-1.8-4.8-4.2-5.6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

export function CoinIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Path d="M12 7v10M9.5 9.3c0-1.3 1.1-2.3 2.5-2.3s2.5.8 2.5 2-1.1 1.7-2.5 2-2.5.8-2.5 2 1.1 2 2.5 2 2.5-1 2.5-2.3" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  )
}

export function HeartPulseIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20s-7.5-4.6-9.5-9.4C1.3 7.4 3 4.5 6.1 4c2-.3 3.6.8 5.9 3 2.3-2.2 3.9-3.3 5.9-3 3.1.5 4.8 3.4 3.6 6.6C19.5 15.4 12 20 12 20Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M5 12h3l1.5-3 2 5 1.5-3H19" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function BriefcaseIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="8" width="18" height="11" rx="1.6" stroke={color} strokeWidth={2} />
      <Path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}
