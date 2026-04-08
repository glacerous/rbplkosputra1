"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    CreditCard,
    CheckCircle2,
    XCircle,
    Loader2,
    User,
    Home,
    Calendar,
    ImageIcon,
} from "lucide-react";

interface Payment {
    id: string;
    amount: number;
    status: string;
    proofUrl: string | null;
    createdAt: string;
    customer: {
        name: string;
        email: string;
    };
    reservation: {
        id: string;
        status: string;
        room: {
            number: string;
        };
    };
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"check-in" | "monthly">("check-in");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [proofModal, setProofModal] = useState<string | null>(null);

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

    const checkInPayments = payments.filter((p) => p.reservation.status === "RESERVED");
    const monthlyPayments = payments.filter((p) => p.reservation.status === "CHECKED_IN");
    const displayedPayments = activeTab === "check-in" ? checkInPayments : monthlyPayments;

    const handleConfirm = async (id: string) => {
        if (!confirm("Konfirmasi pembayaran ini? Kamar akan otomatis terisi.")) return;
        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/payments/${id}/confirm`, { method: "PATCH" });
            if (!res.ok) throw new Error("Gagal mengonfirmasi");
            await fetchPayments();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Tolak pembayaran ini? Tenant perlu mengunggah ulang bukti.")) return;
        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/payments/${id}/reject`, { method: "PATCH" });
            if (!res.ok) throw new Error("Gagal menolak pembayaran");
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
                        <p className="text-[#1F4E5F]/50 font-medium">Pisahkan verifikasi check-in pertama dan bulanan.</p>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex bg-white p-2 rounded-2xl border border-[#F4E7D3] w-fit">
                <button
                    onClick={() => setActiveTab("check-in")}
                    className={`px-6 py-2.5 rounded-xl text-sm font-black italic tracking-tight transition-all flex items-center gap-2 ${activeTab === "check-in" ? "bg-[#0881A3] text-white shadow-lg shadow-[#0881A3]/20" : "text-[#1F4E5F]/40 hover:text-[#1F4E5F]"}`}
                >
                    Check-in Pertama
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "check-in" ? "bg-white/20 text-white" : "bg-[#F9F8ED] text-[#1F4E5F]/40"}`}>
                        {checkInPayments.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("monthly")}
                    className={`px-6 py-2.5 rounded-xl text-sm font-black italic tracking-tight transition-all flex items-center gap-2 ${activeTab === "monthly" ? "bg-[#0881A3] text-white shadow-lg shadow-[#0881A3]/20" : "text-[#1F4E5F]/40 hover:text-[#1F4E5F]"}`}
                >
                    Pembayaran Bulanan
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "monthly" ? "bg-white/20 text-white" : "bg-[#F9F8ED] text-[#1F4E5F]/40"}`}>
                        {monthlyPayments.length}
                    </span>
                </button>
            </div>

            {displayedPayments.length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] border-2 border-dashed border-[#F4E7D3] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[#F9F8ED] rounded-full flex items-center justify-center text-[#1F4E5F]/20">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#1F4E5F]">
                            {activeTab === "check-in" ? "Belum ada Check-in baru" : "Belum ada Pembayaran Bulanan baru"}
                        </h3>
                        <p className="text-sm text-[#1F4E5F]/40 font-medium">Verifikasi ini akan muncul saat tenant melakukan pembayaran.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {displayedPayments.map((payment) => (
                        <div key={payment.id} className="bg-white p-8 rounded-[40px] border border-[#F4E7D3] shadow-sm hover:shadow-xl transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                                <div className="flex items-start gap-6 flex-1">
                                    <div className="w-16 h-16 bg-[#F9F8ED] rounded-[24px] flex items-center justify-center text-[#0881A3] shrink-0 border border-[#F4E7D3]">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-[#1F4E5F]">{payment.customer.name}</h3>
                                        <p className="text-sm text-[#1F4E5F]/50">{payment.customer.email}</p>
                                        <div className="flex flex-wrap gap-4 text-xs font-medium text-[#1F4E5F]/50 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <Home className="w-3.5 h-3.5 text-[#0881A3]" />
                                                Kamar {payment.reservation.room.number}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(payment.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    {/* Proof image */}
                                    {payment.proofUrl ? (
                                        <button
                                            onClick={() => setProofModal(payment.proofUrl)}
                                            className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#0881A3]/20 hover:border-[#0881A3] transition-colors shrink-0 group relative"
                                        >
                                            <Image
                                                src={payment.proofUrl}
                                                alt="Bukti"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold z-10">
                                                Lihat
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-[#F9F8ED] border border-dashed border-[#F4E7D3] flex flex-col items-center justify-center text-[#1F4E5F]/20 shrink-0">
                                            <ImageIcon className="w-6 h-6" />
                                            <span className="text-[8px] font-bold mt-1">Belum ada</span>
                                        </div>
                                    )}

                                    <div className="bg-[#F9F8ED] px-6 py-3 rounded-2xl border border-[#F4E7D3] text-center">
                                        <p className="text-[10px] font-black uppercase text-[#0881A3] tracking-widest mb-0.5">Nominal</p>
                                        <p className="text-xl font-black text-[#1F4E5F]">Rp {payment.amount.toLocaleString("id-ID")}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleConfirm(payment.id)}
                                            disabled={processingId === payment.id || !payment.proofUrl}
                                            className="bg-[#0881A3] text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#0881A3]/20 disabled:opacity-40"
                                            title={!payment.proofUrl ? "Tenant belum mengunggah bukti" : ""}
                                        >
                                            {processingId === payment.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4" />
                                            )}
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(payment.id)}
                                            disabled={processingId === payment.id}
                                            className="bg-red-50 text-red-500 border border-red-200 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-40"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Tolak
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Proof image modal */}
            {proofModal && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                    onClick={() => setProofModal(null)}
                >
                    <div className="max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-[#F4E7D3]">
                            <h3 className="font-black text-[#1F4E5F]">Bukti Transfer</h3>
                            <button onClick={() => setProofModal(null)} className="text-[#1F4E5F]/40 hover:text-[#1F4E5F] transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="relative w-full h-[70vh] p-4">
                            <Image
                                src={proofModal}
                                alt="Bukti transfer"
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
