"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    CONFIRMED: { label: "Dikonfirmasi", className: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    REJECTED: { label: "Ditolak", className: "bg-red-100 text-red-600", icon: XCircle },
    PENDING: { label: "Menunggu", className: "bg-amber-100 text-amber-700", icon: Clock },
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/public/payments")
            .then((r) => r.json())
            .then((data) => setPayments(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#0881A3]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface font-sans text-primary-dark px-4 py-12 sm:px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="w-10 h-10 rounded-2xl bg-white border border-primary-dark/10 flex items-center justify-center hover:bg-[#0881A3] hover:text-white hover:border-transparent transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black italic">Riwayat Pembayaran</h1>
                        <p className="text-primary-dark/40 text-sm font-medium">Semua catatan pembayaranmu</p>
                    </div>
                </div>

                {payments.length === 0 ? (
                    <div className="bg-white rounded-[40px] border-2 border-dashed border-[#F4E7D3] p-16 flex flex-col items-center text-center space-y-3">
                        <CreditCard className="w-10 h-10 text-primary-dark/10" />
                        <p className="font-black text-primary-dark">Belum ada riwayat pembayaran</p>
                        <p className="text-sm text-primary-dark/40">Pembayaran akan muncul di sini setelah kamu melakukan reservasi.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {payments.map((payment) => {
                            const cfg = statusConfig[payment.status] ?? statusConfig.PENDING;
                            const StatusIcon = cfg.icon;
                            return (
                                <div key={payment.id} className="bg-white rounded-[32px] border border-[#F4E7D3] p-6 flex items-center gap-6 shadow-sm">
                                    <div className="w-14 h-14 bg-[#F9F8ED] rounded-2xl flex items-center justify-center text-[#0881A3] shrink-0">
                                        <CreditCard className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <p className="font-black text-[#1F4E5F] text-base">
                                                Kamar {payment.reservation?.room?.number ?? "-"}
                                            </p>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${cfg.className}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <p className="text-xl font-black text-[#1F4E5F] mt-1">
                                            Rp {payment.amount.toLocaleString("id-ID")}
                                        </p>
                                        <p className="text-xs text-primary-dark/40 font-medium mt-1">
                                            {new Date(payment.createdAt).toLocaleDateString("id-ID", {
                                                day: "numeric", month: "long", year: "numeric",
                                            })}
                                            {payment.confirmedAt && ` · Dikonfirmasi ${new Date(payment.confirmedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`}
                                        </p>
                                    </div>
                                    {payment.proofUrl && (
                                        <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl overflow-hidden border border-[#F4E7D3] shrink-0 hover:border-[#0881A3] transition-colors">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={payment.proofUrl} alt="Bukti" className="w-full h-full object-cover" />
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
