---
description: Identify the correct FoundingOS product surface before desktop, SuperDash or marketing changes
applyTo: 'apps/foundingos-*/**,packages/ui/**'
---

The desktop app loads `https://www.foundingos.com/app`, not the separate console
site. The current founder SuperDash is `/superdash` (`FounderSuperDash`); customer
Core Intelligence is `/app/intelligence`. The old console `/superdashboard` is a
different application: deploying a gallery there does not update desktop
SuperDash. Verify the actual target route and deployment source, retain
founder/partner/investor authorization, and test the relevant authenticated
surface rather than inferring success from a build or a login-page redirect.

Website workspace routes use `dynamicParams = false`: new menu modules must be
included in both static generation and route validation. Talent routes consume
the shared `talent-workspace` catalogue through `workspace-routes.ts`; run the
route-registry tests and load the built pages, not just the access gate.
