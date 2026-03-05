CREATE TABLE "boarders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"animalType" varchar(63) NOT NULL,
	"species" varchar(63),
	"dateOfBirth" date,
	"weight" numeric(10, 2),
	"ownerName" varchar(255) NOT NULL,
	"ownerPhone" varchar(63) NOT NULL,
	"ownerEmail" varchar(255),
	"medicalNotes" text,
	"allergies" text,
	"feedingInstructions" text,
	"specialCareInstructions" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL,
	"organisationId" uuid NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "boarders_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"organisationCode" varchar(63) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "businesses_id_unique" UNIQUE("id"),
	CONSTRAINT "businesses_name_unique" UNIQUE("name"),
	CONSTRAINT "businesses_organisationCode_unique" UNIQUE("organisationCode")
);
--> statement-breakpoint
CREATE TABLE "medications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"dosage" varchar(100) NOT NULL,
	"scheduleType" varchar(20) DEFAULT 'recurring' NOT NULL,
	"intervalDays" integer,
	"timingType" varchar(20) DEFAULT 'slot' NOT NULL,
	"administrationTime" varchar(5),
	"daySlot" varchar(20),
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
	"organisationId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "medications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"passwordHash" varchar(300) NOT NULL,
	"code" varchar(255) NOT NULL,
	"isAdmin" boolean DEFAULT false NOT NULL,
	"isNew" boolean DEFAULT true NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"organisationId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_code_organisation_unique" UNIQUE("code","organisationId")
);
--> statement-breakpoint
ALTER TABLE "boarders" ADD CONSTRAINT "boarders_organisationId_businesses_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boarders" ADD CONSTRAINT "boarders_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_administeredBy_users_id_fk" FOREIGN KEY ("administeredBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_boarderId_boarders_id_fk" FOREIGN KEY ("boarderId") REFERENCES "public"."boarders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_organisationId_businesses_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organisationId_businesses_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;