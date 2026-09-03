# Compliance Notes

**Version: v2026-08-30.1**

> DRAFT — for review by the designated Commercial Lawyer reviewer
> (LAW-REVIEW). These are internal notes describing current data-handling
> practice, not a certification of legal compliance.

## Data minimization

This System is designed with data minimization as a default: no data beyond
an access code (password), module assignment, and survey answers is stored.

## Sensitive data

No sensitive personal data (health, biometric, government ID, etc.) is
collected.

## Financial data

No financial data (bank details, payment information, transaction records)
is collected.

## GDPR / UK-GDPR

Whether this program is fully GDPR/UK-GDPR compliant in your specific
deployment is a legal determination for the Legal Reviewer to confirm, not a
status this document can certify on its own.

## Cookies

No cookies are currently used by the tester/investor/legal-reviewer program
beyond the session cookie required to keep you signed in (`fo_tester_session`
/ `fo_tester_admin_session`, both `httpOnly`, `sameSite=lax`). If additional
cookies are introduced later (e.g. analytics), a cookie policy will need to
be added at that time.
