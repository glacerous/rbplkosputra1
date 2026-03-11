import { auth } from '@/server/auth/auth';
import { redirect } from 'next/navigation';
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
  Layout,
} from 'lucide-react';
import Link from 'next/link';
import { getAdminStats } from '@/server/services/admin.service';

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getAdminStats();

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER') {
    redirect('/403');
  }

  const managementTiles = [
    {
      title: 'Kelola Kamar',
      description: 'Atur ketersediaan, harga, dan kategori kamar kos.',
      href: '/admin/rooms',
      icon: Home,
      color: 'bg-[#0881A3]/10 text-[#0881A3]',
      count: `${stats.totalRooms} Kamar`,
    },
    {
      title: 'Manajemen User',
      description: 'Kelola data pengguna, peran, dan akses akun.',
      href: '/admin/users',
      icon: Users,
      color: 'bg-[#0881A3]/10 text-[#0881A3]',
      count: `${stats.totalUsers} User`,
    },
    {
      title: 'Laporan Komplain',
      description: 'Pantau dan selesaikan kendala yang dialami penyewa.',
      href: '/admin/complaints',
      icon: MessageSquare,
      color: 'bg-[#0881A3]/10 text-[#0881A3]',
      count: `${stats.openComplaints} Terbuka`,
    },
    {
      title: 'Status Pembayaran',
      description: 'Verifikasi bukti transfer dan riwayat transaksi sewa.',
      href: '/admin/payments',
      icon: CreditCard,
      color: 'bg-[#0881A3]/10 text-[#0881A3]',
      count: `${stats.pendingPayments} Pending`,
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Minimal Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-black tracking-[0.3em] text-[#0881A3] uppercase">
            Ringkasan Hari Ini
          </p>
          <h1 className="text-4xl font-black tracking-tighter text-[#1F4E5F] italic">
            Halo {session.user.name?.split(' ')[0] || 'Admin'},
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/rooms/create"
            className="flex items-center gap-2 rounded-2xl bg-[#0881A3] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0881A3]/20 transition-all hover:brightness-110"
          >
            <PlusCircle className="h-4 w-4" />
            Update Kamar
          </Link>
        </div>
      </div>

      {/* Clean Stats Row */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {[
          {
            label: 'Total Kamar',
            value: stats.totalRooms,
            icon: Home,
            color: 'text-[#0881A3]',
          },
          {
            label: 'Terisi',
            value: stats.occupiedRooms,
            icon: CheckCircle,
            color: 'text-emerald-500',
          },
          {
            label: 'Bayar Pending',
            value: stats.pendingPayments,
            icon: AlertCircle,
            color: 'text-amber-500',
          },
          {
            label: 'Komplain Baru',
            value: stats.openComplaints,
            icon: MessageSquare,
            color: 'text-red-500',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex min-h-[140px] flex-col justify-between rounded-[32px] border border-[#F4E7D3] bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-70`} />
              <TrendingUp className="h-4 w-4 text-[#1F4E5F]/10" />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-black tracking-widest text-[#1F4E5F]/40 uppercase">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-[#1F4E5F]">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Access Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black tracking-tight text-[#1F4E5F] italic">
            Pusat Kendali
          </h2>
          <div className="h-px flex-1 bg-[#F4E7D3]"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {managementTiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="group relative flex items-center gap-6 overflow-hidden rounded-[36px] border border-[#F4E7D3] bg-white p-5 shadow-sm transition-all hover:shadow-2xl hover:shadow-[#0881A3]/5"
            >
              {/* Subtle Background Pattern */}
              <div className="absolute -right-2 -bottom-2 opacity-[0.03] transition-transform duration-500 group-hover:scale-110">
                <tile.icon className="h-32 w-32" />
              </div>

              <div
                className={`${tile.color} flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] transition-transform duration-300 group-hover:scale-105`}
              >
                <tile.icon className="h-8 w-8" />
              </div>

              <div className="min-w-0 flex-1 pr-2">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#1F4E5F]">
                    {tile.title}
                  </h3>
                  <span className="rounded-full border border-[#F4E7D3] bg-[#F9F8ED] px-2 py-0.5 text-[9px] font-black tracking-widest text-[#0881A3] uppercase">
                    {tile.count}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-medium text-[#1F4E5F]/50">
                  {tile.description}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F4E7D3] bg-[#F9F8ED] text-[#1F4E5F]/20 transition-all group-hover:border-[#0881A3] group-hover:text-[#0881A3]">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
