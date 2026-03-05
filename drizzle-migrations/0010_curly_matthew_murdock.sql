ALTER TABLE "users" ALTER COLUMN "organisationId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_code_organisation_unique" UNIQUE("code","organisationId");