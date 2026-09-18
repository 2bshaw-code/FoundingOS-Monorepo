'use client'

import { CompleteWorkspaceApplication, type BusinessWorkspaceSlug } from './complete-workspace-application'

export type TestWorkspaceSlug = BusinessWorkspaceSlug

export function WorkspaceTestPage({ workspace, section }: { workspace: TestWorkspaceSlug; section?: string }) {
  return <CompleteWorkspaceApplication section={section} workspace={workspace} />
}
