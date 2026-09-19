ALTER TABLE "wros"."AgentAction"
  ADD COLUMN "coordinationSummary" JSONB,
  ADD COLUMN "historicalContext" JSONB,
  ADD COLUMN "trailEventIds" JSONB NOT NULL DEFAULT '[]';

CREATE INDEX "Event_tenantId_type_createdAt_idx" ON "wros"."Event"("tenantId", "type", "createdAt");
CREATE INDEX "Event_tenantId_source_type_createdAt_idx" ON "wros"."Event"("tenantId", "source", "type", "createdAt");
