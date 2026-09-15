/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Path, Polyline, Circle } from 'react-native-svg'

// Real SVG line/area chart for vitals trends, adapted from crypto-mobile's PriceChart —
// same react-native-svg-only approach (no chart library dependency), rendering from this
// brand's own real vitals history (demo-mode server data plus any locally-logged readings).
export function VitalsChart({
  data,
  width = 320,
  height = 120,
  color = '#33CCFF',
  strokeWidth = 2,
  filled = true,
  showDots = false,
}: {
  data: number[]
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
  filled?: boolean
  showDots?: boolean
}) {
  if (!data || data.length < 2) {
    return <View style={{ width, height }} />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  const points = data.map((value, index) => {
    const x = index * stepX
    const y = height - ((value - min) / range) * (height - 8) - 4
    return { x, y }
  })

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPath = `M0,${height} L${points.map((p) => `${p.x},${p.y}`).join(' L')} L${width},${height} Z`

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="vitalsChartFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {filled ? <Path d={areaPath} fill="url(#vitalsChartFill)" /> : null}
      <Polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      {showDots ? points.map((p, i) => <Circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} />) : null}
    </Svg>
  )
}

// Dual-series variant for blood pressure (systolic + diastolic sharing one Y scale).
export function DualVitalsChart({
  seriesA,
  seriesB,
  width = 320,
  height = 120,
  colorA = '#33CCFF',
  colorB = '#9933FF',
}: {
  seriesA: number[]
  seriesB: number[]
  width?: number
  height?: number
  colorA?: string
  colorB?: string
}) {
  if (!seriesA || !seriesB || seriesA.length < 2 || seriesB.length < 2) {
    return <View style={{ width, height }} />
  }
  const all = [...seriesA, ...seriesB]
  const min = Math.min(...all)
  const max = Math.max(...all)
  const range = max - min || 1
  const stepX = width / (seriesA.length - 1)

  const toPoints = (data: number[]) =>
    data.map((value, index) => {
      const x = index * stepX
      const y = height - ((value - min) / range) * (height - 8) - 4
      return `${x},${y}`
    }).join(' ')

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline points={toPoints(seriesA)} fill="none" stroke={colorA} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <Polyline points={toPoints(seriesB)} fill="none" stroke={colorB} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  )
}
