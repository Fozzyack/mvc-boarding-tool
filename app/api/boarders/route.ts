import { BoarderWithMedications, sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";
import db from "@/db/drizzle";
import {
    boardersTable,
    businessTable,
    medicationAdministrationLogTable,
    medicationTable,
    usersTable,
} from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const session = (await getSession()) as sessionPayload;
        if (!session) {
            console.log("No JWT token found");
            return NextResponse.json(
                { msg: "Cannot complete this action: unAuthorized" },
                { status: 401 },
            );
        }

        const [org] = await db
            .select({ id: businessTable.id })
            .from(businessTable)
            .where(eq(businessTable.id, session.organisationId))
            .limit(1);

        const [user] = await db
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(
                and(
                    eq(usersTable.id, session.userId),
                    eq(usersTable.organisationId, session.organisationId),
                ),
            )
            .limit(1);

        if (!org || !user) {
            return NextResponse.json(
                { msg: "Session is out of date. Please log in again." },
                { status: 401 },
            );
        }

        await db.insert(boardersTable).values({
            name: body.name,
            animalType: body.animalType,
            species: body.species || null,
            dateOfBirth: body.dateOfBirth || null,
            weight: body.weight ? String(body.weight) : null,
            ownerName: body.ownerName,
            ownerPhone: body.ownerPhone,
            ownerEmail: body.ownerEmail || null,
            medicalNotes: body.medicalNotes || null,
            allergies: body.allergies || null,
            feedingInstructions: body.feedingInstructions || null,
            specialCareInstructions: body.specialCareInstructions || null,
            startDate: body.startDate,
            endDate: body.endDate,
            organisationId: session.organisationId,
            createdBy: session.userId,
        });

        return NextResponse.json({ msg: "Success" });
    } catch (error) {
        console.error("Error inserting boarder:", error);
        return NextResponse.json(
            { msg: "Failed to create boarder" },
            { status: 500 },
        );
    }
};

export const GET = async () => {
    const session = (await getSession()) as sessionPayload;
    if (!session) {
        console.log("No JWT token found");
        return NextResponse.json(
            { msg: "Cannot complete this action: unAuthorized" },
            { status: 401 },
        );
    }

    const query = await db
        .select()
        .from(boardersTable)
        .leftJoin(
            medicationTable,
            eq(boardersTable.id, medicationTable.boarderId),
        )
        .where(
            and(
                eq(boardersTable.isActive, true),
                eq(boardersTable.organisationId, session.organisationId),
            ),
        );

    const logs = await db
        .select({
            medicationId: medicationAdministrationLogTable.medicationId,
            actionType: medicationAdministrationLogTable.actionType,
            scheduledFor: medicationAdministrationLogTable.scheduledFor,
            createdAt: medicationAdministrationLogTable.createdAt,
        })
        .from(medicationAdministrationLogTable)
        .where(eq(medicationAdministrationLogTable.organisationId, session.organisationId))
        .orderBy(desc(medicationAdministrationLogTable.createdAt));

    const latestLogByMedicationId = new Map<string, (typeof logs)[number]>();
    for (const log of logs) {
        if (!latestLogByMedicationId.has(log.medicationId)) {
            latestLogByMedicationId.set(log.medicationId, log);
        }
    }

    const boardersMap = new Map<string, BoarderWithMedications>();
    for (const row of query) {
        if (!boardersMap.has(row.boarders.id)) {
            boardersMap.set(row.boarders.id, {
                ...row.boarders,
                medications: [],
            });
        }

        const boarderEntry = boardersMap.get(row.boarders.id);
        if (!boarderEntry) {
            continue;
        }

        if (row.medications) {
            const latestLog = latestLogByMedicationId.get(row.medications.id);
            boarderEntry.medications.push({
                id: row.medications.id,
                name: row.medications.name,
                dosage: row.medications.dosage,
                scheduleType: row.medications.scheduleType as "recurring" | "one_off",
                intervalDays: row.medications.intervalDays,
                timingType: row.medications.timingType as "clock" | "slot",
                administrationTime: row.medications.administrationTime,
                daySlot: row.medications.daySlot as "morning" | "night" | null,
                startDate: String(row.medications.startDate),
                endDate: row.medications.endDate ? String(row.medications.endDate) : null,
                instructions: row.medications.instructions,
                administeredBy: row.medications.administeredBy,
                lastAdministeredAt: row.medications.lastAdministeredAt
                    ? String(row.medications.lastAdministeredAt)
                    : null,
                latestLogAction: latestLog
                    ? (latestLog.actionType as "administered" | "skipped" | "missed")
                    : null,
                latestLogScheduledFor: latestLog?.scheduledFor
                    ? String(latestLog.scheduledFor)
                    : null,
                latestLogCreatedAt: latestLog?.createdAt
                    ? String(latestLog.createdAt)
                    : null,
            });
        }
    }
    const payload = Array.from(boardersMap.values());

    return NextResponse.json({ msg: "Success", boarders: payload });
};
