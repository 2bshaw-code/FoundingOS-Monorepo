/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getJSON, setJSON } from './local-store'
import { postBespokeAction } from './bespoke-actions'
import { STAGES, type Stage } from './talent-pipeline'

// FoundTalent's pipeline feed (lib/talent-pipeline.ts) is real, live, deterministic demo data,
// but it's read-only, so there's no real ATS write-backend to advance/reject a candidate
// against directly. "Move to next stage" / "reject" now write through to the real
// module_actions table (moduleId "talent-pipeline") via POST /api/console/bespoke-actions —
// real, durable, cross-device state — while the on-device override layer below still drives
// instant/offline UI and merges into what's rendered.
export type StageAction = {
  id: string
  candidateId: string
  fromStage: Stage
  toStage: Stage | 'rejected'
  timestamp: string
}

export type ScannedCandidate = {
  id: string
  name: string
  headline: string
  jobId: string
  jobTitle: string
  stage: Stage
  yearsExperience: number
  skills: string[]
  appliedDaysAgo: number
  matchScorePct: number
  scannedFromCv: true
  scannedAt: string
}

type OverrideState = {
  // Latest known stage per candidateId, only present once a local action has been taken.
  stageOverrides: Record<string, Stage | 'rejected'>
  actions: StageAction[]
  // Candidates created locally from the CV scanner — these don't exist in the demo backend
  // feed, so they're stored and merged in on-device, clearly labelled in the UI.
  scannedCandidates: ScannedCandidate[]
}

const STORE_KEY = 'fo_talent_pipeline_overrides'

async function loadState(): Promise<OverrideState> {
  return getJSON<OverrideState>(STORE_KEY, { stageOverrides: {}, actions: [], scannedCandidates: [] })
}

async function saveState(state: OverrideState): Promise<void> {
  await setJSON(STORE_KEY, state)
}

export async function getOverrides(): Promise<OverrideState> {
  return loadState()
}

const STAGE_ORDER = STAGES

export function nextStage(current: Stage): Stage | null {
  const idx = STAGE_ORDER.indexOf(current)
  if (idx === -1 || idx === STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[idx + 1]
}

export async function advanceCandidate(candidateId: string, currentStage: Stage): Promise<{ ok: true; newStage: Stage } | { ok: false; error: string }> {
  const upcoming = nextStage(currentStage)
  if (!upcoming) return { ok: false, error: `${candidateId} is already at the final stage.` }
  const state = await loadState()
  state.stageOverrides[candidateId] = upcoming
  state.actions.unshift({
    id: `${Date.now()}-${candidateId}-advance`,
    candidateId,
    fromStage: currentStage,
    toStage: upcoming,
    timestamp: new Date().toISOString(),
  })
  await saveState(state)
  await postBespokeAction({ moduleId: 'talent-pipeline', action: 'Advance candidate', note: `${candidateId}: ${currentStage} → ${upcoming}`, payload: { candidateId, fromStage: currentStage, toStage: upcoming } })
  return { ok: true, newStage: upcoming }
}

export async function rejectCandidate(candidateId: string, currentStage: Stage): Promise<{ ok: true } | { ok: false; error: string }> {
  const state = await loadState()
  state.stageOverrides[candidateId] = 'rejected'
  state.actions.unshift({
    id: `${Date.now()}-${candidateId}-reject`,
    candidateId,
    fromStage: currentStage,
    toStage: 'rejected',
    timestamp: new Date().toISOString(),
  })
  await saveState(state)
  await postBespokeAction({ moduleId: 'talent-pipeline', action: 'Reject candidate', note: `${candidateId}: ${currentStage} → rejected`, payload: { candidateId, fromStage: currentStage, toStage: 'rejected' } })
  return { ok: true }
}

export async function addScannedCandidate(candidate: Omit<ScannedCandidate, 'scannedFromCv' | 'scannedAt'>): Promise<ScannedCandidate> {
  const state = await loadState()
  const full: ScannedCandidate = { ...candidate, scannedFromCv: true, scannedAt: new Date().toISOString() }
  state.scannedCandidates.unshift(full)
  await saveState(state)
  return full
}

export async function resetOverrides(): Promise<void> {
  await saveState({ stageOverrides: {}, actions: [], scannedCandidates: [] })
}
