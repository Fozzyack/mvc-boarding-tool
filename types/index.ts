import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
    businessTable,
    usersTable,
    boardersTable,
    medicationTable,
    medicationAdministrationLogTable,
} from "@/db/schema";

export type sessionPayload = {
    userId: string;
    organisationId: string;
    name: string;
    isAdmin: boolean;
} | null;


// Types from drizzle orm
export type Business = InferSelectModel<typeof businessTable>;
export type InsertBusiness = InferInsertModel<typeof businessTable>;

export type User = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;

export type Boarder = InferSelectModel<typeof boardersTable>;
export type InsertBoarder = InferInsertModel<typeof boardersTable>;

export type Medication = InferSelectModel<typeof medicationTable>;
export type InsertMedication = InferInsertModel<typeof medicationTable>;

export type MedicationAdministrationLog = InferSelectModel<typeof medicationAdministrationLogTable>;
export type InsertMedicationAdministrationLog = InferInsertModel<typeof medicationAdministrationLogTable>;

export type MedicationLogAction = "administered" | "skipped" | "missed";

export interface BoarderMedicationSummary {
    id: string;
    name: string;
    dosage: string;
    scheduleType: "recurring" | "one_off";
    intervalDays: number | null;
    timingType: "clock" | "slot";
    administrationTime: string | null;
    daySlot: "morning" | "night" | null;
    startDate: string;
    endDate: string | null;
    instructions: string | null;
    administeredBy: string | null;
    lastAdministeredAt: string | null;
    latestLogAction: MedicationLogAction | null;
    latestLogScheduledFor: string | null;
    latestLogCreatedAt: string | null;
}

export interface BoarderWithMedications extends Boarder {
    medications: BoarderMedicationSummary[];
}

export type CalendarMedicationStatus =
    | "due_now"
    | "due_soon"
    | "scheduled"
    | "overdue"
    | "completed"
    | "skipped"
    | "missed";

export interface CalendarStay {
    boarderId: string;
    boarderName: string;
    ownerName: string | null;
    startDate: string;
    endDate: string;
}

export interface CalendarMedicationEvent {
    id: string;
    medicationId: string;
    boarderId: string;
    boarderName: string;
    ownerName: string | null;
    medicationName: string;
    dosage: string;
    scheduledFor: string;
    status: CalendarMedicationStatus;
    timingLabel: string;
    scheduleLabel: string;
}

export interface CalendarResponsePayload {
    from: string;
    to: string;
    stays: CalendarStay[];
    medicationEvents: CalendarMedicationEvent[];
}
