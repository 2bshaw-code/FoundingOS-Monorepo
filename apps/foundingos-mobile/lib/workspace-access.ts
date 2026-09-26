/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { router } from 'expo-router'
import { fetchTenantWorkspaces, getSession, logout as coreOpsLogout } from './core-operations-api'
import { logout as legacyLogout } from './api'
import { logout as workforceLogout } from './core-workforce-api'
import { WORKSPACES, WorkspaceSlug } from './workspace-modules'

// What each locked workspace costs to add, mirroring packages/config/src/commercial.ts.
export const WORKSPACE_OFFERS: Record<WorkspaceSlug, { offer: string; price: string; pitch: string }> = {
  retail: { offer: 'Included in every plan', price: 'Free', pitch: 'Sales, orders, customers and stock.' },
  marketing: { offer: 'Core plan', price: '£19/mo', pitch: 'Campaigns, content and social posts written by FoundAI.' },
  finance: { offer: 'Commerce Pro bolt-on', price: '+£25/mo', pitch: 'Invoices, bills, payments, cash flow and reconciliation.' },
  talent: { offer: 'Core.Workforce bolt-on', price: '+£29/mo', pitch: 'Hiring, onboarding, time off and payroll inputs.' },
  intelligence: { offer: 'Core.Intelligence bolt-on', price: '+£35/mo', pitch: 'Signals, forecasts, anomalies and AI recommendations.' },
  logistics: { offer: 'Logistics add-on', price: 'Ask us', pitch: 'Dispatch, routes, drivers, fleet and live tracking.' },
  health: { offer: 'Health add-on', price: 'Ask us', pitch: 'Appointments, patients, care plans and compliance.' },
}

let cached: Set<WorkspaceSlug> | null = null

// Returns the workspaces this company has switched on. `enabled` is null while
// loading or when entitlements can't be read (legacy tester sign-ins), in which
// case every workspace is shown rather than locking the user out.
export function useWorkspaceAccess() {
  const [enabled, setEnabled] = useState<Set<WorkspaceSlug> | null>(cached)
  const [loaded, setLoaded] = useState(Boolean(cached))

  const refresh = useCallback(async () => {
    const session = await getSession()
    if (!session) { setLoaded(true); return }
    try {
      const rows = await fetchTenantWorkspaces()
      const on = new Set(rows.filter((row) => row.enabled).map((row) => row.workspace as WorkspaceSlug))
      cached = rows.length ? on : null
      setEnabled(cached)
    } catch {
      // keep whatever we had
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const isEnabled = (slug: string) => !enabled || enabled.has(slug as WorkspaceSlug)
  const mine = WORKSPACES.filter((workspace) => isEnabled(workspace.slug))
  const locked = enabled ? WORKSPACES.filter((workspace) => !enabled.has(workspace.slug)) : []
  return { loaded, isEnabled, mine, locked, refresh }
}

export async function signOut() {
  cached = null
  await Promise.all([coreOpsLogout(), legacyLogout().catch(() => undefined), workforceLogout().catch(() => undefined)])
  router.replace('/')
}

// True only for the FoundingOS founder account (backend role founder_master).
export function useIsFounder() {
  const [founder, setFounder] = useState(false)
  useEffect(() => { getSession().then((session) => setFounder(session?.role === 'founder_master')) }, [])
  return founder
}
