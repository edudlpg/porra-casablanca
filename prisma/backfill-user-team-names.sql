UPDATE "User"
SET "teamName" = COALESCE("teamName", "username", "name")
WHERE "teamName" IS NULL;
