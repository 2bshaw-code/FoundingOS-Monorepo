/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import FoundingOSFooter from './components/FoundingOSFooter'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { FounderSitePage } from './founder-site/FounderSitePage'
import { Home, PricingPage, OnboardingPage, DocumentationPage, SupportPage, StatusPage, CompanyAboutPage, CompanyCareersPage, CompanyPressPage, CompanySocialPage, CompanyContactPage, LegalTermsPage, LegalPrivacyPage, LegalCookiesPage, LegalCompliancePage, LegalSecurityPage } from './pages/Home'
import { OPEN_FOUND_AI_PANEL_EVENT } from './bob-open'

function GlobalFounderAI() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([{ from: 'foundai', text: 'FoundAI is ready to help with FoundingOS onboarding, the console, and company control.' }])
  const context = useMemo(() => {
    if (location.pathname === '/console' || location.pathname === '/dashboard' || location.pathname === '/founder/console') return 'console'
    if (location.pathname === '/founder-site' || location.pathname === '/bob') return 'company hub'
    if (location.pathname === '/pricing' || location.pathname === '/onboarding') return 'onboarding'
    return 'FoundingOS'
  }, [location.pathname])

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener(OPEN_FOUND_AI_PANEL_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_FOUND_AI_PANEL_EVENT, handleOpen)
  }, [])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const text = prompt.trim()
    if (!text) return
    const reply = /console|dashboard/.test(text.toLowerCase())
      ? 'FoundAI can open the console, explain the current page, and help you move through FoundingOS faster.'
      : /onboard|start|join|apply/.test(text.toLowerCase())
        ? 'FoundAI is the onboarding layer for FoundingOS and can guide users from first visit to a working console.'
        : 'FoundAI helps with FoundingOS navigation, company setup, and the next operational step.'
    setMessages((items) => [...items, { from: 'user', text }, { from: 'foundai', text: reply }])
    setPrompt('')
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="bob-ai-circle fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#006CFF] text-xl font-bold text-white shadow-xl" aria-label="Open FoundAI">AI</button>
      {open && (
        <section className="fixed inset-x-4 bottom-4 z-50 ml-auto max-w-sm overflow-hidden rounded-lg border border-[#8BBEFF] bg-white shadow-2xl sm:right-6">
          <header className="flex items-center justify-between bg-[#006CFF] px-4 py-3 text-white">
            <strong>FoundAI · {context}</strong>
            <button type="button" onClick={() => setOpen(false)} className="text-2xl" aria-label="Close FoundAI">×</button>
          </header>
          <div className="max-h-72 space-y-3 overflow-y-auto bg-[#F5F7FA] p-4">
            {messages.map((message, index) => (
              <p key={`${message.from}-${index}`} className={`w-fit max-w-[88%] rounded-lg px-3 py-2 text-sm leading-6 ${message.from === 'user' ? 'ml-auto bg-[#D8E9FF]' : 'bg-white'}`}>{message.text}</p>
            ))}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-[#D9E3F0] p-3">
            <input value={prompt} onChange={(event) => setPrompt(event.target.value)} className="min-w-0 flex-1 rounded border border-[#A8BDD7] px-3 py-2 text-sm" placeholder="Ask FoundAI about FoundingOS" />
            <button className="rounded bg-[#006CFF] px-4 font-semibold text-white">Send</button>
          </form>
        </section>
      )}
    </>
  )
}

function OpenNewFounderConsole() {
  useEffect(() => {
    window.location.replace('http://localhost:4000/console')
  }, [])

  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <GlobalFounderAI />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/founder-site" element={<FounderSitePage />} />
        <Route path="/foundai" element={<FounderSitePage />} />
        <Route path="/bob" element={<FounderSitePage />} />
        <Route path="/login" element={<OpenNewFounderConsole />} />
        <Route path="/founder/auth/login" element={<OpenNewFounderConsole />} />
        <Route path="/console" element={<OpenNewFounderConsole />} />
        <Route path="/dashboard" element={<OpenNewFounderConsole />} />
        <Route path="/founder/console" element={<OpenNewFounderConsole />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/company/about" element={<CompanyAboutPage />} />
        <Route path="/company/careers" element={<CompanyCareersPage />} />
        <Route path="/company/press" element={<CompanyPressPage />} />
        <Route path="/company/social" element={<CompanySocialPage />} />
        <Route path="/company/contact" element={<CompanyContactPage />} />
        <Route path="/legal/terms" element={<LegalTermsPage />} />
        <Route path="/legal/privacy" element={<LegalPrivacyPage />} />
        <Route path="/legal/cookies" element={<LegalCookiesPage />} />
        <Route path="/legal/compliance" element={<LegalCompliancePage />} />
        <Route path="/legal/security" element={<LegalSecurityPage />} />
      </Routes>
      <FoundingOSFooter />
    </BrowserRouter>
  )
}
