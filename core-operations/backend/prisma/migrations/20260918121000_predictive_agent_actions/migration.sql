ALTER TABLE "wros"."AgentAction"
  ADD COLUMN "predictiveSignals" JSONB,
  ADD COLUMN "simulationPreview" JSONB,
  ADD COLUMN "outcomeSummary" TEXT;
