/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Full-screen professional editors for the app: invoices/bills/quotes with
// lines, VAT and payments; deals with stages, quotes and convert-to-invoice;
// campaigns with results and ROI. Same data shape as the web workspaces.
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Alert, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, Share, StyleSheet, View } from 'react-native'
import {
  campaignChannels, campaignMetrics, campaignObjectives, campaignPatch, dealPatch, dealQuoteRecord, dealSources, dealStages, documentKindFor,
  documentLabel, documentPatch, documentText, documentTotals, emailDocumentLink, invoiceFromQuote, invoiceTargetFor, isOpenDeal, lineId, money,
  penceFrom, poundsInput, readCampaign, readDeal, readDocument, stageProbability, todayIso, utmUrl, vatRates,
  type BusinessDocument, type Campaign, type Deal, type DocumentKind, type DocumentLine, type DocumentProfile, type ProPatch, type VatRate,
} from '@foundingos/ui/pro/models'
import { QuantumButton, QuantumCard, QuantumNotice, QuantumPill, QuantumText, QuantumTextInput, quantumColors, quantumSpace, useActiveQuantumTheme } from '../QuantumUI'
import { createProRecord, dtoToPro, saveProPatch, type ProKind } from '../../lib/pro-records'
import type { WorkspaceRecordDTO } from '../../lib/core-operations-api'

function Field({ label, children, flex }: { label: string; children: ReactNode; flex?: boolean }) {
  return (
    <View style={[styles.field, flex ? { flex: 1 } : null]}>
      <QuantumText variant="overline" color={quantumColors.neutral300}>{label}</QuantumText>
      {children}
    </View>
  )
}

export function ProRow({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: string }) {
  return (
    <View style={styles.row}>
      <QuantumText variant={strong ? 'label' : 'caption'} style={{ flexShrink: 1 }}>{label}</QuantumText>
      <QuantumText variant={strong ? 'label' : 'caption'} color={tone}>{value}</QuantumText>
    </View>
  )
}

const MoneyInput = ({ pence, onChange, placeholder }: { pence: number; onChange: (pence: number) => void; placeholder?: string }) => (
  <QuantumTextInput key={`m-${pence}`} defaultValue={pence ? poundsInput(pence) : ''} keyboardType="decimal-pad" placeholder={placeholder ?? '0.00'} onEndEditing={(event) => onChange(penceFrom(event.nativeEvent.text))} />
)
const NumberInput = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
  <QuantumTextInput key={`n-${value}`} defaultValue={value ? String(value) : ''} keyboardType="number-pad" placeholder="0" onEndEditing={(event) => onChange(Math.max(0, Number(event.nativeEvent.text.replace(/[^0-9.]/g, '')) || 0))} />
)

const acceptedStatus = 'Accepted'
const isError = (message: string) => /could not|error|enter|add the/i.test(message)

function DocumentEditor({ record, kind, profile, statuses, accent, save, onConvert, embedded }: {
  record: WorkspaceRecordDTO
  kind: DocumentKind
  profile: DocumentProfile
  statuses?: string[]
  accent: string
  save: (patch: ProPatch) => Promise<void>
  onConvert?: (doc: BusinessDocument) => Promise<string>
  embedded?: { amountPence: number; company: string; email: string }
}) {
  const pro = useMemo(() => {
    const base = dtoToPro(record)
    return embedded ? { ...base, secondary: embedded.company, email: embedded.email, value: poundsInput(embedded.amountPence) } : base
  }, [record, embedded])
  const initial = useMemo(() => readDocument(pro, kind, profile), [pro, kind, profile])
  const [doc, setDoc] = useState<BusinessDocument>(initial)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [paymentPence, setPaymentPence] = useState(0)
  const [method, setMethod] = useState('Bank transfer')
  useEffect(() => { setDoc(initial); setDirty(false) }, [initial])
  const totals = documentTotals(doc)
  const edit = (patch: Partial<BusinessDocument>) => { setDoc((current) => ({ ...current, ...patch })); setDirty(true) }
  const editLine = (id: string, patch: Partial<DocumentLine>) => edit({ lines: doc.lines.map((line) => (line.id === id ? { ...line, ...patch } : line)) })
  const overdue = kind !== 'quote' && totals.balance > 0 && doc.dueDate < todayIso()

  const persist = async (next: BusinessDocument, status?: string, note = 'Saved') => {
    setBusy(true)
    setMessage('')
    try {
      await save({ ...documentPatch(kind, next, record.name), ...(status ? { status } : {}) })
      setDoc(next)
      setDirty(false)
      setMessage(note)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save')
    } finally {
      setBusy(false)
    }
  }
  const recordPayment = () => {
    const amountPence = paymentPence || totals.balance
    if (amountPence <= 0) return setMessage('Enter a payment amount')
    const next = { ...doc, payments: [...doc.payments, { id: lineId(), date: todayIso(), amountPence, method, reference: '' }] }
    const settled = documentTotals(next).balance <= 0
    setPaymentPence(0)
    void persist(next, settled && statuses?.includes('Paid') ? 'Paid' : undefined, settled ? 'Paid in full' : `Payment of ${money(amountPence)} recorded`)
  }
  const markSent = () => {
    const sentStatus = statuses?.find((status) => ['Sent', 'Approved', 'Issued'].includes(status))
    void persist({ ...doc, sentAt: new Date().toISOString() }, sentStatus, 'Marked as sent')
  }
  const cycleVat = (line: DocumentLine) => {
    const index = vatRates.findIndex((rate) => rate.value === line.vatRate)
    editLine(line.id, { vatRate: vatRates[(index + 1) % vatRates.length].value as VatRate })
  }
  const vatLabel = (rate: VatRate) => vatRates.find((item) => item.value === rate)?.label ?? `${rate}%`

  return (
    <View style={styles.section}>
      <View style={styles.badges}>
        <QuantumPill active accent={accent}>{`${documentLabel[kind]} · ${record.status}`}</QuantumPill>
        {overdue ? <QuantumPill active accent={quantumColors.danger}>Overdue</QuantumPill> : null}
        {doc.sentAt ? <QuantumPill>{`Sent ${doc.sentAt.slice(0, 10)}`}</QuantumPill> : null}
      </View>
      <View style={styles.pair}>
        <Field flex label="Number"><QuantumTextInput value={doc.number} onChangeText={(number) => edit({ number })} /></Field>
        <Field flex label="PO / reference"><QuantumTextInput value={doc.poReference} onChangeText={(poReference) => edit({ poReference })} /></Field>
      </View>
      <Field label={kind === 'bill' ? 'Supplier' : 'Customer'}><QuantumTextInput value={doc.party.name} onChangeText={(name) => edit({ party: { ...doc.party, name } })} /></Field>
      <Field label="Email"><QuantumTextInput value={doc.party.email} autoCapitalize="none" keyboardType="email-address" onChangeText={(email) => edit({ party: { ...doc.party, email } })} /></Field>
      <Field label="Address"><QuantumTextInput value={doc.party.address} multiline onChangeText={(address) => edit({ party: { ...doc.party, address } })} /></Field>
      <View style={styles.pair}>
        <Field flex label="Issued (YYYY-MM-DD)"><QuantumTextInput value={doc.issueDate} onChangeText={(issueDate) => edit({ issueDate })} /></Field>
        <Field flex label={kind === 'quote' ? 'Valid until' : 'Due'}><QuantumTextInput value={doc.dueDate} onChangeText={(dueDate) => edit({ dueDate })} /></Field>
      </View>

      <QuantumText variant="overline" color={accent}>Line items</QuantumText>
      {doc.lines.map((line) => (
        <QuantumCard key={line.id} style={styles.line}>
          <QuantumTextInput value={line.description} placeholder="Description" onChangeText={(description) => editLine(line.id, { description })} />
          <View style={styles.pair}>
            <Field flex label="Qty"><QuantumTextInput key={`q-${line.id}-${line.quantity}`} defaultValue={String(line.quantity)} keyboardType="decimal-pad" onEndEditing={(event) => editLine(line.id, { quantity: Number(event.nativeEvent.text) || 0 })} /></Field>
            <Field flex label="Unit £"><MoneyInput pence={line.unitPence} onChange={(unitPence) => editLine(line.id, { unitPence })} /></Field>
          </View>
          <View style={[styles.pair, { justifyContent: 'space-between' }]}>
            <QuantumPill onPress={() => cycleVat(line)} active accent={accent}>{`VAT ${vatLabel(line.vatRate)} ▾`}</QuantumPill>
            <QuantumText variant="label">{money(Math.round(line.quantity * line.unitPence))}</QuantumText>
            {doc.lines.length > 1 ? <QuantumButton tone="ghost" onPress={() => edit({ lines: doc.lines.filter((item) => item.id !== line.id) })}>Remove</QuantumButton> : null}
          </View>
        </QuantumCard>
      ))}
      <QuantumButton tone="secondary" onPress={() => edit({ lines: [...doc.lines, { id: lineId(), description: '', quantity: 1, unitPence: 0, vatRate: 20 }] })}>+ Add line</QuantumButton>
      <View style={styles.pair}>
        <Field flex label="Discount %"><NumberInput value={doc.discountPercent} onChange={(discountPercent) => edit({ discountPercent: Math.min(100, discountPercent) })} /></Field>
        <View style={{ flex: 1 }} />
      </View>
      <Field label="Notes"><QuantumTextInput value={doc.notes} multiline onChangeText={(notes) => edit({ notes })} /></Field>

      <QuantumCard accent={accent}>
        <ProRow label="Net" value={money(totals.net)} />
        {totals.discount ? <ProRow label={`Discount ${doc.discountPercent}%`} value={`−${money(totals.discount)}`} /> : null}
        <ProRow label="VAT" value={money(totals.vat)} />
        <ProRow strong label="Total" value={money(totals.total)} />
        {totals.paid ? <ProRow label="Paid" value={`−${money(totals.paid)}`} /> : null}
        {kind !== 'quote' ? <ProRow strong label="Balance due" value={money(totals.balance)} tone={totals.balance > 0 ? quantumColors.warning : quantumColors.success} /> : null}
      </QuantumCard>

      {kind !== 'quote' ? (
        <View style={styles.section}>
          <QuantumText variant="overline" color={accent}>Payments</QuantumText>
          {doc.payments.map((payment) => <ProRow key={payment.id} label={`${payment.date} · ${payment.method}`} value={money(payment.amountPence)} />)}
          {totals.balance > 0 ? (
            <>
              <Field label={`Amount (balance ${money(totals.balance)})`}><MoneyInput pence={paymentPence} placeholder={poundsInput(totals.balance)} onChange={setPaymentPence} /></Field>
              <View style={styles.badges}>
                {['Bank transfer', 'Card', 'Cash', 'Direct debit'].map((option) => <QuantumPill key={option} active={method === option} accent={accent} onPress={() => setMethod(option)}>{option}</QuantumPill>)}
              </View>
              <QuantumButton tone="secondary" disabled={busy} onPress={recordPayment}>Record payment</QuantumButton>
            </>
          ) : null}
        </View>
      ) : null}

      {message ? <QuantumNotice tone={isError(message) ? 'danger' : 'success'}>{message}</QuantumNotice> : null}
      <QuantumButton disabled={busy || !dirty} onPress={() => void persist(doc)}>{busy ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</QuantumButton>
      <View style={styles.actions}>
        <QuantumButton tone="secondary" disabled={busy} onPress={markSent}>Mark sent</QuantumButton>
        {doc.party.email ? <QuantumButton tone="secondary" onPress={() => void Linking.openURL(emailDocumentLink(doc, profile))}>Email</QuantumButton> : null}
        <QuantumButton tone="secondary" onPress={() => void Share.share({ message: documentText(doc, profile), title: `${documentLabel[kind]} ${doc.number}` })}>Share</QuantumButton>
        {kind === 'quote' && statuses?.includes(acceptedStatus) ? <QuantumButton tone="secondary" disabled={busy} onPress={() => void persist(doc, acceptedStatus, 'Quote accepted')}>Mark accepted</QuantumButton> : null}
        {onConvert ? (
          <QuantumButton disabled={busy} onPress={() => {
            setBusy(true)
            onConvert(doc).then(setMessage).catch((error) => setMessage(error instanceof Error ? error.message : 'Could not convert')).finally(() => setBusy(false))
          }}>Convert to invoice</QuantumButton>
        ) : null}
      </View>
    </View>
  )
}

function DealEditor({ record, profile, accent, save, createInvoice }: {
  record: WorkspaceRecordDTO
  profile: DocumentProfile
  accent: string
  save: (patch: ProPatch) => Promise<void>
  createInvoice: (doc: BusinessDocument) => Promise<string>
}) {
  const initial = useMemo(() => readDeal(dtoToPro(record)), [record])
  const [deal, setDeal] = useState<Deal>(initial)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [showQuote, setShowQuote] = useState(Boolean(record.data?.document))
  useEffect(() => { setDeal(initial); setDirty(false) }, [initial])
  const edit = (patch: Partial<Deal>) => { setDeal((current) => ({ ...current, ...patch })); setDirty(true) }
  const persist = async (next: Deal, status?: string, note = 'Deal saved') => {
    setBusy(true)
    setMessage('')
    try {
      await save({ ...dealPatch(next), ...(status ? { status } : {}) })
      setDeal(next)
      setDirty(false)
      setMessage(note)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save deal')
    } finally {
      setBusy(false)
    }
  }
  const markLost = () => {
    const finish = (reason: string) => void persist({ ...deal, probability: 0, lostReason: reason, closedAt: todayIso() }, 'Lost', 'Deal marked lost')
    if (Platform.OS === 'ios') Alert.prompt('Why was this deal lost?', undefined, (reason) => finish(reason ?? ''), 'plain-text', deal.lostReason)
    else finish(deal.lostReason)
  }
  const weighted = Math.round((deal.amountPence * deal.probability) / 100)
  const open = isOpenDeal(record.status)
  const quoteSource = useMemo(() => {
    const pro = dealQuoteRecord(dtoToPro(record), deal)
    return { amountPence: deal.amountPence, company: pro.secondary, email: pro.email ?? '' }
  }, [record, deal])

  return (
    <View style={styles.section}>
      <View style={styles.badges}>
        <QuantumPill active accent={accent}>{record.status}</QuantumPill>
        <QuantumPill>{money(deal.amountPence)}</QuantumPill>
        <QuantumPill>{`Weighted ${money(weighted)}`}</QuantumPill>
        {open && deal.nextStepDate && deal.nextStepDate < todayIso() ? <QuantumPill active accent={quantumColors.danger}>Next step overdue</QuantumPill> : null}
        {open && !deal.nextStep ? <QuantumPill active accent={quantumColors.warning}>No next step</QuantumPill> : null}
      </View>
      <QuantumText variant="overline" color={accent}>Stage</QuantumText>
      <View style={styles.badges}>
        {dealStages.filter((stage) => stage !== 'Won' && stage !== 'Lost').map((stage) => (
          <QuantumPill key={stage} active={record.status === stage} accent={accent} onPress={() => { if (!busy) void persist({ ...deal, probability: stageProbability[stage] }, stage, `Moved to ${stage}`) }}>{stage}</QuantumPill>
        ))}
      </View>
      <View style={styles.actions}>
        <QuantumButton disabled={busy || record.status === 'Won'} onPress={() => void persist({ ...deal, probability: 100, closedAt: todayIso() }, 'Won', 'Deal won')}>Mark won</QuantumButton>
        <QuantumButton tone="danger" disabled={busy || record.status === 'Lost'} onPress={markLost}>Mark lost</QuantumButton>
        {deal.email ? <QuantumButton tone="secondary" onPress={() => void Linking.openURL(`mailto:${encodeURIComponent(deal.email)}?subject=${encodeURIComponent(record.name)}`)}>Email</QuantumButton> : null}
        {deal.phone ? <QuantumButton tone="secondary" onPress={() => void Linking.openURL(`tel:${deal.phone.replace(/[^0-9+]/g, '')}`)}>Call</QuantumButton> : null}
      </View>
      <Field label="Company"><QuantumTextInput value={deal.company} onChangeText={(company) => edit({ company })} /></Field>
      <View style={styles.pair}>
        <Field flex label="Contact"><QuantumTextInput value={deal.contact} onChangeText={(contact) => edit({ contact })} /></Field>
        <Field flex label="Phone"><QuantumTextInput value={deal.phone} keyboardType="phone-pad" onChangeText={(phone) => edit({ phone })} /></Field>
      </View>
      <Field label="Email"><QuantumTextInput value={deal.email} autoCapitalize="none" keyboardType="email-address" onChangeText={(email) => edit({ email })} /></Field>
      <View style={styles.pair}>
        <Field flex label="Deal value £"><MoneyInput pence={deal.amountPence} onChange={(amountPence) => edit({ amountPence })} /></Field>
        <Field flex label="Probability %"><NumberInput value={deal.probability} onChange={(probability) => edit({ probability: Math.min(100, probability) })} /></Field>
      </View>
      <Field label="Expected close (YYYY-MM-DD)"><QuantumTextInput value={deal.expectedClose} onChangeText={(expectedClose) => edit({ expectedClose })} /></Field>
      <QuantumText variant="overline" color={quantumColors.neutral300}>Source</QuantumText>
      <View style={styles.badges}>
        {dealSources.map((source) => <QuantumPill key={source} active={deal.source === source} accent={accent} onPress={() => edit({ source })}>{source}</QuantumPill>)}
      </View>
      <Field label="Next step"><QuantumTextInput value={deal.nextStep} placeholder="e.g. Send revised proposal" onChangeText={(nextStep) => edit({ nextStep })} /></Field>
      <Field label="Next step date"><QuantumTextInput value={deal.nextStepDate} placeholder="YYYY-MM-DD" onChangeText={(nextStepDate) => edit({ nextStepDate })} /></Field>
      {record.status === 'Lost' ? <Field label="Lost reason"><QuantumTextInput value={deal.lostReason} onChangeText={(lostReason) => edit({ lostReason })} /></Field> : null}
      {message ? <QuantumNotice tone={isError(message) ? 'danger' : 'success'}>{message}</QuantumNotice> : null}
      <QuantumButton disabled={busy || !dirty} onPress={() => void persist(deal)}>{busy ? 'Saving…' : dirty ? 'Save deal' : 'Saved'}</QuantumButton>

      {showQuote ? (
        <DocumentEditor
          accent={accent}
          embedded={quoteSource}
          kind="quote"
          onConvert={createInvoice}
          profile={profile}
          record={record}
          save={(patch) => save({ ...patch, name: undefined, data: { ...patch.data, secondary: deal.company, deal: { ...deal, amountPence: patch.valuePence ?? deal.amountPence } } })}
          statuses={dealStages}
        />
      ) : <QuantumButton tone="secondary" onPress={() => setShowQuote(true)}>+ Build a quote for this deal</QuantumButton>}
    </View>
  )
}

function CampaignEditor({ record, accent, save }: { record: WorkspaceRecordDTO; accent: string; save: (patch: ProPatch) => Promise<void> }) {
  const initial = useMemo(() => readCampaign(dtoToPro(record)), [record])
  const [campaign, setCampaign] = useState<Campaign>(initial)
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
      await save(campaignPatch(campaign))
      setDirty(false)
      setMessage('Campaign saved')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save campaign')
    } finally {
      setBusy(false)
    }
  }
  const toggleChannel = (channel: string) => edit({ channels: campaign.channels.includes(channel) ? campaign.channels.filter((item) => item !== channel) : [...campaign.channels, channel] })
  const cells: Array<[string, string]> = [['ROAS', metrics.roas], ['ROI', metrics.roi], ['CTR', metrics.ctr], ['CPC', metrics.cpc], ['CPL', metrics.cpl], ['CPA', metrics.cpa], ['CPM', metrics.cpm], ['Conv.', metrics.conversionRate]]

  return (
    <View style={styles.section}>
      <View style={styles.metricGrid}>
        {cells.map(([label, value]) => (
          <View key={label} style={[styles.metricCell, { borderColor: `${accent}55` }]}>
            <QuantumText variant="label" color={accent}>{value}</QuantumText>
            <QuantumText variant="caption" color={quantumColors.neutral300}>{label}</QuantumText>
          </View>
        ))}
      </View>
      <ProRow label={`Budget used ${metrics.budgetUsed}`} value={`${money(campaign.spendPence)} of ${money(campaign.budgetPence)}`} tone={campaign.budgetPence && campaign.spendPence > campaign.budgetPence ? quantumColors.danger : undefined} />
      <QuantumText variant="overline" color={accent}>Objective</QuantumText>
      <View style={styles.badges}>{campaignObjectives.map((objective) => <QuantumPill key={objective} active={campaign.objective === objective} accent={accent} onPress={() => edit({ objective })}>{objective}</QuantumPill>)}</View>
      <QuantumText variant="overline" color={accent}>Channels</QuantumText>
      <View style={styles.badges}>{campaignChannels.map((channel) => <QuantumPill key={channel} active={campaign.channels.includes(channel)} accent={accent} onPress={() => toggleChannel(channel)}>{channel}</QuantumPill>)}</View>
      <View style={styles.pair}>
        <Field flex label="Start"><QuantumTextInput value={campaign.startDate} placeholder="YYYY-MM-DD" onChangeText={(startDate) => edit({ startDate })} /></Field>
        <Field flex label="End"><QuantumTextInput value={campaign.endDate} placeholder="YYYY-MM-DD" onChangeText={(endDate) => edit({ endDate })} /></Field>
      </View>
      <Field label="Audience"><QuantumTextInput value={campaign.audience} onChangeText={(audience) => edit({ audience })} /></Field>
      <QuantumText variant="overline" color={accent}>Results</QuantumText>
      <View style={styles.pair}>
        <Field flex label="Budget £"><MoneyInput pence={campaign.budgetPence} onChange={(budgetPence) => edit({ budgetPence })} /></Field>
        <Field flex label="Spend £"><MoneyInput pence={campaign.spendPence} onChange={(spendPence) => edit({ spendPence })} /></Field>
      </View>
      <View style={styles.pair}>
        <Field flex label="Impressions"><NumberInput value={campaign.impressions} onChange={(impressions) => edit({ impressions })} /></Field>
        <Field flex label="Clicks"><NumberInput value={campaign.clicks} onChange={(clicks) => edit({ clicks })} /></Field>
      </View>
      <View style={styles.pair}>
        <Field flex label="Leads"><NumberInput value={campaign.leads} onChange={(leads) => edit({ leads })} /></Field>
        <Field flex label="Conversions"><NumberInput value={campaign.conversions} onChange={(conversions) => edit({ conversions })} /></Field>
      </View>
      <Field label="Revenue £"><MoneyInput pence={campaign.revenuePence} onChange={(revenuePence) => edit({ revenuePence })} /></Field>
      <QuantumText variant="overline" color={accent}>Tracking link</QuantumText>
      <Field label="Landing page"><QuantumTextInput value={campaign.landingUrl} autoCapitalize="none" keyboardType="url" onChangeText={(landingUrl) => edit({ landingUrl })} /></Field>
      <View style={styles.pair}>
        <Field flex label="utm_source"><QuantumTextInput value={campaign.utmSource} autoCapitalize="none" onChangeText={(utmSource) => edit({ utmSource })} /></Field>
        <Field flex label="utm_medium"><QuantumTextInput value={campaign.utmMedium} autoCapitalize="none" onChangeText={(utmMedium) => edit({ utmMedium })} /></Field>
      </View>
      <Field label="utm_campaign"><QuantumTextInput value={campaign.utmCampaign} autoCapitalize="none" onChangeText={(utmCampaign) => edit({ utmCampaign })} /></Field>
      {link ? (
        <QuantumCard>
          <QuantumText variant="caption">{link}</QuantumText>
          <QuantumButton tone="secondary" onPress={() => void Share.share({ message: link })}>Share link</QuantumButton>
        </QuantumCard>
      ) : null}
      {message ? <QuantumNotice tone={isError(message) ? 'danger' : 'success'}>{message}</QuantumNotice> : null}
      <QuantumButton disabled={busy || !dirty} onPress={() => void persist()}>{busy ? 'Saving…' : dirty ? 'Save campaign' : 'Saved'}</QuantumButton>
    </View>
  )
}

const workspaceLabel = (slug: string) => (slug === 'logistics' ? 'Logistics billing' : 'Finance')

export function ProRecordSheet({ record, workspace, module, kind, profile, statuses, accent, onClose, onSaved }: {
  record: WorkspaceRecordDTO
  workspace: string
  module: string
  kind: ProKind
  profile: DocumentProfile
  statuses?: string[]
  accent: string
  onClose: () => void
  onSaved: (record: WorkspaceRecordDTO) => void
}) {
  const theme = useActiveQuantumTheme()
  const [current, setCurrent] = useState(record)
  useEffect(() => setCurrent(record), [record])
  const save = async (patch: ProPatch) => {
    const updated = await saveProPatch(current, patch)
    setCurrent(updated)
    onSaved(updated)
  }
  const createInvoice = async (quote: BusinessDocument) => {
    const [targetWorkspace, targetModule] = invoiceTargetFor(workspace)
    const input = invoiceFromQuote(quote, profile)
    try {
      await createProRecord(targetWorkspace, targetModule, input)
    } catch (error) {
      if (error instanceof Error && /403|not enabled|forbidden|access/i.test(error.message)) throw new Error(`Add the ${workspaceLabel(targetWorkspace)} workspace to raise invoices from quotes.`)
      throw error
    }
    return `Draft invoice ${input.reference} created in ${workspaceLabel(targetWorkspace)}`
  }
  const documentKind = documentKindFor(workspace, module)

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
        <View style={[styles.sheetHead, { borderBottomColor: theme.borderColor }]}>
          <View style={{ flex: 1 }}>
            <QuantumText variant="overline" color={accent}>{current.reference}</QuantumText>
            <QuantumText variant="h3" numberOfLines={1}>{current.name}</QuantumText>
          </View>
          <QuantumButton tone="ghost" onPress={onClose}>Done</QuantumButton>
        </View>
        <ScrollView contentContainerStyle={styles.sheetBody} keyboardShouldPersistTaps="handled">
          {kind === 'document' && documentKind ? (
            <DocumentEditor accent={accent} kind={documentKind} profile={profile} record={current} save={save} statuses={statuses} {...(documentKind === 'quote' ? { onConvert: createInvoice } : {})} />
          ) : null}
          {kind === 'deal' ? <DealEditor accent={accent} createInvoice={createInvoice} profile={profile} record={current} save={save} /> : null}
          {kind === 'campaign' ? <CampaignEditor accent={accent} record={current} save={save} /> : null}
          {kind !== 'campaign' && !profile.businessName ? (
            <QuantumNotice tone="warning">Add your business, VAT and bank details once in Finance → Invoices → Document settings on foundingos.com so they appear on every document.</QuantumNotice>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  section: { gap: quantumSpace.md },
  field: { gap: 4 },
  pair: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: quantumSpace.sm, paddingVertical: 3 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.xs },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  line: { gap: quantumSpace.sm },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  metricCell: { width: '23%', minWidth: 72, alignItems: 'center', paddingVertical: quantumSpace.sm, borderWidth: 1, borderRadius: 12 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.md, padding: quantumSpace.lg, paddingTop: quantumSpace.xl, borderBottomWidth: StyleSheet.hairlineWidth },
  sheetBody: { padding: quantumSpace.lg, gap: quantumSpace.lg, paddingBottom: 80 },
})
