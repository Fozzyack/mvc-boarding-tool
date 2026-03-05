ALTER TABLE "users" DROP CONSTRAINT "users_code_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "code" SET NOT NULL;