"use client";

import { useEffect, useState } from "react";
import {
    CreditCard,
    CheckCircle2,
    XCircle,
    Loader2,
    User,
    Home,
    Calendar,
    Search,
    ExternalLink
} from "lucide-react";

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchPayments = async () => {
        try {
            const res = await fetch("/api/admin/payments");
            const data = await res.json();
            setPayments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleConfirm = async (id: string) => {
        if (!confirm("Konfirmasi pembayaran ini? Kamar akan otomatis terisi.")) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/payments/${id}/confirm`, {
                method: "PATCH",
            });

            if (!res.ok) throw new Error("Gagal mengonfirmasi");

            await fetchPayments();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#0881A3]" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-[#F4E7D3]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0881A3] rounded-2xl flex items-center justify-center text-white">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic">Verifikasi Pembayaran</h1>
                        <p className="text-[#1F4E5F]/50 font-medium">Setujui bukti transfer untuk aktifkan akses tenant.</p>
                    </div>
                </div>
            </header>

            {payments.length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] border-2 border-dashed border-[#F4E7D3] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[#F9F8ED] rounded-full flex items-center justify-center text-[#1F4E5F]/20">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#1F4E5F]">Semua Beres!</h3>
                        <p className="text-sm text-[#1F4E5F]/40 font-medium">Tidak ada pembayaran yang menunggu verifikasi saat ini.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {payments.map((payment) => (
                        <div key={payment.id} className="bg-white p-8 rounded-[40px] border border-[#F4E7D3] shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-[#F9F8ED] rounded-[24px] flex items-center justify-center text-[#0881A3] shrink-0 border border-[#F4E7D3]">
                                    <User className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-[#1F4E5F]">{payment.customer.name}</h3>
                                    <div className="flex flex-wrap gap-4 text-xs font-medium text-[#1F4E5F]/50">
                                        <div className="flex items-center gap-1.5">
                                            <Home className="w-3.5 h-3.5 text-[#0881A3]" />
                                            Kamar {payment.reservation.room.number}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(payment.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="bg-[#F9F8ED] px-6 py-3 rounded-2xl border border-[#F4E7D3] text-center sm:text-right">
                                    <p className="text-[10px] font-black uppercase text-[#0881A3] tracking-widest mb-0.5">Nominal Transfer</p>
                                    <p className="text-xl font-black text-[#1F4E5F]">Rp {payment.amount.toLocaleString('id-ID')}</p>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleConfirm(payment.id)}
                                        disabled={processingId === payment.id}
                                        className="flex-1 sm:flex-none bg-[#0881A3] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0881A3]/20 disabled:opacity-50"
                                    >
                                        {processingId === payment.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="w-4 h-4" />
                                        )}
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
