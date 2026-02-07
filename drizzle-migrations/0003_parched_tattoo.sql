CREATE TABLE "medications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"dosage" varchar(100) NOT NULL,
	"frequency" varchar(63) NOT NULL,
	"administrationTimes" text,
	"startDate" date NOT NULL,
	"endDate" date,
	"instructions" text,
	"prescribedBy" varchar(255),
	"refillsRemaining" numeric(3, 0),
	"sideEffectsToWatch" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"notes" text,
	"administeredBy" uuid,
	"lastAdministeredAt" timestamp,
	"boarderId" uuid NOT NULL,
	"organisationId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "medications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_administeredBy_users_id_fk" FOREIGN KEY ("administeredBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_boarderId_boarders_id_fk" FOREIGN KEY ("boarderId") REFERENCES "public"."boarders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_organisationId_businesses_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;