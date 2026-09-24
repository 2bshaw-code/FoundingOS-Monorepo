-- Phase 35: real message delivery/read status + sender tracking + inbound media storage,
-- plus lead/customer assignment and tagging for console bulk actions and per-agent analytics.

-- CustomerMessage: honest send lifecycle (sent/delivered/read/failed for outbound,
-- received for inbound), the WhatsApp provider message ID to match later status
-- webhooks back to a row, and which FoundingOS user sent it.
ALTER TABLE "wros"."CustomerMessage" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'sent';
ALTER TABLE "wros"."CustomerMessage" ADD COLUMN "providerMessageId" TEXT;
ALTER TABLE "wros"."CustomerMessage" ADD COLUMN "senderUserId" TEXT;
ALTER TABLE "wros"."CustomerMessage" ADD COLUMN "mediaUrl" TEXT;
ALTER TABLE "wros"."CustomerMessage" ADD COLUMN "mediaType" TEXT;

-- Existing inbound rows predate this column; correct their status from the default
-- "sent" (which only makes sense for outbound) to "received".
UPDATE "wros"."CustomerMessage" SET "status" = 'received' WHERE "direction" = 'inbound';

CREATE UNIQUE INDEX "CustomerMessage_providerMessageId_key" ON "wros"."CustomerMessage"("providerMessageId");
CREATE INDEX "CustomerMessage_senderUserId_idx" ON "wros"."CustomerMessage"("senderUserId");
ALTER TABLE "wros"."CustomerMessage" ADD CONSTRAINT "CustomerMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "wros"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Lead: bulk assign + tag support.
ALTER TABLE "wros"."Lead" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "wros"."Lead" ADD COLUMN "assignedUserId" TEXT;
CREATE INDEX "Lead_assignedUserId_idx" ON "wros"."Lead"("assignedUserId");
ALTER TABLE "wros"."Lead" ADD CONSTRAINT "Lead_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "wros"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Customer: same bulk assign + tag support.
ALTER TABLE "wros"."Customer" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "wros"."Customer" ADD COLUMN "assignedUserId" TEXT;
CREATE INDEX "Customer_assignedUserId_idx" ON "wros"."Customer"("assignedUserId");
ALTER TABLE "wros"."Customer" ADD CONSTRAINT "Customer_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "wros"."AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
