/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FounderSite } from '../FounderSite'

const controlFeatures = [
	['Sales intelligence', 'Revenue dashboards, opportunities, trends, and performance summaries.'],
	['Marketing studio', 'Campaign planning, content generation, engagement, and ROI insight.'],
	['Social media linking', 'Connect brand channels and coordinate publishing context.'],
	['Pipeline forecasting', 'Track opportunities, predict movement, and surface commercial risk.'],
	['Group analytics', 'Compare brand, owner, merchant, package, and platform performance.'],
	['Brand management', 'Control brand identity, assets, positioning, and public presence.'],
	['Primary console management', 'Review primary accounts, package capacity, staff limits, and network access.'],
	['Secondary console management', 'Oversee onboarding, console status, and operational health.'],
	['Package management', 'Manage package abilities, pricing, limits, and upgrade paths.'],
]

export function FounderSitePage() {
	return <>
		<FounderSite />
		<section className="bg-[#003366] py-20 text-white"><div className="mx-auto max-w-6xl px-5"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#8BBEFF]">FoundAI control centre</p><div className="mt-3 grid items-end gap-6 lg:grid-cols-[1fr_auto]"><div><h2 className="max-w-3xl text-4xl font-bold">Commercial intelligence and group control across every brand.</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-[#D8E9FF]">FoundingOS gives the parent company one private view of sales, marketing, social channels, pipeline forecasts, analytics, brands, owners, merchants, packages, and platform health, with FoundAI available throughout.</p></div><a href="/foundai" className="bg-[#006CFF] px-8 py-4 text-lg font-bold text-white">Open FoundAI</a></div><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{controlFeatures.map(([title, description]) => <article key={title} className="border border-white/20 bg-white/5 p-5"><h3 className="font-bold text-[#8BBEFF]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#D8E9FF]">{description}</p></article>)}</div>				<div className="mt-10 flex flex-wrap gap-3"><a href="/console" className="bg-white px-6 py-3 font-bold text-[#003366]">Console</a><a href="/foundai" className="border border-[#8BBEFF] px-6 py-3 font-bold">Ask FoundAI about the group</a></div></div></section>
	</>
}
