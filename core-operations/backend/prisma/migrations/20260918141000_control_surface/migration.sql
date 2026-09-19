CREATE TABLE "wros"."TenantControlSettings" (
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

CREATE UNIQUE INDEX "TenantControlSettings_tenantId_key" ON "wros"."TenantControlSettings"("tenantId");
