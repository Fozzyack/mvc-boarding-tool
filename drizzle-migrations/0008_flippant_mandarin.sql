ALTER TABLE "businesses" ADD COLUMN "organisationCode" varchar(63);--> statement-breakpoint
UPDATE "businesses"
SET "organisationCode" = COALESCE(
    NULLIF(
        UPPER(SUBSTRING(REGEXP_REPLACE("name", '[^A-Za-z0-9]+', '', 'g') FROM 1 FOR 8)),
        ''
    ),
    'ORG'
) || '-' || UPPER(SUBSTRING("id"::text FROM 1 FOR 4))
WHERE "organisationCode" IS NULL;--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "organisationCode" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_organisationCode_unique" UNIQUE("organisationCode");
