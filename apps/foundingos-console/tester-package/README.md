# Tester Package — Legal Documents

Standalone, human-readable copies of the 9 legal documents shown (as
collapsible sections) on the `/tester/login` sign-in screen, plus
`legal-version.json` listing the current document set and version.

**Source of truth:** the runtime UI at `/tester/login` renders its content
from `apps/foundingos-console/app/tester/legal-content.ts`, not from these
files directly. If you edit the wording here for legal review purposes,
mirror the same change into `legal-content.ts` (and bump
`LEGAL_CONTENT_VERSION` there and `version` in `legal-version.json`) so the
live sign-in screen and this handover package stay in sync.

All 9 documents are DRAFT text intended for review by the designated
Commercial Lawyer reviewer (`LAW-REVIEW` access code) — see
`legal-review-scope.md` for that reviewer's scope.
