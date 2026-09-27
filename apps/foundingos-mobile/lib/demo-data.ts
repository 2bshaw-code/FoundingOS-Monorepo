/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

// Demo data: while it is on, workspace record reads and writes are served from made-up example
// records held in memory, so people can explore every tool without touching their real account.
import { moduleSamples } from '@foundingos/ui/sample-data'
import { findModule } from './workspace-modules'
import * as SecureStore from 'expo-secure-store'

export type DemoRecord = {
  id: string
  reference: string
  name: string
  status: string
  ownerId: string | null
  valuePence: number | null
  data: Record<string, unknown> | null
  version: number
  updatedAt: string
}

const OWNERS = ['Sofia Martins', 'Kofi Mensah', 'Priya Anand', 'Tom Hale']
const store = new Map<string, DemoRecord[]>()
const listeners = new Set<(on: boolean) => void>()
let enabled = false

const DEMO_KEY = 'foundingos-demo-data'

export const isDemoData = () => enabled
export function setDemoData(on: boolean) {
  if (enabled === on) return
  enabled = on
  if (!on) store.clear()
  void (on ? SecureStore.setItemAsync(DEMO_KEY, 'on') : SecureStore.deleteItemAsync(DEMO_KEY)).catch(() => undefined)
  listeners.forEach((listener) => listener(on))
}
// Remember the switch between launches, like the web app does.
void SecureStore.getItemAsync(DEMO_KEY).then((value) => { if (value === 'on') setDemoData(true) }).catch(() => undefined)
export function subscribeDemoData(listener: (on: boolean) => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

const hash = (value: string) => [...value].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 7)

function seed(workspace: string, module: string): DemoRecord[] {
  if (module === 'document-profile') return []
  const def = findModule(workspace, module)
  const statuses = def?.statuses?.length ? def.statuses : ['Active']
  const label = def?.label ?? module.replace(/-/g, ' ')
  const samples = moduleSamples(workspace, module) ?? Array.from({ length: 4 }, (_, index) => ({ name: `Example ${label.toLowerCase().replace(/s$/, '')} ${index + 1}`, secondary: `${label} example`, value: undefined as string | undefined }))
  return samples.map((sample, index) => {
    const h = hash(`${workspace}:${module}:${index}`)
    const money = sample.value && /£/.test(sample.value) ? Math.round(Number(sample.value.replace(/[^0-9.]/g, '')) * 100) : null
    const due = new Date(Date.now() + ((h % 21) - 5) * 86_400_000)
    return {
      id: `demo-${workspace}-${module}-${index}`,
      reference: `${module.slice(0, 3).toUpperCase()}-${101 + index}`,
      name: sample.name,
      status: statuses[h % statuses.length],
      ownerId: OWNERS[h % OWNERS.length],
      valuePence: money ?? (h % 3 === 0 ? 4_500 + (h % 180_000) : null),
      data: { secondary: sample.secondary, value: sample.value ?? '', owner: OWNERS[h % OWNERS.length], dueDate: due.toISOString(), demo: true },
      version: 1,
      updatedAt: new Date(Date.now() - index * 3_600_000).toISOString(),
    }
  })
}

const key = (workspace: string, module: string) => `${workspace}/${module}`

export function demoList(workspace: string, module: string): DemoRecord[] {
  const k = key(workspace, module)
  if (!store.has(k)) store.set(k, seed(workspace, module))
  return [...(store.get(k) ?? [])]
}

export function demoCreate(workspace: string, module: string, input: { reference: string; name: string; status: string; ownerId?: string; valuePence?: number; data?: Record<string, unknown> }): DemoRecord {
  const record: DemoRecord = { id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, reference: input.reference, name: input.name, status: input.status, ownerId: input.ownerId ?? null, valuePence: input.valuePence ?? null, data: input.data ?? {}, version: 1, updatedAt: new Date().toISOString() }
  store.set(key(workspace, module), [record, ...demoList(workspace, module)])
  return record
}

export function demoUpdate(id: string, input: { status?: string; name?: string; valuePence?: number; data?: Record<string, unknown> }): DemoRecord {
  for (const [k, list] of store) {
    const index = list.findIndex((item) => item.id === id)
    if (index < 0) continue
    const current = list[index]
    const next: DemoRecord = { ...current, ...(input.status ? { status: input.status } : {}), ...(input.name ? { name: input.name } : {}), ...(input.valuePence !== undefined ? { valuePence: input.valuePence } : {}), ...(input.data ? { data: input.data } : {}), version: current.version + 1, updatedAt: new Date().toISOString() }
    store.set(k, list.map((item, i) => (i === index ? next : item)))
    return next
  }
  throw new Error('This example record is no longer available — pull to refresh.')
}
