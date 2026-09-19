CREATE TABLE "wros"."AgentAction" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'proposed',
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "sourceEventId" TEXT,
    "input" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "estimatedValuePence" INTEGER,
    "proposedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "executedBy" TEXT,
    "executedAt" TIMESTAMP(3),
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AgentAction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AgentAction_tenantId_status_createdAt_idx" ON "wros"."AgentAction"("tenantId", "status", "createdAt");
CREATE INDEX "AgentAction_tenantId_kind_createdAt_idx" ON "wros"."AgentAction"("tenantId", "kind", "createdAt");
