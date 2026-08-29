# Unified Authentication

All applications use `@founder-os/auth` for password hashing, access tokens, refresh rotation, reset flows, response contracts, and safe diagnostics.

## HTTP contract

Each backend mounts the shared router at `/api/v1/auth`:

- `POST /login`
- `POST /refresh`
- `POST /logout`
- `POST /password/forgot`
- `POST /password/reset`
- `POST /password/change`

Every auth request must include a persistent `X-Device-Fingerprint`. Frontends generate a random device identifier once and retain it locally. Access tokens use namespaced localStorage. Refresh tokens are rotated, hashed in PostgreSQL, and sent as httpOnly cookies. Reuse of a rotated refresh token revokes every session for that account.

## Founder federation and application isolation

`bobby@founder.master` always authenticates against FoundingOS. FoundRetail, FoundThis, and FoundMeat send only that email to the Founder identity endpoint and retain their own identity repositories for every other account. Product databases do not need duplicate Founder records.

All backends verify the shared `founding-os` issuer, `founding-os-apps` audience, and `AUTH_ACCESS_TOKEN_SECRET`. Refresh tokens remain bound to the identity service that issued the session, so app-local refresh repositories and rotation remain isolated.

- FoundingOS: `FounderOnly`, `SystemOperator`, `ReadOnly` only
- FoundRetail: `Owner`, `Merchant`, `Staff`
- FoundThis: `Customer`, `Merchant`, `Owner`
- FoundMeat: `MeatTrader`, `Owner`, `Customer`

Owner accounts can use merchant consoles but Owner OS routes require `Owner`. A signed `FounderOnly` token has oversight access across product apps. Merchant, Owner, Customer, Staff, and MeatTrader tokens remain rejected by FoundingOS.

## Persistence

Each PostgreSQL schema defines `AuthUser`, `AuthSession`, and `PasswordReset`. No migration has been created or run. Before enabling an app, review its Prisma schema and create an approved migration against the intended database.

Required environment values are documented in each backend `.env.example`. Access and refresh secrets must be independent, randomly generated values of at least 32 bytes.

## Password reset

Merchant reset requests use `PASSWORD_RESET_WEBHOOK_URL` to deliver one-time reset tokens through an external email provider. FoundingOS password changes require an authenticated founder session and the current password. Password changes revoke all sessions.

## Diagnostics

Allowed events are `LOGIN HIT`, `USER FOUND`, `PASSWORD VERIFIED`, and `TOKEN ISSUED`. Passwords, reset tokens, access tokens, and refresh tokens must never be logged.
