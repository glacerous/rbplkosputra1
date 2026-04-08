'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  PRESENT: { label: 'Hadir', className: 'bg-green-100 text-green-700' },
  ABSENT: { label: 'Tidak Hadir', className: 'bg-red-100 text-red-700' },
};

interface Attendance {
  id: string;
  status: string;
  reason?: string;
  timestamp: string;
}

export default function AttendancePage() {
  const [status, setStatus] = useState<'PRESENT' | 'ABSENT'>('PRESENT');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const fetchAttendances = () => {
    setLoadingList(true);
    fetch('/api/public/attendances')
      .then((res) => res.json())
      .then((data) => setAttendances(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoadingList(false));
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/public/attendances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason: reason || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal menyimpan absensi');
      setSuccessMsg('Absensi berhasil dicatat!');
      setReason('');
      fetchAttendances();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4E7D3]/20 px-4 py-8 font-sans">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0881A3] text-white">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic text-[#1F4E5F]">Absensi</h1>
            <p className="text-sm font-medium text-[#1F4E5F]/50">
              Catat kehadiran harian Anda.
            </p>
          </div>
        </div>

        {/* Submit Form */}
        <div className="rounded-[40px] border border-[#F4E7D3] bg-white p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-[#1F4E5F]">Absen Sekarang</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-[#0881A3] uppercase">
                Status Kehadiran
              </label>
              <div className="flex gap-3">
                {(['PRESENT', 'ABSENT'] as const).map((s) => (
                  <label
                    key={s}
                    className={`flex cursor-pointer items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-colors ${status === s
                        ? 'border-[#0881A3] bg-[#0881A3]/5 text-[#0881A3]'
                        : 'border-[#F4E7D3] bg-[#F9F8ED] text-[#1F4E5F]/60'
                      }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={() => setStatus(s)}
                      className="sr-only"
                    />
                    {s === 'PRESENT' ? 'Hadir' : 'Tidak Hadir'}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-[#0881A3] uppercase">
                Keterangan (opsional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Contoh: Izin sakit, keperluan keluarga..."
                className="w-full resize-none rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] px-4 py-3 text-sm font-medium text-[#1F4E5F] outline-none placeholder:text-[#1F4E5F]/30 focus:border-[#0881A3] transition-colors"
              />
            </div>

            {successMsg && (
              <div className="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0881A3] py-3 text-sm font-black text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ClipboardList className="h-4 w-4" />
              )}
              {submitting ? 'Menyimpan...' : 'Simpan Absensi'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-[#1F4E5F]">Riwayat Kehadiran</h2>

          {loadingList ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#0881A3]" />
            </div>
          ) : attendances.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 rounded-[40px] border-2 border-dashed border-[#F4E7D3] bg-white p-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F9F8ED] text-[#1F4E5F]/20">
                <ClipboardList className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-black text-[#1F4E5F]">Belum Ada Absensi</h3>
                <p className="text-sm font-medium text-[#1F4E5F]/40">
                  Absensi yang kamu catat akan muncul di sini.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {attendances.map((a) => {
                const config = STATUS_CONFIG[a.status as keyof typeof STATUS_CONFIG];
                return (
                  <div
                    key={a.id}
                    className="rounded-3xl border border-[#F4E7D3] bg-white p-6 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-[#1F4E5F]/60">
                        {new Date(a.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${config.className}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    {a.reason && (
                      <p className="text-sm font-medium text-[#1F4E5F]/60">{a.reason}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
