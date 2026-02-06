import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/utils/db/drizzle";
import { usersTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { createToken } from "@/utils/auth/auth";
import { getNodeEnv } from "@/utils/getNodeEnv";

export const POST = async (req: NextRequest) => {
    const { code, password } = await req.json();
    let query = null;

    try {
        query = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.code, code));
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { err: "There was an error retrieving data" },
            { status: 400 },
        );
    }

    if (!query || query.length === 0) {
        console.error("Could not find user");
        return NextResponse.json(
            { err: "Incorrect User Code or Password" },
            { status: 401 },
        );
    }

    const user = query[0];
    console.log("Login detected:", code, " || Name:", user.name);

    let comparison = false;
    try {
        comparison = await bcrypt.compare(password, user.passwordHash);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { err: "Incorrect User Code or Password" },
            { status: 401 },
        );
    }

    if (!comparison) {
        return NextResponse.json(
            { err: "Incorrect User Code or Password" },
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

    const response = NextResponse.json(
        { msg: "Success" },
        { status: 200 },
    );
    response.cookies.set("barkboard", token, {
        httpOnly: true,
        secure: getNodeEnv() === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    return response;
};
