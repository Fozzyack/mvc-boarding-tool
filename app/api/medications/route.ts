import { sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";
import db from "@/db/drizzle";
import { boardersTable, medicationTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const session = (await getSession()) as sessionPayload;
        const rawIsOneOff = body.isOneOff;
        let isOneOff: boolean;

        if (rawIsOneOff === true || rawIsOneOff === "true" || rawIsOneOff === 1 || rawIsOneOff === "1") {
            isOneOff = true;
        } else if (
            rawIsOneOff === false ||
            rawIsOneOff === "false" ||
            rawIsOneOff === 0 ||
            rawIsOneOff === "0" ||
            rawIsOneOff === null ||
            rawIsOneOff === undefined
        ) {
            isOneOff = false;
        } else {
            return NextResponse.json(
                { msg: "Invalid isOneOff value" },
                { status: 400 },
            );
        }

        const scheduleType = isOneOff ? "one_off" : "recurring";
        const timingType = body.timingType;
        const intervalDays =
            body.intervalDays === null || body.intervalDays === undefined || body.intervalDays === ""
                ? null
                : Number(body.intervalDays);

        if (!session) {
            return NextResponse.json(
                { msg: "Cannot complete this action: unAuthorized" },
                { status: 401 },
            );
        }

        if (
            !body.boarderId ||
            !body.name ||
            !body.dosage ||
            !body.startDate
        ) {
            return NextResponse.json(
                { msg: "Missing required medication fields" },
                { status: 400 },
            );
        }

        if (
            !isOneOff &&
            (typeof intervalDays !== "number" || !Number.isInteger(intervalDays) || intervalDays < 1)
        ) {
            return NextResponse.json(
                { msg: "Recurring medications need a valid day interval" },
                { status: 400 },
            );
        }

        if (isOneOff && intervalDays !== null) {
            return NextResponse.json(
                { msg: "One-off medications cannot include an interval" },
                { status: 400 },
            );
        }

        if (timingType !== "clock" && timingType !== "slot") {
            return NextResponse.json(
                { msg: "Invalid timing type" },
                { status: 400 },
            );
        }

        const administrationTime = timingType === "clock" ? body.administrationTime : null;
        const daySlot = timingType === "slot" ? body.daySlot : null;

        if (timingType === "clock") {
            const validTime =
                typeof administrationTime === "string" &&
                /^([01]\d|2[0-3]):([0-5]\d)$/.test(administrationTime);
            if (!validTime) {
                return NextResponse.json(
                    { msg: "Invalid administration time" },
                    { status: 400 },
                );
            }
        }

        if (timingType === "slot" && daySlot !== "morning" && daySlot !== "night") {
            return NextResponse.json(
                { msg: "Day slot must be morning or night" },
                { status: 400 },
            );
        }

        const boarder = await db
            .select({ id: boardersTable.id })
            .from(boardersTable)
            .where(
                and(
                    eq(boardersTable.id, body.boarderId),
                    eq(boardersTable.organisationId, session.organisationId),
                ),
            )
            .limit(1);

        if (boarder.length === 0) {
            return NextResponse.json(
                { msg: "Cannot complete this action: forbidden" },
                { status: 403 },
            );
        }

        await db.insert(medicationTable).values({
            boarderId: body.boarderId,
            name: body.name,
            dosage: body.dosage,
            scheduleType,
            intervalDays,
            timingType,
            administrationTime,
            daySlot,
            startDate: body.startDate,
            endDate: body.endDate || null,
            instructions: body.instructions || null,
            organisationId: session.organisationId,
            administeredBy: session.userId,
        });

        return NextResponse.json({ msg: "Success" });
    } catch (error) {
        console.error("Error creating medication:", error);
        return NextResponse.json(
            { msg: "Failed to create medication" },
            { status: 500 },
        );
    }
};
