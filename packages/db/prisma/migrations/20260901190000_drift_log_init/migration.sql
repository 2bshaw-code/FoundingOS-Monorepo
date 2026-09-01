-- CreateTable
CREATE TABLE "drift_logs" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "app" TEXT,
    "path" TEXT,
    "message" TEXT NOT NULL,
    "detail" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drift_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "drift_logs_runId_idx" ON "drift_logs"("runId");

-- CreateIndex
CREATE INDEX "drift_logs_kind_idx" ON "drift_logs"("kind");
