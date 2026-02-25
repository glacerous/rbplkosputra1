import { auth } from "@/server/auth/auth"
import { Role } from "@prisma/client"

export async function requireRole(allowedRoles: Role[]) {
    const session = await auth()

    if (!session) {
        throw new Error("Unauthorized: No session found")
    }

    if (!allowedRoles.includes(session.user.role)) {
        throw new Error(`Forbidden: Role ${session.user.role} is not allowed`)
    }

    return session
}
