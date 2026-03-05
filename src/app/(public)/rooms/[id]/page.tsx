import { auth } from "@/server/auth/auth";
import { prisma } from "@/server/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, Info, Phone } from "lucide-react";
import ReservationButton from "./ReservationButton";

export default async function RoomDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = await paramsPromise;
    const session = await auth();

    if (!session) {
        redirect(`/login?redirect=/rooms/${params.id}`);
    }

    const room = await prisma.room.findUnique({
        where: { id: params.id },
    });

    if (!room) {
        redirect("/rooms");
    }

    // Check if user already has a reservation
    const existingReservation = await prisma.reservation.findFirst({
        where: {
            customerId: session.user.id,
            status: { in: ["RESERVED", "CHECKED_IN"] }
        }
    });

    if (existingReservation) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-surface py-12 px-6 font-sans text-primary-dark">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link
                    href="/rooms"
                    className="inline-flex items-center gap-2 text-primary-dark/40 hover:text-accent-color transition-colors font-bold text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Kamar
                </Link>

                <div className="bg-warm-surface rounded-[40px] border border-primary-dark/10 overflow-hidden shadow-xl">
                    <div className="aspect-video bg-primary-dark/5 flex items-center justify-center relative">
                        <span className="text-primary-dark/5 text-9xl font-black italic select-none">
                            {room.number}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-t from-warm-surface to-transparent opacity-40" />
                        <div className="absolute bottom-8 left-8">
                            <h1 className="text-4xl font-black italic text-primary-dark tracking-tighter">Kamar {room.number}</h1>
                            <p className="text-primary-dark/60 font-medium uppercase tracking-widest text-[10px] bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white inline-block mt-2">
                                {room.category}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h2 className="text-sm font-black uppercase text-primary-dark/30 tracking-widest">Detail & Fasilitas</h2>
                                <div className="flex flex-wrap gap-2">
                                    {room.facilities?.split(',').map((f, i) => (
                                        <div key={i} className="bg-white px-4 py-2 rounded-2xl border border-primary-dark/5 text-sm font-bold shadow-sm">
                                            {f.trim()}
                                        </div>
                                    )) || <span className="text-sm italic text-primary-dark/30">Fasilitas standar</span>}
                                </div>
                            </div>
                            <div className="bg-[#F9F8ED]/50 p-6 rounded-[32px] border border-[#F4E7D3] flex flex-col justify-center">
                                <p className="text-[10px] font-black uppercase text-[#0881A3] tracking-widest mb-1">Total Biaya Bulanan</p>
                                <div className="text-3xl font-black text-[#1F4E5F]">
                                    Rp {room.priceMonthly.toLocaleString('id-ID')}
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-primary-dark/10" />

                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent-color/10 rounded-2xl flex items-center justify-center text-accent-color">
                                    <Info className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black italic">Instruksi Reservasi</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-white rounded-3xl border border-primary-dark/5 space-y-3">
                                    <div className="flex items-center gap-2 text-primary-dark font-black text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        1. Konfirmasi Data
                                    </div>
                                    <p className="text-xs text-primary-dark/50 font-medium leading-relaxed">Pastikan pilihan kamarmu sudah sesuai. Data reservasi akan tercatat secara otomatis.</p>
                                </div>
                                <div className="p-6 bg-white rounded-3xl border border-primary-dark/5 space-y-3">
                                    <div className="flex items-center gap-2 text-primary-dark font-black text-sm">
                                        <CreditCard className="w-4 h-4 text-accent-color" />
                                        2. Pembayaran
                                    </div>
                                    <p className="text-xs text-primary-dark/50 font-medium leading-relaxed">Lakukan transfer sesuai nominal ke rekening admin yang muncul setelah klik tombol di bawah.</p>
                                </div>
                            </div>

                            <ReservationButton roomId={room.id} />
                        </section>
                    </div>
                </div>

                <div className="bg-white/50 border border-primary-dark/5 p-6 rounded-[32px] flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                        <Phone className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Butuh Bantuan?</h4>
                        <p className="text-xs text-primary-dark/40 font-medium">Hubungi Admin di +62 812-3456-7890 jika ada kendala saat reservasi.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
