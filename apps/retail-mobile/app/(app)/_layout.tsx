/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { BRAND } from '../../lib/brand'

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0b0e14' },
        headerTintColor: '#ffffff',
        tabBarStyle: { backgroundColor: '#0b0e14', borderTopColor: '#242c38' },
        tabBarActiveTintColor: BRAND.accent,
        tabBarInactiveTintColor: '#5b6472',
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Console',
          headerTitle: BRAND.name,
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
