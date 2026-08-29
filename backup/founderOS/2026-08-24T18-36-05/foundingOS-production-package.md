# FounderOS Production Package

## Brand copywriting

### Retail
FoundRetail is a conversational commerce OS for modern retail teams. It unifies customers, products, orders, and service operations into one responsive control layer. The platform helps retail operators move faster, answer better, and keep stock, fulfilment, and support aligned.

### Meat
FoundMeat is a trade operations OS for suppliers, buyers, and fulfilment teams. It brings stock visibility, logistics coordination, compliance, and channel-based communication into a single workflow so meat businesses can run with more confidence and less friction.

### IT
FoundIT is a local discovery and data operations OS. It connects lead capture, routing, reporting, and operational intelligence so teams can convert demand faster, improve signal quality, and manage data-rich workflows with clarity.

### Talent
FoundTalent is a hiring and workforce intelligence OS. It helps recruitment teams manage applicants, jobs, outreach, and hiring pipelines while keeping every candidate interaction, shortlist decision, and workflow step visible and actionable.

### Crypto
FoundCrypto is a market intelligence and automation OS for trading teams. It combines signal monitoring, execution context, workflow automation, and risk awareness so operators can make faster, more disciplined decisions.

### FounderOS ecosystem overview
FounderOS is the orchestration layer for the full multi-brand stack. It gives each brand its own console, routing, and operating model while preserving a common design system, shared components, and consistent user experience. The result is a portfolio that feels unified, premium, and acquisition-ready.

## Whitepaper

### Executive summary
FounderOS is a multi-brand SaaS ecosystem built around isolated brand websites, brand-specific console apps, and a shared UI and workflow layer. Each brand serves a distinct operating domain while using common patterns for navigation, CRM, package selection, and AI assistance.

### Multi-brand architecture
- Separate public websites for Retail, Meat, IT, Talent, and Crypto
- Separate console apps for each brand on dedicated ports
- FounderOS console as the ecosystem command layer
- Shared UI package for shell, CRM, dashboard, package, sidebar, and topbar components

### Technical stack overview
- Next.js App Router
- React 18
- Shared TypeScript packages
- Central brand config and package catalog
- CSS-based shared shell and theme system

### Routing and isolation model
- Websites link only to their own console entry paths
- Consoles expose dashboard, CRM, modules, settings, and package routes
- Brand configs isolate copy, colors, module sets, and URLs
- FounderOS remains a separate ecosystem layer

### Console design system
- Shared topbar
- Collapsible sidebar
- Dashboard cards and KPI widgets
- CRM board and workflow modules
- Bob AI assistant entry point
- Brand-aware accent and typography tokens

### CRM and workflow modules
- Lead/customer/record management
- Stage and status tracking
- Tasks, notes, and activity timelines
- Brand-specific fields and workflows
- Package-led onboarding and conversion flows

### Security model
- Brand isolation at the route and config level
- Shared components with brand-scoped data
- Console entry points separated from public websites
- No cross-brand dashboard leakage in public navigation

### Scalability and multi-tenant strategy
- Shared implementation with brand-specific configuration
- Independent deployability per website and console
- New brand support via config and route extension
- Component reuse without cross-brand coupling

### Commercial positioning and acquisition readiness
- Premium SaaS presentation
- Clear product boundaries per brand
- Reusable operational architecture
- Easier diligence through shared patterns and isolated routes

## Production deployment instructions

### Environment variables
Set the following per app as needed:
- `NEXT_PUBLIC_FOUNDINGOS_WEB_URL`
- `NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL`
- `NEXT_PUBLIC_RETAIL_WEB_URL`
- `NEXT_PUBLIC_RETAIL_CONSOLE_URL`
- `NEXT_PUBLIC_MEAT_WEB_URL`
- `NEXT_PUBLIC_MEAT_CONSOLE_URL`
- `NEXT_PUBLIC_IT_WEB_URL`
- `NEXT_PUBLIC_IT_CONSOLE_URL`
- `NEXT_PUBLIC_TALENT_WEB_URL`
- `NEXT_PUBLIC_TALENT_CONSOLE_URL`
- `NEXT_PUBLIC_CRYPTO_WEB_URL`
- `NEXT_PUBLIC_CRYPTO_CONSOLE_URL`

### Build commands
- `npm run typecheck --workspace @foundingos/ui`
- `npx tsc --noEmit` in each brand website and console workspace
- `npm run build --workspace <workspace-name>` for the target app

### Deployment steps
1. Build shared packages first.
2. Build each console independently.
3. Build each public website independently.
4. Verify brand URLs and console URLs point to the correct local or production hosts.
5. Confirm dashboard, CRM, modules, settings, and package routes respond before publish.

## Ready for production checklist
- [x] App trees backed up
- [x] Brand websites isolated from FounderOS navigation leakage
- [x] Console shell uses a shared layout system
- [x] Sidebar can collapse and expand
- [x] Retail CRM add-record flow verified
- [x] Website typechecks pass
- [x] Console typechecks pass
- [x] Meat website `/login` responds after restart
- [x] Live routes return 200 for all brand websites and consoles
- [x] Brand copy and whitepaper prepared
- [ ] Final production environment variables set
- [ ] Production builds executed
- [ ] Smoke test on deployed environment completed
