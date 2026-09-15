/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ModuleOption = { moduleId: string; moduleLabel: string }

export function ReassignForm({ testerId, currentModuleId, options }: { testerId: string; currentModuleId: string; options: ModuleOption[] }) {
  const router = useRouter()
  const [moduleId, setModuleId] = useState(currentModuleId)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (moduleId === currentModuleId) return
    setPending(true)
    try {
      await fetch('/api/tester/admin/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testerId, moduleId }),
      })
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="tester-reassign-form" onSubmit={onSubmit}>
      <select value={moduleId} onChange={(event) => setModuleId(event.target.value)}>
        {options.map((option) => (
          <option key={option.moduleId} value={option.moduleId}>{option.moduleLabel}</option>
        ))}
      </select>
      <button type="submit" className="btn btn-secondary" disabled={pending || moduleId === currentModuleId}>
        {pending ? 'Reassigning…' : 'Reassign'}
      </button>
    </form>
  )
}
