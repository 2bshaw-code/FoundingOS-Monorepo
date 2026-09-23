/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import NetInfo from '@react-native-community/netinfo'
import { useQuantumStore } from './store'
import { processOutboxSync } from './outbox-sync'
import { flushTelemetry } from './telemetry-client'

let unsubscribe: (() => void) | null = null

// Wires real device connectivity into useQuantumStore.isOnline (previously
// nothing ever called setIsOnline, so the "Online/Offline" indicator and the
// outbox's online-triggered sync were both permanently inert). Call once
// from the root layout; safe to call more than once (re-subscribes cleanly).
export function startNetworkStatusListener() {
  if (unsubscribe) unsubscribe()

  unsubscribe = NetInfo.addEventListener((state) => {
    const online = Boolean(state.isConnected && state.isInternetReachable !== false)
    const wasOnline = useQuantumStore.getState().isOnline
    useQuantumStore.getState().setIsOnline(online)

    // Flush any queued offline actions/telemetry the moment we transition
    // back online.
    if (online && !wasOnline) {
      void processOutboxSync()
      void flushTelemetry()
    }
  })

  // Seed the initial state immediately rather than waiting for the first event.
  void NetInfo.fetch().then((state) => {
    const online = Boolean(state.isConnected && state.isInternetReachable !== false)
    useQuantumStore.getState().setIsOnline(online)
  })

  return unsubscribe
}
