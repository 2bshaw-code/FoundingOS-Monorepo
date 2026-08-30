-- CreateEnum
CREATE TYPE "BillingState" AS ENUM ('trial', 'active', 'past_due', 'cancelled');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "baseTier" TEXT,
ADD COLUMN     "billingState" "BillingState" NOT NULL DEFAULT 'trial',
ADD COLUMN     "hardwarePacks" JSONB,
ADD COLUMN     "industryPack" TEXT,
ADD COLUMN     "intelligenceOSActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pricingModel" TEXT,
ADD COLUMN     "quantumOSActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "usageAnomalyDetections" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageInsights" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageRiskModels" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageScenarioPacks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageSimulations" INTEGER NOT NULL DEFAULT 0;

