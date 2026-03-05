import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/db/drizzle";
import { businessTable, usersTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createToken } from "@/utils/auth/auth";
import { getNodeEnv } from "@/utils/getNodeEnv";
import { tokenName } from "@/constants/auth";

export const POST = async (req: NextRequest) => {
    const { organizationCode, code, password } = await req.json();
    const normalizedOrganizationCode =
        typeof organizationCode === "string"
            ? organizationCode.trim().toUpperCase()
            : "";
    const normalizedCode = typeof code === "string" ? code.trim() : "";

    const isOrganizationCodeValid = /^[A-Z0-9-]{4,63}$/.test(
        normalizedOrganizationCode,
    );

    if (
        typeof password !== "string" ||
        normalizedCode.length === 0 ||
        !isOrganizationCodeValid
    ) {
        return NextResponse.json(
            { err: "Incorrect Organization Code, Client Code or Password" },
            { status: 401 },
        );
    }

    let organisationQuery = null;

    try {
        organisationQuery = await db
            .select()
            .from(businessTable)
            .where(eq(businessTable.organisationCode, normalizedOrganizationCode));
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { err: "There was an error retrieving data" },
            { status: 500 },
        );
    }

    if (!organisationQuery || organisationQuery.length === 0) {
        return NextResponse.json(
            { err: "Incorrect Organization Code, Client Code or Password" },
            { status: 401 },
        );
    }

    const organisation = organisationQuery[0];

    let usersQuery = null;
    try {
        usersQuery = await db
            .select()
            .from(usersTable)
            .where(
                and(
                    eq(usersTable.code, normalizedCode),
                    eq(usersTable.organisationId, organisation.id),
                ),
            );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { err: "There was an error retrieving data" },
            { status: 500 },
        );
    }

    if (!usersQuery || usersQuery.length === 0) {
        return NextResponse.json(
            { err: "Incorrect Organization Code, Client Code or Password" },
            { status: 401 },
        );
    }

    const user = usersQuery[0];

    let comparison = false;
    try {
        comparison = await bcrypt.compare(password, user.passwordHash);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { err: "Incorrect Organization Code, Client Code or Password" },
            { status: 401 },
        );
    }

    if (!comparison) {
        return NextResponse.json(
            { err: "Incorrect Organization Code, Client Code or Password" },
            { status: 401 },
        );
    }
    if (!user.isActive) {
        console.log("User has been disbanded");
        return NextResponse.json(
            {
                err: "Account has been deactivated. Please contact your Client admin for more information",
            },
            { status: 401 },
        );
    }
    let jwtPayload = null;
    let token = null;
    try {
        jwtPayload = {
            userId: user.id,
            organisationId: user.organisationId,
            name: user.name,
            isAdmin: user.isAdmin,
        };
        if (jwtPayload == null) {
            return NextResponse.json(
                { err: "There was an error on our end. Try logging in again." },
                { status: 400 },
            );
        }
        token = await createToken(jwtPayload);
        if (token == null) {
            return NextResponse.json(
                { err: "There was an error on our end. Try logging in again." },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { err: "There was an error on our end. Try logging in again." },
            { status: 400 },
        );
    }

    const response = NextResponse.json({ msg: "Success" }, { status: 200 });
    response.cookies.set(tokenName, token, {
        httpOnly: true,
        secure: getNodeEnv() === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    return response;
};
