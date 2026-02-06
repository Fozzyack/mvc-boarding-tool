import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";
import { boolean, date, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

/*
 * Schema information for all the tables.
 */

// Business for which everything belongs to.
export const busniessTable = pgTable("businesses", {
    id: uuid().primaryKey().unique().defaultRandom(),
    name: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull(),
});

// Individual user emails (used to log in) Each user should belong to a business
// Though business may just decide to use their business email which also needs to be put in this table
export const usersTable = pgTable("users", {
    id: uuid().primaryKey().unique().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    passwordHash: varchar({ length: 300 }).notNull(),
    code: varchar({ length: 255 }).unique(),
    isAdmin: boolean().default(false).notNull(),
    isNew: boolean().default(true).notNull(),
    isActive: boolean().default(true).notNull(),
    organisationId: uuid().references(() => busniessTable.id),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
        .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});
