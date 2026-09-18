-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core_intelligence";

-- CreateTable
CREATE TABLE "core_intelligence"."AuthUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "tenantId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_intelligence"."AuthSession" (
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
CREATE TABLE "core_intelligence"."PasswordReset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_intelligence"."MarketplaceMerchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wrosMerchantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceMerchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_intelligence"."Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_intelligence"."IntelligenceForecastSnapshot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "horizonDays" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "baselineValue" DOUBLE PRECISION NOT NULL,
    "projectedValue" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "evidence" JSONB NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntelligenceForecastSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_intelligence"."IntelligenceScenario" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assumptions" JSONB NOT NULL,
    "baselineMetrics" JSONB NOT NULL,
    "projectedMetrics" JSONB NOT NULL,
    "deltaSummary" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntelligenceScenario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "core_intelligence"."AuthUser"("email");

-- CreateIndex
CREATE INDEX "AuthSession_userId_idx" ON "core_intelligence"."AuthSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_tokenHash_key" ON "core_intelligence"."PasswordReset"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordReset_userId_idx" ON "core_intelligence"."PasswordReset"("userId");

-- CreateIndex
CREATE INDEX "IntelligenceForecastSnapshot_tenantId_metric_createdAt_idx" ON "core_intelligence"."IntelligenceForecastSnapshot"("tenantId", "metric", "createdAt");

-- CreateIndex
CREATE INDEX "IntelligenceScenario_tenantId_createdAt_idx" ON "core_intelligence"."IntelligenceScenario"("tenantId", "createdAt");

-- AddForeignKey
ALTER TABLE "core_intelligence"."AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_intelligence"."AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_intelligence"."PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core_intelligence"."AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_intelligence"."Product" ADD CONSTRAINT "Product_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "core_intelligence"."MarketplaceMerchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
