/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Path, Polyline, Stop } from 'react-native-svg'

// Lightweight hand-rolled sales chart — same SVG-only pattern as crypto-mobile's price
// chart, adapted for retail revenue trends so we keep the app fast and dependency-light.
export function SalesChart({
  data,
  width = 320,
  height = 140,
  color = '#00FF66',
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

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ')
  const areaPath = `M0,${height} L${points.map((point) => `${point.x},${point.y}`).join(' L')} L${width},${height} Z`

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="salesChartFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {filled ? <Path d={areaPath} fill="url(#salesChartFill)" /> : null}
      <Polyline points={linePoints} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  )
}

export function SalesSparkline({ data, color }: { data: number[]; color?: string }) {
  return <SalesChart data={data} width={72} height={28} color={color ?? '#00FF66'} strokeWidth={1.5} filled={false} />
}
