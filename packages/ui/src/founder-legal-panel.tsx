'use client'
import { useCallback, useEffect, useState } from 'react'
import { legalAreas, legalMarketCountries, legalObligations, legalReviewModule, legalReviewStates, readLegalReview, validateLegalReview, type LegalReview } from './founder-legal'
import { productionRecords, type ProductionWorkspaceRecord } from './workspace-production-client'
import type { FounderOverview } from './founder-types'

export function FounderLegalPanel({ section, demo, readOnly, overview }: { section: string; demo: boolean; readOnly: boolean; overview: FounderOverview | null }) {
  const [records, setRecords] = useState<ProductionWorkspaceRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [review, setReview] = useState<LegalReview>({ obligationId: 'subscription-terms', country: '', state: 'In review', reviewer: '', nextReview: '', evidence: '' })
  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const rows = await productionRecords.list('legal', legalReviewModule)
      if (rows.some((row) => !readLegalReview(row))) throw new Error('Some legal review records could not be read. Check the stored records before relying on this register.')
      setRecords(rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the legal review register.')
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { setRecords([]); setMessage(''); if (!demo) void load() }, [demo, load])
  const area = legalAreas.find(([key]) => key === section)?.[0]
  const items = legalObligations.filter((item) => !area || item.area === area)
  const chosen = legalObligations.find((item) => item.id === review.obligationId)!
  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (demo || readOnly || loading || saving || error) return
    setMessage('')
    const input = { ...review, country: chosen.area === 'markets' ? review.country.trim() : 'UK seller / customer scope in notes', reviewer: review.reviewer.trim(), evidence: review.evidence.trim() }
    const invalid = validateLegalReview(input)
    if (invalid) { setMessage(invalid); return }
    setSaving(true)
    try {
      const row = await productionRecords.create('legal', legalReviewModule, { reference: `LEGAL-REVIEW-${crypto.randomUUID()}`, name: `${chosen.title} · ${input.country}`, status: 'Draft', data: { founderLegalReview: input } })
      if (!readLegalReview(row)) throw new Error('The saved review response was incomplete. Refresh the register before retrying.')
      setRecords((current) => [row, ...current])
      setMessage('Review saved to the account. Evidence recorded is not a legal approval or compliance certificate.')
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save the legal review.') }
    finally { setSaving(false) }
  }
  const reviews = records.flatMap((record) => {
    const value = readLegalReview(record)
    return value && (!area || legalObligations.find((item) => item.id === value.obligationId)?.area === area) ? [{ record, value }] : []
  })
  return <div className="sd-legal">
    <section className="sd-panel">
      <p className="sd-eyebrow">FoundingOS company legal · UK seller · India &amp; individual African markets</p>
      <h2>{legalAreas.find(([key]) => key === section)?.[1] ?? 'Business legal control centre'}</h2>
      <p>Run FoundingOS&apos;s own subscription business here. Customer legal practices use the separate Legal workspace; client matters and billable hours do not belong in this control centre.</p>
      <p className="sd-muted">Review framework, not legal advice. No subscription or country is automatically declared compliant. Requirements depend on the actual entity, customer type, country and data flows; use qualified UK and local advisers.</p>
      {demo ? <p className="sd-muted">EXAMPLE DATA: subscriber figures are illustrative. No legal evidence is fabricated and review saving is disabled.</p> : null}
      <div className="sd-kpis">
        <article><span>Subscribers{demo ? ' · example' : ''}</span><b>{overview ? overview.subscriptions.customers : 'Unavailable'}</b><small>Commercial figures, not contract acceptance</small></article>
        <article><span>Review topics</span><b>{legalObligations.length}</b><small>Not an exhaustive legal checklist</small></article>
        <article><span>Country coverage</span><b>Review per country</b><small>No continent-wide approval</small></article>
      </div>
      <p className="sd-error">Subscription terms publication needs review: there is currently no public /terms page. Publish adviser-reviewed terms and connect versioned acceptance to checkout before treating this as ready.</p>
      <p><a href="/privacy" target="_blank" rel="noreferrer">Published privacy notice</a> · <a href="/app/legal">Customer Legal workspace</a></p>
    </section>
    {error ? <div className="sd-panel"><p className="sd-error" role="alert">{error} Do not treat unavailable records as completed reviews.</p><button disabled={loading} onClick={() => void load()} type="button">Retry loading register</button></div> : null}
    <div className="sd-grid">{items.map((item) => <section className="sd-panel" key={item.id}>
      <small>{legalAreas.find(([key]) => key === item.area)?.[1]}</small><h3>{item.title}</h3><p>{item.review}</p>
      <p className="sd-muted">{demo ? 'No example approval supplied.' : loading ? 'Loading recorded evidence…' : error ? 'Review state unavailable.' : records.some((record) => readLegalReview(record)?.obligationId === item.id) ? 'Review entries below. Check their country, scope and next-review date.' : 'No review evidence recorded yet.'}</p>
      <button onClick={() => { setReview((current) => ({ ...current, obligationId: item.id, country: '', evidence: '' })); setMessage('') }} type="button">Select review topic</button>
    </section>)}</div>
    <section className="sd-panel">
      <h2>Record a review</h2><p className="sd-muted">Append a scoped review with a named owner, evidence and next-review date. Previous entries remain in the register; nothing here changes checkout, subscription billing or published terms.</p>
      <form className="sd-form" onSubmit={(event) => void save(event)}>
        <fieldset disabled={demo || readOnly || loading || saving || Boolean(error)}>
          <label className="sd-field">Review topic<select value={review.obligationId} onChange={(event) => { setReview({ ...review, obligationId: event.target.value, country: '' }); setMessage('') }}>{legalObligations.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          {chosen.area === 'markets' ? <label className="sd-field">One country<select required value={review.country} onChange={(event) => setReview({ ...review, country: event.target.value })}><option value="">Choose a country</option>{legalMarketCountries.map((country) => <option key={country}>{country}</option>)}</select><small>India and African countries are available first. A listed country is not an approved market; other launch countries require their own assessment.</small></label> : null}
          <div className="sd-form-row">
            <label className="sd-field">Responsible reviewer<input required value={review.reviewer} onChange={(event) => setReview({ ...review, reviewer: event.target.value })} /></label>
            <label className="sd-field">Next review<input required type="date" value={review.nextReview} onChange={(event) => setReview({ ...review, nextReview: event.target.value })} /></label>
            <label className="sd-field">Review state<select value={review.state} onChange={(event) => setReview({ ...review, state: event.target.value as LegalReview['state'] })}>{legalReviewStates.map((state) => <option key={state}>{state}</option>)}</select></label>
          </div>
          <label className="sd-field">Scope, review notes &amp; evidence reference<textarea required value={review.evidence} placeholder="Document version, customers/country covered, adviser, evidence reference and outstanding actions. Do not paste secrets." onChange={(event) => setReview({ ...review, evidence: event.target.value })} /></label>
          <button type="submit">{saving ? 'Saving…' : 'Save review entry'}</button>
        </fieldset>
      </form>
      {readOnly ? <p className="sd-muted">View-only access: reviews cannot be saved.</p> : null}
      {message ? <p role="status">{message}</p> : null}
    </section>
    <section className="sd-panel"><h2>Review register</h2>
      {loading ? <p>Loading…</p> : error ? <p className="sd-muted">Register unavailable.</p> : !reviews.length ? <p className="sd-muted">No recorded reviews for this view. This does not mean the business meets the requirements.</p> : reviews.map(({ record, value }) => <article className="sd-legal-entry" key={record.id}>
        <h3>{legalObligations.find((item) => item.id === value.obligationId)?.title} · {value.country}</h3>
        <p>{value.state} · {value.reviewer} · next review {value.nextReview}{value.nextReview < new Date().toISOString().slice(0, 10) ? ' · REVIEW DUE' : ''}</p>
        <p className="sd-social-caption">{value.evidence}</p><small>Recorded {new Date(record.updatedAt).toLocaleString('en-GB')} · recorded evidence is not verified legal compliance</small>
      </article>)}
      {records.length >= 500 ? <p className="sd-muted">The register reached its 500-record display limit; older evidence may not be shown.</p> : null}
    </section>
    <section className="sd-panel"><h2>Official starting points</h2><p className="sd-muted">Check current guidance and commencement dates with advisers. Examples below are not a list of approved launch countries.</p>
      <ul>
        <li><a href="https://www.gov.uk/running-a-limited-company" target="_blank" rel="noreferrer">UK company obligations</a> · <a href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/" target="_blank" rel="noreferrer">ICO international transfers</a></li>
        <li><a href="https://www.meity.gov.in/" target="_blank" rel="noreferrer">India: MeitY privacy legislation and notifications</a> · <a href="https://www.gst.gov.in/" target="_blank" rel="noreferrer">India: GST portal</a></li>
        <li><a href="https://www.odpc.go.ke/" target="_blank" rel="noreferrer">Kenya: ODPC</a> · <a href="https://ndpc.gov.ng/" target="_blank" rel="noreferrer">Nigeria: NDPC</a> · <a href="https://inforegulator.org.za/" target="_blank" rel="noreferrer">South Africa: Information Regulator</a></li>
      </ul>
    </section>
  </div>
}
