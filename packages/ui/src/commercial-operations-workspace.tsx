'use client'

import { CoreOperationsModulePage } from './core-operations-live-console'

export function CommercialOperationsWorkspace({ moduleId }: { moduleId: string }) {
  return <CoreOperationsModulePage moduleId={moduleId} />
}
