"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";

export default function ReservationButton({ roomId }: { roomId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReserve = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/public/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal membuat reservasi");
            }

            // Success redirect to Home. The home page will detect the PENDING reservation.
            router.push("/");
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleReserve}
            disabled={loading}
            className="w-full bg-[#0881A3] text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-[#0881A3]/30"
        >
            {loading ? (
                <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Memproses Reservasi...
                </>
            ) : (
                <>
                    <Zap className="w-6 h-6" />
                    Konfirmasi Reservasi
                </>
            )}
        </button>
    );
}
