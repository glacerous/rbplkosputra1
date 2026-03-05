import { auth } from "@/server/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Home,
    Users,
    CreditCard,
    MessageSquare,
    ClipboardList,
    Bell,
    Settings,
    LogOut
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
        redirect("/login");
    }

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Kelola Kamar", href: "/admin/rooms", icon: Home },
        { label: "Penyewa", href: "/admin/users", icon: Users },
        { label: "Reservasi", href: "/admin/reservations", icon: ClipboardList },
        { label: "Pembayaran", href: "/admin/payments", icon: CreditCard },
        { label: "Komplain", href: "/admin/complaints", icon: MessageSquare },
        { label: "Kehadiran", href: "/admin/attendance", icon: Bell },
    ];

    return (
        <div className="flex min-h-screen bg-[#F9F8ED] text-[#1F4E5F] font-['Balsamiq_Sans']">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[#F4E7D3] hidden md:flex flex-col fixed inset-y-0 shadow-sm z-50">
                <div className="p-8 border-b border-[#F4E7D3]">
                    <h1 className="text-xl font-black text-[#0881A3] italic tracking-tight">KOS PUTRA FRIENDLY</h1>
                    <p className="text-[10px] font-bold text-[#1F4E5F]/40 uppercase tracking-[0.2em] mt-1">Management Portal</p>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#F9F8ED] hover:text-[#0881A3] transition-all font-bold group"
                        >
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-[#F4E7D3] space-y-4">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 bg-[#0881A3]/10 rounded-full flex items-center justify-center text-[#0881A3] font-bold text-xs">
                            {session.user.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black truncate">{session.user.name}</p>
                            <p className="text-[10px] text-[#1F4E5F]/50 font-bold uppercase">{session.user.role}</p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Top Mobile Nav */}
                    <div className="md:hidden bg-white border-b border-[#F4E7D3] p-4 flex items-center justify-between sticky top-0 z-40">
                        <h1 className="text-lg font-black text-[#0881A3] italic">KOS PUTRA</h1>
                        <LogoutButton />
                    </div>

                    <div className="p-6 md:p-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
