CREATE TABLE "wros"."TenantBrandProfile" (
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

CREATE UNIQUE INDEX "TenantBrandProfile_tenantId_key" ON "wros"."TenantBrandProfile"("tenantId");

CREATE TABLE "wros"."BrandedDocument" (
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

CREATE UNIQUE INDEX "BrandedDocument_tenantId_documentType_sourceId_key" ON "wros"."BrandedDocument"("tenantId", "documentType", "sourceId");
CREATE INDEX "BrandedDocument_tenantId_generatedAt_idx" ON "wros"."BrandedDocument"("tenantId", "generatedAt");
