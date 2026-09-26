'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useMemo, useState } from 'react'
import { money, penceFrom, poundsInput, ProRecord, ratio, SaveRecord, shortMoney } from './shared'
import { Campaign, campaignChannels, campaignMetrics, campaignObjectives, readCampaign, utmUrl } from './models'

const NumberField = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
  <label>{label}<input type="number" min={0} value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))} /></label>
)

const MoneyField = ({ label, pence, onChange }: { label: string; pence: number; onChange: (pence: number) => void }) => (
  <label>{label}<input inputMode="decimal" defaultValue={poundsInput(pence)} key={`${label}-${pence}`} onBlur={(event) => onChange(penceFrom(event.target.value))} /></label>
)

export function CampaignProPanel({ record, save }: { record: ProRecord; save: SaveRecord }) {
  const initial = useMemo(() => readCampaign(record), [record])
  const [campaign, setCampaign] = useState(initial)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  useEffect(() => { setCampaign(initial); setDirty(false) }, [initial])
  const edit = (patch: Partial<Campaign>) => { setCampaign((current) => ({ ...current, ...patch })); setDirty(true) }
  const metrics = campaignMetrics(campaign)
  const link = utmUrl(campaign)
  const persist = async () => {
    setBusy(true)
    setMessage('')
    try {
      await save({ valuePence: campaign.budgetPence, data: { campaign, channel: campaign.channels[0], dueDate: campaign.endDate || undefined } })
      setDirty(false)
      setMessage('Campaign saved')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save campaign')
    } finally {
      setBusy(false)
    }
  }
  const toggleChannel = (channel: string) => edit({ channels: campaign.channels.includes(channel) ? campaign.channels.filter((item) => item !== channel) : [...campaign.channels, channel] })

  return (
    <section className="pro-panel pro-campaign">
      <header className="pro-panel-head">
        <div><span className="pro-eyebrow">Campaign · {record.status}</span><strong>{record.name}</strong></div>
        <div className="pro-badges"><span className="pro-badge">ROAS {metrics.roas}</span><span className="pro-badge">ROI {metrics.roi}</span></div>
      </header>
      <div className="pro-kpis">
        <div><span>CTR</span><b>{metrics.ctr}</b></div>
        <div><span>CPC</span><b>{metrics.cpc}</b></div>
        <div><span>CPM</span><b>{metrics.cpm}</b></div>
        <div><span>Cost / lead</span><b>{metrics.cpl}</b></div>
        <div><span>Conv. rate</span><b>{metrics.conversionRate}</b></div>
        <div><span>CPA</span><b>{metrics.cpa}</b></div>
      </div>
      <div className="pro-budget"><span>Budget used {metrics.budgetUsed} · {money(campaign.spendPence)} of {money(campaign.budgetPence)}</span><i><b style={{ width: `${metrics.budgetUsedPct}%` }} className={metrics.budgetUsedPct >= 100 ? 'is-danger' : ''} /></i></div>

      <div className="pro-grid-3">
        <label>Objective<select value={campaign.objective} onChange={(event) => edit({ objective: event.target.value })}><option value="">Select…</option>{campaignObjectives.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Start<input type="date" value={campaign.startDate} onChange={(event) => edit({ startDate: event.target.value })} /></label>
        <label>End<input type="date" value={campaign.endDate} onChange={(event) => edit({ endDate: event.target.value })} /></label>
      </div>
      <label>Audience<input value={campaign.audience} placeholder="e.g. UK SMB owners, 25–54, interested in retail tech" onChange={(event) => edit({ audience: event.target.value })} /></label>
      <fieldset className="pro-chips"><legend>Channels</legend>{campaignChannels.map((channel) => <button type="button" key={channel} className={campaign.channels.includes(channel) ? 'is-selected' : ''} onClick={() => toggleChannel(channel)}>{channel}</button>)}</fieldset>

      <h4>Results</h4>
      <div className="pro-grid-4">
        <MoneyField label="Budget £" pence={campaign.budgetPence} onChange={(budgetPence) => edit({ budgetPence })} />
        <MoneyField label="Spend £" pence={campaign.spendPence} onChange={(spendPence) => edit({ spendPence })} />
        <NumberField label="Impressions" value={campaign.impressions} onChange={(impressions) => edit({ impressions })} />
        <NumberField label="Clicks" value={campaign.clicks} onChange={(clicks) => edit({ clicks })} />
        <NumberField label="Leads" value={campaign.leads} onChange={(leads) => edit({ leads })} />
        <NumberField label="Conversions" value={campaign.conversions} onChange={(conversions) => edit({ conversions })} />
        <MoneyField label="Attributed revenue £" pence={campaign.revenuePence} onChange={(revenuePence) => edit({ revenuePence })} />
      </div>

      <h4>Tracking link (UTM)</h4>
      <div className="pro-grid-4">
        <label>Landing page<input value={campaign.landingUrl} placeholder="https://yoursite.com/offer" onChange={(event) => edit({ landingUrl: event.target.value })} /></label>
        <label>utm_source<input value={campaign.utmSource} placeholder="facebook" onChange={(event) => edit({ utmSource: event.target.value })} /></label>
        <label>utm_medium<input value={campaign.utmMedium} placeholder="paid_social" onChange={(event) => edit({ utmMedium: event.target.value })} /></label>
        <label>utm_campaign<input value={campaign.utmCampaign} onChange={(event) => edit({ utmCampaign: event.target.value })} /></label>
      </div>
      {link && <div className="pro-copy"><code>{link}</code><button type="button" onClick={() => navigator.clipboard?.writeText(link).then(() => setMessage('Tracking link copied'))}>Copy</button></div>}

      <div className="pro-actions"><button type="button" className="is-primary" disabled={busy || !dirty} onClick={() => void persist()}>{busy ? 'Saving…' : dirty ? 'Save campaign' : 'Saved'}</button></div>
      {message && <p className="pro-message" role="status">{message}</p>}
    </section>
  )
}

export function CampaignPortfolioPanel({ records }: { records: ProRecord[] }) {
  const campaigns = records.map((record) => ({ record, campaign: readCampaign(record) }))
  const sum = (key: 'budgetPence' | 'spendPence' | 'revenuePence' | 'leads' | 'conversions' | 'clicks' | 'impressions') => campaigns.reduce((total, { campaign }) => total + campaign[key], 0)
  const spend = sum('spendPence')
  const revenue = sum('revenuePence')
  const leads = sum('leads')
  const best = [...campaigns].filter(({ campaign }) => campaign.spendPence > 0).sort((a, b) => b.campaign.revenuePence / b.campaign.spendPence - a.campaign.revenuePence / a.campaign.spendPence)[0]
  const overspent = campaigns.filter(({ campaign }) => campaign.budgetPence > 0 && campaign.spendPence > campaign.budgetPence).length
  const untracked = campaigns.filter(({ record, campaign }) => ['Live', 'Complete'].includes(record.status) && !campaign.impressions && !campaign.clicks && !campaign.spendPence).length
  return (
    <section className="pro-panel pro-portfolio">
      <header className="pro-panel-head"><div><span className="pro-eyebrow">Campaign portfolio</span><strong>ROAS {spend ? `${(revenue / spend).toFixed(2)}×` : '—'}</strong></div></header>
      <div className="pro-kpis">
        <div><span>Budget</span><b>{shortMoney(sum('budgetPence'))}</b></div>
        <div><span>Spend</span><b>{shortMoney(spend)}</b></div>
        <div><span>Revenue</span><b>{shortMoney(revenue)}</b></div>
        <div><span>Leads</span><b>{leads.toLocaleString('en-GB')}</b><small>{leads ? `${money(Math.round(spend / leads))} each` : ''}</small></div>
        <div><span>CTR</span><b>{ratio(sum('clicks'), sum('impressions'), 2)}</b></div>
      </div>
      <ul className="pro-alerts">
        {best && <li className="is-good">Best performer: {best.record.name} at {(best.campaign.revenuePence / best.campaign.spendPence).toFixed(2)}× ROAS</li>}
        {overspent > 0 && <li className="is-danger">{overspent} campaign{overspent === 1 ? '' : 's'} over budget</li>}
        {untracked > 0 && <li className="is-warn">{untracked} live or completed campaign{untracked === 1 ? '' : 's'} with no results logged</li>}
        {!campaigns.length && <li>Create a campaign to start tracking spend and return.</li>}
      </ul>
    </section>
  )
}
