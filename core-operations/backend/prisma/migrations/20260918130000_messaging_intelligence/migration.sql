ALTER TABLE "wros"."MessagingParticipant"
ADD COLUMN "userId" TEXT;

CREATE INDEX "MessagingParticipant_userId_idx"
ON "wros"."MessagingParticipant"("userId");

ALTER TABLE "wros"."MessagingParticipant"
ADD CONSTRAINT "MessagingParticipant_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "wros"."AuthUser"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
