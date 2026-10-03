import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { legalAreas, legalMarketCountries, legalObligations, legalReviewModule, legalReviewStates, readLegalReview, validateLegalReview, type LegalReview } from '@foundingos/ui/founder-legal'
import { createWorkspaceRecord, fetchWorkspaceRecords, type WorkspaceRecordDTO } from '../../lib/core-operations-api'
import { QuantumButton, QuantumCard, QuantumNotice, QuantumPill, QuantumText, QuantumTextInput } from '../QuantumUI'

export function FounderLegalPanel({ section, demo, readOnly, reloadKey }: { section: string; demo: boolean; readOnly: boolean; reloadKey: number }) {
  const [records, setRecords] = useState<WorkspaceRecordDTO[]>([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(!demo)
  const [saving, setSaving] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [review, setReview] = useState<LegalReview>({ obligationId: 'subscription-terms', country: '', reviewer: '', nextReview: '', state: 'In review', evidence: '' })
  const load = useCallback(async () => {
    if (demo) { setRecords([]); setLoading(false); return }
    setError(''); setLoading(true)
    try {
      const rows = await fetchWorkspaceRecords('legal', legalReviewModule, 500)
      if (rows.some((row) => !readLegalReview(row))) throw new Error('Some legal review records could not be read. Check the stored register before relying on it.')
      setRecords(rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not load legal reviews.') }
    finally { setLoading(false) }
  }, [demo])
  useEffect(() => { void load() }, [load, reloadKey])
  const area = legalAreas.find(([key]) => key === section)?.[0]
  const chosen = legalObligations.find((item) => item.id === review.obligationId)!
  const disabled = demo || readOnly || loading || saving || Boolean(error)
  const save = async () => {
    if (disabled) return
    const value = { ...review, country: chosen.area === 'markets' ? review.country : 'UK seller / customer scope in notes' }
    const invalid = validateLegalReview(value)
    if (invalid) { setNotice(invalid); return }
    setNotice(''); setSaving(true)
    try {
      const row = await createWorkspaceRecord('legal', legalReviewModule, { reference: `LEGAL-REVIEW-${Date.now()}-${Math.random().toString(36).slice(2)}`, name: `${chosen.title} · ${value.country}`, status: 'Draft', data: { founderLegalReview: value } })
      if (!readLegalReview(row)) throw new Error('The save response was incomplete. Reload the register before retrying.')
      setRecords((current) => [row, ...current]); setNotice('Review saved to your account. Evidence recorded is not legal approval.')
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save the review.') }
    finally { setSaving(false) }
  }
  const reviews = records.flatMap((record) => {
    const value = readLegalReview(record)
    return value && (!area || legalObligations.find((item) => item.id === value.obligationId)?.area === area) ? [{ record, value }] : []
  })
  return <View style={{ gap: 16 }}>
    <QuantumCard><QuantumText variant="h2">{legalAreas.find(([key]) => key === section)?.[1] ?? 'Business legal control centre'}</QuantumText>
      <QuantumText>FoundingOS's own UK subscription business, serving India and individual African markets. Client matters and billable hours remain in the customer Legal workspace.</QuantumText>
      <QuantumText variant="caption">Review framework, not legal advice or certification. Use qualified UK and local advisers. No country or subscription is automatically declared compliant.</QuantumText>
      <QuantumNotice tone="warning">Public subscription terms and versioned checkout acceptance still need implementation and qualified legal review.</QuantumNotice>
      {demo ? <QuantumText variant="caption">EXAMPLE MODE: no legal evidence is fabricated; saving is disabled.</QuantumText> : null}
    </QuantumCard>
    {error ? <QuantumCard><QuantumNotice tone="danger">{error} Do not treat unavailable evidence as completed reviews.</QuantumNotice><QuantumButton disabled={loading} onPress={() => void load()}>Retry loading register</QuantumButton></QuantumCard> : null}
    {legalObligations.filter((item) => !area || item.area === area).map((item) => <QuantumCard key={item.id}>
      <QuantumText variant="h3">{item.title}</QuantumText><QuantumText>{item.review}</QuantumText>
      <QuantumText variant="caption">{loading ? 'Loading evidence…' : error ? 'Review state unavailable.' : records.some((row) => readLegalReview(row)?.obligationId === item.id) ? 'Review entries below; check scope and dates.' : 'No review evidence recorded.'}</QuantumText>
      <QuantumButton tone="secondary" onPress={() => { setReview((current) => ({ ...current, obligationId: item.id, country: '', evidence: '' })); setNotice('') }}>Select review topic</QuantumButton>
    </QuantumCard>)}
    <QuantumCard><QuantumText variant="h2">Record a review</QuantumText><QuantumText variant="label">{chosen.title}</QuantumText>
      <QuantumText variant="caption">Select a topic above. Entries are appended to the same account register as the Mac app; nothing changes checkout, billing or published terms.</QuantumText>
      {chosen.area === 'markets' ? <>
        <QuantumText>One country: {review.country || 'Not selected'}</QuantumText>
        <QuantumTextInput editable={!disabled} value={countrySearch} onChangeText={setCountrySearch} placeholder="Search India or an African country" />
        <ScrollView style={{ maxHeight: 180 }}>{legalMarketCountries.filter((country) => country.toLowerCase().includes(countrySearch.toLowerCase())).map((country) => <QuantumPill key={country} active={review.country === country} onPress={disabled ? undefined : () => setReview({ ...review, country })}>{country}</QuantumPill>)}</ScrollView>
      </> : null}
      <QuantumText>Responsible reviewer</QuantumText><QuantumTextInput editable={!disabled} value={review.reviewer} onChangeText={(reviewer) => setReview({ ...review, reviewer })} placeholder="Named reviewer / adviser" />
      <QuantumText>Next-review date</QuantumText><QuantumTextInput editable={!disabled} value={review.nextReview} onChangeText={(nextReview) => setReview({ ...review, nextReview })} placeholder="YYYY-MM-DD" />
      <QuantumText>Review state</QuantumText><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{legalReviewStates.map((state) => <QuantumPill active={review.state === state} key={state} onPress={disabled ? undefined : () => setReview({ ...review, state })}>{state}</QuantumPill>)}</View>
      <QuantumText>Scope, notes and evidence reference</QuantumText><QuantumTextInput editable={!disabled} multiline value={review.evidence} onChangeText={(evidence) => setReview({ ...review, evidence })} placeholder="Country/customer scope, document version, adviser and outstanding actions. No secrets." />
      <QuantumButton disabled={disabled} onPress={() => void save()}>{saving ? 'Saving…' : 'Save review entry'}</QuantumButton>
      {readOnly ? <QuantumText variant="caption">View-only access: saving is disabled.</QuantumText> : null}
      {notice ? <QuantumText>{notice}</QuantumText> : null}
    </QuantumCard>
    <QuantumCard><QuantumText variant="h2">Review register</QuantumText>
      {loading ? <QuantumText>Loading…</QuantumText> : error ? <QuantumText>Register unavailable.</QuantumText> : !reviews.length ? <QuantumText>No reviews for this view. This does not mean the business meets the requirements.</QuantumText> : reviews.map(({ record, value }) => <View key={record.id} style={{ gap: 8, paddingVertical: 16 }}>
        <QuantumText variant="h3">{legalObligations.find((item) => item.id === value.obligationId)?.title} · {value.country}</QuantumText>
        <QuantumText>{value.state} · {value.reviewer} · next review {value.nextReview}{value.nextReview < new Date().toISOString().slice(0, 10) ? ' · REVIEW DUE' : ''}</QuantumText>
        <QuantumText>{value.evidence}</QuantumText><QuantumText variant="caption">Recorded {new Date(record.updatedAt).toLocaleString('en-GB')}. Evidence is not verified legal compliance.</QuantumText>
      </View>)}
      {records.length >= 500 ? <QuantumText variant="caption">500-record display limit reached; older evidence may not be shown.</QuantumText> : null}
    </QuantumCard>
  </View>
}
