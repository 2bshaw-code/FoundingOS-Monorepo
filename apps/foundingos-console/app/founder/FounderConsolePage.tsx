/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import KPIWidget from '../components/KPIWidget'
import { ClientDate } from './ClientDate'
import { useFounderGlobalisation, currencyOptions, languageOptions } from './founder-globalisation'

type ControlSection = {
  key: string
  title: string
  summary: string
  amount: number
  status: string
}

const translations = {
  en: {
    title: 'FoundingOS master control centre',
    subtitle: 'One shared view for every brand, workflow, customer, order, and AI onboarding path across the group.',
    global: 'Globalisation',
    geo: 'Geo awareness',
    controls: 'Language and currency controls',
    sections: 'Management sections',
    overview: 'Portfolio overview',
    detected: 'Detected',
    override: 'Override',
    auto: 'Auto',
    locale: 'Locale',
    region: 'Region',
    language: 'Language',
    country: 'Country',
    currency: 'Currency',
    businesses: 'All businesses',
    brands: 'All brands',
    workflows: 'All workflows',
    whatsapp: 'All WhatsApp automation',
    analytics: 'All analytics',
    ai: 'All AI onboarding',
    customers: 'All customers',
    orders: 'All orders',
    products: 'All products',
    employees: 'All employees',
    permissions: 'All permissions',
    settings: 'All settings',
    open: 'Open',
    live: 'Live',
    active: 'Active',
    totalRevenue: 'Total revenue',
    totalOrders: 'Orders in flight',
    localValue: 'Example local value',
    snapshot: 'Global snapshot',
    tax: 'Region-based tax',
    shipping: 'Region-based shipping',
    aiNote: 'AI outputs format to the active locale and currency automatically.',
    refresh: 'Auto-detected on load and stored locally for the session.',
  },
  es: {
    title: 'Centro de control maestro de FoundingOS',
    subtitle: 'Una vista compartida para cada marca, flujo de trabajo, cliente, pedido y ruta de incorporación de IA en todo el grupo.',
    global: 'Globalización',
    geo: 'Conciencia geográfica',
    controls: 'Controles de idioma y moneda',
    sections: 'Secciones de gestión',
    overview: 'Resumen de cartera',
    detected: 'Detectado',
    override: 'Anular',
    auto: 'Automático',
    locale: 'Configuración regional',
    region: 'Región',
    language: 'Idioma',
    country: 'País',
    currency: 'Moneda',
    businesses: 'Todas las empresas',
    brands: 'Todas las marcas',
    workflows: 'Todos los flujos',
    whatsapp: 'Toda la automatización de WhatsApp',
    analytics: 'Todos los análisis',
    ai: 'Todo el onboarding de IA',
    customers: 'Todos los clientes',
    orders: 'Todos los pedidos',
    products: 'Todos los productos',
    employees: 'Todos los empleados',
    permissions: 'Todos los permisos',
    settings: 'Todos los ajustes',
    open: 'Abrir',
    live: 'En vivo',
    active: 'Activo',
    totalRevenue: 'Ingresos totales',
    totalOrders: 'Pedidos en curso',
    localValue: 'Valor local de ejemplo',
    snapshot: 'Resumen global',
    tax: 'Impuesto por región',
    shipping: 'Envío por región',
    aiNote: 'Las salidas de IA se formatean automáticamente según la configuración regional y la moneda activas.',
    refresh: 'Detectado al cargar y guardado localmente para la sesión.',
  },
  fr: {
    title: 'Centre de contrôle principal de FoundingOS',
    subtitle: 'Une vue partagée pour chaque marque, workflow, client, commande et parcours d’intégration IA du groupe.',
    global: 'Mondialisation',
    geo: 'Conscience géographique',
    controls: 'Contrôles de langue et de devise',
    sections: 'Sections de gestion',
    overview: 'Vue d’ensemble du portefeuille',
    detected: 'Détecté',
    override: 'Remplacer',
    auto: 'Auto',
    locale: 'Paramètre régional',
    region: 'Région',
    language: 'Langue',
    country: 'Pays',
    currency: 'Devise',
    businesses: 'Toutes les entreprises',
    brands: 'Toutes les marques',
    workflows: 'Tous les workflows',
    whatsapp: 'Toute l’automatisation WhatsApp',
    analytics: 'Toutes les analyses',
    ai: 'Tout l’onboarding IA',
    customers: 'Tous les clients',
    orders: 'Toutes les commandes',
    products: 'Tous les produits',
    employees: 'Tous les employés',
    permissions: 'Toutes les autorisations',
    settings: 'Tous les paramètres',
    open: 'Ouvrir',
    live: 'En direct',
    active: 'Actif',
    totalRevenue: 'Revenu total',
    totalOrders: 'Commandes en cours',
    localValue: 'Valeur locale exemple',
    snapshot: 'Instantané global',
    tax: 'Taxe par région',
    shipping: 'Livraison par région',
    aiNote: 'Les sorties IA s’alignent automatiquement sur la locale et la devise actives.',
    refresh: 'Détecté au chargement et enregistré localement pour la session.',
  },
} as const

const sections: ControlSection[] = [
  { key: 'businesses', title: 'All businesses', summary: 'Portfolio structure, ownership, and operating health across the group.', amount: 5, status: 'Live' },
  { key: 'brands', title: 'All brands', summary: 'Brand registry, visual identity, and brand-level controls in one place.', amount: 5, status: 'Live' },
  { key: 'workflows', title: 'All workflows', summary: 'Active automations, approvals, and workflow orchestration for every brand.', amount: 18, status: 'Active' },
  { key: 'whatsapp', title: 'All WhatsApp automation', summary: 'Messaging flows, inbox routing, and FoundAI-assisted automation across channels.', amount: 42, status: 'Live' },
  { key: 'analytics', title: 'All analytics', summary: 'Revenue, product, order, customer, and AI metrics across the ecosystem.', amount: 24, status: 'Live' },
  { key: 'ai', title: 'All AI onboarding', summary: 'FoundAI entry points, prompts, handoffs, and onboarding journeys for every brand.', amount: 12, status: 'Active' },
  { key: 'customers', title: 'All customers', summary: 'Customer records, segments, and service signals across the operating layer.', amount: 1284, status: 'Live' },
  { key: 'orders', title: 'All orders', summary: 'Order queues, fulfilment status, and region-based dispatch tracking.', amount: 458, status: 'Live' },
  { key: 'products', title: 'All products', summary: 'Product catalogues, pricing, and local market availability across brands.', amount: 932, status: 'Live' },
  { key: 'employees', title: 'All employees', summary: 'Staff, permissions, teams, and access governance in one central view.', amount: 73, status: 'Active' },
  { key: 'permissions', title: 'All permissions', summary: 'Role scopes, approvals, and access policy controls for the FoundingOS stack.', amount: 36, status: 'Live' },
  { key: 'settings', title: 'All settings', summary: 'Theme, language, currency, tax, and shipping controls for the full system.', amount: 14, status: 'Active' },
]

function langKey(locale: string) {
  return locale.split('-')[0] as keyof typeof translations
}

export default function FounderConsolePage() {
  const geo = useFounderGlobalisation()
  const copyLocale = geo.languageOverride === 'auto' ? geo.locale : geo.languageOverride
  const copy = translations[langKey(copyLocale)] ?? translations.en
  const localeLabel = geo.localeOverride === 'auto' ? copy.detected : copy.override
  const activeLanguage = copyLocale

  const metrics = [
    { label: copy.businesses, value: geo.formatNumber(5), trend: copy.active, icon: '◍', tone: 'good' as const },
    { label: copy.totalRevenue, value: geo.formatCurrency(48200), trend: geo.locale, icon: '£', tone: 'good' as const },
    { label: copy.totalOrders, value: geo.formatNumber(458), trend: copy.live, icon: '▦', tone: 'watch' as const },
    { label: copy.ai, value: geo.formatNumber(12), trend: copy.active, icon: 'B', tone: 'good' as const },
  ]

  return (
    <section className="stack quantum-ambient-grid">
      <div className="quantum-particle-drift"><span className="quantum-particle" /><span className="quantum-particle" /><span className="quantum-particle" /></div>
      <header className="module-header header-premium">
        <p>{copy.overview}</p>
        <h1>{copy.title}</h1>
        <span>{copy.subtitle}</span>
      </header>

      <div className="kpi-grid">
        {metrics.map((metric, index) => <KPIWidget key={metric.label} metric={metric} index={index} />)}
      </div>

      <div className="module-card-grid">
        {sections.map((section, index) => {
          const statusText = section.status === 'Live' ? copy.live : section.status === 'Active' ? copy.active : section.status
          return (
          <article key={section.key} className="module-card card-premium quantum-card">
            <span className="quantum-corner-marker">⌂</span>
            <div className="module-card-top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{copy[section.key as keyof typeof copy]}</strong>
            </div>
            <p>{section.summary}</p>
            <div className="module-card-meta">
              <small>{copy.open}</small>
              <small>{statusText}</small>
            </div>
          </article>
          )
        })}
      </div>

      <div className="console-grid">
        <article className="panel panel-premium wide">
          <h2>{copy.snapshot}</h2>
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>{copy.totalRevenue}</th>
                <th>{copy.totalOrders}</th>
                <th>{copy.language}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['FoundRetail', 12400, 42, 'en-GB'],
                ['FoundMeat', 8700, 31, 'en-GB'],
                ['FoundThat', 9100, 18, 'en-US'],
                ['FoundTalent', 10200, 27, 'en-AU'],
                ['FoundCrypto', 7800, 14, 'en-ZA'],
              ].map(([brand, revenue, orders, locale]) => (
                <tr key={brand as string}>
                  <td>{brand}</td>
                  <td>{geo.formatCurrency(revenue as number)}</td>
                  <td>{geo.formatNumber(orders as number)}</td>
                  <td>{locale as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel panel-premium">
          <h2>{copy.geo}</h2>
          <p>{copy.refresh}</p>
          <dl className="space-y-3">
            <div><dt>{copy.locale}</dt><dd>{geo.locale}</dd></div>
            <div><dt>{copy.region}</dt><dd>{geo.region}</dd></div>
            <div><dt>{copy.language}</dt><dd>{geo.language}</dd></div>
            <div><dt>{copy.country}</dt><dd>{geo.country}</dd></div>
            <div><dt>{copy.currency}</dt><dd>{geo.currency}</dd></div>
          </dl>
        </article>

        <article className="panel panel-premium">
          <h2>{copy.controls}</h2>
          <label className="manager-field">
            <span>{copy.locale}</span>
            <select value={geo.localeOverride} onChange={(event) => geo.setLocaleOverride(event.target.value)}>
              <option value="auto">{copy.auto}</option>
              {languageOptions.filter((option) => option !== 'auto').map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="manager-field">
            <span>{copy.currency}</span>
            <select value={geo.currencyOverride} onChange={(event) => geo.setCurrencyOverride(event.target.value)}>
              <option value="auto">{copy.auto}</option>
              {currencyOptions.filter((option) => option !== 'auto').map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="manager-field">
            <span>{copy.language}</span>
            <select value={geo.languageOverride} onChange={(event) => geo.setLanguageOverride(event.target.value)}>
              <option value="auto">{copy.auto}</option>
              {languageOptions.filter((option) => option !== 'auto').map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <p>{copy.aiNote}</p>
          <p>{localeLabel}: {activeLanguage}</p>
        </article>

        <article className="panel">
          <h2>{copy.global}</h2>
          <p>{copy.totalRevenue}: {geo.formatCurrency(12345)}</p>
          <p>{copy.totalOrders}: {geo.formatNumber(98)}</p>
          <p>{copy.tax}: {geo.formatCurrency(1250)}</p>
          <p>{copy.shipping}: {geo.formatCurrency(185)}</p>
          <p>{copy.localValue}: <ClientDate value={Date.now()} /></p>
        </article>
      </div>
    </section>
  )
}
