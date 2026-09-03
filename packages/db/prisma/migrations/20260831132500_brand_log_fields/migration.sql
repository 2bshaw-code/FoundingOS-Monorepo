-- AlterTable
ALTER TABLE "anomaly_logs" ADD COLUMN     "brandName" TEXT,
ADD COLUMN     "categoryBreakdown" JSONB,
ADD COLUMN     "totalEngagement" INTEGER,
ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "engagement_logs" ADD COLUMN     "brandName" TEXT,
ADD COLUMN     "categoryBreakdown" JSONB,
ADD COLUMN     "totalEngagement" INTEGER,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "submissionCount" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "anomaly_logs_brandName_idx" ON "anomaly_logs"("brandName");

-- CreateIndex
CREATE INDEX "engagement_logs_brandName_idx" ON "engagement_logs"("brandName");

