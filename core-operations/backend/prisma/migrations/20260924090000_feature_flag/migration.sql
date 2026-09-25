-- Phase 34: structured feature flag store backing GET/PUT /platform/feature-flags.
-- See /docs/feature-flags.md for the flag model and evaluation rules.
CREATE TABLE "wros"."FeatureFlag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "environment" TEXT NOT NULL DEFAULT 'all',
    "rolloutPercent" INTEGER NOT NULL DEFAULT 100,
    "tenantOverrides" JSONB NOT NULL DEFAULT '{}',
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "wros"."FeatureFlag"("key");

CREATE INDEX "FeatureFlag_environment_enabled_idx" ON "wros"."FeatureFlag"("environment", "enabled");
