# FoundingOS — Optimistic Sync & Reconciliation Rules

Internal reference for the optimistic-update pattern used across the mobile
app (`apps/foundingos-mobile`) and the web workspace shell
(`packages/ui/src/complete-workspace-application.tsx`). Read this before
adding a new mutating action anywhere in the product.

## The pattern

Every high-frequency mutating action (approve/reject/execute/reverse a
governed action, create or advance a record, propose/activate intelligence)
follows the same four steps:

1. **Apply the change locally first.** Update the in-memory/store state
   immediately so the UI reflects the action before the network call
   resolves. This is what makes approvals, record creation, and status
   changes feel instant.
2. **Call the real backend** (`core-operations`, `core-workforce`, or
   `core-intelligence`, depending on the action).
3. **Reconcile:**
   - **Success** — replace the optimistic state with whatever the server
     returned (source of truth wins).
   - **Rejection (4xx / `status < 500`)** — the server genuinely understood
     and refused the request (validation, permission, conflict). Roll back
     to the pre-optimistic state and surface a **retryable error** (`danger`
     tone banner with a "Retry" action) — retrying re-runs the exact same
     call, since a different input or permission state might succeed later.
   - **Network failure (5xx / no status / offline)** — the request never
     reached a decision. **Do not roll back.** Keep the optimistic state,
     queue the action (mobile: `enqueueOutboxAction`, web: relies on the
     browser's own retry / user-initiated retry), and show a **non-blocking
     warning** ("Working offline — changes will sync later"), not a retry
     button, since it's already queued.

This distinction (`rejected` vs `network`) is centralized in
`apps/foundingos-mobile/lib/errors.ts::normalizeError()` on mobile. The web
shell currently classifies inline by `status < 500` at each call site — see
"Open follow-ups" below if this needs its own shared helper.

## Deduplication (preventing double-submits)

Every mutating handler is guarded by an `inFlight` set (`useRef<Set<string>>`)
keyed by an action-specific string, e.g.:

- `${action.id}:${kind}` — Approvals decide/execute/reverse (mobile
  `workflows.tsx`, web `useAgentActions`)
- `advance:${record.id}`, `photo:${record.id}` — generic module record
  actions (mobile `[module].tsx`, web record-detail hook)
- `create`, `propose`, `activate` — one-shot flows with no natural per-item
  key

The guard is checked at the top of the handler and released in `finally`, so
a rapid double-tap before the button visually disables itself is a no-op
instead of firing the mutation twice.

## Offline queue (mobile)

`apps/foundingos-mobile/lib/outbox-sync.ts` is the durable queue for governed
actions (`GOVERNED_ACTION_*` from Core.Operations, `WORKFORCE_ACTION_*` from
Core.Workforce). It is backed by SQLite with an in-memory fallback (web/Expo
web). Real connectivity is now wired via
`apps/foundingos-mobile/lib/network-status.ts`, which:

- Subscribes to `@react-native-community/netinfo` and calls
  `useQuantumStore.setIsOnline()` on every connectivity change (previously
  nothing called this, so `isOnline` was permanently stuck at its default).
- Immediately triggers `processOutboxSync()` on the offline → online
  transition, flushing anything queued while disconnected.
- Runs from `app/_layout.tsx` for the lifetime of the app.

Workspace switching (`setActiveBrand`) is pure local Zustand state with no
network dependency, so it remains fully usable offline by construction.

## Multi-backend actions

Some governed actions touch more than one suite in sequence (e.g. a
replenishment action commits a Retail purchase order, a Logistics inbound
delivery, and a Finance cash commitment as one governed step). These are
still executed as a single call from the client's point of view — the
suite-level sequencing and any partial-failure compensation happens
server-side in `core-operations`. The client only needs to reconcile the
single call's outcome using the rules above; it does not need to reason
about partial multi-backend failure directly.

## Open follow-ups

- The web shell (`complete-workspace-application.tsx`) does not yet share a
  single `normalizeError`-style helper the way mobile does — each hook
  classifies `status < 500` inline. Worth extracting if more web mutation
  sites are added.
- No dedicated conflict-resolution exists yet for two clients editing the
  same record concurrently — last write (whoever's request lands last on
  the server) wins. Acceptable for the current single-operator-per-tenant
  usage pattern; revisit if multi-seat concurrent editing becomes common.
