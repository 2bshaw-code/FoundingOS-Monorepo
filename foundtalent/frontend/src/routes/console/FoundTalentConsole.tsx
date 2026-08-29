/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState, type ReactNode } from 'react'
import { Routes } from 'react-router-dom'
import { FoundAIAssistant } from '@founder-os/ui'
import { authClient } from '../../auth'
import { FoundTalentConsoleRoutes } from '../../foundtalent/FoundTalentConsoleRoutes'

function ConsoleWithFoundAI({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div className="theme-foundtalent">{children}<button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#F97316] text-lg font-bold text-white shadow-xl" aria-label="Open FoundAI">AI</button>{open && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4"><div className="mx-auto max-w-3xl"><button type="button" onClick={() => setOpen(false)} className="mb-2 bg-white px-4 py-2 font-semibold text-[#F97316]">Close FoundAI</button><FoundAIAssistant client={authClient} appName="FoundTalent" /></div></div>}</div>
}

export function FoundTalentConsole() {
  return <Routes>{FoundTalentConsoleRoutes({ Wrapper: ConsoleWithFoundAI })}</Routes>
}
