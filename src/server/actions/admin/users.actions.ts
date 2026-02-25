"use server"

import { requireRole } from "@/server/guards/requireRole"
import { listUsers } from "@/server/services/user.service"
import { Role } from "@prisma/client"

export async function getUsersAction() {
    try {
        // 1. Guard check
        await requireRole([Role.ADMIN])

        // 2. Call Service
        const users = await listUsers()

        return { success: true, data: users }
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch users" }
    }
}
