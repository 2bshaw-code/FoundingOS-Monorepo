CREATE TABLE "wros"."AgentActionExecution" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "actionId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "effects" JSONB NOT NULL,
  "compensation" JSONB,
  "executedBy" TEXT NOT NULL,
  "executedAt" TIMESTAMP(3) NOT NULL,
  "reversedBy" TEXT,
  "reversedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AgentActionExecution_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AgentActionExecution_actionId_key"
ON "wros"."AgentActionExecution"("actionId");

CREATE INDEX "AgentActionExecution_tenantId_status_createdAt_idx"
ON "wros"."AgentActionExecution"("tenantId", "status", "createdAt");

ALTER TABLE "wros"."AgentActionExecution"
ADD CONSTRAINT "AgentActionExecution_actionId_fkey"
FOREIGN KEY ("actionId") REFERENCES "wros"."AgentAction"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
