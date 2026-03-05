import { prisma } from "@/server/db/prisma"
import bcrypt from "bcryptjs"

export async function listUsers() {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })
}

export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: { email },
    })
}

export async function registerUser(data: { name: string; email: string; passwordHash: string }) {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash: hashedPassword,
            role: "CUSTOMER", // Default role
        },
    });
}
