# FoundingOS — System Status (as of this session)

A plain-English + technical snapshot of what is actually live and working
today, what is demo/simulated, and what is known-broken. This is a status
report, not a roadmap — see [restructure-summary.md](./restructure-summary.md)
for history and [customer-journey.md](./customer-journey.md) for the detailed
step-by-step trace this report is built on.

## 1. The short version

- **Your real product is FoundingOS** — Core.Operations, Core.Workforce, and
  Core.Intelligence. The other eight "brands" (Retail, Meat, FoundThat,
  Talent, Crypto, Finance, Health, Logistics) are legacy/demo scaffolding from
  before the restructure. FoundMeat, FoundCrypto, and FoundThat's scraping
  engine have been formally deprecated (dead code, disabled, or removed —
  see [deprecations.md](./deprecations.md)); the rest still exist as
  per-brand Vercel projects/apps in the repo but are not your product.
- **Sign-in now actually works.** Until this session, `foundingos-web`'s
  `/login` page was a fake demo form that redirected to a page that doesn't
  exist — a real dead end sitting right after the one genuinely working
  account-creation flow (accepting a team invite). It now authenticates
  against your real backend and lands on a real signed-in page.
- **FoundAI (the assistant) is real and wired up**, but only works once
  `AI_ENABLED=true` and a real `ANTHROPIC_API_KEY` are set as **Vercel
  Environment Variables on the Core.Operations backend project** and that
  project is redeployed. You were walked through adding these; confirm they
  are set on the **Production** environment (not just Preview) and that the
  backend has redeployed successfully since.
- **The Node.js 20 deprecation warning** on Vercel will keep appearing on
  every deploy until the `package.json`/`.nvmrc` fix in this session's
  changes is committed and pushed — a dashboard setting alone does not
  override a committed `engines.node` value.
- **Most console web modules (Sales Pipeline, Marketing, Health, Finance,
  etc.) are still illustrative/demo, not backed by your real tenant data**,
  with two exceptions: the mobile app's Sales Pipeline (CRM) and workspace
  module screens are real and backend-persisted, and FoundAI on mobile is
  real. The console web app (`apps/foundingos-console`) has not yet had the
  same "make it real" pass the mobile app has.
- **Nothing in this session has been committed or pushed yet** — all fixes
  below exist only in the working tree until you ask for them to be
  committed.

## 2. What's deployed where

| Surface | App | Status |
| --- | --- | --- |
| Marketing website | `apps/foundingos-web` (Vercel, `www.foundingos.com`) | Live. Real invite-acceptance + now-real login (§3). Mostly static marketing/pricing content otherwise. |
| Product console (web) | `apps/foundingos-console` | Deployed. Real session (shared with the website) plus two real, backend-persisted modules under `/workspace` (Sales Pipeline, Records) — most other console routes are still demo/illustrative per-brand pages. |
| Backend API | `core-operations/backend` (Vercel, `core-operations-api.foundingos.com`) | Live. Real Postgres (`wros` schema via Prisma), real auth, real WhatsApp/Stripe integration code, real FoundAI endpoint (needs only `ANTHROPIC_API_KEY`). |
| Mobile app | `apps/foundingos-mobile` | Built via EAS (`eas.json`), distributed through TestFlight. Real backend-persisted CRM/Sales Pipeline, workspace modules, and FoundAI; demo mode toggle exists for offline/investor demos. |
| Legacy per-brand web/console/mobile apps (Retail, Meat, FoundThat, Talent, Crypto, Finance, Health, Logistics) | `apps/*-web`, `apps/*-console(-starter)`, `apps/*-mobile` | Still present in the repo with their own `vercel.json`s; not part of the FoundingOS product story. Treat as legacy scaffolding, not something to promote to customers. |

## 3. Fixed this session

- **Real WhatsApp delivery/read receipts.** `CustomerMessage` now has a
  real `status` column (`sent`/`delivered`/`read`/`failed`/`received`)
  and a `providerMessageId` to match WhatsApp's own `statuses[]` webhook
  back to the exact row that was sent. The Pipeline conversation panel
  shows the real status ("Sent ✓" → "Delivered ✓✓" → "Read ✓✓"), never a
  simulated progression — if no status webhook has landed yet, it just
  stays at "Sent ✓".
- **Real inbound media storage.** Photos, voice notes, documents, and
  videos a customer sends are now downloaded from WhatsApp's Graph API
  and stored via Vercel Blob (the same storage already used for workspace
  record image uploads), with the resulting URL and media type saved on
  `CustomerMessage`. The conversation panel renders real inline images or
  an "Open attachment" link — download/storage failures fall back to the
  existing honest text placeholder rather than breaking message ingestion.
- **Per-agent/team activity tracking.** Outbound `CustomerMessage` rows
  now record `senderUserId` (the FoundingOS user who sent the quick
  reply), and a new `GET /owner/team-performance` endpoint returns real
  message counts per agent. The post-login workspace page shows a "Team
  activity" card with this — no fabricated numbers, and unattributed
  sends (from before this field existed) are grouped honestly rather than
  guessed at.
- **Bulk assign, tag, and delete in the Pipeline.** The existing
  multi-select bulk action bar (previously only "Mark selected as lost")
  now also supports "Assign to me" (resolved server-side from the
  authenticated session, so the console never needs to know its own user
  ID), tagging (merges into each lead's existing tags), and permanent
  delete (confirmed before sending). `Lead` and `Customer` both gained
  `tags` and `assignedUserId` columns for this.
- **Records module now has real search and status filtering** (it
  previously had none at all) — search by reference/name/message
  preview, plus status-count pills, mirroring the same client-side
  pattern Pipeline's search already uses. This was the single biggest
  remaining friction gap in Records.
- **Pipeline's "Awaiting reply" badge now shows how long they've been
  waiting** (e.g. "Awaiting reply · 3h"), not just a flat yes/no — the
  server component now passes a `customerId → lastMessageAt` map instead
  of a bare id list, computed from the same messages already returned by
  `/ops/owner/pipeline`.
- **Bulk "Mark selected as lost"** — leads can now be multi-selected with
  a checkbox and cleared out together in one action, instead of one at a
  time. Reuses the existing per-lead `PATCH /api/pipeline/:id` (no new
  bulk endpoint); also hardened `changeStage` to revert only the one
  lead that failed rather than the whole list, so concurrent bulk
  updates can't clobber each other's successful changes.
- **FoundAI's team-level context is now richer.** General/non-customer-
  scoped questions ("who needs a reply?", "how's our response time?",
  "are we busier than usual?") are now grounded in real `avgResponseMinutes`
  and 24h/prior-24h message volume, in addition to the awaiting-reply
  list added last session — all from the same lightweight query, no
  schema change.
- **Pipeline now has a real search box** (company/contact name), alongside
  the existing stage filter — client-side only, since the lead list is
  already fully loaded, so results filter instantly with no extra
  request. Addresses the previous gap where finding one lead among many
  meant scanning or using stage pills alone.
- **FoundAI can now answer team-level "who needs a reply" questions**,
  not just questions scoped to one open conversation. When no specific
  customer is selected, FoundAI is given a small, real
  `pipelineAwaitingReply` list (customer names + how long they've been
  waiting, tenant-wide) so it can proactively surface this without the
  user having to open every lead's conversation panel first. No schema
  change — reuses the same awaiting-reply logic as `pipelineSummary`,
  scoped to just the names needed.
- **Workspace now shows a message-volume trend** ("Messages (24h)" with
  "busier/quieter/same as yesterday"), computed from the same recent
  message window `pipelineSummary` already fetches. Deliberately phrased
  as a trend, not a precise percentage, since the underlying sample is
  capped at 100 most-recent messages tenant-wide.
- **Post-login workspace now shows real response-time visibility.**
  "Awaiting reply" (customers whose most recent message is unanswered)
  and "Avg. response time" (minutes between an inbound message and the
  next outbound reply) are now shown as metric cards on the workspace
  landing page, plus a "Needs a reply" nudge card linking straight into
  Sales Pipeline when anything is outstanding. Computed in
  `pipelineSummary` (`pipeline.ts`) from the same 100 most-recent
  `CustomerMessage` rows it already fetched — no new query, no schema
  change. `avgResponseMinutes` is `null` (shown as "—"), never `0`, when
  there isn't enough recent data to compute a real average.
- **Pipeline lead cards now show an "Awaiting reply" badge** for any lead
  whose linked customer's most recent message is inbound and hasn't been
  replied to — computed server-side in `pipeline/page.tsx` from the same
  `messages` list `/ops/owner/pipeline` already returns (again, no new
  endpoint or query). Previously the only way to see who needed a reply
  was to open every lead's conversation panel one at a time.
- **FoundAI can now proactively flag an unanswered message.** When asked
  about a lead/customer whose most recent WhatsApp message is inbound and
  unanswered, FoundAI is told this fact in its system prompt and may
  mention it and suggest a concrete reply — but it's still never allowed
  to claim it sent one. Reuses the same conversation data already fetched
  for grounding; no schema or endpoint change.
- **Real inbound WhatsApp replies now actually reach the Pipeline
  conversation panel.** This was the most important fix this session: the
  "live" conversation panel added previously polled `CustomerMessage`, but
  nothing ever wrote a real customer's inbound WhatsApp reply into that
  table — only the console's own outbound quick-replies were recorded
  there. A genuine reply from a converted lead's customer never appeared
  in the Pipeline, live-polling or not. The WhatsApp webhook handler
  (`processInboundMessage` in `messaging-core.ts`) now also matches the
  sender's phone number against a `Customer` record for that tenant and,
  when found, records the message into `CustomerMessage` too — so a real
  reply now shows up in the panel (within one poll interval) exactly as
  it would from a genuine live conversation. No schema change: this uses
  the same `CustomerMessage` fields already in place.
- **Non-text WhatsApp messages (photos, voice notes, documents, locations)
  no longer vanish.** They previously had no text body and were silently
  dropped from the "for future use" inbound path above. They're now
  recorded with an honest placeholder describing what arrived (e.g.
  "📷 Photo: <caption>" or "🎤 Voice note (not yet playable in
  FoundingOS)") — we do not yet store the actual media file, so the
  placeholder is explicit about that rather than pretending to show it.
  Storing real media requires a schema change (a media URL/type column),
  out of scope this pass.
- **Conversation thread now groups messages by day** ("Today",
  "Yesterday", or a date), the same convention WhatsApp itself uses, so a
  long-running thread stays scannable instead of one unbroken column of
  bubbles.
- **Background polling now pauses when the tab isn't visible** and
  refreshes immediately when it becomes visible again — avoids every open
  console tab quietly polling Core.Operations in the background all day,
  which matters once there are many reps with panels left open.
- **Stage dropdown no longer shows blank for converted leads.** Once a lead
  is converted, its `stage` becomes `'converted'` — a value that isn't in
  the pipeline's working-stage list (new/qualified/proposal/won/lost), so
  the dropdown used to render with no matching option selected. It's now
  replaced with a plain "Stage: Converted to customer ✓" line for those
  leads, and "Mark lost" no longer shows for them either. No new stage was
  added anywhere else in the app.
- **Records module shows real message context, not just status.** Any
  record with a message body (`data.body` — the same field the
  mobile app's inbox modules already use, e.g. Omnichannel/Clinical/
  Campaign inbox) now shows a truncated preview, a real "Last contact"
  timestamp (`updatedAt`), and an "Open conversation" button that expands
  it to the full message (and sender/recipient direction, when present).
  No backend or schema change — `WorkspaceRecord.data` and `updatedAt`
  were already returned by the existing endpoint, the console just wasn't
  rendering them.
- **Conversation panel handles failed sends better.** A failed quick reply
  now renders with a distinct dashed/red-tinted bubble style (rather than
  looking identical to a normal message) and a one-tap "Retry" button that
  resends the same text. Long threads were already capped and scrollable
  (backend returns the most recent 100 messages; the panel now says so
  once a thread hits that limit) — nothing else needed to change there.
- **FoundAI answers now show "Based on N messages" and separate quotes
  from its own suggestions.** The `/ai/ask` response has two new honest
  fields: `conversationMessageCount` (exactly how many of the customer's
  real messages were supplied) and `quotedMessages` (verbatim lines the
  model is quoting from that conversation, always empty when no
  conversation was supplied — a hallucinated quote with no real thread
  behind it is filtered out server-side, not just hidden in the UI). The
  console shows the count next to "Answered from this WhatsApp
  conversation", renders any quotes as their own chat-style bubbles under
  a "What [customer] actually said" heading, and labels the existing
  suggestions list "FoundAI suggests:" so it reads as FoundAI's own
  wording, not something the customer said.
- **Conversation panel is now live.** While a conversation panel is open, it
  polls `GET /customers/:id` every 6 seconds in the background and quietly
  updates the thread — a new inbound WhatsApp message shows up without a
  manual page refresh. Polling stops the moment the panel is closed.
- **Honest delivery status, not fake ticks.** Quick replies now show
  "Sending…" while the WhatsApp Cloud API call is in flight, then either
  become part of the real thread (labelled "Sent ✓") or show "Failed to
  send" inline if the call errors. We do **not** show Delivered/Read
  receipts — `CustomerMessage` has no field to track them and no WhatsApp
  status webhook is wired to it yet, so faking those ticks was ruled out;
  a caption in the panel says this plainly instead.
- **FoundAI conversation widget is now per-lead and pre-filled.** Previously
  the question box was a single shared field across every lead card (a
  bug) and gave no signal about whether the answer actually used the
  conversation. Now each lead has its own question (pre-filled with
  "What does this customer need from us next?" on first open), and every
  answer is labelled either "Answered from this WhatsApp conversation" or
  "Answered from workspace records" (new `usedConversation` field on the
  `/ai/ask` response) so it's clear what grounded the reply.
- **Lead conversion is now a one-tap action in the Pipeline.** Leads
  without a linked customer show a real "Convert to customer" button
  (proxying Core.Operations' existing `POST /leads/:id/convert`) — on
  success the lead's conversation panel opens immediately with the new
  customer's real WhatsApp history, instead of requiring a trip to another
  screen to convert first.
- **Session sharing.** Signing into the website now really does sign you into the console — no second login. It works both ways: signing in on the site and clicking "Open console" goes straight in, and going to the console's own login first bounces through the same real login and comes straight back in, without ever re-asking for a password if you're already signed in.
- **Console Sales Pipeline is now real.** `apps/foundingos-console/app/workspace/pipeline`
  reads and writes the same tenant-scoped Lead model the mobile app's Sales
  Pipeline already used for real — add a lead or move its stage in the
  console and it's actually saved, not demo data. Leads that have been
  converted to a customer also show a real "View conversation" panel with
  that customer's actual WhatsApp/messaging history (`CustomerMessage`
  rows) — this is a messaging-first OS, so a deal in the pipeline is meant
  to be traceable back to the conversation it came from.
- **Conversation panel is now a real chat thread, with a working quick
  reply.** Messages render as inbound/outbound bubbles with sender and
  timestamp instead of a flat log. A "Reply on WhatsApp" box sends a real
  message via the same Cloud API path `/whatsapp/messages` already used,
  then records it as an outbound `CustomerMessage` (new
  `POST /customers/:id/messages`) so it appears in the thread immediately —
  no more waiting for a webhook round-trip to see your own reply.
- **Pipeline now has parity with the mobile app's KPIs and stage
  filtering.** Added an Open pipeline / Won this cycle / Win rate metric
  row and stage-filter pills, matching the mobile Sales Pipeline screen, plus
  a one-tap "Mark lost" action. Both surfaces now group and summarise deals
  the same way.
- **FoundAI can now ground answers in a customer's real conversation.** A
  new "Ask FoundAI about this conversation" box in the Pipeline's
  conversation panel passes the open lead's `customerId` through to
  `askFoundAi`, which now also loads that customer's real `CustomerMessage`
  history and instructs the model to use it — so "what is this customer
  waiting on?" can be answered from what they actually said on WhatsApp,
  not just the deal's stage/value fields.
- **Post-login landing page now shows real pipeline data.** `/workspace`
  used to be a static welcome card with two links; it now shows real Open
  pipeline / Customers / Messages metrics and the 5 most recent leads
  (with stage, value, and whether each has a WhatsApp conversation) pulled
  from the same `GET /owner/pipeline` call the Pipeline page already makes.
- **Console Records module is now real.** `apps/foundingos-console/app/workspace/records`
  is a new generic module (pick a workspace + module, e.g. Retail/inventory
  or Finance/invoices) backed by the same real, generic workspace-record
  backend every mobile module screen already uses — proves the pattern for
  bringing every other console module onto real data with no new backend
  work per module.
- **FoundAI setup simplified.** Turning FoundAI on used to require setting
  two separate variables (`AI_ENABLED=true` *and* `ANTHROPIC_API_KEY`) — it
  was easy to set the key and forget the flag, which silently kept AI off.
  Now only `ANTHROPIC_API_KEY` is required; `AI_ENABLED` is just an
  optional kill switch. A new `GET /api/v1/ops/ai/status` endpoint also
  lets clients show a plain "not set up yet" notice instead of a failed
  request — mobile's Search screen now uses it.
- **Billing checkout dead end** — the checkout API's default success/cancel
  URLs pointed at a `/onboarding` page that doesn't exist. Fixed to point at
  the new real `/workspace` page. (Nothing currently calls this endpoint
  from the UI, so this was a latent bug, not a reachable one yet.)
- **FoundAI JSON parsing** — the backend's AI integration now tolerates
  markdown-code-fence-wrapped model responses instead of failing to parse.
- **FoundAI mobile floating button** — the round "Ask FoundAI" button had a
  rectangular focus outline that didn't fit its shape after being tapped;
  now uses a matching circular ring.
- **FoundAI panel sizing on web** — the chat panel had hardcoded pixel
  insets that made it look like a small floating box partway down the page
  instead of filling the available height; now auto-fits to the page.
- **Workspace module "create new record" forms** — every workspace module
  (Health, Finance, Talent, Logistics, Retail, Intelligence) previously
  auto-created a placeholder record with no way to control what was added.
  Replaced with real, module-aware forms (name, reference, value, notes,
  status) plus an "Edit details" action on existing records.
- **Sales Pipeline (CRM) card interactions on mobile** — cards can now be
  tapped to expand inline details (stage, dates), and swiped to advance to
  the next pipeline stage (Lead → Qualified → Proposal → Won), matching a
  Pipedrive/Monday.com-style interaction.
- **Node.js version pin** — root `package.json`'s `engines.node` updated
  from `>=20 <21` to `>=24 <25`, plus a new `.nvmrc`. This is what actually
  fixes the recurring "Node.js version 20.x is deprecated" Vercel warning —
  the dashboard "Node.js Version" setting alone is overridden by a committed
  `engines.node` value, which is why changing it in the dashboard didn't
  help until this file changes too.

**None of the above is live yet** — it is all uncommitted in this session's
working tree, pending your go-ahead to commit and push.

## 4. Known issues still open (from the customer-journey audit)

- **No typing indicators — and this cannot be honestly built.** WhatsApp's
  Cloud API does not expose a "customer is typing" webhook to businesses
  at all (it only lets a business send a typing indicator *to* the
  customer, not receive one). Building this would mean fabricating the
  signal, which we won't do. Not planned unless Meta adds this capability.
- **Replies sent from the WhatsApp Business app directly (not through the
  console) aren't captured.** Only messages sent via the console's
  quick-reply (outbound) or received via our webhook (inbound) are
  recorded — an agent replying from their own phone's WhatsApp app bypasses
  FoundingOS entirely and that reply won't appear in the Pipeline panel.
  Not fixable without a different WhatsApp integration approach (e.g. the
  WhatsApp Business API's own multi-device support), not attempted here.
- **Converted leads keep `stage: 'converted'`** — this no longer shows as a
  blank dropdown (fixed this session, see §3), but a converted lead still
  has no way to move back into a working stage from the console if that's
  ever needed; not asked for, not built.
- **Console web app** (`apps/foundingos-console`): a "All workflows" link on
  the founder console points at `/dashboard`, which only redirects back to
  `/founder` (an admin-only page) — a dead end for a normal user. Most
  console modules (pipeline, marketing, health, finance, etc.) are seeded
  demo/client-state data, not real tenant records — this is the root of the
  "every page just says add and doesn't let me control what's added"
  complaint on the console web app specifically (the mobile app's version of
  this was already fixed, see §3).
- **Deprecated brand routes still reachable in the console**: `/foundthat`,
  `/meat`, `/crypto` still exist as live routes in
  `apps/foundingos-console`, even though those brands are meant to be
  retired.
- **Stripe webhook** still writes subscription state to a legacy
  `BrandSubscription` model rather than a current tenant-scoped model — this
  is documented and intentionally deferred (see
  [deprecations.md](./deprecations.md)), not a regression, but it means
  billing status isn't fully wired into the current data model yet.
- **Preview/demo data that looks real but isn't persisted anywhere
  customer-visible**: marketing site preview-access signups, marketing site
  feedback surveys, and most console web modules all write to
  demo/preview-only tables, not your real Core.Operations tenant data.
- **AI now only needs one variable**: `ANTHROPIC_API_KEY` alone turns
  FoundAI on. `AI_ENABLED` is only checked as an explicit kill switch (set
  it to `false` to force FoundAI off even with a key present) — it no
  longer has to be separately set to `true`, which was an easy step to miss
  during setup. There's still no demo fallback: without a key, "Ask
  FoundAI" reports it isn't configured rather than faking a response — and
  now both mobile and the backend expose a cheap `GET /api/v1/ops/ai/status`
  check so a client can show that notice up front instead of only after a
  failed request.

## 5. What to check to confirm AI is actually live

1. On the **Core.Operations backend** Vercel project (not the website
   project): Settings → Environment Variables → confirm `ANTHROPIC_API_KEY`
   is set to a real key for the **Production** environment. `AI_ENABLED`
   can be left unset — only set it if you want to explicitly force AI off
   (`AI_ENABLED=false`).
2. Trigger a redeploy of that project (Deployments → latest → Redeploy, or
   push a commit) so the new variables are picked up — Vercel does not hot-
   reload environment variables into an already-running deployment.
3. In the mobile app open Search → "Ask FoundAI" and ask a real question
   about your data. A real answer citing your own
   records confirms it's live; an error means either the env vars aren't set
   on that exact project/environment, or the redeploy hasn't completed yet.

## 6. Recommended next priorities (not yet started)

In rough priority order, based on customer-impact:

1. **Apply the new migration to a real database.** No live database was
   reachable from this environment, so
   `prisma/migrations/20260924210000_message_status_assignment_tags/migration.sql`
   is hand-written and verified against the schema, but has not been run
   via `prisma migrate deploy` against Postgres yet — do that before
   relying on status/media/tags/assignment in production.
2. **Mobile parity for status/media/tags/assignment** — the mobile app's
   CRM screen (`apps/foundingos-mobile/app/(app)/crm.tsx`) manages deals
   but has no WhatsApp conversation panel at all today (unlike the console's
   Pipeline). Bringing over delivery-status ticks, inline media, tags, and
   assignment is a real UI build (a conversation screen/modal), not a small
   tweak — same backend endpoints already return everything needed
   (`/customers/:id/messages`), so this is front-end-only work, just larger
   than a quick pass allows.
3. Commit and push this session's fixes (§3) once you're ready — nothing
   above takes effect in production until then.
4. Continue making `apps/foundingos-console`'s remaining modules real
   (backend-persisted) — Sales Pipeline and a generic Records module are
   now real (§3); everything else in the console (CRM demo boards,
   per-brand modules) is still demo/seeded.
5. Remove or gate the deprecated `/foundthat`, `/meat`, `/crypto` console
   routes so they can't be stumbled into.
6. Wire FoundAI into the console (it currently only exists on mobile) using
   the same `/api/v1/ops/ai/ask` and `/api/v1/ops/ai/status` endpoints.
