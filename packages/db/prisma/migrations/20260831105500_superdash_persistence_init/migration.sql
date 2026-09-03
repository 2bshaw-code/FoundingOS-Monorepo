-- CreateTable
CREATE TABLE "survey_entries" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tester" TEXT,
    "responses" JSONB NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tester_sessions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "moduleLabel" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentAnswers" JSONB NOT NULL,
    "runs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tester_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anomaly_logs" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anomaly_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engagement_logs" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "submissionCount" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engagement_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_metrics" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "survey_entries_category_idx" ON "survey_entries"("category");

-- CreateIndex
CREATE INDEX "survey_entries_brand_idx" ON "survey_entries"("brand");

-- CreateIndex
CREATE INDEX "anomaly_logs_category_idx" ON "anomaly_logs"("category");

-- CreateIndex
CREATE INDEX "engagement_logs_category_idx" ON "engagement_logs"("category");

-- CreateIndex
CREATE INDEX "brand_metrics_brand_idx" ON "brand_metrics"("brand");

