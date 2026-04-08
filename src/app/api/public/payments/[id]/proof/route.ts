import { auth } from "@/server/auth/auth";
import { uploadImage } from "@/server/lib/cloudinary";
import { uploadPaymentProof } from "@/server/services/payment.service";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("proof") as File | null;

        if (!file || file.size === 0) {
            return NextResponse.json({ message: "File bukti wajib diunggah" }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ message: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP." }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ message: "Ukuran file maksimal 5MB" }, { status: 400 });
        }

        const proofUrl = await uploadImage(file, "payment-proofs");
        const payment = await uploadPaymentProof(id, session.user.id, proofUrl);

        return NextResponse.json(payment, { status: 200 });
    } catch (error: unknown) {
        console.error("Proof Upload Error:", error);
        return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
