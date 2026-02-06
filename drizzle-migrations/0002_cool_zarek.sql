CREATE TABLE "boarders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"animalType" varchar(63) NOT NULL,
	"species" varchar(63) NOT NULL,
	"dateOfBirth" date,
	"weight" numeric(10, 2) NOT NULL,
	"ownerName" varchar(255) NOT NULL,
	"ownerPhone" varchar(63) NOT NULL,
	"ownerEmail" varchar(255),
	"medicalNotes" text,
	"allergies" text,
	"feedingInstructions" text,
	"specialCareInstructions" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"organisationId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "boarders_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "boarders" ADD CONSTRAINT "boarders_organisationId_businesses_id_fk" FOREIGN KEY ("organisationId") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;