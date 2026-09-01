-- CreateTable
CREATE TABLE "brand_subscriptions" (
    "id" TEXT NOT NULL,
    "brandSlug" TEXT NOT NULL,
    "baseTier" TEXT,
    "industryPack" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mrr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "arr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "status" TEXT NOT NULL DEFAULT 'none',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_subscriptions_brandSlug_key" ON "brand_subscriptions"("brandSlug");

-- CreateTable
CREATE TABLE "crm_deals" (
    "id" TEXT NOT NULL,
    "brandSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'New',
    "dealValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "expectedValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "probabilityWeightedValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "owner" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_deals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "crm_deals_brandSlug_idx" ON "crm_deals"("brandSlug");

-- CreateTable
CREATE TABLE "brand_finances" (
    "id" TEXT NOT NULL,
    "brandSlug" TEXT NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_finances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_finances_brandSlug_key" ON "brand_finances"("brandSlug");

-- CreateTable
CREATE TABLE "accounting_invoices" (
    "id" TEXT NOT NULL,
    "brandSlug" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outstandingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounting_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accounting_invoices_brandSlug_idx" ON "accounting_invoices"("brandSlug");
