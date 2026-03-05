CREATE TABLE "medication_administration_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medicationId" uuid NOT NULL,
	"boarderId" uuid NOT NULL,
	"organisationId" uuid NOT NULL,
	"actionType" varchar(20) NOT NULL,
	"scheduledFor" timestamp NOT NULL,
	"performedBy" uuid,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "medication_administration_logs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "medication_administration_logs" ADD CONSTRAINT "medication_administration_logs_medicationId_medications_id_fk" FOREIGN KEY ("medicationId") REFERENCES "public"."medications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_administration_logs" ADD CONSTRAINT "medication_administration_logs_boarderId_boarders_id_fk" FOREIGN KEY ("boarderId") REFERENCES "public"."boarders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_administration_logs" ADD CONSTRAINT "medication_administration_logs_organisationId_businesses_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_administration_logs" ADD CONSTRAINT "medication_administration_logs_performedBy_users_id_fk" FOREIGN KEY ("performedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;