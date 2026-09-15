/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg'

// Stylised abstract stop-sequence visualisation — NOT a real map/tiles integration (there is no
// maps SDK/API key configured for this app; react-native-maps is not a dependency). Stops are
// plotted on a simple 0-100 abstract plane from the demo feed's coordinates, connected in visit
// order, same lightweight react-native-svg approach as PriceChart in the crypto app.
export function RouteVisual({
  stops,
  width = 320,
  height = 220,
  color = '#DC143C',
}: {
  stops: Array<{ name: string; x: number; y: number }>
  width?: number
  height?: number
  color?: string
}) {
  if (!stops || stops.length === 0) {
    return (
      <View style={[styles.empty, { width, height }]}>
        <Text style={styles.emptyText}>No active route</Text>
      </View>
    )
  }

  const pad = 24
  const scale = (v: number, size: number) => pad + (v / 100) * (size - pad * 2)

  const points = stops.map((stop) => ({ x: scale(stop.x, width), y: scale(stop.y, height) }))

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {points.slice(1).map((point, index) => (
        <Line
          key={`leg-${index}`}
          x1={points[index].x}
          y1={points[index].y}
          x2={point.x}
          y2={point.y}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="6,4"
          opacity={0.7}
        />
      ))}
      {points.map((point, index) => (
        <Circle
          key={`stop-${index}`}
          cx={point.x}
          cy={point.y}
          r={index === 0 ? 8 : 6}
          fill={index === 0 ? color : '#11161f'}
          stroke={color}
          strokeWidth={2}
        />
      ))}
      {points.map((point, index) => (
        <SvgText
          key={`num-${index}`}
          x={point.x}
          y={point.y + 4}
          fontSize={9}
          fontWeight="700"
          fill={index === 0 ? '#0b0e14' : color}
          textAnchor="middle"
        >
          {index + 1}
        </SvgText>
      ))}
      {stops.map((stop, index) => (
        <SvgText
          key={`label-${index}`}
          x={points[index].x}
          y={points[index].y - 12}
          fontSize={9}
          fill="#b9c2cf"
          textAnchor="middle"
        >
          {stop.name.length > 14 ? `${stop.name.slice(0, 13)}…` : stop.name}
        </SvgText>
      ))}
    </Svg>
  )
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#11161f', borderRadius: 12 },
  emptyText: { color: '#5b6472', fontSize: 12 },
})
