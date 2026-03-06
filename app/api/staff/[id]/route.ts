import bcrypt from "bcrypt";
import { and, eq, sql } from "drizzle-orm";
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

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    try {
        const auth = await requireAdminContext();
        if (!auth.ok) {
            return auth.response;
        }

        const { id: staffId } = await params;
        const body = await req.json();

        const [existingUser] = await db
            .select({
                id: usersTable.id,
                name: usersTable.name,
                code: usersTable.code,
                isAdmin: usersTable.isAdmin,
                isActive: usersTable.isActive,
            })
            .from(usersTable)
            .where(
                and(
                    eq(usersTable.id, staffId),
                    eq(usersTable.organisationId, auth.context.organisationId),
                ),
            )
            .limit(1);

        if (!existingUser) {
            return NextResponse.json({ msg: "Staff member not found" }, { status: 404 });
        }

        const updates: {
            name?: string;
            code?: string;
            passwordHash?: string;
            isAdmin?: boolean;
            isActive?: boolean;
        } = {};

        if (body.name !== undefined) {
            const name = getTrimmed(body.name);
            if (!name) {
                return NextResponse.json({ msg: "Name cannot be empty" }, { status: 400 });
            }
            updates.name = name;
        }

        if (body.code !== undefined) {
            const code = normalizeCode(body.code);
            if (!code) {
                return NextResponse.json({ msg: "Code cannot be empty" }, { status: 400 });
            }
            updates.code = code;
        }

        if (body.isAdmin !== undefined) {
            if (typeof body.isAdmin !== "boolean") {
                return NextResponse.json({ msg: "isAdmin must be a boolean" }, { status: 400 });
            }
            updates.isAdmin = body.isAdmin;
        }

        if (body.isActive !== undefined) {
            if (typeof body.isActive !== "boolean") {
                return NextResponse.json({ msg: "isActive must be a boolean" }, { status: 400 });
            }
            updates.isActive = body.isActive;
        }

        if (body.password !== undefined) {
            if (typeof body.password !== "string" || body.password.length < 8) {
                return NextResponse.json(
                    { msg: "Password must be at least 8 characters" },
                    { status: 400 },
                );
            }
            updates.passwordHash = await bcrypt.hash(body.password, 10);
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ msg: "No updates provided" }, { status: 400 });
        }

        const nextIsAdmin = updates.isAdmin ?? existingUser.isAdmin;
        const nextIsActive = updates.isActive ?? existingUser.isActive;
        const isReducingAdminCoverage =
            existingUser.isAdmin && existingUser.isActive && (!nextIsAdmin || !nextIsActive);

        if (!nextIsActive && existingUser.id === auth.context.userId) {
            return NextResponse.json(
                { msg: "You cannot deactivate your own account" },
                { status: 400 },
            );
        }

        if (isReducingAdminCoverage) {
            const [updatedUser] = await db
                .transaction(async (tx) => {
                    const [countRow] = await tx
                        .select({ count: sql<number>`count(*)` })
                        .from(usersTable)
                        .where(
                            and(
                                eq(usersTable.organisationId, auth.context.organisationId),
                                eq(usersTable.isAdmin, true),
                                eq(usersTable.isActive, true),
                            ),
                        );

                    const activeAdminCount = Number(countRow?.count ?? 0);
                    if (activeAdminCount <= 1) {
                        throw new Error("At least one active admin is required");
                    }

                    return tx
                        .update(usersTable)
                        .set(updates)
                        .where(
                            and(
                                eq(usersTable.id, staffId),
                                eq(usersTable.organisationId, auth.context.organisationId),
                            ),
                        )
                        .returning({
                            id: usersTable.id,
                            name: usersTable.name,
                            code: usersTable.code,
                            isAdmin: usersTable.isAdmin,
                            isActive: usersTable.isActive,
                            createdAt: usersTable.createdAt,
                            updatedAt: usersTable.updatedAt,
                        });
                });

            return NextResponse.json({ msg: "Success", staff: updatedUser });
        }

        const [updatedUser] = await db
            .update(usersTable)
            .set(updates)
            .where(
                and(
                    eq(usersTable.id, staffId),
                    eq(usersTable.organisationId, auth.context.organisationId),
                ),
            )
            .returning({
                id: usersTable.id,
                name: usersTable.name,
                code: usersTable.code,
                isAdmin: usersTable.isAdmin,
                isActive: usersTable.isActive,
                createdAt: usersTable.createdAt,
                updatedAt: usersTable.updatedAt,
            });

        return NextResponse.json({ msg: "Success", staff: updatedUser });
    } catch (error) {
        console.error("Error updating staff:", error);
        const code = (error as { code?: string }).code;
        if (code === "23505") {
            return NextResponse.json(
                { msg: "A staff member with that code already exists for this organization" },
                { status: 409 },
            );
        }

        return NextResponse.json({ msg: "Failed to update staff member" }, { status: 500 });
    }
};
