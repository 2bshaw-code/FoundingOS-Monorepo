CREATE TABLE IF NOT EXISTS "founder_expenses" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "gmailAccount" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "invoiceDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "founder_expenses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "founder_expenses_ownerId_gmailAccount_messageId_key"
ON "founder_expenses"("ownerId", "gmailAccount", "messageId");

CREATE INDEX IF NOT EXISTS "founder_expenses_ownerId_invoiceDate_idx"
ON "founder_expenses"("ownerId", "invoiceDate");
