/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Stack } from 'expo-router'

// Workspace → module drill-down gets its own transition, distinct from the
// root Stack's fade_from_bottom (used for modal-like screens such as
// onboarding). A directional slide reads as "going deeper into a specific
// place" rather than a sheet appearing — the same visual language a founder
// would expect from a fast, native-feeling business app rather than a
// web-view wrapper.
export default function WorkspaceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
        animationDuration: 260,
        gestureEnabled: true,
      }}
    />
  )
}
