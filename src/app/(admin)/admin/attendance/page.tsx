'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';

const STATUS_CONFIG = {
  PRESENT: { label: 'Hadir', className: 'bg-green-100 text-green-700' },
  ABSENT: { label: 'Tidak Hadir', className: 'bg-red-100 text-red-700' },
};

interface Attendance {
  id: string;
  status: string;
  timestamp: string;
  reason?: string | null;
  cleaner?: {
    name: string;
    email: string;
  };
}

export default function AdminAttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/attendances')
      .then((res) => res.json())
      .then((data) => setAttendances(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0881A3]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0881A3] text-white">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#1F4E5F]">Kehadiran Cleaner</h1>
          <p className="text-sm font-medium text-[#1F4E5F]/50">
            Riwayat absensi seluruh cleaner
          </p>
        </div>
      </div>

      {attendances.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-[40px] border-2 border-dashed border-[#F4E7D3] bg-white p-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F9F8ED] text-[#1F4E5F]/20">
            <ClipboardList className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-black text-[#1F4E5F]">Belum Ada Data</h3>
            <p className="text-sm font-medium text-[#1F4E5F]/40">
              Data absensi cleaner akan muncul di sini.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#F4E7D3] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F4E7D3] bg-[#F9F8ED]">
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-[#0881A3] uppercase">
                  Nama Cleaner
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-[#0881A3] uppercase">
                  Tanggal &amp; Waktu
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-[#0881A3] uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black tracking-widest text-[#0881A3] uppercase">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4E7D3]">
              {attendances.map((a) => {
                const config = STATUS_CONFIG[a.status as keyof typeof STATUS_CONFIG];
                return (
                  <tr key={a.id} className="hover:bg-[#F9F8ED]/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1F4E5F]">{a.cleaner?.name}</p>
                      <p className="text-xs text-[#1F4E5F]/50">{a.cleaner?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1F4E5F]/70">
                      {new Date(a.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${config.className}`}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1F4E5F]/60">
                      {a.reason ?? <span className="text-[#1F4E5F]/30">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
