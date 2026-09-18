-- Repair migration (part 2): production is missing 22 additional baseline tables
-- (AuthUser, AuthSession, Event, SalesOrder, Merchant, Invoice, Lead, and others) that
-- were never captured in migration history, the same root cause as the earlier
-- 20260918210000_repair_missing_production_tables migration. Generated via
-- `prisma migrate diff --from-empty --to-schema-datamodel` and made fully idempotent
-- (IF NOT EXISTS / guarded DO blocks) so it is safe to apply regardless of the actual
-- current state of the shared "wros" schema, and safe to re-run.

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."AuthUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "tenantId" TEXT,
    "permissions" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."AuthSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "refreshTokenId" TEXT NOT NULL,
    "deviceFingerprint" TEXT NOT NULL,
    "ipPrefix" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "rotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."PasswordReset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "package" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."Console" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,

    CONSTRAINT "Console_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."Lead" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceRef" TEXT,
    "sourceUrl" TEXT,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "itemTitle" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'new',
    "valuePence" INTEGER NOT NULL DEFAULT 0,
    "customerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."SalesOrder" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "totalPence" INTEGER NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paymentMethod" TEXT,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'unassigned',
    "deliveryAddress" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."CustomerMessage" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'whatsapp',
    "direction" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."MerchantChange" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "itemId" TEXT,
    "submittedBy" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "proposed" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."MerchantActivity" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."Invoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT,
    "number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "subtotalPence" INTEGER NOT NULL DEFAULT 0,
    "taxPence" INTEGER NOT NULL DEFAULT 0,
    "totalPence" INTEGER NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "items" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."MarketingCampaign" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "platforms" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scheduledAt" TIMESTAMP(3),
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "engagements" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "revenuePence" INTEGER NOT NULL DEFAULT 0,
    "idea" TEXT,
    "caption" TEXT,
    "hashtags" TEXT,
    "adCopy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."SocialPost" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "campaignId" TEXT,
    "platforms" JSONB NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "autoPost" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."MediaGeneration" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "brief" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."DeliveryOperator" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'rider',
    "status" TEXT NOT NULL DEFAULT 'available',
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryOperator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."DeliveryVehicle" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL DEFAULT 'van',
    "capacityKg" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'available',
    "currentLat" DOUBLE PRECISION,
    "currentLng" DOUBLE PRECISION,
    "lastLocationAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."DeliveryZone" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "postcodePrefixes" JSONB NOT NULL,
    "feePence" INTEGER NOT NULL DEFAULT 0,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 0,
    "feeMode" TEXT NOT NULL DEFAULT 'zone',
    "cashOnDeliveryAllowed" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."DeliveryAssignment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "operatorId" TEXT,
    "vehicleId" TEXT,
    "zoneId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "feePence" INTEGER NOT NULL DEFAULT 0,
    "routeDistanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 0,
    "originLat" DOUBLE PRECISION,
    "originLng" DOUBLE PRECISION,
    "destinationLat" DOUBLE PRECISION,
    "destinationLng" DOUBLE PRECISION,
    "timeline" JSONB NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."DeliveryNotification" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'whatsapp',
    "recipient" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."Event" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."Insight" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "eventId" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "wros"."LocationProfile" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'Primary location',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "locality" TEXT,
    "countryCode" TEXT,
    "timezone" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "gpsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "ipFallbackEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AuthUser_email_key" ON "wros"."AuthUser"("email");
CREATE INDEX IF NOT EXISTS "AuthSession_userId_idx" ON "wros"."AuthSession"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "PasswordReset_tokenHash_key" ON "wros"."PasswordReset"("tokenHash");
CREATE INDEX IF NOT EXISTS "PasswordReset_userId_idx" ON "wros"."PasswordReset"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Lead_sourceRef_key" ON "wros"."Lead"("sourceRef");
CREATE INDEX IF NOT EXISTS "Lead_tenantId_stage_idx" ON "wros"."Lead"("tenantId", "stage");
CREATE UNIQUE INDEX IF NOT EXISTS "SalesOrder_reference_key" ON "wros"."SalesOrder"("reference");
CREATE INDEX IF NOT EXISTS "SalesOrder_tenantId_status_idx" ON "wros"."SalesOrder"("tenantId", "status");
CREATE INDEX IF NOT EXISTS "CustomerMessage_tenantId_createdAt_idx" ON "wros"."CustomerMessage"("tenantId", "createdAt");
CREATE INDEX IF NOT EXISTS "MerchantChange_tenantId_status_createdAt_idx" ON "wros"."MerchantChange"("tenantId", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "MerchantActivity_tenantId_createdAt_idx" ON "wros"."MerchantActivity"("tenantId", "createdAt");
CREATE INDEX IF NOT EXISTS "MerchantActivity_userId_createdAt_idx" ON "wros"."MerchantActivity"("userId", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_number_key" ON "wros"."Invoice"("number");
CREATE INDEX IF NOT EXISTS "Invoice_tenantId_status_idx" ON "wros"."Invoice"("tenantId", "status");
CREATE INDEX IF NOT EXISTS "MarketingCampaign_tenantId_status_idx" ON "wros"."MarketingCampaign"("tenantId", "status");
CREATE INDEX IF NOT EXISTS "SocialPost_tenantId_status_scheduledAt_idx" ON "wros"."SocialPost"("tenantId", "status", "scheduledAt");
CREATE INDEX IF NOT EXISTS "MediaGeneration_tenantId_createdAt_idx" ON "wros"."MediaGeneration"("tenantId", "createdAt");
CREATE INDEX IF NOT EXISTS "DeliveryOperator_tenantId_status_idx" ON "wros"."DeliveryOperator"("tenantId", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "DeliveryOperator_tenantId_phone_key" ON "wros"."DeliveryOperator"("tenantId", "phone");
CREATE INDEX IF NOT EXISTS "DeliveryVehicle_tenantId_status_idx" ON "wros"."DeliveryVehicle"("tenantId", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "DeliveryVehicle_tenantId_registration_key" ON "wros"."DeliveryVehicle"("tenantId", "registration");
CREATE INDEX IF NOT EXISTS "DeliveryZone_tenantId_active_idx" ON "wros"."DeliveryZone"("tenantId", "active");
CREATE UNIQUE INDEX IF NOT EXISTS "DeliveryZone_tenantId_name_key" ON "wros"."DeliveryZone"("tenantId", "name");
CREATE INDEX IF NOT EXISTS "DeliveryAssignment_tenantId_status_idx" ON "wros"."DeliveryAssignment"("tenantId", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "DeliveryAssignment_tenantId_orderId_key" ON "wros"."DeliveryAssignment"("tenantId", "orderId");
CREATE INDEX IF NOT EXISTS "DeliveryNotification_tenantId_createdAt_idx" ON "wros"."DeliveryNotification"("tenantId", "createdAt");
CREATE INDEX IF NOT EXISTS "Event_tenantId_createdAt_idx" ON "wros"."Event"("tenantId", "createdAt");
CREATE INDEX IF NOT EXISTS "Event_tenantId_type_createdAt_idx" ON "wros"."Event"("tenantId", "type", "createdAt");
CREATE INDEX IF NOT EXISTS "Event_tenantId_source_type_createdAt_idx" ON "wros"."Event"("tenantId", "source", "type", "createdAt");
CREATE INDEX IF NOT EXISTS "Event_source_createdAt_idx" ON "wros"."Event"("source", "createdAt");
CREATE INDEX IF NOT EXISTS "Insight_tenantId_createdAt_idx" ON "wros"."Insight"("tenantId", "createdAt");
CREATE INDEX IF NOT EXISTS "Insight_type_createdAt_idx" ON "wros"."Insight"("type", "createdAt");
CREATE INDEX IF NOT EXISTS "Insight_source_createdAt_idx" ON "wros"."Insight"("source", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "LocationProfile_tenantId_key" ON "wros"."LocationProfile"("tenantId");

-- AddForeignKey (guarded)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'AuthSession')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'AuthSession' AND column_name = 'userId')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'AuthUser')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AuthSession_userId_fkey') THEN
    ALTER TABLE "wros"."AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "wros"."AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'PasswordReset')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'PasswordReset' AND column_name = 'userId')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'AuthUser')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PasswordReset_userId_fkey') THEN
    ALTER TABLE "wros"."PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "wros"."AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'Console')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'Console' AND column_name = 'merchantId')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'Merchant')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Console_merchantId_fkey') THEN
    ALTER TABLE "wros"."Console" ADD CONSTRAINT "Console_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "wros"."Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'Lead')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'Lead' AND column_name = 'customerId')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'Customer')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Lead_customerId_fkey') THEN
    ALTER TABLE "wros"."Lead" ADD CONSTRAINT "Lead_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "wros"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'SalesOrder')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'SalesOrder' AND column_name = 'customerId')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'Customer')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SalesOrder_customerId_fkey') THEN
    ALTER TABLE "wros"."SalesOrder" ADD CONSTRAINT "SalesOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "wros"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'CustomerMessage')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'CustomerMessage' AND column_name = 'customerId')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'Customer')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CustomerMessage_customerId_fkey') THEN
    ALTER TABLE "wros"."CustomerMessage" ADD CONSTRAINT "CustomerMessage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "wros"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- These two FKs reference the newly-restored AuthUser table from tables migrated earlier
-- (TenantInvitation, MessagingParticipant); only addable now that AuthUser exists.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'TenantInvitation')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'TenantInvitation' AND column_name = 'acceptedUserId')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'AuthUser')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TenantInvitation_acceptedUserId_fkey') THEN
    ALTER TABLE "wros"."TenantInvitation" ADD CONSTRAINT "TenantInvitation_acceptedUserId_fkey" FOREIGN KEY ("acceptedUserId") REFERENCES "wros"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'MessagingParticipant')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'wros' AND table_name = 'MessagingParticipant' AND column_name = 'userId')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'wros' AND table_name = 'AuthUser')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MessagingParticipant_userId_fkey') THEN
    ALTER TABLE "wros"."MessagingParticipant" ADD CONSTRAINT "MessagingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "wros"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
