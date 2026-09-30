/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { WorkspaceGate } from '../../../components/WorkspaceAccess'
import { ProCoach } from '../../../components/ProCoach'
import { MonthCalendar, dayKey } from '../../../components/MonthCalendar'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams } from 'expo-router'
import { QuantumBackButton } from '../../../components/QuantumBackButton'
import {
  CoreOpsApiError,
  WorkspaceRecordDTO,
  createWorkspaceRecord,
  fetchWorkspaceRecords,
  updateWorkspaceRecord,
  uploadWorkspaceRecordImage,
} from '../../../lib/core-operations-api'
import { findModule, findWorkspace, WorkspaceModuleDef } from '../../../lib/workspace-modules'
import { getGroupCopy } from '../../../lib/workspace-copy'
import { getModuleKpis } from '../../../lib/module-kpis'
import { useActionFeedback } from '../../../lib/use-action-feedback'
import { useQuantumStore } from '../../../lib/store'
import { logAction } from '../../../lib/action-logger'
import { isDemoData, subscribeDemoData } from '../../../lib/demo-data'
import { DemoDataBar } from '../../../components/DemoDataBar'
import { dtoToPro, loadDocumentProfile, proKindFor, proReportFor } from '../../../lib/pro-records'
import { ProRecordSheet } from '../../../components/pro/ProSheet'
import { OpsInsightsCard, OpsSheet } from '../../../components/pro/OpsSheet'
import { opsSchemaFor } from '@foundingos/ui/pro/ops'
import { linkedProductImage, productImageUrl } from '@foundingos/ui/product-images'
import { CampaignSummaryCard, FinanceReport, MarketingReport, SalesReport, SalesSummaryCard } from '../../../components/pro/ProReports'
import { readProfile, type DocumentProfile } from '@foundingos/ui/pro/models'
import {
  QuantumButton,
  QuantumCard,
  QuantumHeader,
  QuantumListItem,
  QuantumLoadingScreen,
  QuantumMetric,
  QuantumNotice,
  QuantumPill,
  QuantumScreen,
  QuantumText,
  QuantumTextInput,
  quantumColors,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../../components/QuantumUI'

function formatValue(pence: number | null): string {
  if (pence === null || pence === undefined) return ''
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

// Modules read/write through one generic backend record model, but they don't
// all *behave* the same — a sales pipeline is a board you move cards across,
// an inbox is a thread list, a report is read-only numbers, and Team/Settings
// are quiet config screens, not a funnel. This classifies each module once so
// the single screen below can render the right shape for it instead of
// forcing every module into the same list-with-status-pills template.
type ModuleKind = 'kanban' | 'inbox' | 'dashboard' | 'config' | 'records' | 'calendar'

// Scheduling modules render as a real month calendar. The value lists which modules'
// records appear on it (Marketing's Calendar shows content and campaigns).
const CALENDAR_SOURCES: Record<string, string[]> = {
  calendar: ['content', 'campaigns'],
  appointments: ['appointments'],
  interviews: ['interviews'],
  'time-off': ['time-off'],
  deliveries: ['deliveries'],
  dispatch: ['dispatch'],
  'follow-ups': ['follow-ups'],
  shifts: ['shifts'],
  rotas: ['rotas'],
  bookings: ['bookings'],
}
const DATE_FIELDS = ['dueDate', 'date', 'startsAt', 'scheduledAt', 'scheduledFor', 'publishAt']
function recordDate(record: WorkspaceRecordDTO): string | null {
  const data = (record.data || {}) as Record<string, unknown>
  for (const field of DATE_FIELDS) {
    const value = data[field]
    if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) return value
  }
  return null
}

const DASHBOARD_MODULE_IDS = new Set([
  'reports', 'forecasts', 'forecasting', 'attribution', 'scenarios', 'outcomes', 'strategic-overview', 'engagement', 'analytics',
])

function classifyModuleKind(module: WorkspaceModuleDef): ModuleKind {
  if (CALENDAR_SOURCES[module.id]) return 'calendar'
  if (module.group === 'Administration') return 'config'
  if (module.id.includes('inbox')) return 'inbox'
  if (DASHBOARD_MODULE_IDS.has(module.id)) return 'dashboard'
  if (module.statuses && module.statuses.length > 0) return 'kanban'
  return 'records'
}

// Modules where a product/stock photo is meaningful — Retail's Products and
// Inventory catalogues. Kept as an explicit allow-list (rather than every
// module) so, e.g., Finance or Talent records don't grow an unused photo
// button; add module ids here as more workspaces need photo capture.
const PHOTO_ENABLED_MODULES = new Set(['products', 'inventory', 'returns'])

function firstImageUrl(record: WorkspaceRecordDTO): string | null {
  const images = record.data?.images
  if (!Array.isArray(images) || images.length === 0) return null
  const latest = images[images.length - 1]
  return typeof latest === 'object' && latest && 'url' in latest ? String((latest as { url: unknown }).url) : null
}

// Every module in every workspace (retail, logistics, finance, marketing,
// talent, health, intelligence) renders through this single generic screen,
// backed by the same tenant-scoped WorkspaceRecord model the web app's
// production mode uses (GET/POST /platform/workspaces/:workspace/:module/records,
// PATCH /platform/records/:id) — no per-module backend or UI work required.
function WorkspaceModuleScreenInner() {
  const theme = useActiveQuantumTheme()
  const { width: screenWidth } = useWindowDimensions()
  const { workspace: workspaceSlug, module: moduleId } = useLocalSearchParams<{ workspace: string; module: string }>()
  const workspace = findWorkspace(String(workspaceSlug || ''))
  const module = findModule(String(workspaceSlug || ''), String(moduleId || ''))
  const statuses = module?.statuses

  const [records, setRecords] = useState<WorkspaceRecordDTO[]>([])
  const [productCatalogue, setProductCatalogue] = useState<WorkspaceRecordDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadError, setLoadError] = useState('')
  const isOnline = useQuantumStore((state) => state.isOnline)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')
  const [selectedDay, setSelectedDay] = useState(() => dayKey(new Date()))
  const [photoBusyId, setPhotoBusyId] = useState<string | null>(null)
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [productName, setProductName] = useState('')
  const [productCategory, setProductCategory] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productPhoto, setProductPhoto] = useState<{ uri: string; mimeType?: string } | null>(null)
  const [productSaving, setProductSaving] = useState(false)
  const photoEnabled = module ? PHOTO_ENABLED_MODULES.has(module.id) : false
  const { feedback, showError } = useActionFeedback()
  const inFlight = useRef<Set<string>>(new Set())
  const latestRequestKey = useRef<string>('')
  // Rendering 500+ record cards in one pass is what actually causes jank on
  // large datasets (this screen uses a plain ScrollView, not a windowed
  // list), so cap the initial paint and let the user reveal more on demand
  // rather than migrating every render branch to FlatList.
  const RENDER_PAGE_SIZE = 60
  const [renderLimit, setRenderLimit] = useState(RENDER_PAGE_SIZE)
  const proKind = workspace && module ? proKindFor(workspace.slug, module.id) : null
  const opsSchema = workspace && module && !proKind ? opsSchemaFor(workspace.slug, module.id) : null
  const reportKind = workspace && module ? proReportFor(workspace.slug, module.id) : null
  const [sheetRecordId, setSheetRecordId] = useState<string | null>(null)
  const [profile, setProfile] = useState<DocumentProfile>(() => readProfile(null))
  const [reportRefresh, setReportRefresh] = useState(0)
  useEffect(() => {
    if (workspace && (proKind === 'document' || proKind === 'deal')) void loadDocumentProfile(workspace.slug).then(setProfile)
  }, [workspace, proKind])
  const proRecords = useMemo(() => (proKind === 'deal' || proKind === 'campaign' ? records.filter((record) => !record.id.startsWith('temp-')).map(dtoToPro) : []), [proKind, records])
  const sheetRecord = sheetRecordId ? records.find((record) => record.id === sheetRecordId) ?? null : null

  const load = useCallback(
    async (isRefresh = false) => {
      if (!workspace || !module) return
      // Route params can change while a request from a previous module is
      // still in flight (expo-router reuses this screen instance across
      // navigations within the same route pattern). Guard against a stale
      // response landing after the user has already moved to another module.
      const requestKey = `${workspace.slug}:${module.id}`
      latestRequestKey.current = requestKey
      if (isRefresh) {
        setRefreshing(true)
      } else {
        // A fresh navigation into this module, not a pull-to-refresh — clear
        // the previous module's records so they don't briefly flash under
        // the new module's header while the request is in flight.
        setLoading(true)
        setRecords([])
        setProductCatalogue([])
      }
      setLoadError('')
      try {
        const sources = CALENDAR_SOURCES[module.id] ?? [module.id]
        const [data, products] = await Promise.all([
          Promise.all(sources.map((source) => fetchWorkspaceRecords(workspace.slug, source))).then((pages) => pages.flat()),
          workspace.slug === 'retail' && module.id !== 'products' ? fetchWorkspaceRecords('retail', 'products') : Promise.resolve([]),
        ])
        if (latestRequestKey.current !== requestKey) return
        setRecords(data)
        setProductCatalogue(module.id === 'products' ? data : products)
      } catch (err) {
        if (latestRequestKey.current !== requestKey) return
        setLoadError(err instanceof CoreOpsApiError ? err.message : 'Could not load this module. Pull to refresh to try again.')
      } finally {
        if (latestRequestKey.current === requestKey) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    },
    [workspace, module],
  )

  const [demo, setDemo] = useState(isDemoData)
  useEffect(() => subscribeDemoData((on) => { setDemo(on); setReportRefresh((count) => count + 1); void load() }), [load])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setRenderLimit(RENDER_PAGE_SIZE)
  }, [filter, workspaceSlug, moduleId])

  const visibleRecords = filter === 'All' ? records : records.filter((record) => record.status === filter)
  const pagedRecords = visibleRecords.slice(0, renderLimit)
  const hasMoreRecords = visibleRecords.length > pagedRecords.length

  function nextStatus(status: string): string | null {
    if (!statuses) return null
    const index = statuses.indexOf(status)
    if (index === -1 || index === statuses.length - 1) return null
    return statuses[index + 1]
  }

  async function advance(record: WorkspaceRecordDTO) {
    const next = nextStatus(record.status)
    if (!next || !module) return
    const key = `advance:${record.id}`
    if (inFlight.current.has(key)) return
    inFlight.current.add(key)
    setBusyId(record.id)
    // Optimistic: move the record to its next status immediately so the tap
    // feels instant, then reconcile with the server response. Roll back only
    // on a genuine failure — not a transient one, since the UI should stay
    // decisive rather than flicker back and forth.
    const previousRecords = records
    setRecords((current) => current.map((item) => (item.id === record.id ? { ...item, status: next } : item)))
    try {
      const updated = await updateWorkspaceRecord(record.id, { version: record.version, status: next })
      setRecords((current) => current.map((item) => (item.id === record.id ? updated : item)))
      logAction('record_status_change', 'success', { module: module.id, status: next })
    } catch (err) {
      setRecords(previousRecords)
      showError(err, () => advance(record))
    } finally {
      setBusyId(null)
      inFlight.current.delete(key)
    }
  }

  async function addRecord(input?: { name: string; category: string; valuePence: number | null }) {
    if (!workspace || !module) return
    // Optimistic: show the new record in the list immediately with a
    // temporary id, then swap in the server's real record once it responds.
    const tempId = `temp-${Date.now()}`
    const calendarTarget = CALENDAR_SOURCES[module.id]?.[0]
    const targetModule = calendarTarget ? findModule(workspace.slug, calendarTarget) : module
    const scheduled = calendarTarget ? (() => { const due = new Date(`${selectedDay}T09:00:00`); return { dueDate: due.toISOString() } })() : undefined
    const optimisticRecord: WorkspaceRecordDTO = {
      id: tempId,
      reference: `${targetModule?.id ?? module.id}-${Date.now()}`,
      name: input?.name ?? `New ${(targetModule ?? module).label.toLowerCase().replace(/s$/, '')}`,
      status: (targetModule ?? module).statuses?.[0] ?? 'New',
      ownerId: null,
      valuePence: input?.valuePence ?? null,
      data: { ...(scheduled ?? {}), ...(input?.category ? { category: input.category } : {}) },
      version: 0,
      updatedAt: new Date().toISOString(),
    }
    setRecords((current) => [optimisticRecord, ...current])
    try {
      const created = await createWorkspaceRecord(workspace.slug, targetModule?.id ?? module.id, {
        reference: optimisticRecord.reference,
        name: optimisticRecord.name,
        status: optimisticRecord.status,
        ...(optimisticRecord.valuePence === null ? {} : { valuePence: optimisticRecord.valuePence }),
        data: optimisticRecord.data ?? {},
      })
      setRecords((current) => current.map((item) => (item.id === tempId ? created : item)))
      logAction('record_created', 'success', { module: module.id })
      return created
    } catch (err) {
      setRecords((current) => current.filter((item) => item.id !== tempId))
      showError(err, () => addRecord(input))
      return undefined
    }
  }

  function beginAddRecord() {
    if (module?.id === 'products') {
      setProductFormOpen(true)
      return
    }
    void addRecord()
  }

  async function chooseNewProductPhoto(source: 'camera' | 'library') {
    const permission =
      source === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', `Allow ${source === 'camera' ? 'camera' : 'photo library'} access to add a product photo.`)
      return
    }
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 })
    if (!result.canceled && result.assets?.[0]) {
      setProductPhoto({ uri: result.assets[0].uri, mimeType: result.assets[0].mimeType })
    }
  }

  async function saveNewProduct() {
    const name = productName.trim()
    if (!name) {
      Alert.alert('Add a product name', 'Enter the name customers and your team will recognise.')
      return
    }
    const pounds = productPrice.trim() ? Number(productPrice.replace(/[^0-9.]/g, '')) : null
    if (pounds !== null && !Number.isFinite(pounds)) {
      Alert.alert('Check the price', 'Enter a number such as 12.50.')
      return
    }
    setProductSaving(true)
    try {
      const created = await addRecord({ name, category: productCategory.trim(), valuePence: pounds === null ? null : Math.round(pounds * 100) })
      if (!created) return
      let finalRecord = created
      if (productPhoto) {
        const uploaded = await uploadWorkspaceRecordImage(created.id, productPhoto.uri, productPhoto.mimeType || 'image/jpeg')
        finalRecord = uploaded.record
        setRecords((current) => current.map((item) => (item.id === created.id ? finalRecord : item)))
        setProductCatalogue((current) => [finalRecord, ...current.filter((item) => item.id !== finalRecord.id)])
      }
      setProductFormOpen(false)
      setProductName('')
      setProductCategory('')
      setProductPrice('')
      setProductPhoto(null)
      setSheetRecordId(finalRecord.id)
    } catch (err) {
      showError(err, saveNewProduct)
    } finally {
      setProductSaving(false)
    }
  }

  async function scheduleOn(record: WorkspaceRecordDTO, day: string) {
    setBusyId(record.id)
    try {
      const due = new Date(`${day}T09:00:00`)
      const updated = await updateWorkspaceRecord(record.id, { version: record.version, data: { ...(record.data || {}), dueDate: due.toISOString() } })
      setRecords((current) => current.map((item) => (item.id === record.id ? updated : item)))
    } catch (err) {
      showError(err, () => scheduleOn(record, day))
    } finally {
      setBusyId(null)
    }
  }

  async function addPhoto(record: WorkspaceRecordDTO, source: 'camera' | 'library') {
    const permission =
      source === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', `Allow ${source === 'camera' ? 'camera' : 'photo library'} access to add a photo.`)
      return
    }
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 })
    if (result.canceled || !result.assets?.[0]) return
    const asset = result.assets[0]
    const key = `photo:${record.id}`
    if (inFlight.current.has(key)) return
    inFlight.current.add(key)
    setPhotoBusyId(record.id)
    try {
      const { record: updated } = await uploadWorkspaceRecordImage(record.id, asset.uri, asset.mimeType || 'image/jpeg')
      setRecords((current) => current.map((item) => (item.id === record.id ? updated : item)))
      if (module?.id === 'products') setProductCatalogue((current) => current.map((item) => item.id === record.id ? updated : item))
    } catch (err) {
      showError(err, () => addPhoto(record, source))
    } finally {
      setPhotoBusyId(null)
      inFlight.current.delete(key)
    }
  }

  const filterOptions = useMemo(() => statuses ?? Array.from(new Set(records.map((record) => record.status))), [statuses, records])
  const kpis = useMemo(() => (workspace && module ? getModuleKpis(workspace.slug, module.id, records) : null), [workspace, module, records])
  const kind: ModuleKind = module ? classifyModuleKind(module) : 'records'
  const showAddButton = kind !== 'dashboard' && kind !== 'config'
  const showStatusPills = kind === 'records' || kind === 'inbox'

  if (!workspace || !module) return null
  if (loading) return <QuantumLoadingScreen />

  function renderRecordCard(record: WorkspaceRecordDTO) {
    const next = nextStatus(record.status)
    const busy = busyId === record.id
    const sharedPhoto = module!.id === 'products'
      ? productImageUrl({ id: record.reference, backendId: record.id, reference: record.reference, data: record.data })
      : workspace!.slug === 'retail'
        ? linkedProductImage({ id: record.reference, backendId: record.id, reference: record.reference, data: record.data }, productCatalogue.map((item) => ({ id: item.reference, backendId: item.id, reference: item.reference, data: item.data })))
        : null
    const photoUrl = sharedPhoto ?? firstImageUrl(record)
    const photoBusy = photoBusyId === record.id
    const openable = Boolean(proKind || opsSchema) && !record.id.startsWith('temp-')
    return (
      <Pressable key={record.id} disabled={!openable} onPress={() => setSheetRecordId(record.id)} style={({ pressed }) => ({ opacity: pressed && openable ? 0.8 : 1 })}>
      <QuantumCard accent={workspace!.accent} style={styles.recordCard}>
        <View style={styles.recordHeaderRow}>
          {photoEnabled ? (
            <Pressable
              onPress={() =>
                Alert.alert('Add photo', undefined, [
                  { text: 'Take photo', onPress: () => addPhoto(record, 'camera') },
                  { text: 'Choose from library', onPress: () => addPhoto(record, 'library') },
                  { text: 'Cancel', style: 'cancel' },
                ])
              }
              style={styles.thumbnail}
              disabled={photoBusy}
            >
              {photoBusy ? (
                <ActivityIndicator color={workspace!.accent} />
              ) : photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.thumbnailImage} />
              ) : (
                <QuantumText variant="caption" color={theme.subtextColor}>
                  + Photo
                </QuantumText>
              )}
            </Pressable>
          ) : photoUrl ? <Image source={{ uri: photoUrl }} style={styles.thumbnailImage} /> : null}
          <View style={styles.recordTitle}>
            <QuantumText variant="h3">{record.name}</QuantumText>
            <QuantumText variant="caption" color={theme.subtextColor}>
              {record.status} · {record.reference}
            </QuantumText>
          </View>
        </View>
        {record.valuePence !== null ? (
          <QuantumText variant="h3" color={workspace!.accent}>
            {formatValue(record.valuePence)}
          </QuantumText>
        ) : null}
        {openable ? (
          <QuantumText variant="caption" color={workspace!.accent}>
            {opsSchema ? `Open ${opsSchema.title.toLowerCase()} tools ›` : proKind === 'deal' ? 'Open deal · quote · won/lost ›' : proKind === 'campaign' ? 'Open results & ROI ›' : 'Open · lines, VAT, payments ›'}
          </QuantumText>
        ) : null}
        {next && kind !== 'kanban' ? (
          <QuantumButton onPress={() => advance(record)} disabled={busy}>
            Move to {next}
          </QuantumButton>
        ) : null}
      </QuantumCard>
      </Pressable>
    )
  }

  // Config (Team/Settings/Integrations/Security) and dashboard (Reports/
  // Forecasts) modules are quieter by design — plain rows, no status pills,
  // no funnel actions, since neither behaves like a pipeline of records to
  // move through stages.
  function renderQuietRow(record: WorkspaceRecordDTO) {
    return (
      <QuantumListItem
        key={record.id}
        title={record.name}
        subtitle={record.reference}
        accent={quantumColors.neutral300}
      />
    )
  }

  // Inboxes behave like a thread list: unread-style rows with a single
  // "handle" action to advance to the next stage, not a card grid.
  function renderInboxRow(record: WorkspaceRecordDTO) {
    const next = nextStatus(record.status)
    const isUnread = filterOptions[0] ? record.status === filterOptions[0] : false
    const busy = busyId === record.id
    return (
      <QuantumListItem
        key={record.id}
        title={record.name}
        subtitle={`${record.status} · ${record.reference}`}
        accent={isUnread ? workspace!.accent : quantumColors.neutral300}
        trailing={
          next ? (
            <QuantumButton tone="secondary" onPress={() => advance(record)} disabled={busy}>
              {next}
            </QuantumButton>
          ) : undefined
        }
      />
    )
  }

  function renderShowMore() {
    if (!hasMoreRecords) return null
    return (
      <QuantumButton
        key="show-more"
        tone="secondary"
        onPress={() => setRenderLimit((limit) => limit + RENDER_PAGE_SIZE)}
      >
        Show {Math.min(RENDER_PAGE_SIZE, visibleRecords.length - pagedRecords.length)} more (of {visibleRecords.length - pagedRecords.length} remaining)
      </QuantumButton>
    )
  }

  function renderCalendar() {
    const dated = records.filter((record) => recordDate(record))
    const undated = records.filter((record) => !recordDate(record))
    const items = dated.map((record) => ({ id: record.id, date: recordDate(record)!, title: record.name, tone: (/complete|published|done|approved|confirmed|delivered|paid/i.test(record.status) ? 'good' : /cancel|miss|late|overdue/i.test(record.status) ? 'warn' : 'info') as 'good' | 'warn' | 'info' }))
    const onDay = dated.filter((record) => dayKey(new Date(recordDate(record)!)) === selectedDay).sort((a, b) => recordDate(a)!.localeCompare(recordDate(b)!))
    const label = new Date(`${selectedDay}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    return (
      <View style={styles.list}>
        <QuantumCard accent={workspace!.accent}>
          <MonthCalendar accent={workspace!.accent} items={items} onSelectDay={setSelectedDay} selectedDay={selectedDay} />
        </QuantumCard>
        <View style={styles.headerRow}>
          <QuantumText variant="label">{label}</QuantumText>
          <QuantumButton tone="secondary" onPress={beginAddRecord}>+ Add on this day</QuantumButton>
        </View>
        {onDay.length ? onDay.map(renderRecordCard) : <QuantumText variant="caption" color={quantumColors.neutral300}>Nothing booked on this day.</QuantumText>}
        {undated.length ? (
          <>
            <QuantumText variant="overline" color={quantumColors.neutral300}>Not scheduled yet ({undated.length})</QuantumText>
            {undated.slice(0, renderLimit).map((record) => (
              <QuantumCard key={record.id}>
                <QuantumText variant="label">{record.name}</QuantumText>
                <QuantumText variant="caption" color={quantumColors.neutral300}>{record.status}</QuantumText>
                <QuantumButton disabled={busyId === record.id} tone="secondary" onPress={() => scheduleOn(record, selectedDay)}>Schedule for {new Date(`${selectedDay}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</QuantumButton>
              </QuantumCard>
            ))}
          </>
        ) : null}
      </View>
    )
  }

  function renderBody() {
    if (kind === 'calendar') return renderCalendar()
    if (reportKind === 'finance') return <FinanceReport accent={workspace!.accent} refreshKey={reportRefresh} />
    if (reportKind === 'sales') return <SalesReport accent={workspace!.accent} refreshKey={reportRefresh} workspace={workspace!.slug} />
    if (reportKind === 'marketing') return <MarketingReport accent={workspace!.accent} refreshKey={reportRefresh} />
    if (records.length === 0) {
      const copy = module ? getGroupCopy(module.group, [module]) : null
      const headline = kind === 'inbox' ? 'Nothing to review yet' : 'You\'re all caught up'
      return (
        <View style={styles.emptyState}>
          <QuantumText variant="h3" color={quantumColors.success}>{headline}</QuantumText>
          {copy ? <QuantumText variant="body">{copy.howItWorks}</QuantumText> : null}
          {copy ? (
            <View style={styles.emptyExampleBox}>
              <QuantumText variant="overline" color={quantumColors.neutral300}>For example</QuantumText>
              <QuantumText variant="caption" color={quantumColors.neutral300}>{copy.example}</QuantumText>
            </View>
          ) : null}
          {copy ? <QuantumText variant="caption" color={quantumColors.neutral500}>{copy.extensibility}</QuantumText> : null}
          {showAddButton ? (
            <QuantumButton onPress={beginAddRecord}>Add the first {module?.label.toLowerCase().replace(/s$/, '') ?? 'record'}</QuantumButton>
          ) : null}
          <QuantumText variant="caption" color={quantumColors.neutral500}>Nothing here is simulated — this fills in as real activity happens.</QuantumText>
        </View>
      )
    }

    if (kind === 'kanban' && statuses && statuses.length > 0) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kanbanScroll}>
          {statuses.map((status) => {
            const columnRecords = records.filter((record) => record.status === status)
            return (
              <View key={status} style={[styles.kanbanColumn, { width: Math.min(screenWidth - 2 * quantumSpace.lg, 320) }]}>
                <QuantumText variant="overline" color={workspace!.accent}>
                  {status} ({columnRecords.length})
                </QuantumText>
                {columnRecords.length === 0 ? (
                  <QuantumNotice>Nothing in this stage yet.</QuantumNotice>
                ) : (
                  <>
                    {columnRecords.slice(0, renderLimit).map((record) => renderRecordCard(record))}
                    {columnRecords.length > renderLimit ? (
                      <QuantumButton tone="secondary" onPress={() => setRenderLimit((limit) => limit + RENDER_PAGE_SIZE)}>
                        Show {Math.min(RENDER_PAGE_SIZE, columnRecords.length - renderLimit)} more
                      </QuantumButton>
                    ) : null}
                  </>
                )}
              </View>
            )
          })}
        </ScrollView>
      )
    }

    if (kind === 'inbox') return <View style={styles.list}>{pagedRecords.map(renderInboxRow)}{renderShowMore()}</View>
    if (kind === 'config' || kind === 'dashboard') return <View style={styles.list}>{pagedRecords.map(renderQuietRow)}{renderShowMore()}</View>
    return <View style={styles.list}>{pagedRecords.map(renderRecordCard)}{renderShowMore()}</View>
  }

  return (
    <QuantumScreen
      contentStyle={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setReportRefresh((value) => value + 1); void load(true) }} tintColor={workspace.accent} />}
    >
      <QuantumBackButton label={`‹ ${workspace.label}`} fallbackHref={`/workspace/${workspace.slug}`} />
      <QuantumHeader eyebrow={workspace.label} title={module.label} accent={workspace.accent} />
      {!isOnline ? <QuantumNotice tone="warning">Working offline — changes will sync later.</QuantumNotice> : null}
      {loadError ? <QuantumNotice tone="danger">{loadError}</QuantumNotice> : null}
      {feedback ? <QuantumNotice tone={feedback.tone} onRetry={feedback.onRetry}>{feedback.message}</QuantumNotice> : null}

      <ProCoach accent={workspace.accent} moduleId={module.id} moduleLabel={module.label} onShowStatus={setFilter} records={records} statuses={statuses ?? []} workspace={workspace.slug} />

      {kpis ? (
        <View style={styles.kpiRow}>
          {kpis.map((kpi) => (
            <QuantumCard key={kpi.label} accent={workspace.accent} style={styles.kpiCard}>
              <QuantumMetric label={kpi.label} value={kpi.value} tone={kpi.tone} />
            </QuantumCard>
          ))}
        </View>
      ) : null}

      <View style={styles.headerRow}>
        <QuantumText variant="caption" color={theme.subtextColor}>
          {records.length} record{records.length === 1 ? '' : 's'}
        </QuantumText>
        {showAddButton ? (
          <QuantumButton tone="secondary" onPress={beginAddRecord}>
            {module.id === 'products' ? '+ Add product' : '+ Add'}
          </QuantumButton>
        ) : null}
      </View>

      {showStatusPills && filterOptions.length > 0 ? (
        <View style={styles.pillRow}>
          <QuantumPill active={filter === 'All'} onPress={() => setFilter('All')}>
            All ({records.length})
          </QuantumPill>
          {filterOptions.map((status) => (
            <QuantumPill key={status} active={filter === status} accent={workspace.accent} onPress={() => setFilter(status)}>
              {status} ({records.filter((record) => record.status === status).length})
            </QuantumPill>
          ))}
        </View>
      ) : null}

      <DemoDataBar label={module?.label ?? 'this module'} />

      {proKind === 'deal' && proRecords.length ? <SalesSummaryCard accent={workspace.accent} records={proRecords} /> : null}
      {proKind === 'campaign' && proRecords.length ? <CampaignSummaryCard accent={workspace.accent} records={proRecords} /> : null}
      {opsSchema && records.length ? <OpsInsightsCard accent={workspace.accent} onOpen={setSheetRecordId} records={records} schema={opsSchema} statuses={statuses ?? []} /> : null}

      {renderBody()}
      {sheetRecord && opsSchema ? (
        <OpsSheet
          accent={workspace.accent}
          onClose={() => setSheetRecordId(null)}
          onSaved={(updated) => setRecords((current) => current.map((item) => (item.id === updated.id ? updated : item)))}
          record={sheetRecord}
          schema={opsSchema}
        />
      ) : null}
      {sheetRecord && proKind ? (
        <ProRecordSheet
          accent={workspace.accent}
          kind={proKind}
          module={module.id}
          onClose={() => setSheetRecordId(null)}
          onSaved={(updated) => setRecords((current) => current.map((item) => (item.id === updated.id ? updated : item)))}
          profile={profile}
          record={sheetRecord}
          statuses={statuses}
          workspace={workspace.slug}
        />
      ) : null}
      <Modal animationType="slide" onRequestClose={() => setProductFormOpen(false)} transparent visible={productFormOpen}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.productForm, { backgroundColor: theme.cardBg }]}>
            <QuantumText variant="overline" color={workspace.accent}>Retail catalogue</QuantumText>
            <QuantumText variant="h2">Add a product</QuantumText>
            <QuantumText variant="caption" color={theme.subtextColor}>Add the basics now. You can open the product afterwards to add stock, supplier and barcode details.</QuantumText>
            <QuantumTextInput autoFocus onChangeText={setProductName} placeholder="Product name" value={productName} />
            <QuantumTextInput onChangeText={setProductCategory} placeholder="Category, for example Drinks" value={productCategory} />
            <QuantumTextInput keyboardType="decimal-pad" onChangeText={setProductPrice} placeholder="Selling price, for example 12.50" value={productPrice} />
            {productPhoto ? <Image source={{ uri: productPhoto.uri }} style={styles.productPreview} /> : null}
            <View style={styles.photoActions}>
              <QuantumButton tone="secondary" onPress={() => void chooseNewProductPhoto('camera')}>Take photo</QuantumButton>
              <QuantumButton tone="secondary" onPress={() => void chooseNewProductPhoto('library')}>Choose photo</QuantumButton>
            </View>
            <View style={styles.modalActions}>
              <QuantumButton tone="secondary" onPress={() => setProductFormOpen(false)}>Cancel</QuantumButton>
              <QuantumButton disabled={productSaving} onPress={() => void saveNewProduct()}>{productSaving ? 'Saving…' : 'Save product'}</QuantumButton>
            </View>
          </View>
        </View>
      </Modal>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  screen: { gap: quantumSpace.lg },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  kpiCard: { flexGrow: 1, flexBasis: 120, minWidth: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  kanbanScroll: { gap: quantumSpace.md, paddingBottom: quantumSpace.sm },
  kanbanColumn: { gap: quantumSpace.sm },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnailImage: { width: '100%', height: '100%' },
  list: { gap: quantumSpace.md },
  emptyState: { gap: quantumSpace.sm },
  emptyExampleBox: { gap: 2, paddingVertical: quantumSpace.xs },
  recordCard: { gap: quantumSpace.sm },
  recordHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: quantumSpace.md },
  recordTitle: { flex: 1, minWidth: 0 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  productForm: { gap: quantumSpace.md, padding: quantumSpace.lg, paddingBottom: 36, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  productPreview: { width: '100%', height: 180, borderRadius: 16 },
  photoActions: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: quantumSpace.sm },
})

export default function WorkspaceModuleScreen() {
  const { workspace: workspaceSlug } = useLocalSearchParams<{ workspace: string; module: string }>()
  return (
    <WorkspaceGate slug={String(workspaceSlug || '')}>
      <WorkspaceModuleScreenInner />
    </WorkspaceGate>
  )
}
