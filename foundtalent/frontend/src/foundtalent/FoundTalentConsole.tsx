/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { AnalyticsMetricCard, Card, Header, ImageBlock, Table } from '@founder-os/ui'
import { FoundTalentBrandMark } from '@founder-os/brand-assets'
import { authClient } from '../auth'

type Job = { id: string; title: string; employer: string; region: string; salaryRange: string; source: string; skills: string[] }
type Candidate = { id: string; name: string; role: string; score: number; stage: string; location: string; notes: string }
type Dashboard = { jobs: Job[]; candidates: Candidate[]; analytics: { rolesTracked: number; applicantsScored: number; interviewsScheduled: number; averageScore: number; conversionRate: number }; intelligence: { region: string; skillShortages: string[]; salaryBenchmarks: Array<{ role: string; median: string }> } }
type WorkflowDemo = { messageType: string; intent: string; route: string; reply: string; consoleUpdates: string[] }
const multiPlatformMessaging = [
  { platform: 'WhatsApp', status: 'Live', detail: 'Candidate updates are routed into the hiring team workflow.' },
  { platform: 'Instagram DM', status: 'Queued', detail: 'Creator applicants are queued for portfolio review and follow-up.' },
  { platform: 'Messenger', status: 'Live', detail: 'Recruiter DMs are synced to active hiring conversations.' },
  { platform: 'Telegram', status: 'Queued', detail: 'Compensation and interview scheduling notes are waiting approval.' },
  { platform: 'SMS', status: 'Live', detail: 'Shortlist updates are sent to shortlisted candidates.' },
  { platform: 'iMessage', status: 'Queued', detail: 'High-priority candidate outreach is prepared for review.' },
  { platform: 'Email', status: 'Live', detail: 'Offer, rejection, and onboarding updates remain active across the tenant.' },
  { platform: 'Web Chat', status: 'Live', detail: 'Website applicants are routed into screening and recruiter follow-ups.' },
]

export function FoundTalentConsole({ title }: { title: string }) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [workflowDemo, setWorkflowDemo] = useState<WorkflowDemo | null>(null)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    authClient.request<{ success: true; data: Dashboard }>('/dashboard').then((response: { data: Dashboard }) => setDashboard(response.data)).catch((error: unknown) => setNotice(error instanceof Error ? error.message : 'FoundTalent data unavailable'))
  }, [])
  const runWorkflowDemo = async () => {
    try {
      const response = await authClient.request<{ success: true; data: WorkflowDemo }>('/whatsapp/messages', { method: 'POST', body: JSON.stringify({ text: 'Please screen this candidate CV and schedule an interview.' }) })
      setWorkflowDemo(response.data)
      setNotice('')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'FoundAI routing demo failed')
    }
  }
  return <div className="space-y-3"><button type="button" onClick={() => { window.location.href = 'http://localhost:4000/console' }} className="inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-white px-4 py-2 text-sm font-semibold text-[#1f120d] shadow-sm">↩ Back to FoundingOS</button><div className="space-y-7"><Header eyebrow="FoundTalent Console" title={title} description="Workforce intelligence, hiring analytics, and FoundAI onboarding control." /><Card><div className="flex items-center gap-3"><FoundTalentBrandMark className="h-10 w-10"/><div><p className="text-sm text-[var(--muted)]">Orange brand</p><h2 className="text-xl font-semibold">{title}</h2></div></div></Card>{notice && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{notice}</p>}{dashboard && <><Card title="FoundTalent dashboard preview"><ImageBlock variant="foundtalent-dashboard" alt="FoundTalent console preview" caption="Hiring console preview" glow="#F97316" /></Card><div className="grid gap-4 md:grid-cols-4"><AnalyticsMetricCard title="Roles tracked" value={String(dashboard.analytics.rolesTracked)} detail="Scraped from career pages"/><AnalyticsMetricCard title="Applicants scored" value={String(dashboard.analytics.applicantsScored)} detail="Matched against requirements"/><AnalyticsMetricCard title="Interviews scheduled" value={String(dashboard.analytics.interviewsScheduled)} detail="FoundAI-assisted follow-up"/><AnalyticsMetricCard title="Average score" value={String(dashboard.analytics.averageScore)} detail="AI screening output"/></div>  <div className="grid gap-5 lg:grid-cols-2"><Card title="Multi-platform hiring messaging"><div className="grid gap-3 md:grid-cols-2">{multiPlatformMessaging.map((item) => <div key={item.platform} className="rounded-xl border border-[var(--line)] bg-[#FFF7ED] p-3"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-[var(--ink)]">{item.platform}</span><span className="rounded-full border border-[#DCE3EC] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{item.status}</span></div><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p></div>)}</div></Card><Card title="Labour intelligence"><ul className="space-y-3 text-sm"><li><strong>Region:</strong> {dashboard.intelligence.region}</li><li><strong>Skill shortages:</strong> {dashboard.intelligence.skillShortages.join(', ')}</li><li><strong>Salary benchmarks:</strong> {dashboard.intelligence.salaryBenchmarks.map((item) => `${item.role} ${item.median}`).join(' · ')}</li></ul></Card></div><Card title="FoundAI routing demo"><div className="flex flex-wrap items-center gap-3"><button type="button" onClick={() => void runWorkflowDemo()} className="bg-[#F97316] px-4 py-2 font-semibold text-white">Run candidate screening demo</button><p className="text-sm text-[var(--muted)]">Exercises the FoundAI onboarding layer.</p></div>{workflowDemo && <div className="mt-4 grid gap-3 rounded border border-[var(--line)] bg-[#FFF7ED] p-4 text-sm"><p><strong>Type:</strong> {workflowDemo.messageType}</p><p><strong>Intent:</strong> {workflowDemo.intent}</p><p><strong>Route:</strong> {workflowDemo.route}</p><p><strong>Reply:</strong> {workflowDemo.reply}</p><p><strong>Console updates:</strong> {workflowDemo.consoleUpdates.join(' · ')}</p></div>}</Card><Card title="Top candidates"><Table headers={['Candidate', 'Role', 'Score', 'Stage', 'Location']}>{dashboard.candidates.map((candidate) => <tr key={candidate.id}><td className="px-4 py-3 font-medium">{candidate.name}</td><td className="px-4 py-3">{candidate.role}</td><td className="px-4 py-3">{candidate.score}</td><td className="px-4 py-3">{candidate.stage}</td><td className="px-4 py-3">{candidate.location}</td></tr>)}</Table></Card><Card title="Open roles"><Table headers={['Role', 'Employer', 'Region', 'Salary', 'Source']}>{dashboard.jobs.map((job) => <tr key={job.id}><td className="px-4 py-3 font-medium">{job.title}</td><td className="px-4 py-3">{job.employer}</td><td className="px-4 py-3">{job.region}</td><td className="px-4 py-3">{job.salaryRange}</td><td className="px-4 py-3">{job.source}</td></tr>)}</Table></Card></>}</div></div>}
