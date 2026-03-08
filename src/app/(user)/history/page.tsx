"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Calendar } from "lucide-react";
import ReservationsSkeleton from "@/components/skeletons/ReservationsSkeleton";

type Payment = {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
};

type Room = {
    id: string;
    number: string;
    category: string;
};

type Reservation = {
    id: string;
    status: string;
    createdAt: string;
    checkInAt: string | null;
    checkOutAt: string | null;
    room: Room;
    payments: Payment[];
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    RESERVED: { label: "Menunggu Konfirmasi", className: "bg-amber-100 text-amber-700" },
    CHECKED_IN: { label: "Aktif", className: "bg-emerald-100 text-emerald-700" },
    CHECKED_OUT: { label: "Selesai", className: "bg-slate-100 text-slate-600" },
    CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-600" },
};

export default function HistoryPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/public/reservations")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setReservations(data);
                else setError(data.message || "Gagal memuat riwayat");
            })
            .catch(() => setError("Koneksi gagal"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <ReservationsSkeleton />;

    return (
        <div className="min-h-screen bg-surface px-4 py-8 text-primary-dark sm:px-6 sm:py-12">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center gap-3">
                    <Link
                        href="/"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-dark/10 bg-warm-surface transition-all hover:bg-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-[24px] font-bold">Riwayat Sewa</h1>
                        <p className="text-sm text-primary-dark/60">Semua riwayat reservasi kamu</p>
                    </div>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                        {error}
                    </div>
                )}

                {!error && reservations.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-primary-dark/10 bg-warm-surface py-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-dark/5">
                            <Home className="h-8 w-8 text-primary-dark/20" />
                        </div>
                        <div>
                            <p className="font-bold text-primary-dark/60">Belum Ada Riwayat</p>
                            <p className="mt-1 text-sm text-primary-dark/40">Reservasi kamu akan muncul di sini</p>
                        </div>
                        <Link
                            href="/rooms"
                            className="mt-2 rounded-2xl bg-accent-color px-6 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
                        >
                            Cari Kamar
                        </Link>
                    </div>
                )}

                <div className="space-y-4">
                    {reservations.map((r) => {
                        const statusInfo = STATUS_LABELS[r.status] ?? { label: r.status, className: "bg-gray-100 text-gray-600" };
                        const latestPayment = r.payments[0];
                        return (
                            <div key={r.id} className="rounded-[32px] border border-[#F4E7D3] bg-white p-6 shadow-sm">
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-sm font-bold text-primary-dark/60">
                                        <Home className="h-4 w-4" />
                                        Kamar {r.room.number}
                                    </div>
                                    <span className={`rounded-full px-3 py-0.5 text-[11px] font-black ${statusInfo.className}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>

                                <div className="text-base font-bold text-primary-dark">{r.room.category}</div>

                                {latestPayment && (
                                    <div className="mt-1 text-sm text-primary-dark/60">
                                        Rp {latestPayment.amount.toLocaleString("id-ID")}
                                        {" · "}
                                        <span className={`font-bold ${latestPayment.status === "CONFIRMED" ? "text-emerald-600" : "text-amber-600"}`}>
                                            {latestPayment.status}
                                        </span>
                                    </div>
                                )}

                                <div className="mt-3 flex items-center gap-1.5 text-xs text-primary-dark/40">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                    {r.checkOutAt && (
                                        <span>
                                            {" · "} Checkout {new Date(r.checkOutAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
