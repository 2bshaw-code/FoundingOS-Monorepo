-- Real, persisted per-tenant suite license records backing
-- createModuleAccessMiddleware's `/module-access/:tenantId/:module`
-- check across Core.Operations, Core.Workforce, and Core.Intelligence.
CREATE TABLE "wros"."TenantSuiteLicense" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "suite" TEXT NOT NULL,
    "planTier" TEXT NOT NULL DEFAULT 'starter',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "seats" INTEGER,
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantSuiteLicense_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TenantSuiteLicense_tenantId_suite_key" ON "wros"."TenantSuiteLicense"("tenantId", "suite");

CREATE INDEX "TenantSuiteLicense_tenantId_enabled_idx" ON "wros"."TenantSuiteLicense"("tenantId", "enabled");
