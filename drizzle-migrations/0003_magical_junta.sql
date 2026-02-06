ALTER TABLE "users" RENAME COLUMN "username" TO "code";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_code_unique" UNIQUE("code");