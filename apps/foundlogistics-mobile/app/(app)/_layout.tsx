/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { BRAND } from '../../lib/brand'
import { createQuantumTabBar } from '../../components/QuantumTabBar'
import { FloatingAISphere } from '../../components/FloatingAISphere'
import { HomeIcon, TruckIcon, BoxIcon, PulseIcon, SparkleIcon, LayersIcon } from '../../components/icons'

// Premium floating pill tab bar (QuantumTabBar) replaces the default flat/edge-to-edge tab
// bar — real vector icons instead of emoji, condensed to 3 visible destinations plus a "More"
// sheet for the rest, so the bar never looks cluttered regardless of how many screens this
// brand's console has. All screens are still real expo-router tabs underneath (deep links,
// back button, and state persistence keep working exactly as before).
const icons = {
  home: HomeIcon,
  deliveries: TruckIcon,
  fleet: BoxIcon,
  activity: PulseIcon,
  'ai-actions': SparkleIcon,
  settings: LayersIcon,
  default: HomeIcon,
}

export default function AppTabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={createQuantumTabBar({ accent: BRAND.accent, maxVisible: 3, icons })}
        screenOptions={{
          headerStyle: { backgroundColor: '#0b0e14' },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
          sceneStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Home', headerTitle: BRAND.name }} />
        <Tabs.Screen name="deliveries" options={{ title: 'Deliveries', headerTitle: 'Deliveries' }} />
        <Tabs.Screen name="fleet" options={{ title: 'Fleet', headerTitle: 'Fleet Status' }} />
        <Tabs.Screen name="activity" options={{ title: 'Activity', headerTitle: 'Live Activity' }} />
        <Tabs.Screen name="ai-actions" options={{ title: 'AI Actions', headerTitle: 'AI Actions' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings', headerTitle: 'Settings' }} />
        <Tabs.Screen name="about" options={{ href: null, headerTitle: 'About' }} />
      </Tabs>
      <FloatingAISphere />
    </View>
  )
}
