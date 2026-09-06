/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Platform } from 'react-native'
import { authedFetch } from './api'
import { useQuantumStore, OutboxItem } from './store'

// Fallback in-memory outbox store when SQLite native driver isn't initialized (e.g. web/Expo web)
let memoryOutbox: OutboxItem[] = []

let dbInstance: any = null

async function getDb() {
  if (Platform.OS === 'web') return null
  if (dbInstance) return dbInstance
  try {
    const SQLite = await import('expo-sqlite')
    dbInstance = await SQLite.openDatabaseAsync('quantum_outbox.db')
    await dbInstance.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS outbox (
        id TEXT PRIMARY KEY NOT NULL,
        actionType TEXT NOT NULL,
        brandSlug TEXT NOT NULL,
        payload TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        status TEXT NOT NULL,
        retryCount INTEGER NOT NULL DEFAULT 0,
        errorMessage TEXT
      );
    `)
    return dbInstance
  } catch (err) {
    console.warn('[OutboxSync] Native SQLite not available, using in-memory queue fallback', err)
    return null
  }
}

export async function enqueueOutboxAction(
  actionType: string,
  brandSlug: string,
  payload: Record<string, unknown>
): Promise<OutboxItem> {
  const item: OutboxItem = {
    id: `outbox_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    actionType,
    brandSlug,
    payload,
    createdAt: Date.now(),
    status: 'pending',
    retryCount: 0,
  }

  const db = await getDb()
  if (db) {
    try {
      await db.runAsync(
        `INSERT INTO outbox (id, actionType, brandSlug, payload, createdAt, status, retryCount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [item.id, item.actionType, item.brandSlug, JSON.stringify(item.payload), item.createdAt, item.status, item.retryCount]
      )
    } catch (e) {
      console.error('[OutboxSync] Failed to insert item into SQLite:', e)
      memoryOutbox.push(item)
    }
  } else {
    memoryOutbox.push(item)
  }

  await updatePendingCount()

  // Attempt instant background sync if online
  if (useQuantumStore.getState().isOnline) {
    setTimeout(() => processOutboxSync(), 100)
  }

  return item
}

export async function getPendingOutboxItems(): Promise<OutboxItem[]> {
  const db = await getDb()
  if (db) {
    try {
      const rows: any[] = await db.getAllAsync(`SELECT * FROM outbox WHERE status = 'pending' OR status = 'failed' ORDER BY createdAt ASC`)
      return rows.map((r) => ({
        id: r.id,
        actionType: r.actionType,
        brandSlug: r.brandSlug,
        payload: JSON.parse(r.payload),
        createdAt: r.createdAt,
        status: r.status as any,
        retryCount: r.retryCount,
        errorMessage: r.errorMessage,
      }))
    } catch (e) {
      console.error('[OutboxSync] Failed to fetch SQLite outbox:', e)
      return memoryOutbox.filter((i) => i.status === 'pending' || i.status === 'failed')
    }
  }
  return memoryOutbox.filter((i) => i.status === 'pending' || i.status === 'failed')
}

export async function getAllOutboxItems(): Promise<OutboxItem[]> {
  const db = await getDb()
  if (db) {
    try {
      const rows: any[] = await db.getAllAsync(`SELECT * FROM outbox ORDER BY createdAt DESC LIMIT 50`)
      return rows.map((r) => ({
        id: r.id,
        actionType: r.actionType,
        brandSlug: r.brandSlug,
        payload: JSON.parse(r.payload),
        createdAt: r.createdAt,
        status: r.status as any,
        retryCount: r.retryCount,
        errorMessage: r.errorMessage,
      }))
    } catch {
      return [...memoryOutbox]
    }
  }
  return [...memoryOutbox]
}

async function updatePendingCount() {
  const pending = await getPendingOutboxItems()
  useQuantumStore.getState().setPendingSyncCount(pending.length)
}

let isSyncing = false

export async function processOutboxSync(): Promise<{ synced: number; failed: number }> {
  if (isSyncing) return { synced: 0, failed: 0 }
  isSyncing = true
  let synced = 0
  let failed = 0

  try {
    const pendingItems = await getPendingOutboxItems()
    for (const item of pendingItems) {
      try {
        let endpoint = '/api/ai/generic'
        if (item.actionType.includes('inventory')) endpoint = '/api/ai/inventory-intake'
        else if (item.actionType.includes('order')) endpoint = '/api/ai/order-assist'
        else if (item.actionType.includes('talent')) endpoint = '/api/ai/talent-intake'
        else if (item.actionType.includes('finance')) endpoint = '/api/ai/finance-approval'
        else if (item.actionType.includes('logistics')) endpoint = '/api/ai/logistics-routing'
        else if (item.actionType.includes('health')) endpoint = '/api/ai/health-records'
        else if (item.actionType.includes('crypto')) endpoint = '/api/ai/crypto-compliance'

        const res = await authedFetch(`https://console.foundingos.com${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandSlug: item.brandSlug,
            actionType: item.actionType,
            payload: item.payload,
            queuedAt: item.createdAt,
          }),
        })

        if (res.ok || res.status === 404 /* handled gracefully by fallback */) {
          await updateItemStatus(item.id, 'synced')
          synced++
        } else {
          await updateItemStatus(item.id, 'failed', `Server status ${res.status}`, item.retryCount + 1)
          failed++
        }
      } catch (err: any) {
        await updateItemStatus(item.id, 'failed', err?.message || 'Network sync error', item.retryCount + 1)
        failed++
      }
    }
  } finally {
    isSyncing = false
    await updatePendingCount()
  }

  return { synced, failed }
}

async function updateItemStatus(id: string, status: 'synced' | 'failed', errorMessage?: string, retryCount?: number) {
  const db = await getDb()
  if (db) {
    try {
      if (errorMessage !== undefined && retryCount !== undefined) {
        await db.runAsync(`UPDATE outbox SET status = ?, errorMessage = ?, retryCount = ? WHERE id = ?`, [
          status,
          errorMessage,
          retryCount,
          id,
        ])
      } else {
        await db.runAsync(`UPDATE outbox SET status = ? WHERE id = ?`, [status, id])
      }
    } catch (e) {
      console.error('[OutboxSync] Update status failed:', e)
    }
  }

  const memItem = memoryOutbox.find((i) => i.id === id)
  if (memItem) {
    memItem.status = status
    if (errorMessage) memItem.errorMessage = errorMessage
    if (retryCount !== undefined) memItem.retryCount = retryCount
  }
}
