# Routing Conventions

All frontends use React Router with these conventions:

- `/` public or application home
- `/login` authentication entry
- `/dashboard` authenticated landing page
- `/foundretail/retail-manager-console` retail manager console
- `/foundretail/staff-console` staff console
- `/foundmeat/supplier-console` supplier console
- `/foundmeat/buyer-console/*` buyer console
- `/foundthis/intelligence-console` intelligence console
- `/foundthis/data-operations-console/*` data operations console
- `/foundtalent/workforce-intelligence-console` workforce intelligence console
- `/foundtalent/recruiter-console/*` recruiter console
- `/foundcrypto/chart-intelligence-dashboard` chart intelligence dashboard
- `/foundcrypto/trader-console` trader console
- `/system/*` operational routes

Legacy aliases remain in place as redirects during the transition.

All backends expose:

- `GET /health`
- `GET /api/v1/status`
- application resources beneath `/api/v1/*`

FoundingOS deep-links to the documented local frontend hostnames. Hostname resolution is intentionally left to future local infrastructure work.
