/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect } from 'react'
import { Tabs } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import { BRANDS } from '../../../lib/brands'
import { fetchLicensedSuites } from '../../../lib/core-operations-api'
import { FOUNDINGOS_SHELL_THEME, useQuantumStore } from '../../../lib/store'
import { getScreenHeaderOptions } from '../../../components/QuantumUI'
import { QuantumShellHeaderBackdrop, QuantumShellHeaderTitle } from '../../../components/QuantumShellVisuals'
import { createQuantumTabBar } from '../../../components/QuantumTabBar'
import { HomeIcon, SparkleIcon, LayersIcon, PulseIcon, CompassIcon, ChartIcon, TagIcon, BriefcaseIcon, SearchIcon } from '../../../components/icons'

export default function AppTabsLayout() {
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const setLicensedSuites = useQuantumStore((state) => state.setLicensedSuites)
  const shellTheme = FOUNDINGOS_SHELL_THEME
  const activeBrand = BRANDS.find((brand) => brand.slug === activeBrandSlug) ?? BRANDS[0]
  const activeWorkspaceName = activeBrand?.name ?? 'FoundingOS Home'
  const shellAccent = shellTheme.accent

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
    search: ({ color, size }: { color: string; size?: number }) => <SearchIcon color={color} size={size} />,
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
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Today',
            headerTitle: () => renderHeaderTitle('Today'),
          }}
        />
        <Tabs.Screen
          name="brands"
          options={{
            title: 'Workspaces',
            headerTitle: () => renderHeaderTitle('Workspaces'),
          }}
        />
        <Tabs.Screen
          name="workflows"
          options={{
            title: 'Approvals',
            headerTitle: () => renderHeaderTitle('Approvals'),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            headerTitle: () => renderHeaderTitle('Search'),
          }}
        />
        <Tabs.Screen
          name="workforce"
          options={{
            title: 'Hiring',
            headerTitle: () => renderHeaderTitle('Core.Workforce'),
            // Reachable from the Workspaces tab's directory instead of its own
            // bottom-tab slot — keeps the tab bar to 4 clear destinations
            // instead of 8, matching the web app's workspace-first navigation.
            href: null,
          }}
        />
        <Tabs.Screen
          name="data"
          options={{
            title: 'Data',
            headerTitle: () => renderHeaderTitle('Data & Offline Outbox'),
            href: null,
          }}
        />
        <Tabs.Screen
          name="automation"
          options={{
            title: 'Automate',
            headerTitle: () => renderHeaderTitle('Messaging & Automation'),
            href: null,
          }}
        />
        <Tabs.Screen
          name="intelligence"
          options={{
            title: 'Intel',
            headerTitle: () => renderHeaderTitle('Core.Intelligence'),
            href: null,
          }}
        />
        <Tabs.Screen
          name="marketing"
          options={{
            title: 'Marketing',
            headerTitle: () => renderHeaderTitle('Marketing Console'),
            href: null,
          }}
        />
      </Tabs>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerStyle: {
    backgroundColor: 'transparent',
  },
})
