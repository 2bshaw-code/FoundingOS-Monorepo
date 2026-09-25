# Permission Matrix (Phase 26)

Client-side permission tiers and the role → tier → action matrix used across
the FoundingOS mobile app and web/console consumers of `@foundingos/auth`.

**Status: client-side UX gating only.** Every action below is re-checked by
the real backend on every request (`core-operations`, `core-workforce`,
`core-intelligence` each independently authorize using the tenant's real
session). A rejected server response always wins — the optimistic UI rolls
back and surfaces the error via the Phase 18 error layer (see
[docs/SYNC.md](./SYNC.md)). This matrix exists purely to avoid showing
controls a user cannot actually use, not to enforce security.

## Where it lives

| Location | Purpose |
| --- | --- |
| [`packages/auth/src/permissions.ts`](/Users/bobbyshaw/.copilot/session-state/edab7e50-9403-4321-893c-db4792ee263a/files/unified-release-push/packages/auth/src/permissions.ts) | Canonical definition, importable via `@foundingos/auth/permissions` (dependency-free subpath — does not pull in `next-auth`). Used by web/console consumers. |
| `apps/foundingos-mobile/lib/permissions.ts` | Byte-for-byte mirror, duplicated (not imported) because Expo/Metro shouldn't resolve a package whose main entry depends on `next-auth`/`@foundingos/db`. **Keep both files in sync when the matrix changes.** |

## Permission tiers

Ranked lowest to highest. Reuses the mobile app's existing `UserRole` names
plus one new tier (`viewer`) rather than inventing a new vocabulary:

| Tier | Rank |
| --- | --- |
| `viewer` | 0 |
| `operator` | 1 |
| `manager` | 2 |
| `admin` | 3 |
| `founder` | 4 |

## Raw role → tier mapping

The live tenant-role vocabulary (see `TeamRole` in
`apps/foundingos-mobile/lib/core-operations-api.ts`) maps as follows. Unknown
or missing roles default to `viewer` (least privilege):

| Raw backend role | Tier |
| --- | --- |
| `founder_master` | `founder` |
| `business_owner` | `admin` |
| `business_manager` | `manager` |
| `business_staff` | `operator` |
| `business_viewer` | `viewer` |

A handful of legacy per-brand roles (from before the FoundingOS restructure,
e.g. `retail_manager`, `recruiter`) are also mapped as a best-effort fallback
in case an old session is still valid somewhere. They are not the design
target — new code should only ever produce the `business_*`/`founder_master`
roles above.

## Action → minimum tier matrix

| Action | Minimum tier | Notes |
| --- | --- | --- |
| `view` | `viewer` | Baseline — anyone with a session can view. |
| `createRecord` | `operator` | |
| `editRecord` | `operator` | |
| `approveOrReject` | `manager` | Gates the Approvals queue (`workflows.tsx`). |
| `deleteRecord` | `manager` | No delete-record UI exists yet anywhere in the app (`app/workspace/[workspace]/[module].tsx` has no delete action) — this entry has no wired call site today; it is defined so a future delete feature has a matrix entry to gate against from day one. |
| `manageWorkspace` | `manager` | Matches the existing, independent gate already implemented in `app/(app)/team.tsx` (`MANAGE_ROLES = {business_owner, business_manager}`), which was deliberately left as-is rather than refactored onto this matrix, to guarantee zero behavior change. |

## Current call sites

- `apps/foundingos-mobile/app/index.tsx` — hydrates the real tier into the
  Zustand store (`setRole(normalizeRole(rawRole))`) on both session-restore
  and fresh sign-in. Before this phase, `role` always defaulted to `founder`
  and was never actually set from a real session — the gating below would
  have been decorative without this wiring.
- `apps/foundingos-mobile/app/(app)/(tabs)/workflows.tsx` — hides
  Approve/Reject/Execute/Undo controls (and shows an explanatory line
  instead) when `canPerformAction(role, 'approveOrReject')` is false. This
  was the first real UI target for the matrix; previously this screen had no
  gating at all.
- `apps/foundingos-mobile/app/(app)/team.tsx` — has its own pre-existing,
  independent gate (not migrated onto this matrix; see note above).

## Known gaps / follow-ups

- No delete-record feature exists yet to gate with `deleteRecord`.
- Web/console consumers do not yet call into `@foundingos/auth/permissions`
  from any UI — only the mobile app currently uses the matrix.
- Server-side enforcement is unaffected by any of the above; it remains the
  actual security boundary.
