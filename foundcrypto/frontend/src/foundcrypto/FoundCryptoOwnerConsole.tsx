/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useMemo, useState } from 'react'
import { Card, FoundCryptoLogo, ImageBlock, InsightPanel, PasskeySettings, PremiumConsole, type ConsoleTab } from '@founder-os/ui'
import { authClient } from '../auth'

type Candle = { time: string; open: number; high: number; low: number; close: number; volume: number }
type ChartData = {
  symbol: string
  candles: Candle[]
  indicators: { rsi: number; macd: number; signal: number; ema12: number; ema26: number; sma20: number; sma50: number; volatility: number; trend: number }
  volumeAnalysis: { current: number; average: number; spike: boolean; spread: number }
  supportResistance: { support: number; resistance: number }
  patternRecognition: string[]
  trendline: { slope: number; direction: string }
  watchlist: string[]
}
type Trigger = { id: string; symbol: string; indicator: string; operator: string; threshold: number; action: string; sellPercent: number; enabled: boolean; note: string; createdAt: string; updatedAt: string }
type Execution = { id: string; symbol: string; action: string; quantityPercent: number; reason: string; status: 'queued' | 'executed' | 'reversed'; reversible: boolean; price: number; createdAt: string; executedAt: string; reversedAt?: string }
type Risk = { maxPositionPercent: number; maxDailyLossPercent: number; drawdownStopPercent: number; stopLossPercent: number; takeProfitPercent: number; stablecoin: string; fiatRail: string; alertOnVolatility: boolean }
type Overview = { watchlist: string[]; chart: ChartData; triggers: Trigger[]; executions: Execution[]; risk: Risk; insights: string }

const tabs: ConsoleTab[] = [
  { id: 'dashboard', label: 'Chart Intelligence' },
  { id: 'indicators', label: 'Portfolio Intelligence' },
  { id: 'triggers', label: 'Trigger Engine' },
  { id: 'execution', label: 'Auto Execution' },
  { id: 'insights', label: 'FoundAI Onboarding' },
]

const money = (value: number) => new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }).format(value)
const pct = (value: number) => `${value.toFixed(2)}%`
const api = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const response = await authClient.request<{ success: true; data: T }>(path, init)
  return response.data
}

function CandlestickChart({ data }: { data: ChartData }) {
  const chart = useMemo(() => {
    const width = 920
    const height = 340
    const margin = 20
    const candleArea = height - 110
    const prices = data.candles.flatMap((candle) => [candle.high, candle.low])
    const max = Math.max(...prices)
    const min = Math.min(...prices)
    const range = Math.max(1, max - min)
    const scale = (value: number) => candleArea - ((value - min) / range) * (candleArea - margin * 2) + margin
    const step = (width - margin * 2) / Math.max(1, data.candles.length)
    const line = (key: 'ema12' | 'ema26' | 'sma20' | 'sma50') => data.candles.map((candle, index) => `${index * step + margin + step / 2},${scale(data.indicators[key])}`).join(' ')
    return { width, height, margin, candleArea, scale, step, line }
  }, [data])

  return <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="w-full rounded-lg bg-[#0B1020] p-3 text-white">
    <defs>
      <linearGradient id="cryptoVolume" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width={chart.width} height={chart.height} rx="18" fill="#0B1020" />
    {data.candles.map((candle, index) => {
      const x = index * chart.step + chart.margin
      const center = x + chart.step / 2
      const openY = chart.scale(candle.open)
      const closeY = chart.scale(candle.close)
      const highY = chart.scale(candle.high)
      const lowY = chart.scale(candle.low)
      const bullish = candle.close >= candle.open
      const bodyTop = Math.min(openY, closeY)
      const bodyHeight = Math.max(2, Math.abs(closeY - openY))
      return <g key={candle.time}>
        <line x1={center} y1={highY} x2={center} y2={lowY} stroke={bullish ? '#34D399' : '#F87171'} strokeWidth="2" />
        <rect x={x + chart.step * 0.24} y={bodyTop} width={chart.step * 0.52} height={bodyHeight} rx="3" fill={bullish ? '#34D399' : '#F87171'} />
      </g>
    })}
    {data.candles.map((candle, index) => {
      const x = index * chart.step + chart.margin
      const volumeHeight = Math.max(8, (candle.volume / Math.max(...data.candles.map((item) => item.volume))) * 72)
      return <rect key={`${candle.time}-volume`} x={x + chart.step * 0.22} y={chart.height - 24 - volumeHeight} width={chart.step * 0.56} height={volumeHeight} rx="2" fill="url(#cryptoVolume)" />
    })}
    <polyline points={chart.line('ema12')} fill="none" stroke="#A78BFA" strokeWidth="2" />
    <polyline points={chart.line('ema26')} fill="none" stroke="#60A5FA" strokeWidth="2" />
  </svg>
}

export function FoundCryptoOwnerConsole({
  title = 'Trader Console',
  description = 'Unified Trader Console for chart intelligence, trigger engine, auto execution, portfolio intelligence, and FoundAI onboarding.',
}: {
  title?: string
  description?: string
} = {}) {
  const [tab, setTab] = useState('dashboard')
  const [message, setMessage] = useState('')
  const [overview, setOverview] = useState<Overview | null>(null)
  const [chart, setChart] = useState<ChartData | null>(null)
  const [triggers, setTriggers] = useState<Trigger[]>([])
  const [executions, setExecutions] = useState<Execution[]>([])
  const [risk, setRisk] = useState<Risk | null>(null)
  const [insights, setInsights] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('BTC-USD')
  const [activeIndicators, setActiveIndicators] = useState(['EMA12', 'EMA26', 'RSI', 'MACD', 'SMA20'])

  const load = async (symbol = selectedSymbol) => {
    try {
      const [nextOverview, nextChart, nextTriggers, nextExecutions, nextRisk, nextInsights] = await Promise.all([
        api<Overview>('/crypto/overview'),
        api<ChartData>(`/crypto/chart?symbol=${encodeURIComponent(symbol)}`),
        api<Trigger[]>('/crypto/triggers'),
        api<Execution[]>('/crypto/executions'),
        api<Risk>('/crypto/risk'),
        api<{ headline: string }>('/crypto/insights'),
      ])
      setOverview(nextOverview)
      setChart(nextChart)
      setTriggers(nextTriggers)
      setExecutions(nextExecutions)
      setRisk(nextRisk)
      setInsights(nextInsights.headline)
      setMessage('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'FoundCrypto data unavailable')
    }
  }

  useEffect(() => { void load() }, [])
  const refreshChart = async (symbol: string) => {
    setSelectedSymbol(symbol)
    await load(symbol)
  }

  const addTrigger = async (form: HTMLFormElement) => {
    const data = new FormData(form)
    await api('/crypto/triggers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: String(data.get('symbol') || selectedSymbol),
        indicator: String(data.get('indicator') || 'RSI'),
        operator: String(data.get('operator') || 'below'),
        threshold: Number(data.get('threshold') || 0),
        action: String(data.get('action') || 'alert'),
        sellPercent: Number(data.get('sellPercent') || 0),
        enabled: data.get('enabled') === 'on',
        note: String(data.get('note') || ''),
      }),
    })
    form.reset()
    await load()
  }

  const executeTrade = async (form: HTMLFormElement) => {
    const data = new FormData(form)
    await api('/crypto/executions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: String(data.get('symbol') || selectedSymbol),
        action: String(data.get('action') || 'alert'),
        quantityPercent: Number(data.get('quantityPercent') || 0),
        reason: String(data.get('reason') || 'Manual execution'),
        reversible: data.get('reversible') === 'on',
      }),
    })
    form.reset()
    await load()
  }

  const updateRisk = async (form: HTMLFormElement) => {
    const data = new FormData(form)
    await api('/crypto/risk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maxPositionPercent: Number(data.get('maxPositionPercent') || 0),
        maxDailyLossPercent: Number(data.get('maxDailyLossPercent') || 0),
        drawdownStopPercent: Number(data.get('drawdownStopPercent') || 0),
        stopLossPercent: Number(data.get('stopLossPercent') || 0),
        takeProfitPercent: Number(data.get('takeProfitPercent') || 0),
        stablecoin: String(data.get('stablecoin') || 'USDC'),
        fiatRail: String(data.get('fiatRail') || 'GBP'),
        alertOnVolatility: data.get('alertOnVolatility') === 'on',
      }),
    })
    await load()
  }

  const reverseExecution = async (id: string) => {
    await api(`/crypto/executions/${id}/reverse`, { method: 'POST' })
    await load()
  }

  const riskText = risk ? `${risk.maxPositionPercent}% max position · ${risk.stopLossPercent}% stop loss · ${risk.takeProfitPercent}% take profit` : 'Risk data unavailable'

  return <div className="space-y-3"><button type="button" onClick={() => { window.location.href = 'http://localhost:4000/console' }} className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-white px-4 py-2 text-sm font-semibold text-[#1f120d] shadow-sm">↩ Back to FoundingOS</button><PremiumConsole
    brand="FoundCrypto"
    eyebrow="Crypto operations"
    title={title}
    description={description}
    tabs={tabs}
    activeTab={tab}
    onTabChange={setTab}
    accent="#7C3AED"
    logo={<FoundCryptoLogo className="h-11 w-11" />}
  >
    {message && <p role="alert" className="border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{message}</p>}

    {tab === 'dashboard' && overview && chart && <div className="space-y-5">
      <Card title="FoundCrypto dashboard preview"><ImageBlock variant="foundcrypto-dashboard" alt="FoundCrypto console preview" caption="Crypto console preview" glow="#7C3AED" /></Card>
      <div className="flex flex-wrap gap-2">
        {overview.watchlist.map((symbol) => <button key={symbol} type="button" onClick={() => void refreshChart(symbol)} className={`rounded-full px-4 py-2 text-sm font-semibold ${selectedSymbol === symbol ? 'bg-[#7C3AED] text-white' : 'bg-white text-[#7C3AED] border border-[#C4B5FD]'}`}>{symbol}</button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <InsightPanel title="Spot price" value={money(chart.candles[chart.candles.length - 1]?.close || 0)} detail={chart.symbol} tone="positive" />
        <InsightPanel title="RSI" value={chart.indicators.rsi.toFixed(1)} detail={chart.indicators.rsi > 70 ? 'Overbought' : chart.indicators.rsi < 30 ? 'Oversold' : 'Neutral'} />
        <InsightPanel title="Trend" value={pct(chart.indicators.trend)} detail={chart.trendline.direction} />
        <InsightPanel title="Volatility" value={pct(chart.indicators.volatility)} detail={chart.volumeAnalysis.spike ? 'Volume spike detected' : 'Normal volume'} tone={chart.volumeAnalysis.spike ? 'warning' : 'default'} />
      </div>
      <Card title="Candlestick analysis"><CandlestickChart data={chart} /></Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Support / resistance"><div className="space-y-2 text-sm"><p>Support: <strong>{money(chart.supportResistance.support)}</strong></p><p>Resistance: <strong>{money(chart.supportResistance.resistance)}</strong></p><p>Volume spread: <strong>{money(chart.volumeAnalysis.spread)}</strong></p></div></Card>
        <Card title="Indicators"><div className="space-y-2 text-sm"><p>EMA 12: {money(chart.indicators.ema12)}</p><p>EMA 26: {money(chart.indicators.ema26)}</p><p>SMA 20: {money(chart.indicators.sma20)}</p><p>SMA 50: {money(chart.indicators.sma50)}</p></div></Card>
        <Card title="Pattern recognition"><ul className="space-y-2 text-sm">{chart.patternRecognition.map((item) => <li key={item}>✓ {item}</li>)}</ul></Card>
      </div>
    </div>}

    {tab === 'indicators' && chart && <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <Card title="Indicator controls">
        <div className="flex flex-wrap gap-2">
          {['EMA12', 'EMA26', 'SMA20', 'SMA50', 'RSI', 'MACD', 'Volume', 'Trendline'].map((indicator) => <button key={indicator} type="button" onClick={() => setActiveIndicators((current) => current.includes(indicator) ? current.filter((item) => item !== indicator) : [...current, indicator])} className={`rounded-full border px-4 py-2 text-sm font-semibold ${activeIndicators.includes(indicator) ? 'border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED]' : 'border-[#D9D9D9] bg-white text-[#68778A]'}`}>{indicator}</button>)}
        </div>
        <p className="mt-4 text-sm text-[#68778A]">Active overlays: {activeIndicators.join(', ') || 'none'}</p>
      </Card>
      <Card title="Indicator snapshot">
        <div className="grid gap-3 sm:grid-cols-2">
          <InsightPanel title="MACD" value={chart.indicators.macd.toFixed(4)} detail={`Signal ${chart.indicators.signal.toFixed(4)}`} />
          <InsightPanel title="Trendline" value={chart.trendline.direction.toUpperCase()} detail={`Slope ${chart.trendline.slope.toFixed(4)}`} />
          <InsightPanel title="Volume average" value={chart.volumeAnalysis.average.toLocaleString()} detail={`Current ${chart.volumeAnalysis.current.toLocaleString()}`} />
          <InsightPanel title="Watchlist" value={String(chart.watchlist.length)} detail={chart.watchlist.join(', ')} />
        </div>
      </Card>
    </div>}

    {tab === 'triggers' && <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
      <Card title="Trigger configuration">
        <form className="grid gap-3" onSubmit={async (event) => { event.preventDefault(); await addTrigger(event.currentTarget) }}>
          <input name="symbol" defaultValue={selectedSymbol} className="border border-[#D9D9D9] px-3 py-2" placeholder="Symbol" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="indicator" defaultValue="RSI" className="border border-[#D9D9D9] px-3 py-2" placeholder="Indicator" />
            <select name="operator" defaultValue="below" className="border border-[#D9D9D9] px-3 py-2">
              <option value="above">above</option>
              <option value="below">below</option>
              <option value="crossesAbove">crossesAbove</option>
              <option value="crossesBelow">crossesBelow</option>
            </select>
            <input name="threshold" type="number" defaultValue={30} className="border border-[#D9D9D9] px-3 py-2" placeholder="Threshold" />
            <select name="action" defaultValue="alert" className="border border-[#D9D9D9] px-3 py-2">
              <option value="alert">alert</option>
              <option value="sellPercent">sellPercent</option>
              <option value="sellAll">sellAll</option>
              <option value="stablecoin">stablecoin</option>
              <option value="fiat">fiat</option>
            </select>
            <input name="sellPercent" type="number" defaultValue={25} className="border border-[#D9D9D9] px-3 py-2" placeholder="Sell %" />
            <label className="flex items-center gap-2 text-sm"><input name="enabled" type="checkbox" defaultChecked /> Enabled</label>
          </div>
          <textarea name="note" className="min-h-24 border border-[#D9D9D9] px-3 py-2" placeholder="Trigger note" />
          <button className="rounded-md bg-[#7C3AED] px-4 py-3 font-semibold text-white">Save trigger</button>
        </form>
      </Card>
      <Card title="Existing triggers">
        <div className="space-y-3">
          {triggers.map((trigger) => <article key={trigger.id} className="border border-[#E5E7EB] p-4">
            <div className="flex items-center justify-between gap-3">
              <strong>{trigger.symbol} · {trigger.indicator}</strong>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${trigger.enabled ? 'bg-[#EDE9FE] text-[#7C3AED]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>{trigger.enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <p className="mt-2 text-sm text-[#68778A]">{trigger.operator} {trigger.threshold} · {trigger.action} {trigger.sellPercent ? `${trigger.sellPercent}%` : ''}</p>
            <p className="mt-1 text-sm text-[#68778A]">{trigger.note}</p>
          </article>)}
        </div>
      </Card>
    </div>}

    {tab === 'execution' && <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
      <Card title="Auto-execution settings">
        <form className="grid gap-3" onSubmit={async (event) => { event.preventDefault(); await executeTrade(event.currentTarget) }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="symbol" defaultValue={selectedSymbol} className="border border-[#D9D9D9] px-3 py-2" placeholder="Symbol" />
            <select name="action" defaultValue="sellPercent" className="border border-[#D9D9D9] px-3 py-2">
              <option value="sellPercent">Sell X%</option>
              <option value="sellAll">Sell 100%</option>
              <option value="stablecoin">Move to stablecoin</option>
              <option value="fiat">Move to fiat</option>
              <option value="alert">Trigger alerts</option>
            </select>
            <input name="quantityPercent" type="number" defaultValue={25} className="border border-[#D9D9D9] px-3 py-2" placeholder="Quantity %" />
            <label className="flex items-center gap-2 text-sm"><input name="reversible" type="checkbox" defaultChecked /> Reversible</label>
          </div>
          <textarea name="reason" className="min-h-24 border border-[#D9D9D9] px-3 py-2" placeholder="Execution reason" />
          <button className="rounded-md bg-[#7C3AED] px-4 py-3 font-semibold text-white">Execute safely</button>
        </form>
      </Card>
      <Card title="Execution policy">
        <div className="space-y-2 text-sm">
          <p>{riskText}</p>
          <p>Execution is logged, reversible when flagged, and always tied to the authenticated tenant.</p>
        </div>
      </Card>
    </div>}

    {tab === 'history' && <Card title="Trade history">
      <table className="w-full text-left text-sm">
        <thead><tr><th className="border-b p-3">Symbol</th><th className="border-b p-3">Action</th><th className="border-b p-3">Qty</th><th className="border-b p-3">Price</th><th className="border-b p-3">Status</th><th className="border-b p-3">Action</th></tr></thead>
        <tbody>
          {executions.map((execution) => <tr key={execution.id}>
            <td className="border-b p-3">{execution.symbol}</td>
            <td className="border-b p-3">{execution.action}</td>
            <td className="border-b p-3">{execution.quantityPercent}%</td>
            <td className="border-b p-3">{money(execution.price)}</td>
            <td className="border-b p-3">{execution.status}</td>
            <td className="border-b p-3"><button disabled={!execution.reversible || execution.status === 'reversed'} onClick={() => void reverseExecution(execution.id)} className="rounded border border-[#7C3AED] px-3 py-1 text-xs font-semibold text-[#7C3AED] disabled:opacity-40">Reverse</button></td>
          </tr>)}
        </tbody>
      </table>
    </Card>}

    {tab === 'risk' && <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
      <Card title="Risk management">
        <form className="grid gap-3" onSubmit={async (event) => { event.preventDefault(); await updateRisk(event.currentTarget) }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="maxPositionPercent" defaultValue={risk?.maxPositionPercent ?? 25} type="number" className="border border-[#D9D9D9] px-3 py-2" placeholder="Max position %" />
            <input name="maxDailyLossPercent" defaultValue={risk?.maxDailyLossPercent ?? 8} type="number" className="border border-[#D9D9D9] px-3 py-2" placeholder="Max daily loss %" />
            <input name="drawdownStopPercent" defaultValue={risk?.drawdownStopPercent ?? 12} type="number" className="border border-[#D9D9D9] px-3 py-2" placeholder="Drawdown stop %" />
            <input name="stopLossPercent" defaultValue={risk?.stopLossPercent ?? 5} type="number" className="border border-[#D9D9D9] px-3 py-2" placeholder="Stop loss %" />
            <input name="takeProfitPercent" defaultValue={risk?.takeProfitPercent ?? 14} type="number" className="border border-[#D9D9D9] px-3 py-2" placeholder="Take profit %" />
            <input name="stablecoin" defaultValue={risk?.stablecoin ?? 'USDC'} className="border border-[#D9D9D9] px-3 py-2" placeholder="Stablecoin" />
            <input name="fiatRail" defaultValue={risk?.fiatRail ?? 'GBP'} className="border border-[#D9D9D9] px-3 py-2" placeholder="Fiat rail" />
            <label className="flex items-center gap-2 text-sm"><input name="alertOnVolatility" type="checkbox" defaultChecked={risk?.alertOnVolatility ?? true} /> Alert on volatility spikes</label>
          </div>
          <button className="rounded-md bg-[#7C3AED] px-4 py-3 font-semibold text-white">Save risk policy</button>
        </form>
      </Card>
      <Card title="Policy summary">
        <div className="space-y-2 text-sm">
          <p>Current policy: {riskText}</p>
          <p>Stablecoin rail: {risk?.stablecoin || 'USDC'} · Fiat rail: {risk?.fiatRail || 'GBP'}</p>
          <p>Volatility alerts: {risk?.alertOnVolatility ? 'Enabled' : 'Disabled'}</p>
        </div>
        <PasskeySettings client={authClient} />
      </Card>
    </div>}

    {tab === 'insights' && <div className="grid gap-4 lg:grid-cols-[1fr_.9fr]">
      <Card title="AI insights">
        <p className="text-sm leading-7 text-[#68778A]">{insights}</p>
      </Card>
      <div className="grid gap-4">
        <InsightPanel title="Triggers" value={String(triggers.length)} detail={`${triggers.filter((trigger) => trigger.enabled).length} enabled`} />
        <InsightPanel title="Executions" value={String(executions.length)} detail={executions.some((execution) => execution.reversible && execution.status !== 'reversed') ? 'Reversible actions available' : 'No reversible actions queued'} />
        <InsightPanel title="Risk posture" value={risk?.alertOnVolatility ? 'Guarded' : 'Open'} detail={riskText} tone={risk?.alertOnVolatility ? 'positive' : 'warning'} />
      </div>
    </div>}
  </PremiumConsole></div>
}
