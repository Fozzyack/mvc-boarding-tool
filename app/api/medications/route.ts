import { sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";
import db from "@/db/drizzle";
import { medicationTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const session = (await getSession()) as sessionPayload;

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
            !body.frequency ||
            !body.startDate
        ) {
            return NextResponse.json(
                { msg: "Missing required medication fields" },
                { status: 400 },
            );
        }

        await db.insert(medicationTable).values({
            boarderId: body.boarderId,
            name: body.name,
            dosage: body.dosage,
            frequency: body.frequency,
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
