import "dotenv/config";
import db from "@/utils/db/drizzle";
import { businessTable, usersTable } from "@/utils/db/schema";
import bcrypt from "bcrypt";

/*
 * Simple seeder
 * Inserts a sample business and sample user.
 * Should only be used for testing
 */

const checkEnv = () => {
    if (
        !process.env.TEST_ORGANISATION_NAME ||
        !process.env.TEST_ORGANISATION_EMAIL
    ) {
        throw new Error(
            "TEST_ORGANISATION_NAME and TEST_ORGANISATION_EMAIL not set (cannot seed)",
        );
    }
    if (
        !process.env.TEST_USER_NAME ||
        !process.env.TEST_USER_PASSWORD ||
        !process.env.TEST_USER_CODE
    ) {
        throw new Error("TEST_USER fields not set (cannot seed)");
    }
    return;
};

const seed = async () => {
    checkEnv();
    const [business] = await db
        .insert(businessTable)
        .values({
            name: process.env.TEST_ORGANISATION_NAME!,
            email: process.env.TEST_ORGANISATION_EMAIL!,
        })
        .returning();

    const hashedPassword = await bcrypt.hash(
        process.env.TEST_USER_PASSWORD!,
        10,
    );

    const [user] = await db
        .insert(usersTable)
        .values({
            name: process.env.TEST_USER_NAME!,
            passwordHash: hashedPassword,
            code: process.env.TEST_USER_CODE!,
            isAdmin: true,
            organisationId: business.id,
        })
        .returning();

    console.log(business);
    console.log(user);
};

async function main() {
    await seed();
}

main();
