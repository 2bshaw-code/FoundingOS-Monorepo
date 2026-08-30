-- CreateEnum
CREATE TYPE "SurveyType" AS ENUM ('customer', 'buyer', 'investor');

-- CreateEnum
CREATE TYPE "SurveySentiment" AS ENUM ('positive', 'neutral', 'negative');

-- CreateTable
CREATE TABLE "SurveyResult" (
    "id" TEXT NOT NULL,
    "type" "SurveyType" NOT NULL,
    "userId" TEXT,
    "subscriptionId" TEXT,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "insight" TEXT NOT NULL,
    "risk" TEXT NOT NULL,
    "opportunity" TEXT NOT NULL,
    "sentiment" "SurveySentiment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SurveyResult_userId_idx" ON "SurveyResult"("userId");

-- CreateIndex
CREATE INDEX "SurveyResult_subscriptionId_idx" ON "SurveyResult"("subscriptionId");

-- CreateIndex
CREATE INDEX "SurveyResult_type_idx" ON "SurveyResult"("type");

-- AddForeignKey
ALTER TABLE "SurveyResult" ADD CONSTRAINT "SurveyResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResult" ADD CONSTRAINT "SurveyResult_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

