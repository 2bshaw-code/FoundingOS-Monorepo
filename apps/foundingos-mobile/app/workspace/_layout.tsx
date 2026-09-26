/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Stack } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Workspace screens have no navigation header, so keep their content clear of
// the status bar (clock, notch, Dynamic Island).
export default function WorkspaceLayout() {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, gestureEnabled: true }} />
    </View>
  )
}
