import Link from 'next/link';
import { BarChart3, Settings, ShieldCheck } from 'lucide-react';

export default function OwnerDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-4xl font-black italic tracking-tight text-[#0881A3]">
                    Welcome Back, Owner!
                </h1>
                <p className="mt-2 font-medium text-[#1F4E5F]/60">
                    Kelola dan pantau performa bisnis properti Anda secara efisien.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Link
                    href="/owner/finance"
                    className="group relative overflow-hidden rounded-3xl border border-[#F4E7D3] bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0881A3]/5"
                >
                    <div className="relative z-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0881A3]/10 text-[#0881A3] transition-colors group-hover:bg-[#0881A3] group-hover:text-white">
                            <BarChart3 className="h-8 w-8" />
                        </div>
                        <h2 className="mt-6 text-2xl font-black italic">Laporan Keuangan</h2>
                        <p className="mt-2 text-sm font-medium text-[#1F4E5F]/60">
                            Analisis pendapatan bulanan, trend transaksi, dan performa keuangan tahunan.
                        </p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-[#0881A3]/5 transition-transform group-hover:scale-150" />
                </Link>

                {/* Future Modules */}
                <div className="group relative overflow-hidden rounded-3xl border border-[#F4E7D3] bg-white/50 p-8 shadow-sm grayscale opacity-60 cursor-not-allowed">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F4E5F]/10 text-[#1F4E5F]">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h2 className="mt-6 text-2xl font-black italic">Property Management</h2>
                    <p className="mt-2 text-sm font-medium text-[#1F4E5F]/60">
                        Segera hadir: Pantau seluruh aset properti Anda dalam satu tampilan.
                    </p>
                </div>

                <div className="group relative overflow-hidden rounded-3xl border border-[#F4E7D3] bg-white/50 p-8 shadow-sm grayscale opacity-60 cursor-not-allowed">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F4E5F]/10 text-[#1F4E5F]">
                        <Settings className="h-8 w-8" />
                    </div>
                    <h2 className="mt-6 text-2xl font-black italic">Owner Settings</h2>
                    <p className="mt-2 text-sm font-medium text-[#1F4E5F]/60">
                        Konfigurasi akun dan preferensi pelaporan Anda.
                    </p>
                </div>
            </div>
        </div>
    );
}
