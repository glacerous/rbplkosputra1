import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const { Pool } = pg

const GLOBAL_KEY = "PRISMA_SINGLETON_FINAL"
const globalForPrisma = globalThis as unknown as {
    [GLOBAL_KEY]?: any
}

export const getPrisma = (): PrismaClient => {
    if (globalForPrisma[GLOBAL_KEY]) {
        return globalForPrisma[GLOBAL_KEY]
    }

    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        throw new Error("DATABASE_URL is missing")
    }

    try {
        const pool = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false
            }
        })
        const adapter = new PrismaPg(pool)
        const client = new PrismaClient({ adapter })

        if (process.env.NODE_ENV !== "production") {
            globalForPrisma[GLOBAL_KEY] = client
        }

        return client
    } catch (e) {
        console.error(`[PRISMA_FATAL] Database initialization failed:`, e);
        throw e
    }
}

export const prisma = getPrisma()
export default prisma
