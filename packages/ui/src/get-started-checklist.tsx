/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from './console'

const CHECKLIST_ITEMS = [
  'Add business details',
  'Add products/services',
  'Add staff',
  'Add customers',
  'Add inventory',
  'Add accounts',
]

export function GetStartedChecklist({ config }: { config: BrandConsoleConfig }) {
  return (
    <section className="panel panel-premium get-started-checklist quantum-card">
      <span className="quantum-corner-marker">{config.logo}</span>
      <header className="module-header">
        <p>Activation</p>
        <h2>Get Started Checklist</h2>
        <span>Complete these steps to bring {config.name} to life.</span>
      </header>
      <ul className="checklist-list">
        {CHECKLIST_ITEMS.map((item) => (
          <li key={item} className="checklist-item">
            <span className="checklist-box" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default GetStartedChecklist
