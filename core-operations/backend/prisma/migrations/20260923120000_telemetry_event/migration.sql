-- Phase 28: shared cross-suite telemetry sink backing POST /platform/telemetry.
-- See /docs/telemetry.md for the event envelope contract.
CREATE TABLE "wros"."TelemetryEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "suite" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "actorId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "properties" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelemetryEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TelemetryEvent_tenantId_occurredAt_idx" ON "wros"."TelemetryEvent"("tenantId", "occurredAt");

CREATE INDEX "TelemetryEvent_suite_name_occurredAt_idx" ON "wros"."TelemetryEvent"("suite", "name", "occurredAt");

CREATE INDEX "TelemetryEvent_receivedAt_idx" ON "wros"."TelemetryEvent"("receivedAt");
