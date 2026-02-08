import { sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";
import db from "@/utils/db/drizzle";
import { boardersTable } from "@/utils/db/schema";
import { eq, and } from "drizzle-orm";
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
        .where(
            and(
                eq(boardersTable.isActive, true),
                eq(boardersTable.organisationId, session.organisationId),
            ),
        );

    console.log(query);
    return NextResponse.json({msg: "Success", boarders: query});
};
