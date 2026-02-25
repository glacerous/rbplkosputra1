import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

neonConfig.webSocketConstructor = ws

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(pool as any)

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    })

export default prisma

if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma
