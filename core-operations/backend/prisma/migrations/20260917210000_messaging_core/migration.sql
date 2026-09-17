CREATE TABLE "wros"."MessagingChannelConnection" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "displayName" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessagingChannelConnection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "wros"."MessagingParticipant" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "displayName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'operator',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessagingParticipant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "wros"."MessagingConversation" (
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

CREATE TABLE "wros"."MessagingMessage" (
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

CREATE UNIQUE INDEX "MessagingChannelConnection_channel_externalAccountId_key"
ON "wros"."MessagingChannelConnection"("channel", "externalAccountId");
CREATE INDEX "MessagingChannelConnection_tenantId_channel_idx"
ON "wros"."MessagingChannelConnection"("tenantId", "channel");

CREATE UNIQUE INDEX "MessagingParticipant_tenantId_channel_address_key"
ON "wros"."MessagingParticipant"("tenantId", "channel", "address");
CREATE INDEX "MessagingParticipant_tenantId_active_idx"
ON "wros"."MessagingParticipant"("tenantId", "active");

CREATE UNIQUE INDEX "MessagingConversation_tenantId_channel_externalConversationId_key"
ON "wros"."MessagingConversation"("tenantId", "channel", "externalConversationId");
CREATE INDEX "MessagingConversation_tenantId_lastMessageAt_idx"
ON "wros"."MessagingConversation"("tenantId", "lastMessageAt");

CREATE UNIQUE INDEX "MessagingMessage_providerMessageId_key"
ON "wros"."MessagingMessage"("providerMessageId");
CREATE INDEX "MessagingMessage_tenantId_createdAt_idx"
ON "wros"."MessagingMessage"("tenantId", "createdAt");
CREATE INDEX "MessagingMessage_conversationId_createdAt_idx"
ON "wros"."MessagingMessage"("conversationId", "createdAt");

ALTER TABLE "wros"."MessagingMessage"
ADD CONSTRAINT "MessagingMessage_conversationId_fkey"
FOREIGN KEY ("conversationId") REFERENCES "wros"."MessagingConversation"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
