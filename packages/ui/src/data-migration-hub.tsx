/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from './console'

const MIGRATION_ITEMS = [
  { label: 'CSV import', status: 'Ready' },
  { label: 'API connections', status: 'Ready' },
  { label: 'Integrations', status: 'Ready' },
  { label: 'Sync status', status: 'Live' },
  { label: 'Migration progress', status: 'Live' },
]

export function DataMigrationHub({ config }: { config: BrandConsoleConfig }) {
  return (
    <section className="panel panel-premium data-migration-hub quantum-card">
      <span className="quantum-corner-marker">{config.logo}</span>
      <header className="module-header">
        <p>Migration</p>
        <h2>Data Migration Hub</h2>
        <span>Bring existing {config.name} data in and keep it in sync.</span>
      </header>
      <ul className="migration-list">
        {MIGRATION_ITEMS.map((item) => (
          <li key={item.label} className="migration-item">
            <span>{item.label}</span>
            <span className="team-viewer-status active">{item.status}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default DataMigrationHub
