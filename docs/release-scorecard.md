# FoundingOS 10/10 Release Scorecard

A 10/10 rating is earned only when every hard gate below has evidence. Passing
source builds or publishing marketing pages does not make a production system.

## Hard gates

| Gate | Required evidence | Current state |
| --- | --- | --- |
| Product truth | Public claims match deployed capabilities and planned channels are labelled planned | Pass |
| Source integrity | Focused changes committed; generated output, credentials, and cache files excluded | Pass |
| Build integrity | Website, Core Operations console, backend build, Prisma validation, and targeted tests pass in CI | Local pass; CI evidence required |
| Database safety | Staging and production backups, restore test, migration review, and forward rollback procedure | Blocked |
| WhatsApp connectivity | Verified Meta webhook, valid signature rejection, tenant connection, outbound delivery, and status callbacks | Blocked |
| Command correctness | `/status`, `/order`, `/delivered`, `/invoice`, and `/campaign` pass authorized, unauthorized, duplicate, malformed, and retry cases | Parser pass; integration evidence required |
| Intelligence loop | Completed, unknown, failed, and undelivered messaging events produce the expected role-relevant insight | Source implemented; integration evidence required |
| Fallback resilience | A Meta outage or delivery failure leaves the action auditable and completable in FoundingOS web | Source implemented; drill required |
| Observability | Delivery success, failure, unknown-intent rate, command latency, policy/rate-limit errors, and tenant/channel readiness are monitored and alerted | Blocked |
| Customer proof | At least three pilot businesses complete real weekly workflows and provide measured activation, reliability, and retention feedback | Blocked |

Any blocked hard gate caps the release below 10/10.

## Staging command matrix

For every supported command, capture the webhook request ID, provider message
ID, tenant, participant role, conversation, Event Feed record, resulting
workspace record, confirmation message ID, and latency.

| Scenario | Expected result |
| --- | --- |
| Authorized `/status` | Current tenant summary returned; no mutation |
| Authorized structured `/order` | Customer/order created once; event and confirmation emitted |
| Replayed provider message ID | No duplicate order or confirmation |
| Natural-language order | Guarded order created with reviewable notes |
| Driver `/delivered` | Matching tenant order/delivery closed; Finance follow-up insight created |
| Finance `/invoice` | Immutable branded invoice generated with profile/source provenance |
| Marketing `/campaign` | Brand rules enforced; prohibited terminology rejected |
| Unauthorized participant | No mutation; authorization response and audit event |
| Unauthorized role | No mutation; role failure event and web fallback |
| Unknown request | No mutation; help response and product-learning insight |
| Invalid Meta signature | HTTP 401; no message or business record |
| Meta delivery failure | Failed outbound record, Event Feed event, risk insight, web fallback available |

## Operational targets

- Webhook acknowledgement p95 below 2 seconds. Long-running work moves to a
  durable queue before production scale.
- Command processing success at least 99.5%, excluding rejected unauthorized or
  invalid requests.
- No duplicate business mutations in replay tests.
- 100% of successful mutations have an Event Feed record and explicit
  confirmation attempt.
- 100% of failed actions preserve an auditable reason and web recovery route.
- Messaging readiness reports zero unknown active connections and zero
  unauthorized production seed accounts.

## Customer proof

Run a four-week pilot with at least three businesses:

1. Week-one activation: connect WhatsApp, authorize roles, create the first
   order, and complete one fulfilment-to-cash loop.
2. Weekly active operators and completed commands.
3. Median time saved versus the prior process.
4. Unknown-intent and correction rates.
5. Delivery/confirmation reliability.
6. Repeat usage after four weeks.

Only customer behavior can validate whether FoundingOS is solving the right
problem.
