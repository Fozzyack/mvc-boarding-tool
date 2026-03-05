ALTER TABLE "boarders" ALTER COLUMN "organisationId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ALTER COLUMN "organisationId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "scheduleType" varchar(20) DEFAULT 'recurring' NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "intervalDays" integer;--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "timingType" varchar(20) DEFAULT 'slot' NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "administrationTime" varchar(5);--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "daySlot" varchar(20);--> statement-breakpoint
ALTER TABLE "medications" DROP COLUMN "frequency";--> statement-breakpoint
ALTER TABLE "medications" DROP COLUMN "administrationTimes";