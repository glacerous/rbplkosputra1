import { auth } from '@/server/auth/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Home,
  Users,
  CreditCard,
  MessageSquare,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  Receipt,
} from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (
    !session ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')
  ) {
    redirect('/login');
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Kelola Kamar', href: '/admin/rooms', icon: Home },
    { label: 'Penyewa', href: '/admin/users', icon: Users },
    { label: 'Reservasi', href: '/admin/reservations', icon: ClipboardList },
    { label: 'Pembayaran', href: '/admin/payments', icon: CreditCard },
    { label: 'Komplain', href: '/admin/complaints', icon: MessageSquare },
    { label: 'Kehadiran', href: '/admin/attendance', icon: Bell },
    { label: 'Laporan Transaksi', href: '/admin/transactions', icon: Receipt },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9F8ED] font-['Balsamiq_Sans'] text-[#1F4E5F]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 z-50 hidden w-64 flex-col border-r border-[#F4E7D3] bg-white shadow-sm md:flex">
        <div className="border-b border-[#F4E7D3] p-8">
          <h1 className="text-xl font-black tracking-tight text-[#0881A3] italic">
            KOS PUTRA FRIENDLY
          </h1>
          <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-[#1F4E5F]/40 uppercase">
            Management Portal
          </p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all hover:bg-[#F9F8ED] hover:text-[#0881A3]"
            >
              <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="space-y-4 border-t border-[#F4E7D3] p-6">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0881A3]/10 text-xs font-bold text-[#0881A3]">
              {session.user.name?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black">{session.user.name}</p>
              <p className="text-[10px] font-bold text-[#1F4E5F]/50 uppercase">
                {session.user.role}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen flex-1 md:ml-64">
        <div className="mx-auto max-w-7xl">
          {/* Top Mobile Nav */}
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#F4E7D3] bg-white p-4 md:hidden">
            <h1 className="text-lg font-black text-[#0881A3] italic">
              KOS PUTRA
            </h1>
            <LogoutButton />
          </div>

          <div className="p-6 md:p-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
