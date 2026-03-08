import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { adminUpdateUser, deleteUser } from "@/server/services/user.service";
import { z } from "zod";
import { Role } from "@prisma/client";

const updateSchema = z.object({
    name: z.string().min(1).optional(),
    role: z.nativeEnum(Role).optional(),
});

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const result = updateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const user = await adminUpdateUser(id, result.data);
        return NextResponse.json(user);
    } catch (error: any) {
        console.error("[API_ADMIN_USER_ID_PUT]", error);
        if (error.code === "P2025") {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await deleteUser(id);
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error("[API_ADMIN_USER_ID_DELETE]", error);
        if (error.code === "P2025") {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
