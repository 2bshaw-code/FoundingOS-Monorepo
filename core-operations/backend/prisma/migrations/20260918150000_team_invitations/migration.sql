CREATE TABLE "wros"."TenantInvitation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "invitedBy" TEXT NOT NULL,
    "acceptedUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantInvitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TenantInvitation_tokenHash_key" ON "wros"."TenantInvitation"("tokenHash");
CREATE INDEX "TenantInvitation_tenantId_email_expiresAt_idx" ON "wros"."TenantInvitation"("tenantId", "email", "expiresAt");
CREATE INDEX "TenantInvitation_tenantId_acceptedAt_revokedAt_idx" ON "wros"."TenantInvitation"("tenantId", "acceptedAt", "revokedAt");
ALTER TABLE "wros"."TenantInvitation" ADD CONSTRAINT "TenantInvitation_acceptedUserId_fkey" FOREIGN KEY ("acceptedUserId") REFERENCES "wros"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
