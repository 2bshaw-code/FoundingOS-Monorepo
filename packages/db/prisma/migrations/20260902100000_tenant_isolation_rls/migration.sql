-- Tenant isolation hardening. See docs/shared-schema.md "Multi-tenancy & isolation".
--
-- Today every tenant (brand) shares one Postgres database, isolated only by an
-- app-level `brandId`/`brandSlug` WHERE clause on every query. That is fine for
-- small/mid tenants but is a single point of failure: one query in one code
-- path that forgets the filter can leak another tenant's rows, and one very
-- large tenant's volume/locks affect every other tenant sharing the same
-- tables. This migration adds a defense-in-depth layer (Postgres Row-Level
-- Security) so the database itself refuses cross-tenant reads/writes even if
-- application code has a bug, and adds the `dataTier` flag brands can be
-- promoted to when they need a fully separate, dedicated database instead of
-- sharing this pool (see docs/shared-schema.md for that provisioning path).

-- CreateEnum
CREATE TYPE "DataTier" AS ENUM ('pooled', 'dedicated');

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN "dataTier" "DataTier" NOT NULL DEFAULT 'pooled';

-- Every tenant-scoped query and mutation must run inside a transaction that
-- first sets these two session-local GUCs (see packages/db/src/index.ts
-- withTenantScope helper). `app.current_brand_id` covers tables keyed by the
-- Brand relation's cuid; `app.current_brand_slug` covers tables keyed by the
-- brand's slug string (the two independent tenant key shapes already present
-- in the schema). `app.bypass_rls` is only ever set by trusted, brand-spanning
-- admin code paths (e.g. the SuperDash cross-brand rollups), never by
-- per-tenant request handlers.
--
-- RLS on brandId-keyed tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "User"
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR "brandId" IS NULL
    OR "brandId" = current_setting('app.current_brand_id', true)
  );

ALTER TABLE "Module" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Module" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "Module"
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR "brandId" = current_setting('app.current_brand_id', true)
  );

ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "Subscription"
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR "brandId" = current_setting('app.current_brand_id', true)
  );

ALTER TABLE "ActivityLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ActivityLog" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "ActivityLog"
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR "brandId" = current_setting('app.current_brand_id', true)
  );

-- RLS on brandSlug-keyed tables
ALTER TABLE "brand_subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "brand_subscriptions" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "brand_subscriptions"
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR "brandSlug" = current_setting('app.current_brand_slug', true)
  );

ALTER TABLE "crm_deals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "crm_deals" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "crm_deals"
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR "brandSlug" = current_setting('app.current_brand_slug', true)
  );

ALTER TABLE "brand_finances" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "brand_finances" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "brand_finances"
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR "brandSlug" = current_setting('app.current_brand_slug', true)
  );

ALTER TABLE "accounting_invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "accounting_invoices" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "accounting_invoices"
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR "brandSlug" = current_setting('app.current_brand_slug', true)
  );

-- NOTE: AnomalyLog, EngagementLog, BrandMetric, DriftLog are intentionally
-- left out of RLS — they are cross-brand admin/portfolio rollup tables read
-- only by SuperDash, not per-tenant application data.
