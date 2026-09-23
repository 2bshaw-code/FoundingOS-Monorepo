/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Phase 26 — initial permission matrix (roles × actions).
//
// Mirror of packages/auth/src/permissions.ts, duplicated (not imported)
// because that package depends on next-auth/@foundingos/db, which are
// web/Node-only and shouldn't be pulled into the Expo/React Native bundle.
// Keep the two files in sync when the matrix changes.
//
// This is a CLIENT-SIDE UX helper only. It is NOT the source of truth for
// authorization — every backend route re-checks the real session
// role/tenant on every request, and a rejected request always rolls back
// any optimistic UI change (see docs/SYNC.md). Treat a `false` result here
// as "don't bother showing the button", never as "this request would be
// safe to skip authorizing".
import type { UserRole } from './store'

/** Reuses the app's existing `UserRole` type as the permission tier. */
export type PermissionTier = UserRole

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
 * `TeamRole`/login responses today (see lib/core-operations-api.ts's
 * `TeamRole` type). The remaining entries are legacy per-brand roles from
 * before the FoundingOS restructure — kept here only so a still-live
 * legacy session degrades to a sane tier instead of falling through to
 * the least-privileged default.
 */
const ROLE_TIER_MAP: Record<string, PermissionTier> = {
  founder_master: 'founder',
  business_owner: 'admin',
  business_manager: 'manager',
  business_staff: 'operator',
  business_viewer: 'viewer',
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
 * or missing roles resolve to `'viewer'` (least privilege).
 */
export function normalizeRole(rawRole: string | null | undefined): PermissionTier {
  if (!rawRole) return 'viewer'
  return ROLE_TIER_MAP[rawRole] ?? 'viewer'
}

/** High-impact actions gated by this matrix. */
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
  // app/(app)/team.tsx's MANAGE_ROLES for the concrete precedent this mirrors.
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
