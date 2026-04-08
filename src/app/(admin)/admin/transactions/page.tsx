"use client";

import { useEffect, useState } from "react";
import {
    Receipt,
    Loader2,
    User,
    Home,
    Calendar,
} from "lucide-react";

interface Transaction {
    id: string;
    amount?: number;
    total?: number;
    createdAt: string;
    payment?: {
        customer?: {
            name: string;
            email: string;
        };
        reservation?: {
            room?: {
                number: string;
            };
        };
    };
}

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/transactions")
            .then((res) => res.json())
            .then((data) => setTransactions(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const totalRevenue = transactions.reduce((sum, t) => sum + (t.total ?? 0), 0);

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
                        <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic">Laporan Transaksi</h1>
                        <p className="text-[#1F4E5F]/50 font-medium">Riwayat seluruh transaksi pembayaran yang telah dikonfirmasi.</p>
                    </div>
                </div>

                <div className="bg-[#F9F8ED] px-6 py-4 rounded-2xl border border-[#F4E7D3] text-right shrink-0">
                    <p className="text-[10px] font-black uppercase text-[#0881A3] tracking-widest mb-0.5">Total Pendapatan</p>
                    <p className="text-2xl font-black text-[#1F4E5F]">Rp {totalRevenue.toLocaleString("id-ID")}</p>
                </div>
            </header>

            {transactions.length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] border-2 border-dashed border-[#F4E7D3] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[#F9F8ED] rounded-full flex items-center justify-center text-[#1F4E5F]/20">
                        <Receipt className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#1F4E5F]">Belum Ada Transaksi</h3>
                        <p className="text-sm text-[#1F4E5F]/40 font-medium">Transaksi akan muncul setelah pembayaran dikonfirmasi.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="bg-white p-6 rounded-3xl border border-[#F4E7D3] shadow-sm hover:shadow-lg transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#F9F8ED] rounded-2xl flex items-center justify-center text-[#0881A3] shrink-0 border border-[#F4E7D3]">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="font-black text-[#1F4E5F]">{transaction.payment?.customer?.name}</p>
                                        <p className="text-xs text-[#1F4E5F]/50">{transaction.payment?.customer?.email}</p>
                                        <div className="flex flex-wrap gap-3 text-xs font-medium text-[#1F4E5F]/50 pt-0.5">
                                            <span className="flex items-center gap-1">
                                                <Home className="w-3 h-3 text-[#0881A3]" />
                                                Kamar {transaction.payment?.reservation?.room?.number}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#F9F8ED] px-5 py-3 rounded-2xl border border-[#F4E7D3] text-center shrink-0">
                                    <p className="text-[10px] font-black uppercase text-[#0881A3] tracking-widest mb-0.5">Jumlah</p>
                                    <p className="text-lg font-black text-[#1F4E5F]">Rp {transaction.total?.toLocaleString("id-ID")}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
