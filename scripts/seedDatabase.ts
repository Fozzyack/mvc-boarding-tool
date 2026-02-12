import "dotenv/config";
import db from "@/utils/db/drizzle";
import {
    boardersTable,
    businessTable,
    medicationTable,
    usersTable,
} from "@/utils/db/schema";
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

const delete_from_database = async () => {
    console.log("Delete medication from medication table");
    await db.delete(medicationTable);
    console.log("Delete boarders from boarders table");
    await db.delete(boardersTable);
    console.log("Delete users from users table");
    await db.delete(usersTable);
    console.log("Delete businesses from business table");
    await db.delete(businessTable);
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

    const [boarder] = await db
        .insert(boardersTable)
        .values({
            name: "Buddy",
            animalType: "Dog",
            species: "Golden Retriever",
            ownerName: "John Doe",
            ownerPhone: "555-0123",
            ownerEmail: "john@example.com",
            startDate: "2025-02-01",
            endDate: "2025-02-07",
            organisationId: business.id,
            createdBy: user.id,
        })
        .returning();

    const [medication] = await db
        .insert(medicationTable)
        .values({
            name: "Carprofen",
            dosage: "50mg",
            frequency: "1 week",
            startDate: "2025-02-01",
            instructions: "Give with food",
            boarderId: boarder.id,
            organisationId: business.id,
        })
        .returning();

    const [medication2] = await db
        .insert(medicationTable)
        .values({
            name: "Homing ballistic missle",
            dosage: "20kg",
            frequency: "3 Days",
            startDate: "2025-02-02",
            instructions: "Give with food",
            boarderId: boarder.id,
            organisationId: business.id,
        })
        .returning();

    console.log(business);
    console.log(user);
    console.log(boarder);
    console.log(medication);
    console.log(medication2);

    console.log("Database seeded successfully!");
};

async function main() {
    if (process.argv[2] == "delete") {
        console.log("Deleting table entries");
        await delete_from_database();
        return;
    }
    console.log("Seeding Database");
    await seed();
    return;
}

main();
