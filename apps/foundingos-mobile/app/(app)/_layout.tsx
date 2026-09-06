/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ReactNode, useState } from 'react'
import { Tabs } from 'expo-router'
import { Text, View, Pressable, StyleSheet, type PressableProps } from 'react-native'
import { BRANDS } from '../../lib/brands'
import { FOUNDINGOS_SHELL_THEME, useQuantumStore } from '../../lib/store'
import { QuantumWheelModal } from '../../components/QuantumWheel'
import { CommandBarModal } from '../../components/CommandBar'
import { FloatingFoundAIButton } from '../../components/FloatingFoundAIButton'
import { MultimodalCaptureModal, AIConfirmationModal, AIConfirmationData } from '../../components/MultimodalCaptureModal'
import { getScreenHeaderOptions, quantumColors, quantumRadius, quantumSpace } from '../../components/QuantumUI'
import { QuantumOverlay, QuantumShellFooter, QuantumShellHeaderBackdrop, QuantumShellHeaderTitle } from '../../components/QuantumShellVisuals'

export default function AppTabsLayout() {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const setCommandBarOpen = useQuantumStore((state) => state.setCommandBarOpen)
  const setQuantumWheelOpen = useQuantumStore((state) => state.setQuantumWheelOpen)
  const shellTheme = FOUNDINGOS_SHELL_THEME
  const activeBrand = BRANDS.find((brand) => brand.slug === activeBrandSlug) ?? BRANDS[0]
  const activeBrandName = activeBrand?.name ?? 'FoundingOS'
  const shellAccent = shellTheme.accent

  const [captureType, setCaptureType] = useState<'voice' | 'photo' | 'video' | null>(null)
  const [confirmationData, setConfirmationData] = useState<AIConfirmationData | null>(null)
  const renderHeaderTitle = (title: string) => <QuantumShellHeaderTitle title={title} brandName={activeBrandName} accent={shellAccent} />
  const renderTabButton = (props: PressableProps & { children?: ReactNode; accessibilityState?: { selected?: boolean } }) => (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.tabButton,
        {
          backgroundColor: props.accessibilityState?.selected ? shellTheme.cardBg : shellTheme.bgSecondary,
          borderColor: props.accessibilityState?.selected ? shellAccent : shellTheme.borderColor,
          shadowColor: props.accessibilityState?.selected ? shellAccent : shellTheme.bgPrimary,
          opacity: pressed ? 0.86 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    />
  )

  return (
    <View style={[styles.root, { backgroundColor: shellTheme.bgPrimary }]}>
      <QuantumOverlay accent={shellAccent} shellTheme={shellTheme} />
      <Tabs
        screenOptions={{
          ...getScreenHeaderOptions(shellTheme),
          headerTitleAlign: 'left',
          headerStyle: styles.headerStyle,
          headerBackground: () => <QuantumShellHeaderBackdrop theme={shellTheme} accent={shellAccent} />,
          tabBarStyle: {
            backgroundColor: shellTheme.bgSecondary,
            borderTopColor: shellTheme.borderColor,
            minHeight: 72,
            paddingTop: quantumSpace.sm,
            paddingBottom: quantumSpace.sm,
          },
          tabBarBackground: () => <View style={[styles.tabBackdrop, { backgroundColor: shellTheme.cardBg, borderColor: shellTheme.borderColor }]} />,
          tabBarButton: renderTabButton,
          tabBarItemStyle: styles.tabItem,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: shellAccent,
          tabBarInactiveTintColor: quantumColors.neutral500,
          sceneStyle: { backgroundColor: 'transparent' },
          animation: 'shift',
          headerRight: () => (
            <View style={styles.headerRightRow}>
              <Pressable style={[styles.headerBtn, { borderColor: shellAccent, backgroundColor: shellTheme.cardBg, shadowColor: shellAccent }]} onPress={() => setQuantumWheelOpen(true)}>
                <Text style={[styles.headerBtnText, { color: shellAccent }]}>Wheel</Text>
              </Pressable>
              <Pressable style={[styles.headerBtn, { borderColor: shellAccent, backgroundColor: shellTheme.cardBg, shadowColor: shellAccent }]} onPress={() => setCommandBarOpen(true)}>
                <Text style={[styles.headerBtnText, { color: shellAccent }]}>Cmd</Text>
              </Pressable>
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerTitle: () => renderHeaderTitle('QuantumOS Home'),
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>⌂</Text>,
          }}
        />
        <Tabs.Screen
          name="workflows"
          options={{
            title: 'Workflows',
            headerTitle: () => renderHeaderTitle('Workflows & Bolt-Ons'),
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>⚡</Text>,
          }}
        />
        <Tabs.Screen
          name="data"
          options={{
            title: 'Data',
            headerTitle: () => renderHeaderTitle('Data & Offline Outbox'),
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>▦</Text>,
          }}
        />
        <Tabs.Screen
          name="automation"
          options={{
            title: 'Automation',
            headerTitle: () => renderHeaderTitle('WhatsApp & AI Automation'),
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>◈</Text>,
          }}
        />
        <Tabs.Screen
          name="brands"
          options={{
            title: 'Brands',
            headerTitle: () => renderHeaderTitle('Control Room Directory'),
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>◆</Text>,
          }}
        />
        {/* Hidden legacy screens */}
        <Tabs.Screen name="activity" options={{ href: null }} />
        <Tabs.Screen name="superdash" options={{ href: null }} />
        <Tabs.Screen name="guardian" options={{ href: null }} />
        <Tabs.Screen name="ai-actions" options={{ href: null }} />
      </Tabs>
      <QuantumShellFooter brandName={activeBrandName} accent={shellAccent} shellTheme={shellTheme} />
      <FloatingFoundAIButton />

      {/* Global Overlays */}
      <QuantumWheelModal />
      <CommandBarModal onOpenMultimodal={(type) => setCaptureType(type)} />
      <MultimodalCaptureModal
        visible={!!captureType}
        captureType={captureType}
        onClose={() => setCaptureType(null)}
        onConfirmationReady={(data) => setConfirmationData(data)}
      />
      <AIConfirmationModal data={confirmationData} onClose={() => setConfirmationData(null)} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerStyle: {
    backgroundColor: 'transparent',
  },
  tabBackdrop: {
    flex: 1,
    borderTopWidth: 1,
    opacity: 0.96,
  },
  tabItem: {
    paddingHorizontal: quantumSpace.xs,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 3,
    marginVertical: quantumSpace.xs,
    borderWidth: 1,
    borderRadius: quantumRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: quantumSpace.xs,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  headerRightRow: { flexDirection: 'row', gap: quantumSpace.xs, marginRight: quantumSpace.md, flexShrink: 0 },
  headerBtn: {
    borderWidth: 1,
    borderRadius: quantumRadius.pill,
    paddingVertical: quantumSpace.xs,
    paddingHorizontal: quantumSpace.sm,
    justifyContent: 'center',
    minWidth: 48,
    maxWidth: 64,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  headerBtnText: { fontSize: 10, fontWeight: '900', textAlign: 'center' },
  tabIcon: { fontSize: 18, fontWeight: '900' },
  tabLabel: { fontSize: 11, fontWeight: '800' },
})
