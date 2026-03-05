import { signOut } from "next-auth/react";
import { Clock, CreditCard, Phone, LogOut, ChevronRight } from "lucide-react";

interface PendingPaymentViewProps {
    reservation: any;
}

export default function PendingPaymentView({ reservation }: PendingPaymentViewProps) {
    const room = reservation.room;

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-sans text-primary-dark">
            <div className="max-w-xl w-full space-y-8">
                {/* Status Header */}
                <div className="bg-white p-8 rounded-[40px] border border-primary-dark/5 shadow-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                    <div className="flex items-center justify-between">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                            <Clock className="w-8 h-8 animate-pulse" />
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="text-primary-dark/30 hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black italic tracking-tighter">Reservasi Berhasil!</h1>
                        <p className="text-primary-dark/50 font-medium">Kamar {room?.number} telah dititipkan untukmu. Tunggu verifikasi pembayaran dari admin.</p>
                    </div>

                    <div className="h-px bg-primary-dark/5" />

                    {/* Step Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-[#F9F8ED] p-4 rounded-2xl border border-[#F4E7D3]">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0881A3] shadow-sm">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase text-[#0881A3] tracking-widest">Lakukan Pembayaran</p>
                                <p className="text-sm font-bold text-[#1F4E5F]">Transfer Rp {room?.priceMonthly?.toLocaleString('id-ID')}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-primary-dark/5 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-primary-dark/30 tracking-widest">Kirim Bukti ke WhatsApp</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black text-primary-dark">+62 812-3456-7890</span>
                                    <a
                                        href="https://wa.me/6281234567890"
                                        target="_blank"
                                        className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                    >
                                        <Phone className="w-4 h-4 fill-current" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-[#1F4E5F] text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                            Menunggu Konfirmasi
                        </div>
                        <h2 className="text-2xl font-black italic leading-tight">Admin akan mengecek <br />pembayaran segera.</h2>
                        <p className="text-white/40 text-[10px] font-medium max-w-[240px]">Halaman ini akan otomatis diperbarui setelah admin melakukan approval.</p>
                    </div>
                    <div className="absolute right-[-20%] bottom-[-20%] w-64 h-64 bg-[#0881A3] rounded-full blur-[80px] opacity-20" />
                </div>
            </div>
        </div>
    );
}
