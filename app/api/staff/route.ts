import bcrypt from "bcrypt";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import type { sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";

interface AdminContext {
    organisationId: string;
    userId: string;
}

const normalizeCode = (value: unknown): string => {
    return typeof value === "string" ? value.trim().toUpperCase() : "";
};

const getTrimmed = (value: unknown): string => {
    return typeof value === "string" ? value.trim() : "";
};

const unauthorizedResponse = () => {
    return NextResponse.json({ msg: "Cannot complete this action: unAuthorized" }, { status: 401 });
};

const forbiddenResponse = () => {
    return NextResponse.json({ msg: "Cannot complete this action: forbidden" }, { status: 403 });
};

const requireAdminContext = async (): Promise<
    { ok: true; context: AdminContext } | { ok: false; response: NextResponse }
> => {
    const session = (await getSession()) as sessionPayload;
    if (!session) {
        return { ok: false, response: unauthorizedResponse() };
    }

    const [user] = await db
        .select({
            id: usersTable.id,
            isAdmin: usersTable.isAdmin,
            isActive: usersTable.isActive,
        })
        .from(usersTable)
        .where(
            and(
                eq(usersTable.id, session.userId),
                eq(usersTable.organisationId, session.organisationId),
            ),
        )
        .limit(1);

    if (!user || !user.isActive) {
        return { ok: false, response: unauthorizedResponse() };
    }

    if (!user.isAdmin) {
        return { ok: false, response: forbiddenResponse() };
    }

    return {
        ok: true,
        context: {
            organisationId: session.organisationId,
            userId: session.userId,
        },
    };
};

export const GET = async () => {
    try {
        const auth = await requireAdminContext();
        if (!auth.ok) {
            return auth.response;
        }

        const staff = await db
            .select({
                id: usersTable.id,
                name: usersTable.name,
                code: usersTable.code,
                isAdmin: usersTable.isAdmin,
                isActive: usersTable.isActive,
                createdAt: usersTable.createdAt,
                updatedAt: usersTable.updatedAt,
            })
            .from(usersTable)
            .where(eq(usersTable.organisationId, auth.context.organisationId))
            .orderBy(desc(usersTable.createdAt));

        return NextResponse.json({ msg: "Success", staff });
    } catch (error) {
        console.error("Error loading staff:", error);
        return NextResponse.json({ msg: "Failed to load staff" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const auth = await requireAdminContext();
        if (!auth.ok) {
            return auth.response;
        }

        const body = await req.json();
        const name = getTrimmed(body.name);
        const code = normalizeCode(body.code);
        const password = typeof body.password === "string" ? body.password : "";
        const isAdmin = body.isAdmin === true;

        if (!name || !code || password.length < 8) {
            return NextResponse.json(
                { msg: "Name, code, and a password with at least 8 characters are required" },
                { status: 400 },
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [createdUser] = await db
            .insert(usersTable)
            .values({
                name,
                code,
                passwordHash,
                isAdmin,
                organisationId: auth.context.organisationId,
            })
            .returning({
                id: usersTable.id,
                name: usersTable.name,
                code: usersTable.code,
                isAdmin: usersTable.isAdmin,
                isActive: usersTable.isActive,
                createdAt: usersTable.createdAt,
                updatedAt: usersTable.updatedAt,
            });

        return NextResponse.json({ msg: "Success", staff: createdUser }, { status: 201 });
    } catch (error) {
        console.error("Error creating staff:", error);
        const code = (error as { code?: string }).code;
        if (code === "23505") {
            return NextResponse.json(
                { msg: "A staff member with that code already exists for this organization" },
                { status: 409 },
            );
        }

        return NextResponse.json({ msg: "Failed to create staff member" }, { status: 500 });
    }
};
