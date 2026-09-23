/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types'
import { PRESS_SPRING, SETTLE_SPRING, useReducedMotionPreference } from '../lib/motion'

// Compact enterprise tab bar. Shows at
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
  const reduceMotion = useReducedMotionPreference()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetMounted, setSheetMounted] = useState(false)
  const sheetProgress = useSharedValue(0)

  const openMore = () => {
    setSheetMounted(true)
    setSheetOpen(true)
  }
  const closeMore = () => setSheetOpen(false)

  useEffect(() => {
    if (sheetOpen) {
      sheetProgress.value = reduceMotion ? 1 : withSpring(1, SETTLE_SPRING)
    } else if (sheetMounted) {
      if (reduceMotion) {
        sheetProgress.value = 0
        setSheetMounted(false)
      } else {
        sheetProgress.value = withSpring(0, SETTLE_SPRING, (finished) => {
          if (finished) runOnJS(setSheetMounted)(false)
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen, reduceMotion])

  const backdropStyle = useAnimatedStyle(() => ({ opacity: sheetProgress.value }))
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(sheetProgress.value, [0, 1], [420, 0]) }],
  }))

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
                <TabIcon
                  key={route.key}
                  onPress={onPress}
                  isFocused={isFocused}
                  accent={accent}
                  label={label}
                  reduceMotion={reduceMotion}
                >
                  {Icon ? Icon({ color: isFocused ? accent : '#7c8797', size: 20 }) : null}
                </TabIcon>
              )
            })}

            {hasOverflow ? (
              <TabIcon onPress={openMore} isFocused={false} accent={accent} label="More" reduceMotion={reduceMotion}>
                <MoreDots color="#7c8797" />
              </TabIcon>
            ) : null}
          </View>
        </View>

        {hasOverflow ? (
          <Modal visible={sheetMounted} transparent animationType="none" onRequestClose={closeMore}>
            <Animated.View style={[styles.backdrop, backdropStyle]}>
              <Pressable style={StyleSheet.absoluteFill} onPress={closeMore} />
            </Animated.View>
            <Animated.View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }, sheetStyle]}>
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
                      closeMore()
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
            </Animated.View>
          </Modal>
        ) : null}
      </>
    )
}

// Extracted so each tab item owns its own press shared value (a hook can't be
// called once-per-iteration inside a parent's .map(), only inside its own
// component). Drives a subtle scale-down on the icon chip on press-in,
// springing back on release — skipped entirely under Reduce Motion.
function TabIcon({
  onPress,
  isFocused,
  accent,
  label,
  reduceMotion,
  children,
}: {
  onPress: () => void
  isFocused: boolean
  accent: string
  label: string
  reduceMotion: boolean
  children: React.ReactNode
}) {
  const press = useSharedValue(0)
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - press.value * 0.12 }],
  }))

  const handlePressIn = () => {
    if (reduceMotion) return
    press.value = withSpring(1, PRESS_SPRING)
  }
  const handlePressOut = () => {
    press.value = reduceMotion ? 0 : withSpring(0, PRESS_SPRING)
  }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.item} hitSlop={6}>
      <Animated.View style={[styles.iconWrap, isFocused && { backgroundColor: `${accent}22` }, animatedIconStyle]}>
        {children}
      </Animated.View>
      <Text
        numberOfLines={1}
        style={[styles.label, { color: isFocused ? accent : '#7c8797' }, isFocused && styles.labelActive]}
      >
        {label}
      </Text>
    </Pressable>
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
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingHorizontal: 0 },
  bar: {
    flexDirection: 'row',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 7,
    paddingHorizontal: 4,
    width: '100%',
    maxWidth: 1100,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 6 },
  iconWrap: { width: 32, height: 29, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11.5, fontWeight: '700' },
  labelActive: { fontWeight: '800' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#11161f', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 10, paddingHorizontal: 16, gap: 4,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#333d4a', alignSelf: 'center', marginBottom: 12 },
  sheetTitle: { color: '#7c8797', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  sheetItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  sheetItemText: { color: '#dbe2ea', fontSize: 17, fontWeight: '600' },
})
