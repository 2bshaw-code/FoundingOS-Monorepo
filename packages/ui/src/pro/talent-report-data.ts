import type { LoadRecords, ProRecord } from './shared'

export const talentReportModules = ['jobs', 'candidates', 'outreach', 'submissions', 'activities', 'placements'] as const

export async function loadTalentReportSources(loadRecords: LoadRecords): Promise<Record<string, ProRecord[]>> {
  const results = await Promise.all(talentReportModules.map(async (module) => [module, await loadRecords('talent', module)] as const))
  return Object.fromEntries(results)
}
