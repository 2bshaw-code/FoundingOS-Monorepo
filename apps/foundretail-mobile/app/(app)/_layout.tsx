/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { BRAND } from '../../lib/brand'
import { createQuantumTabBar } from '../../components/QuantumTabBar'
import { FloatingAISphere } from '../../components/FloatingAISphere'
import { HomeIcon, TagIcon, BoxIcon, PulseIcon, SparkleIcon, LayersIcon } from '../../components/icons'

const icons = {
  home: HomeIcon,
  today: TagIcon,
  inventory: BoxIcon,
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
        <Tabs.Screen name="today" options={{ title: 'Today', headerTitle: 'Today' }} />
        <Tabs.Screen name="inventory" options={{ title: 'Inventory', headerTitle: 'Inventory' }} />
        <Tabs.Screen name="activity" options={{ title: 'Activity', headerTitle: 'Live Activity' }} />
        <Tabs.Screen name="ai-actions" options={{ title: 'AI Actions', headerTitle: 'AI Actions' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings', headerTitle: 'Settings' }} />
        <Tabs.Screen name="new-sale" options={{ href: null, headerTitle: 'New Sale' }} />
        <Tabs.Screen name="about" options={{ href: null, headerTitle: 'About' }} />
      </Tabs>
      <FloatingAISphere />
    </View>
  )
}
