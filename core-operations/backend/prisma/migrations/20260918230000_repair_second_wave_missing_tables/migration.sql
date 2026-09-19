-- Repair migration: restore tables that were part of schema.prisma (some with prior
-- migration-history entries) but were never actually created in production due to
-- historical `prisma db push` schema drift. Idempotent: safe to re-run.

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."TenantBrandProfile" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "tradingName" TEXT,
    "tagline" TEXT,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#4A90E2',
    "secondaryColor" TEXT NOT NULL DEFAULT '#101828',
    "accentColor" TEXT NOT NULL DEFAULT '#7C3AED',
    "headingFont" TEXT NOT NULL DEFAULT 'Inter',
    "bodyFont" TEXT NOT NULL DEFAULT 'Inter',
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "address" TEXT,
    "registrationNumber" TEXT,
    "taxNumber" TEXT,
    "defaultLocale" TEXT NOT NULL DEFAULT 'en-GB',
    "defaultCurrency" TEXT NOT NULL DEFAULT 'GBP',
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
    "paymentTerms" TEXT,
    "documentFooter" TEXT,
    "brandVoice" JSONB,
    "socialLinks" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantBrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."BrandedDocument" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "brandProfileVersion" INTEGER NOT NULL,
    "brandProfileSnapshot" JSONB NOT NULL,
    "sourceSnapshot" JSONB NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'text/html',
    "content" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."MessagingConversation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "externalConversationId" TEXT NOT NULL,
    "participantAddress" TEXT NOT NULL,
    "state" JSONB,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessagingConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."MessagingMessage" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "providerMessageId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "body" TEXT,
    "intent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'received',
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessagingMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."TenantOnboarding" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "industry" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'GB',
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/London',
    "completedSteps" JSONB NOT NULL,
    "goLiveStatus" TEXT NOT NULL DEFAULT 'setup',
    "acceptedTermsAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantOnboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."TenantControlSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "notificationChannel" TEXT NOT NULL DEFAULT 'whatsapp',
    "notificationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "approvalThresholdPence" INTEGER NOT NULL DEFAULT 0,
    "requireOwnerExecution" BOOLEAN NOT NULL DEFAULT true,
    "requireEvidence" BOOLEAN NOT NULL DEFAULT true,
    "governanceMode" TEXT NOT NULL DEFAULT 'human_approval',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantControlSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."TenantWorkspace" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "workspace" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "plan" TEXT NOT NULL DEFAULT 'growth',
    "modules" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."WorkspaceRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "workspace" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ownerId" TEXT,
    "valuePence" INTEGER,
    "data" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WorkspaceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."IntegrationCredential" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'configured',
    "configuration" JSONB NOT NULL,
    "credentialsCiphertext" TEXT NOT NULL,
    "credentialsIv" TEXT NOT NULL,
    "credentialsTag" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."AgentActionExecution" (
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

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TenantBrandProfile_tenantId_key" ON "wros"."TenantBrandProfile"("tenantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BrandedDocument_tenantId_generatedAt_idx" ON "wros"."BrandedDocument"("tenantId", "generatedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "BrandedDocument_tenantId_documentType_sourceId_key" ON "wros"."BrandedDocument"("tenantId", "documentType", "sourceId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MessagingConversation_tenantId_lastMessageAt_idx" ON "wros"."MessagingConversation"("tenantId", "lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "MessagingConversation_tenantId_channel_externalConversation_key" ON "wros"."MessagingConversation"("tenantId", "channel", "externalConversationId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "MessagingMessage_providerMessageId_key" ON "wros"."MessagingMessage"("providerMessageId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MessagingMessage_tenantId_createdAt_idx" ON "wros"."MessagingMessage"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MessagingMessage_conversationId_createdAt_idx" ON "wros"."MessagingMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TenantOnboarding_tenantId_key" ON "wros"."TenantOnboarding"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TenantControlSettings_tenantId_key" ON "wros"."TenantControlSettings"("tenantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TenantWorkspace_tenantId_enabled_idx" ON "wros"."TenantWorkspace"("tenantId", "enabled");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TenantWorkspace_tenantId_workspace_key" ON "wros"."TenantWorkspace"("tenantId", "workspace");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WorkspaceRecord_tenantId_workspace_module_status_idx" ON "wros"."WorkspaceRecord"("tenantId", "workspace", "module", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WorkspaceRecord_tenantId_updatedAt_idx" ON "wros"."WorkspaceRecord"("tenantId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "WorkspaceRecord_tenantId_workspace_module_reference_key" ON "wros"."WorkspaceRecord"("tenantId", "workspace", "module", "reference");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "IntegrationCredential_tenantId_status_idx" ON "wros"."IntegrationCredential"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "IntegrationCredential_tenantId_provider_key" ON "wros"."IntegrationCredential"("tenantId", "provider");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "IdempotencyRecord_expiresAt_idx" ON "wros"."IdempotencyRecord"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "IdempotencyRecord_tenantId_key_key" ON "wros"."IdempotencyRecord"("tenantId", "key");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AgentActionExecution_actionId_key" ON "wros"."AgentActionExecution"("actionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AgentActionExecution_tenantId_status_createdAt_idx" ON "wros"."AgentActionExecution"("tenantId", "status", "createdAt");

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'MessagingMessage')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'MessagingConversation')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MessagingMessage_conversationId_fkey') THEN
    ALTER TABLE "wros"."MessagingMessage" ADD CONSTRAINT "MessagingMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "wros"."MessagingConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'AgentActionExecution')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'AgentAction')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AgentActionExecution_actionId_fkey') THEN
    ALTER TABLE "wros"."AgentActionExecution" ADD CONSTRAINT "AgentActionExecution_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "wros"."AgentAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
