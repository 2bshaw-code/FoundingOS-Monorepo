/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0b0e14' },
        headerTintColor: '#ffffff',
        tabBarStyle: { backgroundColor: '#0b0e14', borderTopColor: '#242c38' },
        tabBarActiveTintColor: FOUNDINGOS_ACCENT,
        tabBarInactiveTintColor: '#5b6472',
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen
        name="brands"
        options={{
          title: 'Brands',
          headerTitle: 'FoundingOS',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⌂</Text>,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          headerTitle: 'Live Activity',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>◈</Text>,
        }}
      />
      <Tabs.Screen
        name="superdash"
        options={{
          title: 'SuperDash',
          headerTitle: 'SuperDashboard',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✦</Text>,
        }}
      />
      <Tabs.Screen
        name="guardian"
        options={{
          title: 'Guardian',
          headerTitle: 'Guardian',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>◈</Text>,
        }}
      />
      <Tabs.Screen
        name="ai-actions"
        options={{
          title: 'AI Actions',
          headerTitle: 'AI Actions',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✧</Text>,
        }}
      />
    </Tabs>
  )
}
