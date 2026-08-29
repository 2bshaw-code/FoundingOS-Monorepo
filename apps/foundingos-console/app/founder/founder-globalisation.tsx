/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const LOCALE_KEY = 'foundingos-founder-locale'
const CURRENCY_KEY = 'foundingos-founder-currency'
const LANGUAGE_KEY = 'foundingos-founder-language'

const currencyMap: Record<string, string> = {
  'en-GB': 'GBP',
  'en-US': 'USD',
  'en-ZA': 'ZAR',
  'en-AU': 'AUD',
  'en-CA': 'CAD',
  default: 'USD',
}

const languageOptions = ['auto', 'en-GB', 'en-US', 'es-ES', 'fr-FR'] as const
const currencyOptions = ['auto', 'GBP', 'USD', 'ZAR', 'AUD', 'CAD'] as const

type FounderGlobalisationState = {
  locale: string
  region: string
  language: string
  country: string
  currency: string
  localeOverride: string
  currencyOverride: string
  languageOverride: string
  setLocaleOverride: (locale: string) => void
  setCurrencyOverride: (currency: string) => void
  setLanguageOverride: (locale: string) => void
  formatCurrency: (value: number) => string
  formatNumber: (value: number) => string
  formatDate: (value: string | number | Date) => string
}

const FounderGlobalisationContext = createContext<FounderGlobalisationState | null>(null)

function readStoredValue(key: string) {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(key) ?? ''
}

function detectLocale() {
  if (typeof navigator === 'undefined') return 'en-US'
  return navigator.languages?.[0] || navigator.language || 'en-US'
}

function regionFor(locale: string) {
  return new Intl.Locale(locale).region || locale.split('-')[1] || 'US'
}

function labelFor(locale: string, type: 'language' | 'region') {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type })
    return type === 'language'
      ? displayNames.of(locale.split('-')[0]) || locale.split('-')[0]
      : displayNames.of(regionFor(locale)) || regionFor(locale)
  } catch {
    return type === 'language' ? locale.split('-')[0] : regionFor(locale)
  }
}

function resolveCurrency(locale: string, currencyOverride: string) {
  if (currencyOverride && currencyOverride !== 'auto') return currencyOverride
  return currencyMap[locale] || currencyMap.default
}

function resolveLocale(localeOverride: string) {
  return localeOverride && localeOverride !== 'auto' ? localeOverride : detectLocale()
}

export function FounderGlobalisationProvider({ children }: { children: ReactNode }) {
  const [localeOverride, setLocaleOverride] = useState('auto')
  const [currencyOverride, setCurrencyOverride] = useState('auto')
  const [languageOverride, setLanguageOverride] = useState('auto')

  useEffect(() => {
    setLocaleOverride(readStoredValue(LOCALE_KEY) || 'auto')
    setCurrencyOverride(readStoredValue(CURRENCY_KEY) || 'auto')
    setLanguageOverride(readStoredValue(LANGUAGE_KEY) || 'auto')
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(LOCALE_KEY, localeOverride)
  }, [localeOverride])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(CURRENCY_KEY, currencyOverride)
  }, [currencyOverride])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(LANGUAGE_KEY, languageOverride)
  }, [languageOverride])

  const locale = resolveLocale(localeOverride)
  const currency = resolveCurrency(locale, currencyOverride)
  const region = regionFor(locale)
  const languageCode = locale.split('-')[0]
  const language = labelFor(locale, 'language')
  const country = labelFor(locale, 'region')
  const activeLanguage = languageOverride !== 'auto' ? languageOverride : locale

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = locale
    document.documentElement.dataset.founderLocale = locale
  }, [locale])

  useEffect(() => {
    const sync = () => {
      setLocaleOverride(readStoredValue(LOCALE_KEY) || 'auto')
      setCurrencyOverride(readStoredValue(CURRENCY_KEY) || 'auto')
      setLanguageOverride(readStoredValue(LANGUAGE_KEY) || 'auto')
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const value = useMemo<FounderGlobalisationState>(() => ({
    locale,
    region,
    language,
    country,
    currency,
    localeOverride,
    currencyOverride,
    languageOverride,
    setLocaleOverride,
    setCurrencyOverride,
    setLanguageOverride,
    formatCurrency: (amount) => new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount),
    formatNumber: (amount) => new Intl.NumberFormat(locale).format(amount),
    formatDate: (valueToFormat) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(valueToFormat)),
  }), [locale, region, language, country, currency, localeOverride, currencyOverride, languageOverride])

  return <FounderGlobalisationContext.Provider value={value}>{children}</FounderGlobalisationContext.Provider>
}

export function useFounderGlobalisation() {
  const context = useContext(FounderGlobalisationContext)
  if (!context) throw new Error('useFounderGlobalisation must be used within FounderGlobalisationProvider')
  return context
}

export { currencyOptions, languageOptions, detectLocale }
