# Core.Workforce backend

Real Express + Prisma backend for Core.Workforce. No hardcoded jobs, candidates, interviews, or workflow data is shipped here.

## Data model

- **AuthUser / AuthSession / PasswordReset / TenantInvitation** — shared auth tables reused via `@foundingos/service-auth`.
- **Job** — tenant-scoped requisitions with title, department, location, status (`open`, `closed`, `filled`), and description.
- **Candidate** — tenant-scoped applicants linked to a `Job`, with contact details, source, resume URL, notes, and pipeline stage (`Applied`, `Screening`, `Interview`, `Offer`, `Hired`, `Rejected`).
- **PipelineEvent** — immutable pipeline history for application intake, stage changes, interview scheduling/status changes, and reversals.
- **Interview** — tenant-scoped interview bookings tied to a candidate.
- **Event / WorkspaceAuditEvent** — governed-action and request audit trail.
- **WorkforceAction / WorkforceActionExecution** — governed workflow ledger for approval-based workforce actions.

## Governed workflow

Implemented workflow: **applicant shortlisting** (`candidate.shortlist`)

1. **Propose** a shortlisting action for a real candidate.
2. **Simulate** the pipeline impact before any write occurs.
3. **Approve or reject** the action.
4. **Execute** the action to move the candidate to `Screening` or `Interview` and optionally create a real `Interview` record.
5. **Assess outcome** from the actual write result.
6. **Reverse** the execution by restoring the previous stage and cancelling any interview created by the action.

## Endpoints

Base path: `/api/v1/workforce`

### Auth / health
- `GET /status`

### Jobs
- `GET /jobs`
- `POST /jobs`
- `GET /jobs/:id`
- `PATCH /jobs/:id`
- `DELETE /jobs/:id`

### Candidates
- `GET /candidates`
- `POST /candidates`
- `GET /candidates/:id`
- `PATCH /candidates/:id`
- `DELETE /candidates/:id`

### Interviews
- `GET /interviews`
- `POST /interviews`
- `GET /interviews/:id`
- `PATCH /interviews/:id`
- `DELETE /interviews/:id`

### Governed workforce actions
- `GET /platform/workforce-actions`
- `POST /platform/workforce-actions/shortlisting`
- `POST /platform/workforce-actions/proposals`
- `POST /platform/workforce-actions/:id/decision`
- `POST /platform/workforce-actions/:id/execute`
- `POST /platform/workforce-actions/:id/reverse`
- `GET /platform/workforce-actions/:id/trail`

## Local verification

Recommended local checks:

```bash
cd core-workforce/backend
npx prisma validate
npx prisma generate
npx tsc --noEmit
```

A live CRUD smoke test additionally requires a real Postgres database wired through `DATABASE_URL` and the shared auth secrets used by `@foundingos/service-auth`.
