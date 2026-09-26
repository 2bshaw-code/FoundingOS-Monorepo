-- Talent/HR split: Talent is now recruitment, HR is people management.
-- Every tenant that had Talent keeps the HR features it already used.
INSERT INTO "wros"."TenantWorkspace" ("id", "tenantId", "workspace", "enabled", "plan", "modules", "createdAt", "updatedAt")
SELECT 'hr_' || md5(random()::text || "tenantId"), "tenantId", 'hr', "enabled", "plan", '[]'::jsonb, NOW(), NOW()
FROM "wros"."TenantWorkspace"
WHERE "workspace" = 'talent'
ON CONFLICT ("tenantId", "workspace") DO NOTHING;
