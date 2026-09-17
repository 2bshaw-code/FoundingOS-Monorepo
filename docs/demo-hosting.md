# Zero-credential demo hosting

The demo build is forced to `APP_MODE=demo` and uses local/mock adapters. Do
not add provider credentials to a demo deployment.

> **Before building:** if this repository lives inside a cloud-synced folder
> (macOS iCloud Drive Desktop/Documents, Dropbox, OneDrive, Google Drive),
> builds can stall or hang indefinitely due to file-provider daemon
> contention, unrelated to this codebase. See
> [environment-setup.md](./environment-setup.md) for how to detect this and
> work around it (move the repo, or redirect build output to
> `./build-clean/`, which the `demo:build` scripts already do). Also use
> **Node 20 LTS** — Next.js 14.2 is known to hang silently on newer Node
> major versions on some machines.

## Vercel

```bash
npm install
npm run demo:build --workspace @foundingos/foundingos-web
npx vercel --prod --local-config vercel.json
```

Set `APP_MODE=demo`, `NEXT_PUBLIC_APP_MODE=demo`, and the `DEMO_*` flags in the
Vercel project environment. The demo build output is written to
`apps/foundingos-web/.build-clean` (a symlink into `./build-clean/web-demo/`,
outside any cloud-synced path) — point Vercel's output directory at
`.build-clean` if deploying from a pre-built artifact rather than letting
Vercel run the build itself.

## Netlify

```bash
npm install
npm run demo:build --workspace @foundingos/foundingos-web
npx netlify deploy --prod --dir=apps/foundingos-web/.build-clean
```

Configure the same demo variables in Netlify. For Next.js, prefer the Netlify
Next runtime/plugin rather than treating the build output as a static
directory.

## Cloudflare Pages

Cloudflare Pages is suitable for a static export only. If the website uses
server-rendered Next routes, deploy it to a Next-compatible runtime instead.
For a static demo, add `output: 'export'` to the web Next config, then run:

```bash
npm install
npm run demo:build --workspace @foundingos/foundingos-web
npx wrangler pages deploy apps/foundingos-web/.build-clean --project-name foundingos-demo
```
