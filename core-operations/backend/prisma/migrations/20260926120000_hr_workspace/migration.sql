-- Talent/HR split: Talent is now recruitment, HR is people management.
-- Every tenant that had Talent keeps the HR features it already used.
INSERT INTO "wros"."TenantWorkspace" ("id", "tenantId", "workspace", "enabled", "plan", "modules", "createdAt", "updatedAt")
SELECT 'hr_' || md5(random()::text || "tenantId"), "tenantId", 'hr', "enabled", "plan", '[]'::jsonb, NOW(), NOW()
FROM "wros"."TenantWorkspace"
WHERE "workspace" = 'talent'
ON CONFLICT ("tenantId", "workspace") DO NOTHING;

-- People-management records now live in the HR workspace.
UPDATE "wros"."WorkspaceRecord"
SET "workspace" = 'hr'
WHERE "workspace" = 'talent'
  AND "module" IN ('onboarding', 'people', 'performance', 'time-off', 'learning', 'payroll', 'engagement');
