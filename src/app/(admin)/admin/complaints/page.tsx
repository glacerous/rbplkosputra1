'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Loader2, User } from 'lucide-react';

const STATUS_CONFIG = {
  OPEN: { label: 'Terbuka', className: 'bg-amber-100 text-amber-700' },
  IN_PROGRESS: { label: 'Diproses', className: 'bg-blue-100 text-blue-700' },
  RESOLVED: { label: 'Selesai', className: 'bg-green-100 text-green-700' },
};

const NEXT_STATUS: Record<string, 'IN_PROGRESS' | 'RESOLVED' | null> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'RESOLVED',
  RESOLVED: null,
};

interface Complaint {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  customer?: {
    name: string;
    email: string;
  };
}

const NEXT_LABEL: Record<string, string> = {
  OPEN: 'Proses',
  IN_PROGRESS: 'Selesaikan',
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/complaints')
      .then((res) => res.json())
      .then((data) => setComplaints(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal memperbarui status');
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: data.status } : c)),
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal memperbarui status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0881A3]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4 rounded-3xl border border-[#F4E7D3] bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0881A3] text-white">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black italic">Manajemen Komplain</h1>
          <p className="font-medium text-[#1F4E5F]/50">
            Kelola dan tindak lanjuti komplain dari penghuni.
          </p>
        </div>
      </header>

      {complaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-[40px] border-2 border-dashed border-[#F4E7D3] bg-white p-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F9F8ED] text-[#1F4E5F]/20">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-black text-[#1F4E5F] text-lg">Belum Ada Komplain</h3>
            <p className="text-sm font-medium text-[#1F4E5F]/40">
              Komplain dari penghuni akan muncul di sini.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {complaints.map((complaint) => {
            const config =
              STATUS_CONFIG[complaint.status as keyof typeof STATUS_CONFIG];
            const nextStatus = NEXT_STATUS[complaint.status];
            const nextLabel = NEXT_LABEL[complaint.status];

            return (
              <div
                key={complaint.id}
                className="rounded-3xl border border-[#F4E7D3] bg-white p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] text-[#0881A3]">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-[#1F4E5F]">
                        {complaint.customer?.name}
                      </p>
                      <p className="text-xs text-[#1F4E5F]/50">
                        {complaint.customer?.email}
                      </p>
                      <p className="text-xs font-medium text-[#1F4E5F]/40">
                        {new Date(complaint.createdAt).toLocaleDateString(
                          'id-ID',
                          { day: 'numeric', month: 'long', year: 'numeric' },
                        )}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`self-start rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${config.className}`}
                  >
                    {config.label}
                  </span>
                </div>

                <div className="mt-4 space-y-1 rounded-2xl border border-[#F4E7D3] bg-[#F9F8ED] p-4">
                  <p className="font-black text-[#1F4E5F]">{complaint.title}</p>
                  <p className="text-sm font-medium text-[#1F4E5F]/60">
                    {complaint.content}
                  </p>
                </div>

                {nextStatus && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleStatusUpdate(complaint.id, nextStatus)}
                      disabled={updating === complaint.id}
                      className="flex items-center gap-2 rounded-2xl bg-[#0881A3] px-5 py-2.5 text-sm font-black text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {updating === complaint.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      {nextLabel}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
