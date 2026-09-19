'use client'

import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'

const API_BASE = '/api/core-operations/ops'

type BrandProfile = {
  companyName: string
  tradingName: string
  tagline: string
  logoUrl: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  headingFont: string
  bodyFont: string
  email: string
  phone: string
  website: string
  address: string
  registrationNumber: string
  taxNumber: string
  defaultLocale: string
  defaultCurrency: string
  invoicePrefix: string
  paymentTerms: string
  documentFooter: string
  brandVoice: { tone: string; approvedTerms: string; avoidedTerms: string }
  socialLinks: { instagram: string; facebook: string; linkedin: string; x: string }
  version?: number
}

const initialProfile: BrandProfile = {
  companyName: '',
  tradingName: '',
  tagline: '',
  logoUrl: '',
  primaryColor: '#4A90E2',
  secondaryColor: '#101828',
  accentColor: '#7C3AED',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  email: '',
  phone: '',
  website: '',
  address: '',
  registrationNumber: '',
  taxNumber: '',
  defaultLocale: 'en-GB',
  defaultCurrency: 'GBP',
  invoicePrefix: 'INV',
  paymentTerms: 'Payment due within 14 days.',
  documentFooter: '',
  brandVoice: { tone: 'Clear, confident, and helpful', approvedTerms: '', avoidedTerms: '' },
  socialLinks: { instagram: '', facebook: '', linkedin: '', x: '' },
}

async function brandRequest(init?: RequestInit) {
  const response = await fetch(`${API_BASE}/brand-profile`, {
    ...init,
    credentials: 'include',
    headers: { 'content-type': 'application/json', ...init?.headers },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.message || `Brand Studio request failed (${response.status})`)
  return body.data as Partial<BrandProfile> | null
}

export default function BrandStudioPage() {
  const [profile, setProfile] = useState(initialProfile)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    brandRequest()
      .then((saved) => {
        if (!cancelled && saved) setProfile((current) => ({ ...current, ...saved }))
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Brand profile could not be loaded.')
      })
    return () => { cancelled = true }
  }, [])

  const setField = <Key extends keyof BrandProfile>(key: Key, value: BrandProfile[Key]) => {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setStatus('')
    setError('')
    try {
      const saved = await brandRequest({ method: 'PUT', body: JSON.stringify(profile) })
      if (saved) setProfile((current) => ({ ...current, ...saved }))
      setStatus('Brand profile published. New order and invoice documents will use this version.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Brand profile could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  const previewStyle = {
    '--brand-primary': profile.primaryColor,
    '--brand-secondary': profile.secondaryColor,
    '--brand-accent': profile.accentColor,
    fontFamily: `${profile.bodyFont}, Inter, sans-serif`,
  } as CSSProperties

  return (
    <section className="page-grid">
      <header className="page-header">
        <div><p className="eyebrow">Shared company identity</p><h1>Brand Studio</h1><p>Define your brand once. FoundingOS applies it to orders, invoices, receipts, campaigns, email, and customer documents.</p></div>
      </header>
      {error ? <div className="panel" role="alert"><strong>Brand Studio needs attention</strong><p>{error}</p></div> : null}
      {status ? <div className="panel" role="status">{status}</div> : null}

      <div className="brand-studio-layout">
        <form className="panel brand-studio-form" onSubmit={submit}>
          <fieldset>
            <legend>Company identity</legend>
            <label>Registered company name<input className="input" required value={profile.companyName} onChange={(event) => setField('companyName', event.target.value)} /></label>
            <label>Trading name<input className="input" value={profile.tradingName} onChange={(event) => setField('tradingName', event.target.value)} /></label>
            <label>Tagline<input className="input" value={profile.tagline} onChange={(event) => setField('tagline', event.target.value)} /></label>
            <label>Logo asset URL<input className="input" type="url" value={profile.logoUrl} onChange={(event) => setField('logoUrl', event.target.value)} placeholder="https://…" /></label>
          </fieldset>

          <fieldset>
            <legend>Visual system</legend>
            <div className="brand-colour-grid">
              <label>Primary<input type="color" value={profile.primaryColor} onChange={(event) => setField('primaryColor', event.target.value)} /></label>
              <label>Secondary<input type="color" value={profile.secondaryColor} onChange={(event) => setField('secondaryColor', event.target.value)} /></label>
              <label>Accent<input type="color" value={profile.accentColor} onChange={(event) => setField('accentColor', event.target.value)} /></label>
            </div>
            <label>Heading font<input className="input" value={profile.headingFont} onChange={(event) => setField('headingFont', event.target.value)} /></label>
            <label>Body font<input className="input" value={profile.bodyFont} onChange={(event) => setField('bodyFont', event.target.value)} /></label>
          </fieldset>

          <fieldset>
            <legend>Legal and contact details</legend>
            <label>Address<textarea className="input" rows={3} value={profile.address} onChange={(event) => setField('address', event.target.value)} /></label>
            <label>Email<input className="input" type="email" value={profile.email} onChange={(event) => setField('email', event.target.value)} /></label>
            <label>Phone<input className="input" value={profile.phone} onChange={(event) => setField('phone', event.target.value)} /></label>
            <label>Website<input className="input" type="url" value={profile.website} onChange={(event) => setField('website', event.target.value)} /></label>
            <label>Company registration number<input className="input" value={profile.registrationNumber} onChange={(event) => setField('registrationNumber', event.target.value)} /></label>
            <label>Tax / VAT number<input className="input" value={profile.taxNumber} onChange={(event) => setField('taxNumber', event.target.value)} /></label>
          </fieldset>

          <fieldset>
            <legend>Document defaults</legend>
            <label>Locale<input className="input" value={profile.defaultLocale} onChange={(event) => setField('defaultLocale', event.target.value)} /></label>
            <label>Currency<input className="input" maxLength={3} value={profile.defaultCurrency} onChange={(event) => setField('defaultCurrency', event.target.value.toUpperCase())} /></label>
            <label>Invoice prefix<input className="input" value={profile.invoicePrefix} onChange={(event) => setField('invoicePrefix', event.target.value)} /></label>
            <label>Payment terms<textarea className="input" rows={3} value={profile.paymentTerms} onChange={(event) => setField('paymentTerms', event.target.value)} /></label>
            <label>Document footer<textarea className="input" rows={3} value={profile.documentFooter} onChange={(event) => setField('documentFooter', event.target.value)} /></label>
          </fieldset>

          <fieldset>
            <legend>Brand voice</legend>
            <p>These rules are enforced when FoundingOS creates campaign copy, social posts, and generated media. Content containing prohibited terminology is rejected before it is saved.</p>
            <label>Tone<textarea className="input" rows={2} value={profile.brandVoice.tone} onChange={(event) => setField('brandVoice', { ...profile.brandVoice, tone: event.target.value })} /></label>
            <label>Approved words and phrases<textarea className="input" rows={2} value={profile.brandVoice.approvedTerms} onChange={(event) => setField('brandVoice', { ...profile.brandVoice, approvedTerms: event.target.value })} /></label>
            <label>Words and claims to avoid<textarea className="input" rows={2} value={profile.brandVoice.avoidedTerms} onChange={(event) => setField('brandVoice', { ...profile.brandVoice, avoidedTerms: event.target.value })} /></label>
          </fieldset>

          <button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Publishing…' : 'Publish brand profile'}</button>
        </form>

        <aside className="brand-document-preview" style={previewStyle}>
          <p className="eyebrow">Live document preview</p>
          <div className="brand-document-paper">
            <header>
              {profile.logoUrl ? <img src={profile.logoUrl} alt="" /> : <span>{(profile.tradingName || profile.companyName || 'B').slice(0, 1)}</span>}
              <div><h2>{profile.tradingName || profile.companyName || 'Your company'}</h2><p>{profile.tagline || 'Your company tagline'}</p></div>
              <strong>INVOICE</strong>
            </header>
            <div className="brand-document-details"><p><b>{profile.invoicePrefix}-00142</b><br />Issued 17 Sep 2026<br />Due 1 Oct 2026</p><p>{profile.address || 'Company address'}<br />{profile.email || 'accounts@example.com'}<br />{profile.taxNumber ? `Tax: ${profile.taxNumber}` : 'Tax number'}</p></div>
            <div className="brand-document-line"><span>FoundingOS implementation</span><span>1</span><strong>1,250.00 {profile.defaultCurrency}</strong></div>
            <div className="brand-document-total"><span>Total</span><strong>1,250.00 {profile.defaultCurrency}</strong></div>
            <footer><p>{profile.paymentTerms}</p><p>{profile.documentFooter}</p></footer>
          </div>
          <p>Profile version {profile.version ?? 0}. Every generated document stores this full brand profile and its source record as immutable provenance; later brand changes do not rewrite historic documents.</p>
        </aside>
      </div>
    </section>
  )
}
