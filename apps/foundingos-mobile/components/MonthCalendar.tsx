/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Native month-grid calendar for every scheduling screen (content, appointments,
// interviews, deliveries, rotas). Tap a day to see or add what's on it.
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { QuantumText, quantumColors } from './QuantumUI'

export type CalendarItem = { id: string; date: string; title: string; tone?: 'good' | 'warn' | 'info' | 'muted' }

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
export const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const toneColor = { good: '#26E07F', warn: '#FBBF24', info: '#38BDF8', muted: '#7f91a5' }

export function MonthCalendar({ items, selectedDay, onSelectDay, accent = '#38BDF8' }: { items: CalendarItem[]; selectedDay?: string | null; onSelectDay?: (day: string) => void; accent?: string }) {
  const [cursor, setCursor] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1) })
  const byDay = useMemo(() => {
    const map = new Map<string, CalendarItem[]>()
    for (const item of items) {
      const parsed = new Date(item.date)
      if (Number.isNaN(parsed.getTime())) continue
      const key = dayKey(parsed)
      map.set(key, [...(map.get(key) || []), item])
    }
    return map
  }, [items])
  const today = dayKey(new Date())
  const lead = (cursor.getDay() + 6) % 7
  const cells = Array.from({ length: 42 }, (_, index) => new Date(cursor.getFullYear(), cursor.getMonth(), index - lead + 1))
  const shift = (months: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + months, 1))

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Pressable accessibilityLabel="Previous month" accessibilityRole="button" hitSlop={10} onPress={() => shift(-1)} style={styles.nav}><QuantumText variant="h3">‹</QuantumText></Pressable>
        <QuantumText variant="label" style={styles.month}>{cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</QuantumText>
        <Pressable accessibilityLabel="Next month" accessibilityRole="button" hitSlop={10} onPress={() => shift(1)} style={styles.nav}><QuantumText variant="h3">›</QuantumText></Pressable>
      </View>
      <View style={styles.grid}>
        {WEEKDAYS.map((day, index) => <QuantumText key={`${day}${index}`} variant="caption" color={quantumColors.neutral300} style={styles.weekday}>{day}</QuantumText>)}
        {cells.map((date) => {
          const key = dayKey(date)
          const list = byDay.get(key) || []
          const selected = key === selectedDay
          return (
            <Pressable accessibilityLabel={`${date.toDateString()}, ${list.length} items`} accessibilityRole="button" key={key} onPress={() => onSelectDay?.(key)} style={[styles.cell, date.getMonth() !== cursor.getMonth() && styles.out, key === today && { borderColor: accent }, selected && { backgroundColor: `${accent}33` }]}>
              <QuantumText variant="caption" color={key === today ? accent : undefined}>{date.getDate()}</QuantumText>
              <View style={styles.dots}>{list.slice(0, 3).map((item) => <View key={item.id} style={[styles.dot, { backgroundColor: toneColor[item.tone || 'info'] }]} />)}</View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nav: { paddingHorizontal: 12, paddingVertical: 2 },
  month: { flex: 1, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: `${100 / 7}%`, textAlign: 'center', paddingBottom: 4 },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'transparent', gap: 2 },
  out: { opacity: 0.35 },
  dots: { flexDirection: 'row', gap: 2, height: 5 },
  dot: { width: 5, height: 5, borderRadius: 3 },
})
