import { auth } from "@/server/auth/auth"
import { redirect } from "next/navigation"
import {
    Home,
    Users,
    CreditCard,
    MessageSquare,
    ArrowRight,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    PlusCircle,
    Layout
} from "lucide-react"
import Link from "next/link"
import { getAdminStats } from "@/server/services/admin.service"

export default async function AdminDashboardPage() {
    const session = await auth()
    const stats = await getAdminStats()

    if (!session) {
        redirect("/login")
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
        redirect("/403")
    }

    const managementTiles = [
        {
            title: "Kelola Kamar",
            description: "Atur ketersediaan, harga, dan kategori kamar kos.",
            href: "/admin/rooms",
            icon: Home,
            color: "bg-[#0881A3]/10 text-[#0881A3]",
            count: `${stats.totalRooms} Kamar`
        },
        {
            title: "Manajemen User",
            description: "Kelola data penyewa, admin, dan petugas kebersihan.",
            href: "/admin/users",
            icon: Users,
            color: "bg-[#0881A3]/10 text-[#0881A3]",
            count: `${stats.totalUsers} User`
        },
        {
            title: "Laporan Komplain",
            description: "Pantau dan selesaikan kendala yang dialami penyewa.",
            href: "/admin/complaints",
            icon: MessageSquare,
            color: "bg-[#0881A3]/10 text-[#0881A3]",
            count: `${stats.openComplaints} Terbuka`
        },
        {
            title: "Status Pembayaran",
            description: "Verifikasi bukti transfer dan riwayat transaksi sewa.",
            href: "/admin/payments",
            icon: CreditCard,
            color: "bg-[#0881A3]/10 text-[#0881A3]",
            count: `${stats.pendingPayments} Pending`
        },
    ]

    return (
        <div className="space-y-12 pb-12">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-[#0881A3] tracking-[0.3em]">Ringkasan Hari Ini</p>
                    <h1 className="text-4xl font-black italic tracking-tighter text-[#1F4E5F]">
                        Halo {session.user.name?.split(' ')[0] || 'Admin'},
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/rooms/create"
                        className="flex items-center gap-2 bg-[#0881A3] text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[#0881A3]/20"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Update Kamar
                    </Link>
                </div>
            </div>

            {/* Clean Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: "Total Kamar", value: stats.totalRooms, icon: Home, color: "text-[#0881A3]" },
                    { label: "Terisi", value: stats.occupiedRooms, icon: CheckCircle, color: "text-emerald-500" },
                    { label: "Bayar Pending", value: stats.pendingPayments, icon: AlertCircle, color: "text-amber-500" },
                    { label: "Komplain Baru", value: stats.openComplaints, icon: MessageSquare, color: "text-red-500" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-5 md:p-6 rounded-[32px] border border-[#F4E7D3] shadow-sm flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <stat.icon className={`w-5 h-5 ${stat.color} opacity-70`} />
                            <TrendingUp className="w-4 h-4 text-[#1F4E5F]/10" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-[#1F4E5F]/40 tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-[#1F4E5F]">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Feature Access Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black italic tracking-tight text-[#1F4E5F]">Pusat Kendali</h2>
                    <div className="h-px bg-[#F4E7D3] flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {managementTiles.map((tile) => (
                        <Link
                            key={tile.title}
                            href={tile.href}
                            className="group bg-white p-5 rounded-[36px] border border-[#F4E7D3] shadow-sm hover:shadow-2xl hover:shadow-[#0881A3]/5 transition-all flex items-center gap-6 relative overflow-hidden"
                        >
                            {/* Subtle Background Pattern */}
                            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                                <tile.icon className="w-32 h-32" />
                            </div>

                            <div className={`${tile.color} w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300`}>
                                <tile.icon className="w-8 h-8" />
                            </div>

                            <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-black text-[#1F4E5F]">{tile.title}</h3>
                                    <span className="text-[9px] font-black px-2 py-0.5 bg-[#F9F8ED] border border-[#F4E7D3] rounded-full text-[#0881A3] uppercase tracking-widest">
                                        {tile.count}
                                    </span>
                                </div>
                                <p className="text-xs text-[#1F4E5F]/50 font-medium leading-relaxed">
                                    {tile.description}
                                </p>
                            </div>

                            <div className="w-10 h-10 bg-[#F9F8ED] border border-[#F4E7D3] rounded-full flex items-center justify-center text-[#1F4E5F]/20 group-hover:border-[#0881A3] group-hover:text-[#0881A3] transition-all shrink-0">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Human Touch: Quick Information Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-[#1F4E5F] text-white p-8 rounded-[40px] shadow-xl flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
                    <div className="relative z-10 space-y-3">
                        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                            <Layout className="w-5 h-5 text-white/50" />
                        </div>
                        <h4 className="text-2xl font-black italic italic leading-tight">Pantau Hunian <br />Secara Langsung</h4>
                        <p className="text-white/50 text-xs font-medium max-w-[200px]">Semua data sekarang terhubung dengan database pusat secara real-time.</p>
                    </div>
                    <div className="absolute -right-10 -top-10 bg-[#0881A3] w-48 h-48 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
                </div>

                <div className="bg-white border-2 border-dashed border-[#F4E7D3] p-8 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 hover:border-[#0881A3]/30 transition-colors group">
                    <div className="w-14 h-14 bg-[#F9F8ED] rounded-full flex items-center justify-center text-[#0881A3] group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-[#1F4E5F]">Punya Pertanyaan Teknis?</h4>
                        <p className="text-xs text-[#1F4E5F]/40 font-medium mt-1">Gunakan sistem ticketing atau hubungi support <br />untuk bantuan pengelolaan panel.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
