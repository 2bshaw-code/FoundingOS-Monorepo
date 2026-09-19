-- Repair migration: production was missing Customer, InventoryItem, AgentAction,
-- MessagingChannelConnection, and MessagingParticipant even though earlier migrations
-- were recorded as applied in _prisma_migrations. This migration is fully idempotent
-- (IF NOT EXISTS / guarded DO blocks) so it is safe to run regardless of the actual
-- current state of the shared "wros" schema, and safe to re-run.

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."Customer" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."InventoryItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "supplierName" TEXT,
    "supplierEmail" TEXT,
    "pricePence" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "lowStockLevel" INTEGER NOT NULL DEFAULT 5,
    "variants" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "availability" TEXT NOT NULL DEFAULT 'available',
    "approvalStatus" TEXT NOT NULL DEFAULT 'approved',
    "lastChangedBy" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."AgentAction" (
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
    "coordinationSummary" JSONB,
    "historicalContext" JSONB,
    "predictiveSignals" JSONB,
    "simulationPreview" JSONB,
    "outcomeSummary" TEXT,
    "outcomeAssessment" JSONB,
    "trailEventIds" JSONB NOT NULL DEFAULT '[]',
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

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."MessagingChannelConnection" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "displayName" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessagingChannelConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."MessagingParticipant" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "channel" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "displayName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'operator',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessagingParticipant_pkey" PRIMARY KEY ("id")
);

-- In case MessagingParticipant already existed without the userId column (schema drift)
ALTER TABLE "wros"."MessagingParticipant" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- CreateIndex (all guarded with IF NOT EXISTS; Postgres supports this natively for indexes)
CREATE INDEX IF NOT EXISTS "Customer_tenantId_idx" ON "wros"."Customer"("tenantId");
CREATE INDEX IF NOT EXISTS "MessagingChannelConnection_tenantId_channel_idx" ON "wros"."MessagingChannelConnection"("tenantId", "channel");
CREATE UNIQUE INDEX IF NOT EXISTS "MessagingChannelConnection_channel_externalAccountId_key" ON "wros"."MessagingChannelConnection"("channel", "externalAccountId");
CREATE INDEX IF NOT EXISTS "MessagingParticipant_tenantId_active_idx" ON "wros"."MessagingParticipant"("tenantId", "active");
CREATE INDEX IF NOT EXISTS "MessagingParticipant_userId_idx" ON "wros"."MessagingParticipant"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "MessagingParticipant_tenantId_channel_address_key" ON "wros"."MessagingParticipant"("tenantId", "channel", "address");
CREATE INDEX IF NOT EXISTS "InventoryItem_tenantId_category_idx" ON "wros"."InventoryItem"("tenantId", "category");
CREATE UNIQUE INDEX IF NOT EXISTS "InventoryItem_tenantId_sku_key" ON "wros"."InventoryItem"("tenantId", "sku");
CREATE INDEX IF NOT EXISTS "AgentAction_tenantId_status_createdAt_idx" ON "wros"."AgentAction"("tenantId", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "AgentAction_tenantId_kind_createdAt_idx" ON "wros"."AgentAction"("tenantId", "kind", "createdAt");

-- AddForeignKey statements guarded via DO blocks: only add if both the constraint is
-- missing AND the referencing/referenced tables and columns actually exist. This makes
-- the migration safe to apply regardless of the exact partial state of the shared schema.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'Lead')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'Lead' AND column_name = 'customerId')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Lead_customerId_fkey') THEN
    ALTER TABLE "wros"."Lead" ADD CONSTRAINT "Lead_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "wros"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'SalesOrder')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'SalesOrder' AND column_name = 'customerId')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SalesOrder_customerId_fkey') THEN
    ALTER TABLE "wros"."SalesOrder" ADD CONSTRAINT "SalesOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "wros"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'CustomerMessage')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'CustomerMessage' AND column_name = 'customerId')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CustomerMessage_customerId_fkey') THEN
    ALTER TABLE "wros"."CustomerMessage" ADD CONSTRAINT "CustomerMessage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "wros"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'AuthUser')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MessagingParticipant_userId_fkey') THEN
    ALTER TABLE "wros"."MessagingParticipant" ADD CONSTRAINT "MessagingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "wros"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'AgentActionExecution')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AgentActionExecution_actionId_fkey') THEN
    ALTER TABLE "wros"."AgentActionExecution" ADD CONSTRAINT "AgentActionExecution_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "wros"."AgentAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
