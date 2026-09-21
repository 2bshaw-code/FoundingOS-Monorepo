/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { Tabs } from 'expo-router'
import { Text, View, Pressable, StyleSheet } from 'react-native'
import { BRANDS } from '../../../lib/brands'
import { fetchLicensedSuites } from '../../../lib/core-operations-api'
import { FOUNDINGOS_SHELL_THEME, useQuantumStore } from '../../../lib/store'
import { QuantumWheelModal } from '../../../components/QuantumWheel'
import { CommandBarModal } from '../../../components/CommandBar'
import { MultimodalCaptureModal, AIConfirmationModal, AIConfirmationData } from '../../../components/MultimodalCaptureModal'
import { getScreenHeaderOptions, quantumRadius, quantumSpace } from '../../../components/QuantumUI'
import { QuantumShellHeaderBackdrop, QuantumShellHeaderTitle } from '../../../components/QuantumShellVisuals'
import { createQuantumTabBar } from '../../../components/QuantumTabBar'
import { HomeIcon, SparkleIcon, LayersIcon, PulseIcon, CompassIcon, ChartIcon, TagIcon, BriefcaseIcon } from '../../../components/icons'

export default function AppTabsLayout() {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const setCommandBarOpen = useQuantumStore((state) => state.setCommandBarOpen)
  const setQuantumWheelOpen = useQuantumStore((state) => state.setQuantumWheelOpen)
  const licensedSuites = useQuantumStore((state) => state.licensedSuites)
  const setLicensedSuites = useQuantumStore((state) => state.setLicensedSuites)
  const shellTheme = FOUNDINGOS_SHELL_THEME
  const activeBrand = BRANDS.find((brand) => brand.slug === activeBrandSlug) ?? BRANDS[0]
  const activeWorkspaceName = activeBrand?.name ?? 'FoundingOS Home'
  const shellAccent = shellTheme.accent

  const [captureType, setCaptureType] = useState<'voice' | 'photo' | 'video' | null>(null)
  const [confirmationData, setConfirmationData] = useState<AIConfirmationData | null>(null)
  const renderHeaderTitle = (title: string) => <QuantumShellHeaderTitle title={title} brandName={activeWorkspaceName} accent={shellAccent} />

  // Suite tab visibility is driven by real TenantSuiteLicense records via the
  // Core.Operations /module-access endpoint — not hardcoded. Re-checked on
  // every mount of the authenticated shell.
  useEffect(() => {
    let cancelled = false
    fetchLicensedSuites().then((suites) => {
      if (!cancelled) setLicensedSuites(suites)
    })
    return () => {
      cancelled = true
    }
  }, [setLicensedSuites])

  const tabIcons = {
    home: ({ color, size }: { color: string; size?: number }) => <HomeIcon color={color} size={size} />,
    workflows: ({ color, size }: { color: string; size?: number }) => <SparkleIcon color={color} size={size} />,
    workforce: ({ color, size }: { color: string; size?: number }) => <BriefcaseIcon color={color} size={size} />,
    data: ({ color, size }: { color: string; size?: number }) => <LayersIcon color={color} size={size} />,
    automation: ({ color, size }: { color: string; size?: number }) => <PulseIcon color={color} size={size} />,
    intelligence: ({ color, size }: { color: string; size?: number }) => <ChartIcon color={color} size={size} />,
    marketing: ({ color, size }: { color: string; size?: number }) => <TagIcon color={color} size={size} />,
    brands: ({ color, size }: { color: string; size?: number }) => <CompassIcon color={color} size={size} />,
    default: ({ color, size }: { color: string; size?: number }) => <HomeIcon color={color} size={size} />,
  }

  return (
    <View style={[styles.root, { backgroundColor: shellTheme.bgPrimary }]}> 
      <Tabs
        tabBar={createQuantumTabBar({ accent: shellAccent, maxVisible: 5, icons: tabIcons })}
        screenOptions={{
          ...getScreenHeaderOptions(shellTheme),
          headerTitleAlign: 'left',
          headerStyle: styles.headerStyle,
          headerBackground: () => <QuantumShellHeaderBackdrop theme={shellTheme} accent={shellAccent} />,
          sceneStyle: { backgroundColor: 'transparent' },
          animation: 'shift',
          headerRight: () => (
            <View style={styles.headerRightRow}>
              <Pressable style={[styles.headerBtn, { borderColor: shellAccent, backgroundColor: shellTheme.cardBg, shadowColor: shellAccent }]} onPress={() => setQuantumWheelOpen(true)}>
                <Text style={[styles.headerBtnText, { color: shellAccent }]}>Switch</Text>
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
            title: 'Overview',
            headerTitle: () => renderHeaderTitle('Command Deck'),
          }}
        />
        <Tabs.Screen
          name="workflows"
          options={{
            title: 'Work',
            headerTitle: () => renderHeaderTitle('Work & Approvals'),
          }}
        />
        <Tabs.Screen
          name="workforce"
          options={{
            title: 'Hiring',
            headerTitle: () => renderHeaderTitle('Core.Workforce'),
            href: licensedSuites.core_workforce ? undefined : null,
          }}
        />
        <Tabs.Screen
          name="data"
          options={{
            title: 'Data',
            headerTitle: () => renderHeaderTitle('Data & Offline Outbox'),
          }}
        />
        <Tabs.Screen
          name="automation"
          options={{
            title: 'Automate',
            headerTitle: () => renderHeaderTitle('Messaging & Automation'),
          }}
        />
        <Tabs.Screen
          name="intelligence"
          options={{
            title: 'Intel',
            headerTitle: () => renderHeaderTitle('Core.Intelligence'),
            href: licensedSuites.core_intelligence ? undefined : null,
          }}
        />
        <Tabs.Screen
          name="marketing"
          options={{
            title: 'Marketing',
            headerTitle: () => renderHeaderTitle('Marketing Console'),
          }}
        />
        <Tabs.Screen
          name="brands"
          options={{
            title: 'Directory',
            headerTitle: () => renderHeaderTitle('Workspace Directory'),
          }}
        />
      </Tabs>
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
  headerBtnText: { fontSize: 12, fontWeight: '900', textAlign: 'center' },
})
