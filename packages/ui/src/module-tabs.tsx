/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState, type CSSProperties } from 'react'

export type ModuleTab = {
  id: string
  label: string
  icon?: string
  render: () => React.ReactNode
}

// Real, shared tabbed-page shell used by every module that has genuine internal structure
// (Marketing, Accounting, Messaging, Customer Service, AI Automation, Sales) — replaces the
// previous pattern of one generic single-table page per module. Visually reuses the exact same
// tab-bar styling already proven in the CRM board (.crm-tab-bar) via a plain class alias, so
// every module looks consistent with the rest of the console rather than inventing a new look.
export function ModuleTabs({
  title,
  description,
  tabs,
  accentStyle,
  headerExtra,
  defaultTabId,
}: {
  title: string
  description: string
  tabs: ModuleTab[]
  accentStyle?: CSSProperties
  headerExtra?: React.ReactNode
  defaultTabId?: string
}) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id)
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0]

  return (
    <section className="stack" style={accentStyle} data-module-tabs>
      <header className="module-header header-premium">
        <h1>{title}</h1>
        <span>{description}</span>
      </header>
      {headerExtra}
      <div className="crm-tab-bar" role="tablist" aria-label={`${title} sections`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === active?.id}
            className={tab.id === active?.id ? 'active' : ''}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.icon ? <span style={{ marginRight: 6 }}>{tab.icon}</span> : null}
            {tab.label}
          </button>
        ))}
      </div>
      {/* key={active?.id} is required, not cosmetic: without it, React treats each tab's panel
          as the SAME component instance across tab switches (same type, same tree position) and
          only re-renders it with new props — it does NOT remount. Confirmed live: switching from
          Campaigns to Templates showed the new tab's title/description/KPIs but the OLD tab's
          table rows, because DataWorkbench seeds its internal state via a lazy
          useState(() => cloneRows(rows)) initializer, which only ever runs on a component's
          first-ever mount, never again on a props change. A changing key forces a real
          unmount/remount on every tab switch, giving each tab a genuinely fresh, correct state. */}
      <div key={active?.id} data-module-tab-panel={active?.id}>{active?.render()}</div>
    </section>
  )
}
