'use client'

import {
  gbpExchangeRates,
  regionCurrency,
  supportedCurrencies,
  supportedLanguages,
  type SupportedCurrency,
  type SupportedLanguageCode,
} from '@foundingos/config/globalisation'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const LANGUAGE_KEY = 'foundingos-language'
const CURRENCY_KEY = 'foundingos-currency'

type GlobalisationState = {
  language: SupportedLanguageCode
  currency: SupportedCurrency
  setLanguage: (language: SupportedLanguageCode) => void
  setCurrency: (currency: SupportedCurrency) => void
  formatGbp: (amount: number) => string
}

const GlobalisationContext = createContext<GlobalisationState | null>(null)

function browserLanguage(): SupportedLanguageCode {
  if (typeof navigator === 'undefined') return 'en'
  const requested = navigator.languages?.[0] || navigator.language
  const code = requested.split('-')[0]
  return supportedLanguages.some((language) => language.code === code)
    ? code as SupportedLanguageCode
    : 'en'
}

function browserCurrency(): SupportedCurrency {
  if (typeof navigator === 'undefined') return 'GBP'
  const locale = navigator.languages?.[0] || navigator.language
  const region = new Intl.Locale(locale).region
  return region ? regionCurrency[region] ?? 'USD' : 'USD'
}

export function GlobalisationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguageCode>('en')
  const [currency, setCurrency] = useState<SupportedCurrency>('GBP')

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY) as SupportedLanguageCode | null
    const storedCurrency = window.localStorage.getItem(CURRENCY_KEY) as SupportedCurrency | null
    setLanguage(storedLanguage && supportedLanguages.some((item) => item.code === storedLanguage) ? storedLanguage : browserLanguage())
    setCurrency(storedCurrency && supportedCurrencies.includes(storedCurrency) ? storedCurrency : browserCurrency())
  }, [])

  useEffect(() => {
    const selected = supportedLanguages.find((item) => item.code === language) ?? supportedLanguages[0]
    document.documentElement.lang = selected.locale
    document.documentElement.dir = selected.direction
    window.localStorage.setItem(LANGUAGE_KEY, language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem(CURRENCY_KEY, currency)
  }, [currency])

  const value = useMemo<GlobalisationState>(() => ({
    language,
    currency,
    setLanguage,
    setCurrency,
    formatGbp: (amount) => new Intl.NumberFormat(
      supportedLanguages.find((item) => item.code === language)?.locale ?? 'en-GB',
      { style: 'currency', currency, maximumFractionDigits: amount === 0 ? 0 : 2 },
    ).format(amount * gbpExchangeRates[currency]),
  }), [currency, language])

  return <GlobalisationContext.Provider value={value}>{children}</GlobalisationContext.Provider>
}

export function useGlobalisation() {
  const context = useContext(GlobalisationContext)
  if (!context) throw new Error('useGlobalisation must be used within GlobalisationProvider')
  return context
}

export function GlobalisationControls() {
  const { language, currency, setLanguage, setCurrency } = useGlobalisation()

  return (
    <div className="globalisation-controls" aria-label="Language and currency">
      <label>
        <span className="sr-only">Language</span>
        <select value={language} onChange={(event) => setLanguage(event.target.value as SupportedLanguageCode)} aria-label="Language">
          {supportedLanguages.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
        </select>
      </label>
      <label>
        <span className="sr-only">Currency</span>
        <select value={currency} onChange={(event) => setCurrency(event.target.value as SupportedCurrency)} aria-label="Currency">
          {supportedCurrencies.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>
  )
}

export function LocalizedGbp({ amount }: { amount: number }) {
  const { formatGbp } = useGlobalisation()
  return <>{formatGbp(amount)}</>
}
