/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Keeps the home screen widget and Lock Screen/Dynamic Island Live Activity in sync with the
// real approvals queue. This is the single place that writes to the shared App Group storage
// and starts/updates/ends the Live Activity — called from lib/approvals-queue.ts's facade
// alongside the existing haptics/notifications wiring, so every screen that reads the queue
// keeps the widget current for free.
//
// Fully guarded for platforms/builds where the native pieces don't exist yet: on web, on
// Android (no Live Activity/widget support written yet), and in Expo Go (no custom native
// modules) this becomes a no-op rather than throwing.
import { Platform } from 'react-native'

import type { ApprovalsQueueItem } from './services/approvalsService'

const APP_GROUP = 'group.com.foundingos.quantum'

type ExtensionStorageLike = {
  new (appGroup: string): { set(key: string, value: string | number): void }
  reloadWidget(name?: string): void
}

type BridgeModuleLike = {
  isSupported(): boolean
  startOrUpdateActivity(pendingCount: number, topItemTitle: string): boolean
  endActivity(): void
}

let extensionStorage: ExtensionStorageLike | null = null
let bridge: BridgeModuleLike | null = null

function loadNativeModules() {
  if (Platform.OS !== 'ios') return
  try {
    // Lazy/try-required: absent entirely in Expo Go and in web bundles, and only present after
    // an EAS build that includes the `@bacons/apple-targets` config plugin + widget target.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    extensionStorage = require('@bacons/apple-targets').ExtensionStorage
  } catch {
    extensionStorage = null
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    bridge = require('../modules/approvals-widget-bridge/src/ApprovalsWidgetBridgeModule').default
  } catch {
    bridge = null
  }
}

loadNativeModules()

function topItemTitle(items: ApprovalsQueueItem[]): string | null {
  const pending = items.filter((item) => item.requiresApproval && item.status === 'proposed')
  if (pending.length === 0) return null
  // Oldest first — matches the "what needs my attention" ordering used elsewhere (AI command
  // bar, Today screen), so the widget/Live Activity never disagrees with the in-app queue.
  const sorted = [...pending].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  return sorted[0].title
}

// Called from fetchApprovalsQueue() on every refresh. Safe to call unconditionally on any
// platform/build — becomes a no-op wherever the native pieces aren't present.
export function syncApprovalsWidget(items: ApprovalsQueueItem[]) {
  if (Platform.OS !== 'ios') return

  const pending = items.filter((item) => item.requiresApproval && item.status === 'proposed')
  const title = topItemTitle(items)

  if (extensionStorage) {
    try {
      const storage = new extensionStorage(APP_GROUP)
      storage.set('approvalsPendingCount', pending.length)
      storage.set('approvalsTopItemTitle', title ?? '')
      extensionStorage.reloadWidget('widget')
    } catch {
      // Widget target not present in this build (e.g. dev client built before this feature) —
      // fail silently rather than crash the approvals queue for an unrelated feature.
    }
  }

  if (bridge) {
    try {
      if (pending.length > 0 && title) {
        bridge.startOrUpdateActivity(pending.length, title)
      } else {
        bridge.endActivity()
      }
    } catch {
      // Same fail-open reasoning as above.
    }
  }
}
