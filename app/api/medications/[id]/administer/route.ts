import db from "@/db/drizzle";
import { medicationAdministrationLogTable, medicationTable } from "@/db/schema";
import { sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";
import getMedicationDueAt from "@/utils/medications/getMedicationDueAt";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const isValidAction = (value: unknown): value is "administered" | "skipped" | "missed" => {
    return value === "administered" || value === "skipped" || value === "missed";
};

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    try {
        const { id } = await params;
        const session = (await getSession()) as sessionPayload;
        if (!session) {
            return NextResponse.json(
                { msg: "Cannot complete this action: unAuthorized" },
                { status: 401 },
            );
        }

        const body = await req.json().catch(() => ({}));
        if (!isValidAction(body.actionType)) {
            return NextResponse.json(
                { msg: "Invalid action type" },
                { status: 400 },
            );
        }

        const actionType = body.actionType;
        const notes = typeof body.notes === "string" && body.notes.trim().length > 0
            ? body.notes.trim()
            : null;

        const [medication] = await db
            .select()
            .from(medicationTable)
            .where(
                and(
                    eq(medicationTable.id, id),
                    eq(medicationTable.organisationId, session.organisationId),
                    eq(medicationTable.isActive, true),
                ),
            )
            .limit(1);

        if (!medication) {
            return NextResponse.json(
                { msg: "Medication not found" },
                { status: 404 },
            );
        }

        const now = new Date();
        const scheduledFor = getMedicationDueAt(
            {
                scheduleType: medication.scheduleType as "recurring" | "one_off",
                intervalDays: medication.intervalDays,
                timingType: medication.timingType as "clock" | "slot",
                administrationTime: medication.administrationTime,
                daySlot: medication.daySlot as "morning" | "night" | null,
                startDate: medication.startDate,
                endDate: medication.endDate,
                lastAdministeredAt: medication.lastAdministeredAt,
            },
            now,
        );

        await db.transaction(async (tx) => {
            await tx.insert(medicationAdministrationLogTable).values({
                medicationId: medication.id,
                boarderId: medication.boarderId,
                organisationId: session.organisationId,
                actionType,
                scheduledFor: scheduledFor || now,
                performedBy: session.userId,
                notes,
            });

            if (actionType === "administered") {
                await tx
                    .update(medicationTable)
                    .set({
                        lastAdministeredAt: now,
                        administeredBy: session.userId,
                    })
                    .where(eq(medicationTable.id, medication.id));
            }
        });

        return NextResponse.json({ msg: "Success" });
    } catch (error) {
        console.error("Error administering medication:", error);
        return NextResponse.json(
            { msg: "Failed to administer medication" },
            { status: 500 },
        );
    }
};
