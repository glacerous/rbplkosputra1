import "dotenv/config";
import pg from "pg";
const { Client } = pg;
import * as bcrypt from "bcryptjs";
import crypto from "crypto";

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function main() {
    await client.connect();
    console.log("Connected to database");

    const passwordHash = await bcrypt.hash("Admin123!", 10);
    const ownerHash = await bcrypt.hash("Owner123!", 10);
    const cleanerHash = await bcrypt.hash("Cleaner123!", 10);
    const customerHash = await bcrypt.hash("Customer123!", 10);

    const users = [
        { email: "admin@example.com", name: "Super Admin", role: "ADMIN", passwordHash },
        { email: "owner@example.com", name: "Kos Owner", role: "OWNER", passwordHash: ownerHash },
        { email: "cleaner@example.com", name: "John Cleaner", role: "CLEANER", passwordHash: cleanerHash },
        { email: "customer@example.com", name: "Jane Customer", role: "CUSTOMER", passwordHash: customerHash },
    ];

    for (const user of users) {
        // We generate a simple ID if it doesn't exist, as we can't easily generate CUIDs here
        // but it should follow the cuid-like format or just be a long random string.
        const id = `cl-${crypto.randomBytes(12).toString('hex')}`;

        await client.query(
            `INSERT INTO "User" (id, email, name, "passwordHash", role, "updatedAt", "createdAt")
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             ON CONFLICT (email) DO UPDATE 
             SET name = EXCLUDED.name, "passwordHash" = EXCLUDED."passwordHash", role = EXCLUDED.role, "updatedAt" = NOW()`,
            [id, user.email, user.name, user.passwordHash, user.role]
        );
        console.log(`Upserted user: ${user.email}`);
    }

    console.log("Seed completed successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await client.end();
    });
