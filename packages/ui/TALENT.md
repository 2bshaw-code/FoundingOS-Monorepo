# Unified Talent recruiter workspace

FoundingOS is building one recruiter workspace rather than requiring an agency
to buy several overlapping ATS, CRM, outreach and reporting tools. This is a
direction, not a claim of current feature parity with commercial vendors.

## Implemented foundation

Web/Mac and native mobile use `src/talent-workspace.ts` for the same Talent
modules and hiring stages. Existing jobs, candidates, interviews, offers,
references, talent pools, clients and placements remain.

New modules use the existing tenant-scoped workspace records API and the shared
specialist forms/insights registry:

- **Client submissions:** candidate, job and client references, feedback dates,
  recorded sharing permission/evidence and manually recorded placement conversion.
- **Outreach follow-ups:** manual contact queue, draft messages, contact-basis
  evidence, restrictions and follow-up dates. No automatic sending.
- **Recruiter activity:** manual activity records, with completed activity by
  type/recruiter over today and the preceding six calendar dates. Planned,
  cancelled, future and undated activity does not count.
- **Candidate source tracking:** named job boards, external application/profile
  references, contact preferences and retention-review dates. Naming a source
  does not connect to it.

An Offer is no longer reported as a hire: the candidate board has an explicit
Hired stage. Existing Offer records remain Offer; there is no automatic migration
to Hired. Closed candidates and do-not-contact preferences are excluded from
contact-chasing insights. Date-only contact records support calendar-day alerts,
not precise elapsed-hour SLAs.

References are free-text, not enforced foreign keys. Permission fields are
review evidence/advisory warnings, not a compliance certificate or an outbound
enforcement mechanism. There is no outbound recruiter send action in this slice.
The existing linear workflow UI has not gained separate rejection/withdrawal
branches. Counts describe the loaded module records, not an unlimited,
cross-system warehouse or independently verified provider events.

## Remaining replacement work

| Recruiter stack area | Work still needed |
| --- | --- |
| idibu-style distribution | Provider adapter, job posting/update/closure, posting receipts and reliable applicant intake |
| SourceWhale-style outreach | Governed sequences, email delivery/reply ingestion, suppression, stop-on-reply, retry/idempotency and duplicate handling |
| Seven20 / Salesforce-style agency CRM | Linked client/contact/job/candidate/submission entities, deduplication, relationship timeline, permissions and migration |
| OneUp-style performance | Verified events, targets, period filters, source-to-placement attribution, aggregate reporting and reconciliation |
| Ringover-style calling | Licensed phone service, signed event ingestion, call logging and permissioned recording/transcription |
| HireAra-style presentation | CV ingestion, reviewed extraction, original-file handling and branded/redacted client-ready document export |

## Approved job-board connections

No Talent connector for CV-Library, Totaljobs, Indeed or LinkedIn is implemented
by this change. Posting, receiving applications and searching a licensed CV
database are different permissions/products. Do not assume a recruiter login
provides API access or unrestricted profile extraction.

For each provider, obtain approved partner/API access, contractual scopes and
customer licences first; then implement against its current official contract.
Store credentials through existing encrypted backend integration storage, never
in mobile/web code or chat. Verify tenant isolation, webhook authentication,
consent/provenance, retention/deletion, idempotency, pagination and failure
visibility before showing a connection as working. No scraping or bypasses.

LinkedIn's official [Talent Solutions documentation](https://learn.microsoft.com/en-us/linkedin/talent/)
describes distinct Apply Connect, Apply with LinkedIn, job-posting and recruiter
integration products; these are not an unrestricted public candidate-search API.

## Delivery and acceptance

These are source changes. A website deployment is required for Mac/web.
Native releases/compatible updates must be distributed separately; already
submitted mobile builds do not include changes made after their upload.

Before claiming replacement readiness, prove with agency testing: fewer
duplicate entries and missed follow-ups, faster application response, accurate
source-to-placement attribution, compliant contact suppression and consistent
web/native workflows. Use measured baselines, not vendor marketing percentages.

Targeted validation from the repository root:

```sh
node --import tsx --test packages/ui/src/talent-workspace.test.ts
npm run typecheck --workspace @foundingos/mobile
npm run typecheck --workspace @foundingos/foundingos-website
```
