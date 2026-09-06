/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
const failures = new Map<string, number>()

export function recordModelFailure(model: string) {
  const count = (failures.get(model) ?? 0) + 1
  failures.set(model, count)
  return count
}

export function isCircuitOpen(model: string) {
  return (failures.get(model) ?? 0) >= 3
}

export function resetCircuit(model: string) {
  failures.delete(model)
}
