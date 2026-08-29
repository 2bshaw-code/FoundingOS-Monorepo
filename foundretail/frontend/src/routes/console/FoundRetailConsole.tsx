/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState, type ReactNode } from 'react'
import { Routes } from 'react-router-dom'
import { BobAssistant } from '@founder-os/ui'
import { authClient } from '../../auth'
import { FoundRetailConsoleRoutes } from '../../foundretail/FoundRetailConsoleRoutes'

function ConsoleWithBob({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div className="theme-foundretail">{children}<button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-lg font-bold text-white shadow-xl" aria-label="Open Bob AI">B</button>{open && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4"><div className="mx-auto max-w-3xl"><button type="button" onClick={() => setOpen(false)} className="mb-2 rounded bg-white px-4 py-2 font-semibold">Close Bob</button><BobAssistant client={authClient} appName="FoundRetail" /></div></div>}</div>
}

export function FoundRetailConsole() {
  return <Routes>{FoundRetailConsoleRoutes({ Wrapper: ConsoleWithBob })}</Routes>
}
