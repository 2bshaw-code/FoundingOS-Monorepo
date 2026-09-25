/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Phase 26 — initial permission matrix (roles × actions).
//
// This is a CLIENT-SIDE UX helper only. It exists so screens can hide or
// disable actions a user almost certainly cannot perform, to avoid a
// confusing "tap it, watch it fail" experience. It is NOT the source of
// truth for authorization — every backend route re-checks the real
// session role/tenant on every request (see `shared/auth`'s
// `createModuleAccessMiddleware`/`requireTenantOwnerAccess`-style guards),
// and a rejected request always rolls back any optimistic UI change (see
// docs/SYNC.md). Treat a `false` result here as "don't bother showing the
// button", never as "this request would be safe to skip authorizing".
//
// Dependency-free by design (no `@foundingos/db`/`next-auth` imports) so
// this exact file can be mirrored into `apps/foundingos-mobile/lib/
// permissions.ts` without pulling web-only auth dependencies into the
// Expo/React Native bundle. Keep both copies in sync when the matrix
// changes.

/**
 * Canonical, suite-agnostic permission tier. This reuses the mobile app's
 * existing `UserRole` vocabulary (`founder`/`admin`/`manager`/`operator`)
 * plus an added `viewer` tier, rather than inventing a new naming scheme,
 * so the two stay drop-in compatible.
 */
export type PermissionTier = 'founder' | 'admin' | 'manager' | 'operator' | 'viewer'

const TIER_RANK: Record<PermissionTier, number> = {
  viewer: 0,
  operator: 1,
  manager: 2,
  admin: 3,
  founder: 4,
}

/**
 * Raw backend role strings this maps from. `founder_master` and the
 * `business_*` roles are the live tenant-role vocabulary used by
 * `TeamRole`/login responses today (see `shared/auth`'s `roles` export).
 * The remaining entries are legacy per-brand roles from before the
 * FoundingOS restructure — kept here only so a still-live legacy session
 * (e.g. an old FoundRetail/FoundTalent account) degrades to a sane tier
 * instead of falling through to the least-privileged default.
 */
const ROLE_TIER_MAP: Record<string, PermissionTier> = {
  founder_master: 'founder',
  business_owner: 'admin',
  business_manager: 'manager',
  business_staff: 'operator',
  business_viewer: 'viewer',
  // Legacy per-brand roles (pre-restructure) — best-effort mapping only.
  retail_manager: 'admin',
  retail_staff: 'operator',
  talent_manager: 'admin',
  recruiter: 'operator',
  applicant: 'viewer',
  workforce_intel: 'manager',
  it_intelligence: 'manager',
  it_dataops: 'operator',
}

/**
 * Normalizes any raw backend role string into a `PermissionTier`. Unknown
 * or missing roles resolve to `'viewer'` (least privilege), never to a
 * higher tier — a client-side bug in this mapping should hide actions
 * that would have been allowed, not show actions that will be rejected.
 */
export function normalizeRole(rawRole: string | null | undefined): PermissionTier {
  if (!rawRole) return 'viewer'
  return ROLE_TIER_MAP[rawRole] ?? 'viewer'
}

/**
 * High-impact actions gated by this matrix. Extend this list as more
 * screens adopt client-side gating — keep it to actions with a real
 * server-side authorization check behind them, not arbitrary UI state.
 */
export type PermissionAction =
  | 'view'
  | 'createRecord'
  | 'editRecord'
  | 'approveOrReject'
  | 'deleteRecord'
  | 'manageWorkspace'

/** Minimum tier required to perform each action. */
export const PERMISSION_MATRIX: Record<PermissionAction, PermissionTier> = {
  view: 'viewer',
  createRecord: 'operator',
  editRecord: 'operator',
  approveOrReject: 'manager',
  deleteRecord: 'manager',
  // 'manager' (not 'admin') to match the real backend guard on team-management
  // routes, which allows both business_owner and business_manager — see
  // apps/foundingos-mobile/app/(app)/team.tsx's MANAGE_ROLES for the concrete
  // precedent this mirrors.
  manageWorkspace: 'manager',
}

/** Pure tier comparison — the core check every helper below delegates to. */
export function canPerformAction(tier: PermissionTier, action: PermissionAction): boolean {
  return TIER_RANK[tier] >= TIER_RANK[PERMISSION_MATRIX[action]]
}

/** Convenience wrapper: normalize a raw backend role, then check an action. */
export function hasPermission(rawRole: string | null | undefined, action: PermissionAction): boolean {
  return canPerformAction(normalizeRole(rawRole), action)
}
