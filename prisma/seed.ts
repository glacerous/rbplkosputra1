import "dotenv/config";
import { PrismaClient, Role } from '@prisma/client';
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as bcrypt from 'bcryptjs';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaNeon(pool as any);

const prisma = new PrismaClient({ adapter });

async function main() {
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    const ownerHash = await bcrypt.hash('Owner123!', 10);
    const cleanerHash = await bcrypt.hash('Cleaner123!', 10);
    const customerHash = await bcrypt.hash('Customer123!', 10);

    // Users
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Super Admin',
            passwordHash,
            role: Role.ADMIN,
        },
    });

    await prisma.user.upsert({
        where: { email: 'owner@example.com' },
        update: {},
        create: {
            email: 'owner@example.com',
            name: 'Kos Owner',
            passwordHash: ownerHash,
            role: Role.OWNER,
        },
    });

    await prisma.user.upsert({
        where: { email: 'cleaner@example.com' },
        update: {},
        create: {
            email: 'cleaner@example.com',
            name: 'John Cleaner',
            passwordHash: cleanerHash,
            role: Role.CLEANER,
        },
    });

    await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            name: 'Jane Customer',
            passwordHash: customerHash,
            role: Role.CUSTOMER,
        },
    });

    console.log('Seed completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
