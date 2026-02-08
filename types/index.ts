import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { businessTable, usersTable, boardersTable, medicationTable } from "@/utils/db/schema";

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
