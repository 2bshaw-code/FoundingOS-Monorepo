export const supportedLanguages = [
  { code: 'en', locale: 'en-GB', name: 'English', direction: 'ltr' },
  { code: 'fr', locale: 'fr-FR', name: 'Français', direction: 'ltr' },
  { code: 'es', locale: 'es-ES', name: 'Español', direction: 'ltr' },
  { code: 'pt', locale: 'pt-PT', name: 'Português', direction: 'ltr' },
  { code: 'sw', locale: 'sw-KE', name: 'Kiswahili', direction: 'ltr' },
  { code: 'ar', locale: 'ar-AE', name: 'العربية', direction: 'rtl' },
] as const

export type SupportedLanguageCode = (typeof supportedLanguages)[number]['code']

export const supportedCurrencies = [
  'GBP', 'USD', 'EUR', 'AED', 'AUD', 'CAD', 'GHS', 'KES', 'MAD', 'MUR',
  'NGN', 'RWF', 'SAR', 'TZS', 'UGX', 'XAF', 'XOF', 'ZAR', 'ZMW',
] as const

export type SupportedCurrency = (typeof supportedCurrencies)[number]

export const regionCurrency: Record<string, SupportedCurrency> = {
  AE: 'AED',
  AU: 'AUD',
  CA: 'CAD',
  GB: 'GBP',
  GH: 'GHS',
  KE: 'KES',
  MA: 'MAD',
  MU: 'MUR',
  NG: 'NGN',
  RW: 'RWF',
  SA: 'SAR',
  TZ: 'TZS',
  UG: 'UGX',
  US: 'USD',
  ZA: 'ZAR',
  ZM: 'ZMW',
}

export const gbpExchangeRates: Record<SupportedCurrency, number> = {
  GBP: 1,
  USD: 1.29,
  EUR: 1.17,
  AED: 4.74,
  AUD: 1.98,
  CAD: 1.76,
  GHS: 20.2,
  KES: 167,
  MAD: 12.8,
  MUR: 59.5,
  NGN: 2050,
  RWF: 1810,
  SAR: 4.84,
  TZS: 3340,
  UGX: 4750,
  XAF: 768,
  XOF: 768,
  ZAR: 23.8,
  ZMW: 36.1,
}
