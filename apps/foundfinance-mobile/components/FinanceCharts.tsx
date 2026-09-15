/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Fragment } from 'react'
import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Path, Polyline, Rect } from 'react-native-svg'

// Real SVG line/area chart, adapted from apps/crypto-mobile/components/PriceChart.tsx — no
// chart library dependency, just react-native-svg (already a dependency in every brand app).
export function TrendChart({
  data,
  width = 320,
  height = 120,
  color = '#0033AA',
  strokeWidth = 2,
  filled = true,
}: {
  data: number[]
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
  filled?: boolean
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
        <LinearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {filled ? <Path d={areaPath} fill="url(#trendFill)" /> : null}
      <Polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  )
}

// Dual-series overlay chart — inflow and outflow lines sharing one scale, used for the cash
// flow trend so a "healthy" vs. "tightening" pattern reads at a glance.
export function DualTrendChart({
  seriesA,
  seriesB,
  width = 320,
  height = 140,
  colorA = '#00CC66',
  colorB = '#FF4D4D',
  strokeWidth = 2,
}: {
  seriesA: number[]
  seriesB: number[]
  width?: number
  height?: number
  colorA?: string
  colorB?: string
  strokeWidth?: number
}) {
  if (!seriesA?.length || !seriesB?.length || seriesA.length < 2) {
    return <View style={{ width, height }} />
  }
  const all = [...seriesA, ...seriesB]
  const min = Math.min(...all)
  const max = Math.max(...all)
  const range = max - min || 1
  const stepX = width / (seriesA.length - 1)

  const toPolyline = (series: number[]) =>
    series
      .map((value, index) => {
        const x = index * stepX
        const y = height - ((value - min) / range) * (height - 8) - 4
        return `${x},${y}`
      })
      .join(' ')

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline points={toPolyline(seriesA)} fill="none" stroke={colorA} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      <Polyline points={toPolyline(seriesB)} fill="none" stroke={colorB} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  )
}

// Simple horizontal-bar chart for spend-by-category breakdowns — one Rect per category,
// width proportional to its share of the max value in the set.
export function BarBreakdown({
  items,
  width = 320,
  barHeight = 18,
  gap = 10,
  color = '#0033AA',
  trackColor = '#1c2430',
}: {
  items: { label: string; value: number }[]
  width?: number
  barHeight?: number
  gap?: number
  color?: string
  trackColor?: string
}) {
  if (!items?.length) return <View style={{ width, height: barHeight }} />
  const max = Math.max(...items.map((i) => i.value), 1)
  const height = items.length * (barHeight + gap) - gap

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {items.map((item, index) => {
        const y = index * (barHeight + gap)
        const barWidth = Math.max((item.value / max) * width, 2)
        return (
          <Fragment key={item.label}>
            <Rect x={0} y={y} width={width} height={barHeight} rx={6} fill={trackColor} />
            <Rect x={0} y={y} width={barWidth} height={barHeight} rx={6} fill={color} />
          </Fragment>
        )
      })}
    </Svg>
  )
}
