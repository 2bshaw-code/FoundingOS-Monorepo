# FoundingOS Workspace

Isolated scaffold for FoundingOS, FoundRetail, FoundThis, FoundMeat, and FoundTalent.

## Applications

| Application | Frontend hostname | Frontend port | Backend port | PostgreSQL schema |
| --- | --- | ---: | ---: | --- |
| FoundRetail | `localhost:3000` | 3000 | 4000 | `foundretail` |
| FoundMeat | `localhost:3001` | 3001 | 4001 | `foundmeat` |
| FoundThis | `localhost:3002` | 3002 | 4002 | `foundthis` |
| FoundTalent | `localhost:3003` | 3003 | 4003 | `foundtalent` |
| FoundCrypto | `localhost:3004` | 3004 | 4004 | `foundcrypto` |
| FoundingOS Console | `localhost:3005` | 3005 | 5000 | `founder_os` |

The hostnames are documented targets only. This scaffold does not edit `/etc/hosts`, proxies, DNS, server configuration, or existing environment files.

## Shared packages

- `@founder-os/auth`: role and access-policy utilities
- `@founder-os/ui`: shared React primitives
- `@founder-os/media`: shared media-upload contracts and helpers

## Safety

No dependencies have been installed, no database migrations have been created or run, and no deployment configuration has been changed. Copy each backend's `.env.example` to a local ignored `.env` only when development begins.
