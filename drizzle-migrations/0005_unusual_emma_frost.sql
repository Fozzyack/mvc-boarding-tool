ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isNew" boolean DEFAULT true NOT NULL;