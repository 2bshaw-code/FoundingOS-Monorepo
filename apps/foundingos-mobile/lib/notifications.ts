/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Actionable local notifications for the Approvals/Guardian queue. There is
// no backend that pushes these remotely today (see docs/telemetry.md-style
// honesty about scope) — notifyNewApprovals fires a *local* notification the
// moment the app itself observes a fresh item awaiting a decision (e.g. on
// tab focus or pull-to-refresh), and the Approve/Reject buttons on the
// notification call the exact same approve/reject path the in-app buttons
// use. True server-triggered push (someone gets notified without ever
// opening the app) needs a backend sender and is out of scope for a
// mobile-only change.
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { Platform } from 'react-native'
import { hapticError, hapticSuccess, hapticWarning } from './haptics'
import { getApprovalsService } from './services/approvalsService'
import type { ApprovalsQueueItem } from './services/approvalsService'

const APPROVAL_CATEGORY = 'approval-action'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

let categoriesReady = false
// Resets on every app cold start by design — the goal is "notify me about
// approvals that appeared while I've had the app open this session", not a
// durable read/unread ledger, which would need real persistence and a sync
// story with the server's own queue state.
const notifiedIds = new Set<string>()
let responseSubscription: Notifications.Subscription | null = null

async function ensureCategories() {
  if (categoriesReady || Platform.OS === 'web') return
  categoriesReady = true
  await Notifications.setNotificationCategoryAsync(APPROVAL_CATEGORY, [
    { identifier: 'approve', buttonTitle: 'Approve', options: { opensAppToForeground: false } },
    { identifier: 'reject', buttonTitle: 'Reject', options: { opensAppToForeground: false, isDestructive: true } },
  ])
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web' || !Device.isDevice) return false
  const existing = await Notifications.getPermissionsAsync()
  if (existing.granted) return true
  const requested = await Notifications.requestPermissionsAsync()
  return requested.granted
}

// Registers for a push token using the EAS project already configured in
// app.base.json. Returned/stored for whenever a backend exists to send to —
// registering it now costs nothing and means no further client work is
// needed once that backend exists.
export async function registerPushToken(projectId: string): Promise<string | null> {
  if (Platform.OS === 'web' || !Device.isDevice) return null
  try {
    const granted = await requestNotificationPermission()
    if (!granted) return null
    const token = await Notifications.getExpoPushTokenAsync({ projectId })
    return token.data
  } catch {
    return null
  }
}

export async function notifyNewApprovals(items: ApprovalsQueueItem[]): Promise<void> {
  if (Platform.OS === 'web' || !Device.isDevice) return
  const pending = items.filter((item) => item.status === 'proposed' && item.requiresApproval && !notifiedIds.has(item.id))
  if (pending.length === 0) return
  const granted = await requestNotificationPermission()
  if (!granted) return
  await ensureCategories()
  for (const item of pending) {
    notifiedIds.add(item.id)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Action needs your approval',
        body: item.title,
        categoryIdentifier: APPROVAL_CATEGORY,
        // Carries the full item (not just an id) so the Approve/Reject
        // buttons below can call the real approve/reject services directly,
        // without first re-fetching the queue to look the item back up.
        data: { item },
      },
      trigger: null,
    })
  }
}

export function startNotificationResponseListener(): () => void {
  if (Platform.OS === 'web') return () => undefined
  responseSubscription = Notifications.addNotificationResponseReceivedListener(async (response) => {
    const actionId = response.actionIdentifier
    const item = response.notification.request.content.data?.item as ApprovalsQueueItem | undefined
    // Calls the same service factory approvals-queue.ts wraps (rather than
    // importing lib/approvals-queue.ts itself, which would create a
    // notifications <-> approvals-queue import cycle) — haptics are
    // duplicated here for the same tactile confirmation as an in-app tap.
    if (item && actionId === 'approve') {
      try {
        await getApprovalsService().approve(item)
        hapticSuccess()
      } catch {
        hapticError()
      }
      return
    }
    if (item && actionId === 'reject') {
      try {
        await getApprovalsService().reject(item)
        hapticWarning()
      } catch {
        hapticError()
      }
      return
    }
    // Default tap (not an action button) — open the Approvals tab so the
    // user can see full context rather than acting blind.
    router.push('/workflows')
  })
  return () => {
    responseSubscription?.remove()
    responseSubscription = null
  }
}
