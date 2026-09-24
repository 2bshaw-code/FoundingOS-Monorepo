/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { brands } from '@foundingos/config'
import { QuantumHeader } from '@foundingos/ui/quantum'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../lib/tenant-session'
import { RecordsBoard, type WorkspaceRecordDTO } from './records-board'
import { WORKSPACE_OPTIONS } from './workspace-options'

export const dynamic = 'force-dynamic'

// Real, generic workspace records for a signed-in account — the console's second module
// backed by Core.Operations' actual database instead of demo/seeded data (after Sales
// Pipeline). Same generic backend the mobile app uses for every one of its module screens
// (apps/foundingos-mobile/lib/core-operations-api.ts: fetchWorkspaceRecords).
async function fetchInitialRecords(workspace: string, moduleId: string): Promise<WorkspaceRecordDTO[] | null> {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return null
  try {
    const response = await fetch(`${apiRoot}/ops/platform/workspaces/${encodeURIComponent(workspace)}/${encodeURIComponent(moduleId)}/records`, {
      headers: { authorization: 'Bearer ' + token },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) return null
    const body = await response.json().catch(() => ({})) as { success?: boolean; data?: WorkspaceRecordDTO[] }
    return body.data ?? []
  } catch {
    return null
  }
}

export default async function ConsoleRecordsPage({ searchParams }: { searchParams: { workspace?: string; module?: string } }) {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  if (!token) redirect('/login')

  const workspace = WORKSPACE_OPTIONS.some((option) => option.slug === searchParams.workspace) ? searchParams.workspace! : 'retail'
  const moduleId = searchParams.module || WORKSPACE_OPTIONS.find((option) => option.slug === workspace)?.defaultModule || 'tasks'

  const records = await fetchInitialRecords(workspace, moduleId)
  if (records === null) redirect('/login')

  return (
    <main className="q-shell q-login-shell">
      <QuantumHeader
        brand={brands.foundingos}
        eyebrow="Records"
        title="Workspace records"
        description="Real, saved records for your account across every enabled workspace — pick a workspace and module below."
      />
      <RecordsBoard workspace={workspace} moduleId={moduleId} initialRecords={records} />
    </main>
  )
}
