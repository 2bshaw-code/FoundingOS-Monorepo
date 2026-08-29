/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { randomUUID } from 'crypto'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { Router } from 'express'
import { answerBob } from '@founder-os/bob'

type Candle = { time: string; open: number; high: number; low: number; close: number; volume: number }
type TriggerOperator = 'above' | 'below' | 'crossesAbove' | 'crossesBelow'
type TriggerAction = 'sellPercent' | 'sellAll' | 'stablecoin' | 'fiat' | 'alert'
type CryptoTrigger = { id: string; symbol: string; indicator: string; operator: TriggerOperator; threshold: number; action: TriggerAction; sellPercent: number; enabled: boolean; note: string; createdAt: string; updatedAt: string }
type CryptoExecution = { id: string; symbol: string; action: TriggerAction; quantityPercent: number; reason: string; status: 'queued' | 'executed' | 'reversed'; reversible: boolean; price: number; createdAt: string; executedAt: string; reversedAt?: string }
type CryptoRisk = { maxPositionPercent: number; maxDailyLossPercent: number; drawdownStopPercent: number; stopLossPercent: number; takeProfitPercent: number; stablecoin: string; fiatRail: string; alertOnVolatility: boolean }
type TenantState = { watchlist: string[]; triggers: CryptoTrigger[]; executions: CryptoExecution[]; risk: CryptoRisk }
type Store = Record<string, TenantState>

const statePath = fileURLToPath(new URL('./foundcrypto-state.json', import.meta.url))

const defaultRisk: CryptoRisk = {
  maxPositionPercent: 25,
  maxDailyLossPercent: 8,
  drawdownStopPercent: 12,
  stopLossPercent: 5,
  takeProfitPercent: 14,
  stablecoin: 'USDC',
  fiatRail: 'GBP',
  alertOnVolatility: true,
}

const ensureNumber = (value: unknown, fallback = 0) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

const round = (value: number, digits = 2) => Number(value.toFixed(digits))

const baseForSymbol = (symbol: string) => {
  const normalized = symbol.toUpperCase()
  if (normalized.includes('ETH')) return 3200
  if (normalized.includes('SOL')) return 145
  if (normalized.includes('XRP')) return 0.62
  if (normalized.includes('ADA')) return 0.38
  return 69000
}

const seriesForSymbol = (symbol: string) => {
  const base = baseForSymbol(symbol)
  return Array.from({ length: 48 }, (_, index) => {
    const drift = Math.sin(index / 4) * base * 0.02 + index * base * 0.0015
    const open = base + drift + Math.cos(index / 5) * base * 0.01
    const close = open + Math.sin((index + 1) / 3) * base * 0.015
    const high = Math.max(open, close) + base * (0.006 + (index % 5) * 0.001)
    const low = Math.min(open, close) - base * (0.006 + (index % 4) * 0.001)
    const volume = Math.round(1200 + Math.abs(Math.sin(index / 2)) * 3200 + index * 55)
    const time = new Date(Date.now() - (47 - index) * 60 * 60 * 1000).toISOString()
    return { time, open: round(open, 4), high: round(high, 4), low: round(low, 4), close: round(close, 4), volume }
  })
}

const sma = (series: number[], period: number) => series.slice(-period).reduce((sum, value) => sum + value, 0) / Math.max(1, Math.min(period, series.length))
const ema = (series: number[], period: number) => {
  const k = 2 / (period + 1)
  return series.reduce((value, price, index) => index === 0 ? price : price * k + value * (1 - k), series[0] || 0)
}

const rsi = (series: number[]) => {
  if (series.length < 2) return 50
  let gains = 0
  let losses = 0
  for (let index = 1; index < series.length; index += 1) {
    const delta = series[index] - series[index - 1]
    if (delta >= 0) gains += delta
    else losses += Math.abs(delta)
  }
  if (!losses) return 100
  const relativeStrength = gains / losses
  return 100 - 100 / (1 + relativeStrength)
}

const macd = (series: number[]) => {
  const fast = ema(series, 12)
  const slow = ema(series, 26)
  const macdValue = fast - slow
  const signal = macdValue * 0.8
  return { macd: macdValue, signal }
}

const volatility = (series: number[]) => {
  const mean = series.reduce((sum, value) => sum + value, 0) / series.length
  const variance = series.reduce((sum, value) => sum + (value - mean) ** 2, 0) / series.length
  return Math.sqrt(variance) / mean * 100
}

const analysisFor = (symbol: string) => {
  const candles = seriesForSymbol(symbol)
  const closes = candles.map((candle) => candle.close)
  const volumes = candles.map((candle) => candle.volume)
  const last = candles[candles.length - 1]
  const prior = candles[candles.length - 2] || last
  const ema12 = ema(closes, 12)
  const ema26 = ema(closes, 26)
  const sma20 = sma(closes, 20)
  const sma50 = sma(closes, 50)
  const indicatorRsi = rsi(closes)
  const indicatorMacd = macd(closes)
  const spread = last.high - last.low
  const support = Math.min(...candles.slice(-12).map((candle) => candle.low))
  const resistance = Math.max(...candles.slice(-12).map((candle) => candle.high))
  const trend = round(((last.close - candles[0].open) / candles[0].open) * 100, 2)
  const volumeAverage = volumes.reduce((sum, value) => sum + value, 0) / volumes.length
  const volumeSpike = last.volume > volumeAverage * 1.35
  const bullish = last.close >= last.open
  const pattern = bullish ? (last.close > prior.close ? 'Bullish continuation' : 'Bullish reversal') : (last.close < prior.close ? 'Bearish continuation' : 'Bearish reversal')
  return {
    symbol,
    candles,
    indicators: { rsi: round(indicatorRsi, 1), macd: round(indicatorMacd.macd, 4), signal: round(indicatorMacd.signal, 4), ema12: round(ema12, 4), ema26: round(ema26, 4), sma20: round(sma20, 4), sma50: round(sma50, 4), volatility: round(volatility(closes), 2), trend },
    volumeAnalysis: { current: last.volume, average: Math.round(volumeAverage), spike: volumeSpike, spread: round(spread, 4) },
    supportResistance: { support: round(support, 4), resistance: round(resistance, 4) },
    patternRecognition: [pattern, volumeSpike ? 'Volume spike' : 'Normal volume', indicatorRsi > 70 ? 'Overbought momentum' : indicatorRsi < 30 ? 'Oversold momentum' : 'Balanced momentum'].filter(Boolean),
    trendline: { slope: round((last.close - candles[0].open) / candles.length, 4), direction: trend >= 0 ? 'up' : 'down' },
  }
}

const loadStore = async (): Promise<Store> => {
  try {
    return JSON.parse(await readFile(statePath, 'utf8')) as Store
  } catch {
    return {}
  }
}

const saveStore = async (store: Store) => {
  await writeFile(statePath, JSON.stringify(store, null, 2))
}

const tenantStateFor = async (tenantId: string) => {
  const store = await loadStore()
  if (!store[tenantId]) {
    store[tenantId] = {
      watchlist: ['BTC-USD', 'ETH-USD'],
      triggers: [
        { id: randomUUID(), symbol: 'BTC-USD', indicator: 'RSI', operator: 'below', threshold: 32, action: 'alert', sellPercent: 0, enabled: true, note: 'Alert when momentum resets', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: randomUUID(), symbol: 'ETH-USD', indicator: 'EMA20/50', operator: 'crossesAbove', threshold: 0, action: 'sellPercent', sellPercent: 25, enabled: false, note: 'Scale out on trend confirmation', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
      executions: [],
      risk: defaultRisk,
    }
    await saveStore(store)
  }
  return { store, state: store[tenantId] }
}

const persistTenantState = async (tenantId: string, state: TenantState) => {
  const store = await loadStore()
  store[tenantId] = state
  await saveStore(store)
}

const tenantIdFrom = (res: { locals: Record<string, any> }) => String(res.locals.auth?.tenantId || 'foundcrypto-demo')

export const createCryptoRouter = () => {
  const router = Router()

  router.get('/overview', async (_req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      const chart = analysisFor(state.watchlist[0] || 'BTC-USD')
      res.json({
        success: true,
        data: {
          watchlist: state.watchlist,
          chart,
          triggers: state.triggers,
          executions: state.executions,
          risk: state.risk,
          insights: answerBob(`Explain the current crypto setup for ${chart.symbol}. Use the analysis, triggers, and risk controls.`, { app: 'foundcrypto', tenantId }),
        },
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/chart', async (req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const symbol = String(req.query.symbol || 'BTC-USD')
      const chart = analysisFor(symbol)
      const { state } = await tenantStateFor(tenantId)
      res.json({ success: true, data: { ...chart, watchlist: state.watchlist } })
    } catch (error) {
      next(error)
    }
  })

  router.get('/triggers', async (_req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      res.json({ success: true, data: state.triggers })
    } catch (error) {
      next(error)
    }
  })

  router.post('/triggers', async (req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      const now = new Date().toISOString()
      const trigger: CryptoTrigger = {
        id: randomUUID(),
        symbol: String(req.body?.symbol || 'BTC-USD'),
        indicator: String(req.body?.indicator || 'RSI'),
        operator: String(req.body?.operator || 'below') as TriggerOperator,
        threshold: ensureNumber(req.body?.threshold, 0),
        action: String(req.body?.action || 'alert') as TriggerAction,
        sellPercent: ensureNumber(req.body?.sellPercent, 0),
        enabled: req.body?.enabled !== false,
        note: String(req.body?.note || ''),
        createdAt: now,
        updatedAt: now,
      }
      state.triggers = [trigger, ...state.triggers]
      await persistTenantState(tenantId, state)
      res.status(201).json({ success: true, data: trigger })
    } catch (error) {
      next(error)
    }
  })

  router.patch('/triggers/:id', async (req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      const trigger = state.triggers.find((item) => item.id === req.params.id)
      if (!trigger) return res.status(404).json({ success: false, message: 'Trigger not found' })
      Object.assign(trigger, {
        symbol: req.body?.symbol !== undefined ? String(req.body.symbol) : trigger.symbol,
        indicator: req.body?.indicator !== undefined ? String(req.body.indicator) : trigger.indicator,
        operator: req.body?.operator !== undefined ? String(req.body.operator) as TriggerOperator : trigger.operator,
        threshold: req.body?.threshold !== undefined ? ensureNumber(req.body.threshold, trigger.threshold) : trigger.threshold,
        action: req.body?.action !== undefined ? String(req.body.action) as TriggerAction : trigger.action,
        sellPercent: req.body?.sellPercent !== undefined ? ensureNumber(req.body.sellPercent, trigger.sellPercent) : trigger.sellPercent,
        enabled: req.body?.enabled !== undefined ? Boolean(req.body.enabled) : trigger.enabled,
        note: req.body?.note !== undefined ? String(req.body.note) : trigger.note,
        updatedAt: new Date().toISOString(),
      })
      await persistTenantState(tenantId, state)
      res.json({ success: true, data: trigger })
    } catch (error) {
      next(error)
    }
  })

  router.delete('/triggers/:id', async (req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      const before = state.triggers.length
      state.triggers = state.triggers.filter((item) => item.id !== req.params.id)
      if (state.triggers.length === before) return res.status(404).json({ success: false, message: 'Trigger not found' })
      await persistTenantState(tenantId, state)
      res.json({ success: true })
    } catch (error) {
      next(error)
    }
  })

  router.get('/executions', async (_req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      res.json({ success: true, data: state.executions })
    } catch (error) {
      next(error)
    }
  })

  router.post('/executions', async (req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      const chart = analysisFor(String(req.body?.symbol || state.watchlist[0] || 'BTC-USD'))
      const now = new Date().toISOString()
      const quantityPercent = Math.max(0, Math.min(100, ensureNumber(req.body?.quantityPercent, 0)))
      const execution: CryptoExecution = {
        id: randomUUID(),
        symbol: String(req.body?.symbol || state.watchlist[0] || 'BTC-USD'),
        action: String(req.body?.action || 'alert') as TriggerAction,
        quantityPercent,
        reason: String(req.body?.reason || 'Manual execution requested'),
        status: 'executed',
        reversible: req.body?.reversible !== false,
        price: chart.candles[chart.candles.length - 1]?.close || 0,
        createdAt: now,
        executedAt: now,
      }
      state.executions = [execution, ...state.executions].slice(0, 100)
      await persistTenantState(tenantId, state)
      res.status(201).json({ success: true, data: execution })
    } catch (error) {
      next(error)
    }
  })

  router.post('/executions/:id/reverse', async (req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      const execution = state.executions.find((item) => item.id === req.params.id)
      if (!execution) return res.status(404).json({ success: false, message: 'Execution not found' })
      if (!execution.reversible) return res.status(400).json({ success: false, message: 'Execution is not reversible' })
      execution.status = 'reversed'
      execution.reversedAt = new Date().toISOString()
      await persistTenantState(tenantId, state)
      res.json({ success: true, data: execution })
    } catch (error) {
      next(error)
    }
  })

  router.get('/risk', async (_req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      res.json({ success: true, data: state.risk })
    } catch (error) {
      next(error)
    }
  })

  router.patch('/risk', async (req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      state.risk = {
        maxPositionPercent: ensureNumber(req.body?.maxPositionPercent, state.risk.maxPositionPercent),
        maxDailyLossPercent: ensureNumber(req.body?.maxDailyLossPercent, state.risk.maxDailyLossPercent),
        drawdownStopPercent: ensureNumber(req.body?.drawdownStopPercent, state.risk.drawdownStopPercent),
        stopLossPercent: ensureNumber(req.body?.stopLossPercent, state.risk.stopLossPercent),
        takeProfitPercent: ensureNumber(req.body?.takeProfitPercent, state.risk.takeProfitPercent),
        stablecoin: String(req.body?.stablecoin || state.risk.stablecoin),
        fiatRail: String(req.body?.fiatRail || state.risk.fiatRail),
        alertOnVolatility: req.body?.alertOnVolatility !== undefined ? Boolean(req.body.alertOnVolatility) : state.risk.alertOnVolatility,
      }
      await persistTenantState(tenantId, state)
      res.json({ success: true, data: state.risk })
    } catch (error) {
      next(error)
    }
  })

  router.get('/trades', async (_req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      res.json({ success: true, data: state.executions })
    } catch (error) {
      next(error)
    }
  })

  router.get('/insights', async (_req, res, next) => {
    try {
      const tenantId = tenantIdFrom(res)
      const { state } = await tenantStateFor(tenantId)
      const chart = analysisFor(state.watchlist[0] || 'BTC-USD')
      res.json({
        success: true,
        data: {
          headline: answerBob(`Summarize the FoundCrypto chart for ${chart.symbol}.`, { app: 'foundcrypto', tenantId }),
          chart,
          executionCount: state.executions.length,
          activeTriggers: state.triggers.filter((trigger) => trigger.enabled).length,
          risk: state.risk,
        },
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
