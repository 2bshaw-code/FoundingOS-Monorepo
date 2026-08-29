/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState, type ReactNode } from 'react'
import { Routes } from 'react-router-dom'
import { BobAssistant } from '@founder-os/ui'
import { authClient } from '../../auth'
import { FoundThisConsoleRoutes } from '../../foundit/FoundThisConsoleRoutes'

function ConsoleWithBob({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div className="theme-foundit">{children}<button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#FFD600] text-lg font-bold text-[#2E2E2E] shadow-xl" aria-label="Open Bob AI">B</button>{open && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4"><div className="mx-auto max-w-3xl"><button type="button" onClick={() => setOpen(false)} className="mb-2 bg-white px-4 py-2 font-semibold">Close Bob</button><BobAssistant client={authClient} appName="FoundThis" /></div></div>}</div>
}

export function FoundThisConsole() {
  return <Routes>{FoundThisConsoleRoutes({ Wrapper: ConsoleWithBob })}</Routes>
}
