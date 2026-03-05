import { NextResponse } from "next/server";
import { registerUser, getUserByEmail } from "@/server/services/user.service";
import * as z from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = signupSchema.parse(body);

        // Check if user already exists
        const existingUser = await getUserByEmail(validatedData.email);
        if (existingUser) {
            return NextResponse.json(
                { error: "Email sudah terdaftar" },
                { status: 400 }
            );
        }

        const user = await registerUser({
            name: validatedData.name,
            email: validatedData.email,
            passwordHash: validatedData.password, // This will be hashed in the service
        });

        return NextResponse.json(
            { message: "Registrasi berhasil", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        console.error("[SIGNUP_ERROR]", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan internal" },
            { status: 500 }
        );
    }
}
