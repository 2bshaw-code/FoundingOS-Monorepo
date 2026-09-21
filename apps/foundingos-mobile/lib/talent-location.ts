/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Mirrors the deterministic city-assignment logic from the web workspace's
// TalentLocationMapPanel (packages/ui/src/complete-workspace-application.tsx) so mobile shows
// the exact same "which city is this candidate in" answer as web, without a shared network
// call — candidates don't have a stored location field yet, so both platforms derive one
// deterministically from the candidate id using the same city list and hash.

const TALENT_CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Glasgow', 'Edinburgh', 'Liverpool']

function hashSpread(id: string, min: number, max: number): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  const range = max - min
  return range <= 0 ? min : min + (hash % range)
}

export function candidateCity(id: string): string {
  return TALENT_CITIES[hashSpread(id, 0, TALENT_CITIES.length)]
}

export function citiesInUse(ids: string[]): string[] {
  const seen = new Set<string>()
  for (const id of ids) seen.add(candidateCity(id))
  return TALENT_CITIES.filter((city) => seen.has(city))
}
