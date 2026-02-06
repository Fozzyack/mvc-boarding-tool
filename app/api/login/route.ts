import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/utils/db/drizzle";
import { usersTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

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

    const comparison = await bcrypt.compare(password, user.passwordHash);
    if (!comparison) {
        return NextResponse.json({ err: "Incorrect User Code or Password"}, { status: 401 });
    }

    return NextResponse.json({ msg: "Success"}, { status: 200 });
};
