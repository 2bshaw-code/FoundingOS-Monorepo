CREATE TABLE "wros"."TenantOnboarding" (
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

CREATE TABLE "wros"."TenantWorkspace" (
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

CREATE TABLE "wros"."WorkspaceRecord" (
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

CREATE TABLE "wros"."IntegrationCredential" (
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

CREATE TABLE "wros"."WorkspaceAuditEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "workspace" TEXT,
    "module" TEXT,
    "entityId" TEXT,
    "requestId" TEXT,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkspaceAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "wros"."IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TenantOnboarding_tenantId_key" ON "wros"."TenantOnboarding"("tenantId");
CREATE UNIQUE INDEX "TenantWorkspace_tenantId_workspace_key" ON "wros"."TenantWorkspace"("tenantId", "workspace");
CREATE INDEX "TenantWorkspace_tenantId_enabled_idx" ON "wros"."TenantWorkspace"("tenantId", "enabled");
CREATE UNIQUE INDEX "WorkspaceRecord_tenantId_workspace_module_reference_key" ON "wros"."WorkspaceRecord"("tenantId", "workspace", "module", "reference");
CREATE INDEX "WorkspaceRecord_tenantId_workspace_module_status_idx" ON "wros"."WorkspaceRecord"("tenantId", "workspace", "module", "status");
CREATE INDEX "WorkspaceRecord_tenantId_updatedAt_idx" ON "wros"."WorkspaceRecord"("tenantId", "updatedAt");
CREATE UNIQUE INDEX "IntegrationCredential_tenantId_provider_key" ON "wros"."IntegrationCredential"("tenantId", "provider");
CREATE INDEX "IntegrationCredential_tenantId_status_idx" ON "wros"."IntegrationCredential"("tenantId", "status");
CREATE INDEX "WorkspaceAuditEvent_tenantId_createdAt_idx" ON "wros"."WorkspaceAuditEvent"("tenantId", "createdAt");
CREATE INDEX "WorkspaceAuditEvent_tenantId_workspace_module_idx" ON "wros"."WorkspaceAuditEvent"("tenantId", "workspace", "module");
CREATE UNIQUE INDEX "IdempotencyRecord_tenantId_key_key" ON "wros"."IdempotencyRecord"("tenantId", "key");
CREATE INDEX "IdempotencyRecord_expiresAt_idx" ON "wros"."IdempotencyRecord"("expiresAt");
