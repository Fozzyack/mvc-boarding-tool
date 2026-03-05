ALTER TABLE "medications" ADD COLUMN "scheduleType" varchar(20) DEFAULT 'recurring' NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "intervalDays" integer;--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "timingType" varchar(20) DEFAULT 'slot' NOT NULL;--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "administrationTime" varchar(5);--> statement-breakpoint
ALTER TABLE "medications" ADD COLUMN "daySlot" varchar(20);--> statement-breakpoint
UPDATE "medications"
SET
    "scheduleType" = 'recurring',
    "intervalDays" = CASE
        WHEN "frequency" ~ '[0-9]+' THEN CAST(substring("frequency" from '([0-9]+)') AS integer)
        WHEN lower("frequency") LIKE '%week%' THEN 7
        ELSE 1
    END,
    "timingType" = 'slot',
    "daySlot" = 'morning';--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_scheduleType_check" CHECK ("scheduleType" IN ('recurring', 'one_off'));--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_intervalDays_check" CHECK ((("scheduleType" = 'one_off' AND "intervalDays" IS NULL) OR ("scheduleType" = 'recurring' AND "intervalDays" IS NOT NULL AND "intervalDays" >= 1)));--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_timingType_check" CHECK ("timingType" IN ('clock', 'slot'));--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_timing_fields_check" CHECK ((("timingType" = 'clock' AND "administrationTime" IS NOT NULL AND "daySlot" IS NULL) OR ("timingType" = 'slot' AND "daySlot" IS NOT NULL AND "administrationTime" IS NULL)));--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_daySlot_check" CHECK ("daySlot" IS NULL OR "daySlot" IN ('morning', 'night'));--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_administrationTime_check" CHECK ("administrationTime" IS NULL OR "administrationTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');--> statement-breakpoint
ALTER TABLE "medications" DROP COLUMN "frequency";--> statement-breakpoint
ALTER TABLE "medications" DROP COLUMN "administrationTimes";
