-- Phase 33/35 — removes the dead pre-FoundingOS NextAuth + per-brand SaaS
-- scaffold. See docs/single-schema-migration.md §2/§4/§6 for the full audit.
--
-- Every model dropped here was confirmed to have ZERO live readers/writers
-- anywhere in the codebase:
--   - Brand/Module/ActivityLog: no call sites at all.
--   - User/Account/Session/VerificationToken: only ever reachable through
--     packages/auth's NextAuth PrismaAdapter wiring (authOptionsForBrand),
--     which itself has zero importers anywhere in apps/ or packages/ — a
--     fully built but never-wired-in auth path.
--   - Subscription/SurveyResult: same status — SurveyResult's only writer
--     (packages/db/src/survey-service.ts's saveSurveyResultToDb) also has
--     zero importers; every real survey flow uses
--     packages/config/src/surveys/survey-storage.ts (localStorage) instead.
--   - BrandMetric: migrated to core-operations' TelemetryEvent pipeline in
--     this same pass (see packages/config/src/engagement-telemetry.ts) —
--     brand slugs have no real tenant mapping, so this now flows through
--     the existing tenant-optional telemetry ingestion endpoint instead.
--
-- BrandSubscription/CrmDeal/BrandFinance/AccountingInvoice are NOT touched —
-- confirmed live, backing real console UI (see docs/single-schema-migration.md
-- §2) — deferred to a separate future initiative.
-- AnomalyLog/EngagementLog/DriftLog are NOT touched — still live for
-- category-level anomaly detection (survey-feed-signals.server.ts,
-- verification-layer.server.ts); only BrandMetric's brand-level writer into
-- them was migrated away, the tables themselves stay.

-- Drop RLS policies added in 20260902100000_tenant_isolation_rls for the
-- tables being dropped below (Postgres would otherwise refuse the drop).
DROP POLICY IF EXISTS "tenant_isolation" ON "User";
DROP POLICY IF EXISTS "tenant_isolation" ON "Module";
DROP POLICY IF EXISTS "tenant_isolation" ON "Subscription";
DROP POLICY IF EXISTS "tenant_isolation" ON "ActivityLog";

-- DropForeignKey (children before parents)
ALTER TABLE "SurveyResult" DROP CONSTRAINT IF EXISTS "SurveyResult_userId_fkey";
ALTER TABLE "SurveyResult" DROP CONSTRAINT IF EXISTS "SurveyResult_subscriptionId_fkey";
ALTER TABLE "Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE "Subscription" DROP CONSTRAINT IF EXISTS "Subscription_brandId_fkey";
ALTER TABLE "Subscription" DROP CONSTRAINT IF EXISTS "Subscription_userId_fkey";
ALTER TABLE "ActivityLog" DROP CONSTRAINT IF EXISTS "ActivityLog_brandId_fkey";
ALTER TABLE "ActivityLog" DROP CONSTRAINT IF EXISTS "ActivityLog_userId_fkey";
ALTER TABLE "Module" DROP CONSTRAINT IF EXISTS "Module_brandId_fkey";
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_brandId_fkey";

-- DropTable
DROP TABLE IF EXISTS "SurveyResult";
DROP TABLE IF EXISTS "Account";
DROP TABLE IF EXISTS "Session";
DROP TABLE IF EXISTS "VerificationToken";
DROP TABLE IF EXISTS "Subscription";
DROP TABLE IF EXISTS "ActivityLog";
DROP TABLE IF EXISTS "Module";
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "Brand";
DROP TABLE IF EXISTS "brand_metrics";

-- DropEnum
DROP TYPE IF EXISTS "SurveyType";
DROP TYPE IF EXISTS "SurveySentiment";
DROP TYPE IF EXISTS "BillingState";
DROP TYPE IF EXISTS "Role";
DROP TYPE IF EXISTS "DataTier";

-- Additive fix for packages/billing's Stripe webhook, which previously wrote
-- the now-dropped per-user Subscription model above (brandId/userId-keyed).
-- Repointed to upsert the live, brandSlug-keyed BrandSubscription instead
-- (see packages/billing/src/stripe-service.ts) — these two columns capture
-- what the dropped model stored so the webhook keeps working.
ALTER TABLE "brand_subscriptions" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "brand_subscriptions" ADD COLUMN "stripeSubscriptionId" TEXT;

