'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { ClipboardList, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Attendance {
  id: string;
  status: 'PRESENT' | 'ABSENT';
  reason?: string | null;
  timestamp: string;
}

export default function CleanerDashboardView({ name }: { name: string }) {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/attendances')
      .then((r) => r.json())
      .then((data) => setAttendances(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const todayRecord = attendances.find(
    (a) => new Date(a.timestamp).toDateString() === today,
  );
  const recent = attendances.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F9F8ED]">
      <div className="mx-auto max-w-md px-6 pt-8">
        <div className="flex justify-end pb-4">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 rounded-lg border border-[#1F4E5F]/10 bg-[#1F4E5F]/5 px-4 py-2 text-[12px] font-bold transition-all hover:bg-white hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#0881A3]/10">
            <ClipboardList className="h-8 w-8 text-[#0881A3]" />
          </div>
          <h1 className="text-2xl font-black text-[#1F4E5F]">Halo, {name}!</h1>
          <p className="mt-1 text-sm font-medium text-[#1F4E5F]/60">
            Selamat datang kembali!
          </p>
        </div>

        {/* Today's status */}
        <div className="mb-4 rounded-3xl border border-[#F4E7D3] bg-white p-5">
          <p className="mb-3 text-[10px] font-black tracking-widest text-[#0881A3] uppercase">
            Status Hari Ini
          </p>
          {loading ? (
            <div className="flex items-center gap-2 text-sm font-medium text-[#1F4E5F]/40">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat...
            </div>
          ) : todayRecord ? (
            <div className="flex items-center gap-3">
              {todayRecord.status === 'PRESENT' ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
              ) : (
                <XCircle className="h-6 w-6 shrink-0 text-red-400" />
              )}
              <div>
                <p className="font-black text-[#1F4E5F]">
                  {todayRecord.status === 'PRESENT' ? 'Hadir' : 'Tidak Hadir'}
                </p>
                {todayRecord.reason && (
                  <p className="text-xs font-medium text-[#1F4E5F]/50">
                    {todayRecord.reason}
                  </p>
                )}
                <p className="text-[10px] text-[#1F4E5F]/30">
                  {new Date(todayRecord.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium text-[#1F4E5F]/40 italic">
              Belum absen hari ini.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href="/attendance"
            className="flex items-center gap-4 rounded-3xl border border-[#F4E7D3] bg-white p-6 shadow-sm transition-all hover:border-[#0881A3]/30 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0881A3] text-white">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-[#1F4E5F]">Absen Hari Ini</p>
              <p className="text-sm font-medium text-[#1F4E5F]/50">
                Catat kehadiran Anda sekarang
              </p>
            </div>
          </Link>
        </div>

        {/* Recent history */}
        {!loading && recent.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-[10px] font-black tracking-widest text-[#1F4E5F]/40 uppercase">
              Riwayat Terakhir
            </p>
            <div className="space-y-2">
              {recent.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-2xl border border-[#F4E7D3] bg-white px-4 py-3"
                >
                  <p className="text-xs font-medium text-[#1F4E5F]/60">
                    {new Date(a.timestamp).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-widest uppercase ${
                      a.status === 'PRESENT'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {a.status === 'PRESENT' ? 'Hadir' : 'Tidak Hadir'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
