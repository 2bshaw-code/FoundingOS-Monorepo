/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'
import { getHandoffUrl } from '../../lib/api'

const SUPERDASH_URL = 'https://console.foundingos.com/superdashboard'

async function openSuperDash() {
  const url = await getHandoffUrl(SUPERDASH_URL)
  await WebBrowser.openBrowserAsync(url, { controlsColor: FOUNDINGOS_ACCENT, toolbarColor: '#05060a' })
}

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0b0e14' },
        headerTintColor: '#ffffff',
        tabBarStyle: { backgroundColor: '#0b0e14', borderTopColor: '#242c38' },
        tabBarActiveTintColor: FOUNDINGOS_ACCENT,
        tabBarInactiveTintColor: '#5b6472',
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
        listeners={{
          // Real one-tap access: tapping this tab opens SuperDashboard directly (in-app
          // browser, already signed in via the SSO handoff) instead of navigating to an
          // intermediate screen that then needs a second tap on its own button.
          tabPress: (event) => {
            event.preventDefault()
            openSuperDash()
          },
        }}
      />
    </Tabs>
  )
}
