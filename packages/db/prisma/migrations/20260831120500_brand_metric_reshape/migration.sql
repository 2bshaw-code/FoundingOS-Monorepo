-- DropIndex
DROP INDEX "brand_metrics_brand_idx";

-- AlterTable
ALTER TABLE "brand_metrics" DROP COLUMN "brand",
DROP COLUMN "metric",
DROP COLUMN "recordedAt",
DROP COLUMN "value",
ADD COLUMN     "anomalyScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "brandName" TEXT NOT NULL,
ADD COLUMN     "categoryBreakdown" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalEngagement" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "brand_metrics_brandName_key" ON "brand_metrics"("brandName");

