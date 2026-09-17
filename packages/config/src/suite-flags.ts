export type BuyerSuite = 'ops' | 'work' | 'int'

const envBySuite: Record<BuyerSuite, string> = {
  ops: 'OPS_ENABLED',
  work: 'WORK_ENABLED',
  int: 'INT_ENABLED',
}

export function isSuiteEnabled(suite: BuyerSuite): boolean {
  const value = process.env[envBySuite[suite]]
  return value === undefined ? true : value !== 'false'
}

export function enabledBuyerSuites(): BuyerSuite[] {
  return (['ops', 'work', 'int'] as const).filter(isSuiteEnabled)
}

export const buyerSubsets = {
  messagingPlatforms: ['ops', 'int'],
  fintech: ['ops'],
  jio: ['ops', 'work', 'int'],
  rollUps: ['int'],
} as const
