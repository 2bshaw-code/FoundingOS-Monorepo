/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Modal, Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types'

// Premium floating "pill" tab bar replacing the flat, edge-to-edge default tab bar. Shows at
// most `maxVisible` primary tabs plus a "More" tab that opens a bottom sheet listing any
// remaining routes — this is what keeps the bar from ever looking crowded, no matter how many
// screens a brand's console has. Routes are still real expo-router tabs underneath (deep
// links, back button, state persistence all keep working); this only changes how they're
// presented.
export function QuantumTabBar({
  accent,
  maxVisible = 4,
  icons,
  state,
  descriptors,
  navigation,
}: {
  accent: string
  maxVisible?: number
  icons: Record<string, (props: { color: string; size?: number }) => React.ReactNode>
} & BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const [moreOpen, setMoreOpen] = useState(false)

  const routes = state.routes.filter((route) => {
    const options = descriptors[route.key]?.options as { href?: unknown; tabBarShowLabel?: boolean } | undefined
    return options?.href !== null
  })

  const primary = routes.slice(0, maxVisible)
  const overflow = routes.slice(maxVisible)
  const hasOverflow = overflow.length > 0

  return (
      <>
        <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.bar}>
            <LinearGradient
              colors={['rgba(17,22,31,0.94)', 'rgba(11,14,20,0.98)']}
              style={StyleSheet.absoluteFill}
            />
            {primary.map((route) => {
              const index = state.routes.findIndex((r) => r.key === route.key)
              const isFocused = state.index === index
              const options = descriptors[route.key].options
              const label = (options.title ?? route.name) as string
              const Icon = icons[route.name] ?? icons.default

              const onPress = () => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
                if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name)
              }

              return (
                <Pressable key={route.key} onPress={onPress} style={styles.item} hitSlop={6}>
                  <View style={[styles.iconWrap, isFocused && { backgroundColor: `${accent}22` }]}>
                    {Icon ? Icon({ color: isFocused ? accent : '#7c8797', size: 20 }) : null}
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[styles.label, { color: isFocused ? accent : '#7c8797' }, isFocused && styles.labelActive]}
                  >
                    {label}
                  </Text>
                </Pressable>
              )
            })}

            {hasOverflow ? (
              <Pressable onPress={() => setMoreOpen(true)} style={styles.item} hitSlop={6}>
                <View style={styles.iconWrap}>
                  <MoreDots color="#7c8797" />
                </View>
                <Text style={[styles.label, { color: '#7c8797' }]}>More</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {hasOverflow ? (
          <Modal visible={moreOpen} transparent animationType="fade" onRequestClose={() => setMoreOpen(false)}>
            <Pressable style={styles.backdrop} onPress={() => setMoreOpen(false)}>
              <View />
            </Pressable>
            <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>More</Text>
              {overflow.map((route) => {
                const index = state.routes.findIndex((r) => r.key === route.key)
                const isFocused = state.index === index
                const options = descriptors[route.key].options
                const label = (options.title ?? route.name) as string
                const Icon = icons[route.name] ?? icons.default
                return (
                  <Pressable
                    key={route.key}
                    style={styles.sheetItem}
                    onPress={() => {
                      setMoreOpen(false)
                      navigation.navigate(route.name)
                    }}
                  >
                    <View style={[styles.iconWrap, isFocused && { backgroundColor: `${accent}22` }]}>
                      {Icon ? Icon({ color: isFocused ? accent : '#dbe2ea', size: 20 }) : null}
                    </View>
                    <Text style={[styles.sheetItemText, isFocused && { color: accent }]}>{label}</Text>
                  </Pressable>
                )
              })}
            </View>
          </Modal>
        ) : null}
      </>
    )
}

// tabBar in expo-router/react-navigation is invoked as a plain function call inside a
// SafeAreaInsetsContext.Consumer render-prop, not mounted as JSX — calling hooks (like
// useSafeAreaInsets) directly inside that function violates the Rules of Hooks and crashes
// with "Invalid hook call" the moment the tab bar renders. Wrapping it in a real component
// and returning a factory that renders `<QuantumTabBar {...props} .../>` via JSX fixes this,
// since JSX-rendered components get a proper fiber and hooks work normally.
export function createQuantumTabBar(config: { accent: string; maxVisible?: number; icons: Record<string, (props: { color: string; size?: number }) => React.ReactNode> }) {
  return function TabBar(props: BottomTabBarProps) {
    return <QuantumTabBar {...config} {...props} />
  }
}

function MoreDots({ color }: { color: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingHorizontal: 16 },
  bar: {
    flexDirection: 'row',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    paddingHorizontal: 6,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 4 },
  iconWrap: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10.5, fontWeight: '600' },
  labelActive: { fontWeight: '800' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#11161f', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 10, paddingHorizontal: 16, gap: 4,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#333d4a', alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { color: '#7c8797', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  sheetItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  sheetItemText: { color: '#dbe2ea', fontSize: 15, fontWeight: '600' },
})
