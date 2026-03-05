import { signOut } from "next-auth/react";
import Link from "next/link";
import {
    CreditCard,
    ChevronRight,
    LogOut,
    MessageSquare,
    History,
    DoorOpen
} from "lucide-react";

interface UserDashboardViewProps {
    reservation: any;
}

export default function UserDashboardView({ reservation }: UserDashboardViewProps) {
    const latestPayment = reservation.payments?.[0];
    const room = reservation.room;

    return (
        <div className="w-full min-h-screen bg-surface text-primary-dark font-sans py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full justify-between">
                        <div>
                            <h1 className="text-[32px] font-bold mb-2">Hunian Saya</h1>
                            <p className="text-base font-normal text-primary-dark/60">Kelola kamar dan detail masa tinggalmu.</p>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="px-6 py-2 rounded-xl bg-primary-dark/5 border border-primary-dark/10 text-sm font-bold hover:bg-white hover:text-red-600 transition-all flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Keluar
                        </button>
                    </div>
                    <div className="bg-warm-surface border border-primary-dark/10 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-color/10 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-accent-color animate-pulse" />
                        </div>
                        <div>
                            <div className="text-[12px] font-bold text-primary-dark/40 uppercase tracking-wide">Status Sewa</div>
                            <div className="text-sm font-bold">Terdaftar & Aktif</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Room Info */}
                    <div className="p-6 rounded-xl bg-warm-surface border border-primary-dark/10 col-span-1 md:col-span-2 shadow-sm">
                        <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-color" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 001 1h12a1 1 0 001-1V8a1 1 0 00-.504-.868l-7-4zM5 14V8.4l5-2.857 5 2.857V14H5z" clipRule="evenodd" />
                            </svg>
                            Informasi Kamar
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/2 aspect-video bg-primary-dark/5 rounded-lg border border-primary-dark/5 flex items-center justify-center italic text-primary-dark/20 text-sm">
                                Foto Kamar
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-primary-dark/40 text-[12px] font-bold uppercase">Nomor Kamar</div>
                                        <div className="text-xl font-bold">Kamar {room?.number || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-primary-dark/40 text-[12px] font-bold uppercase">Tipe/Kategori</div>
                                        <div className="text-sm font-bold">{room?.category || 'Standard'}</div>
                                    </div>
                                </div>
                                <div className="pt-6 flex gap-3">
                                    <button className="flex-1 py-2.5 rounded-lg bg-surface border border-primary-dark/10 text-sm font-bold hover:bg-white transition-all">
                                        Detail Kamar
                                    </button>
                                    <button className="flex-1 py-2.5 rounded-lg bg-surface border border-primary-dark/10 text-sm font-bold hover:bg-white transition-all">
                                        Lapor Kendala
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Lease & Payment */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-[32px] bg-white border border-primary-dark/10 shadow-sm space-y-4">
                            <h3 className="text-base font-black italic flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#0881A3]" />
                                Tagihan & Pembayaran
                            </h3>
                            <div className="p-4 rounded-2xl bg-[#F9F8ED] border border-[#F4E7D3]">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-[9px] font-black uppercase text-[#0881A3] tracking-widest">Status Terakhir</div>
                                    <div className={`text-[9px] font-black px-2 py-0.5 rounded-full ${latestPayment?.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {latestPayment?.status || 'No Records'}
                                    </div>
                                </div>
                                <div className="text-xl font-black text-[#1F4E5F]">
                                    {latestPayment ? `Rp ${latestPayment.amount.toLocaleString('id-ID')}` : '-'}
                                </div>
                            </div>
                            <Link
                                href="/payments"
                                className="w-full block py-3 rounded-2xl bg-[#0881A3] text-white text-center font-black uppercase tracking-widest text-xs border border-transparent hover:bg-white hover:text-[#0881A3] hover:border-[#0881A3] transition-all"
                            >
                                Riwayat Pembayaran
                            </Link>
                        </div>

                        <div className="p-6 rounded-[32px] bg-[#1F4E5F] text-white shadow-xl space-y-6 relative overflow-hidden group">
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-base font-black italic flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-color" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Kelola Hunian
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        href="/complaints"
                                        className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-sm font-bold">Lapor Komplain</span>
                                        <ChevronRight className="w-4 h-4 text-white/30" />
                                    </Link>
                                    <button
                                        onClick={() => confirm("Anda yakin ingin melakukan checkout?") && alert("Fitur checkout segera hadir (Sprint 4)")}
                                        className="w-full flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-colors text-left"
                                    >
                                        <span className="text-sm font-bold text-red-400">Checkout Kamar</span>
                                        <LogOut className="w-4 h-4 text-red-400/30" />
                                    </button>
                                </div>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#0881A3] rounded-full blur-[60px] opacity-20" />
                        </div>
                    </div>
                </div>

                <footer className="mt-12 text-center text-[12px] font-normal text-primary-dark/30">
                    &copy; 2026 Kos Putra Friendly• Layanan Tenant Terpadu
                </footer>
            </div>
        </div>
    );
}
